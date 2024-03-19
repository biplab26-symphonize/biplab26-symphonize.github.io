import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AppConfig,OptionsList } from 'app/_services';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService implements Resolve<any>{
    locations: any;
    editLocation : any;
    onEditLocationChange : BehaviorSubject<any>;
    onLocationChanged: BehaviorSubject<any>;
    appConfig: any;
    optionsList: any;
    locationFilters: object={};

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
        this.onLocationChanged = new BehaviorSubject({});
        this.onEditLocationChange = new BehaviorSubject({});
        this.appConfig       = AppConfig.Settings;
        this.optionsList     = OptionsList.Options;
        this.locationFilters = this.optionsList.tables.pagination.filters;
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
            if(route.routeConfig.path=='admin/events/location/edit/:id' && route.params.id>0){
                this.locationFilters['category_type'] = 'EL';
                funArray = [this.getLocationContent(route.params.id)];
            }
            else{
                if(route.routeConfig.path=='admin/events/location/list')  
                this.locationFilters['direction']   = 'desc'; 
                this.locationFilters['category_type'] = 'EL';
                this.locationFilters['column'] = 'id';
                //Set Trash From Router If Present
                this.locationFilters['trash'] = route.data.trash ? route.data.trash : '';
                funArray = [this.getLocation(this.locationFilters)];
            }

            Promise.all(funArray).then(
                () => {
                    resolve();
                },
                reject );
        });
    }

    /**
     * Get roles
     *
     * @returns {Promise<any>}
     */
    getLocation(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/categories`,{params:filters})
            .subscribe((response: any) => {
                this.locations = response;
                this.onLocationChanged.next(this.locations);
                resolve(response);
            }, reject);
        });
    }
    /**
     * Get content
     *
     * @returns {Promise<any>}
     */
    getLocationContent(id: any): Promise<any>{
        let params = new HttpParams();
        if(id != null){
        params = params.set('id', id.toString());
        }
        return new Promise((resolve, reject) => {
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/categories`,{ params: params })
        .subscribe((response: any) => {
            this.editLocation = response.categoryinfo;
            this.onEditLocationChange.next(this.editLocation);
            resolve(response);
            }, reject);
        });
    }

    /** SAVE & EDIT  */
    saveLocation(formInfo:any,edit:boolean=false): Observable<any>{
        //set api endpoint accroding edit or add view 
        let apiendpoint = edit == true ? 'update/categories' : 'create/categories';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,formInfo)
                .pipe(catchError(this.errorHandler));
    }

    deleteLocation(deleteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/categories`,deleteInfo)
        .pipe(catchError(this.errorHandler));
    }
     /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message);
    }
}
