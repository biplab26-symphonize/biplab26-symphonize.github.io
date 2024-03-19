import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';

@Injectable({
    providedIn: 'root'
})

export class CategoryService {
    searchText: string;
    filterBy: string;

    Categorys: any;
    Category: any;
    appConfig: any;
    optionsList: any;
    DepartmentList: any = [];
    filters: object = {};
    onCategorysChanged: BehaviorSubject<any>;
    onCategoryChanged: BehaviorSubject<any>;
    selectedCategorys: string[] = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) {
        // Set the defaults
        this.onCategorysChanged = new BehaviorSubject({});
        this.onCategoryChanged = new BehaviorSubject({});
        this.appConfig = AppConfig.Settings;
        this.optionsList = OptionsList.Options;
        this.filters = this.optionsList.tables.pagination.filters;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            let funArray: any[];
            this.filters['category_type'] = '';
            //call functions on route path values
            if (route.routeConfig.path == 'admin/departments/edit/:id' && route.params.id > 0) {
                funArray = [this.getCategory(route.params.id)];

                this.filters['trash']  = '';
                this.filters['column'] = 'category_name';
                this.filters['direction'] = 'asc';
                this.filters['dept'] = 'Y';
                this.filters['limit']  = route.data.limit ? route.data.limit : this.filters['limit'];;
                this.filters['status'] = route.data.status ? route.data.status : 'A';
                this.filters['category_type'] = route.data.type ? route.data.type : ''

                funArray.push(this.getCategorys(this.filters));
            }
            else if ((route.routeConfig.path == 'admin/title/edit/:id' || route.routeConfig.path == 'admin/files/categories/edit/:id' || route.routeConfig.path == 'admin/users/interest/edit/:id' || route.routeConfig.path == 'admin/users/commitee/edit/:id') && route.params.id > 0) {
                funArray = [this.getCategory(route.params.id)];
            }
            // else if(route.routeConfig.path=='admin/forums/edit/:id'){
            //     funArray = [this.getEditForum(route.params.id)];
            // }
            else if (route.routeConfig.path == 'admin/forums/all') {
                this.filters['trash'] = '';
                this.filters['column'] = 'id';
                this.filters['category_type'] = route.data.type || 'FC';
                funArray = [this.getForums(this.filters)];
            }
            else if (route.routeConfig.path == 'admin/users/interests/list' || route.routeConfig.path == 'admin/users/interests/trash' || route.routeConfig.path == 'admin/users/commitees/list' || route.routeConfig.path == 'admin/users/commitees/trash') {
                this.filters['trash'] = route.data.trash ? 1 : '';
                this.filters['column'] = 'id';
                this.filters['category_type'] = route.data.type || 'INTEREST';
                funArray = [this.getCategorys(this.filters)];
            }
            else if (route.routeConfig.path == 'admin/files/add/:id') {
                this.filters['trash']  = '';
                this.filters['column'] = 'category_name';
                this.filters['direction'] = 'asc';
                this.filters['limit']  = '';
                this.filters['status'] = route.data.status ? route.data.status : '';
                this.filters['category_type'] = route.data.type ? route.data.type : ''

                funArray = [this.getCategorys(this.filters)];
            }
            else {
                //Set Trash From Router If Present
                this.filters['trash'] = route.data.trash ? 1 : '';
                this.filters['status'] = route.data.status ? route.data.status : '';
                this.filters['category_type'] = route.data.type ? route.data.type : ''
                this.filters['dept'] = route.data.dept ? route.data.dept : '';
                this.filters['column'] = 'category_name';
                this.filters['direction'] = 'asc';
                this.filters['limit'] = route.data.limit ? route.data.limit : this.filters['limit'];
                funArray = [this.getCategorys(this.filters)];
            }

            Promise.all(funArray).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get Categorys
     *
     * @returns {Promise<any>}
     */
    getCategorys(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/categories`, { params: filters })
                .subscribe((response: any) => {
                    this.Categorys = response;
                    this.onCategorysChanged.next(this.Categorys);
                    resolve(this.Categorys);
                }, reject);
        });
    }
    //GET FORUMS LIST
    getForums(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/forum`, { params: filters })
                .subscribe((response: any) => {
                    this.Categorys = response;
                    this.onCategorysChanged.next(this.Categorys);
                    resolve(this.Categorys);
                }, reject);
        });
    }

    getDeptCategory(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/categories`, { params: filters })
                .subscribe((response: any) => {
                    this.DepartmentList = response;
                    resolve(this.DepartmentList);

                }, reject);
        });
    }

    /**
     * Get Single Category
     *
     * @returns {Promise<any>}
     */
    getCategory(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/categories`, { params: { 'id': id.toString() } })
                .subscribe((response: any) => {
                    this.Category = response.categoryinfo;
                    this.onCategoryChanged.next(this.Category);
                    resolve(response);
                }, reject);
        });
    }
    //SINGLE FORUM EDIT
    //   getEditForum(id:number): Promise<any>
    //   {
    //     return new Promise((resolve, reject) => {
    //     this._httpClient.get(`${this.appConfig.url.apiUrl}view/forum`,{ params: {'id' : id.toString() } })
    //         .subscribe((response: any) => {
    //             this.Category = response.categoryinfo;
    //             this.onCategoryChanged.next(this.Category);
    //             resolve(response);
    //         }, reject);
    //     });
    //   }
    getEditForum(id: number, edit): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/forum`, { params: { 'id': id.toString(), 'edit': edit } })
                .subscribe((response: any) => {
                    this.Category = response.categoryinfo;
                    this.onCategoryChanged.next(this.Category);
                    resolve(response);
                }, reject);
        });
    }
    getForum(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/forum`, { params: { 'category_alias': id.toString() } })
                .subscribe((response: any) => {
                    this.Category = response.categoryinfo;
                    this.onCategoryChanged.next(this.Category);
                    resolve(response);
                }, reject);
        });
    }
    updateForm(recordId: any, type: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('record_id', recordId);
        params = params.set('type', type);
        let apiendpoint = 'actions/editupdaterestriction';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, params)
            .pipe(catchError(this.errorHandler));
    }
    //GET TOPICS
    getTopics(params: any): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/topics`, { params: params })
            .pipe(catchError(this.errorHandler));
    }

    // Create Categorys
    createCategory(formData: any, update: boolean = false): Observable<any> {
        //set api endpoint accroding edit or add view 
        let apiendpoint = update == true ? 'update/categories' : 'create/categories';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, formData)
            .pipe(catchError(this.errorHandler));
    }

    /**SOFT DELETE Categorys */
    deleteCategorys(deleteInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/categories`, deleteInfo)
            .pipe(catchError(this.errorHandler));
    }

    /**FORCE DELETE Categorys */
    forceDeleteCategorys(deleteInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/categoriespermanentdelete`, deleteInfo)
            .pipe(catchError(this.errorHandler));
    }

    /**RESTORE Categorys */
    restoreCategorys(restoreInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/categoriesrestore`, restoreInfo)
            .pipe(catchError(this.errorHandler));
    }

    /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse) {
        return Observable.throw(error.message);
    }

}

