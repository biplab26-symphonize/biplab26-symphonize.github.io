import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventcategoryService implements Resolve<any>{
    eventcategory: any;
    eventsubcategory: any;
    editeventcategory : any;
    eventcategory_calendar : any;
    onEditCategoryChange : BehaviorSubject<any>;
    onCategoryChanged: BehaviorSubject<any>;
    onCategory_Changed : BehaviorSubject<any>
    appConfig: any;
    optionsList: any;
    categoryFilters: object={};
    subcategoryFilters: object={};

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onCategoryChanged = new BehaviorSubject({});
        this.onCategory_Changed = new BehaviorSubject({});
        this.onEditCategoryChange = new BehaviorSubject({});
        this.appConfig       = AppConfig.Settings;
        this.optionsList     = OptionsList.Options;
        this.categoryFilters = this.optionsList.tables.pagination.filters;
        this.subcategoryFilters = this.optionsList.tables.pagination.filters;
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            let funArray:any[];
            //Roles Filtering according to users page or staff page or roles list page

            if(route.routeConfig.path=='admin/events/categories/edit/:id' && route.params.id>0){
            this.categoryFilters['column']        = 'id';  
            this.categoryFilters['category_type'] = 'C';
            funArray = [this.getCategoryContent(route.params.id)];
            }
            else if(route.routeConfig.path=='admin/events/category_Calendar/edit/:id' && route.params.id>0){
                this.categoryFilters['column']        = 'id';  
                this.categoryFilters['category_type'] = 'ECL';
                funArray = [this.getCategoryContent(route.params.id)];
                }
            else if(route.routeConfig.path=='admin/events/all' || route.routeConfig.path=='admin/events/trash' || route.routeConfig.path=='admin/event/:slug' || route.routeConfig.path=='admin/event/trash/:slug'){
                this.categoryFilters['column']          = 'category_name'; 
                this.categoryFilters['direction']       = 'asc'; 
                this.categoryFilters['category_type']   = 'C';
                this.categoryFilters['status']          = 'A';
                this.categoryFilters['slug']            = route.params.slug || '';
                
                funArray = [this.getCategory(this.categoryFilters),this.getCommonCategory({column:'category_name',direction:'asc',category_type:'C',status:'A'})];
            }
            else if(route.routeConfig.path=='admin/events/category_Calendar/list' || route.routeConfig.path=='admin/events/category_Calendar/trash'){
                this.categoryFilters['column']          = 'category_name'; 
                this.categoryFilters['direction']       = 'asc'; 
                this.categoryFilters['category_type']   = 'ECL';
                this.categoryFilters['trash']           = route.data.trash ? route.data.trash : '';
                this.categoryFilters['status']          = 'A';
                this.categoryFilters['slug']            = '';
                funArray = [this.getCategory(this.categoryFilters)];
            } 
            else{
                this.categoryFilters['column']        = 'id'; 
                this.categoryFilters['direction']     = 'desc'; 
                this.categoryFilters['trash']         = route.data.trash ? route.data.trash : '';
                this.categoryFilters['category_type'] = 'C';
                this.categoryFilters['status']        = '';
                this.categoryFilters['slug']          = route.params.slug || '';
                this.categoryFilters['calendar_id']   = 0;
                funArray = [this.getCategory(this.categoryFilters)];
            }
        
            Promise.all(funArray).then(
            () => {
                resolve();
            },
            reject );
        });
    }

    /**
     * Get category
     *
     * @returns {Promise<any>}
     */
    getCategory(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/categories`,{params:filters})
            .subscribe((response: any) => {
                this.eventcategory = response;
                this.onCategoryChanged.next(this.eventcategory);
                resolve(response);
            }, reject);
        });
    }
    //common categories
    getCommonCategory(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/commoncategories`,{params:filters})
            .subscribe((response: any) => {
                this.eventsubcategory = response;
                this.onCategoryChanged.next(this.eventsubcategory);
                resolve(response);
            }, reject);
        });
    }
    getCategory_calendar(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/categories`,{params:filters})
            .subscribe((response: any) => {
                this.eventcategory_calendar = response;
                this.onCategory_Changed.next(this.eventcategory_calendar);
                resolve(response);
            }, reject);
        });
    }
    /**
   * Get content
   *
   * @returns {Promise<any>}
   */
    getCategoryContent(id: any): Promise<any>{
        let params = new HttpParams();
        if(id != null){
            params = params.set('id', id.toString());
        }
        return new Promise((resolve, reject) => {
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/categories`,{ params: params })
        .subscribe((response: any) => {
            this.editeventcategory = response.categoryinfo;
            this.onEditCategoryChange.next(this.editeventcategory);
            resolve(response);
            }, reject);
        });
    }

    /** SAVE & EDIT  */
    saveCategory(formInfo:any,edit:boolean=false): Observable<any>{
        //set api endpoint accroding edit or add view 
        let apiendpoint = edit == true ? 'update/categories' : 'create/categories';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,formInfo)
                .pipe(catchError(this.errorHandler));
    }

    /** DELETE CATEGORY */
    deleteCategory(url,deleteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+ url,deleteInfo)
                .pipe(catchError(this.errorHandler));
    }
    
     /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message);
    }
}
