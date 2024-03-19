import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig,OptionsList } from 'app/_services';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RolesService implements Resolve<any>
{
    roles: any;
    role: any;
    onRolesChanged: BehaviorSubject<any>;
    onRoleChanged: BehaviorSubject<any>;
    appConfig: any;
    optionsList: any;
    Rolefilters: object={};
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
        this.onRolesChanged = new BehaviorSubject({});
        this.onRoleChanged  = new BehaviorSubject({});
        this.appConfig      = AppConfig.Settings;
        this.optionsList    = OptionsList.Options;
        //this.filters        = this.optionsList.tables.pagination.filters;
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
            //call functions on route path values
            if(route.routeConfig.path=='admin/roles/edit/:id' && route.params.id>0){
                // alert("if call")
                funArray = [this.getRole(route.params.id)];
            }else if(route.routeConfig.path=='admin/users/trash'){
                this.Rolefilters['status']      = route.data.status ? route.data.status : '';
                this.Rolefilters['type']        = route.data.roleType ? route.data.roleType : '';
                //Set sorting for ID
                this.Rolefilters['column']      = 'id';
                this.Rolefilters['direction']   = 'desc';
                //Set Trash From Router If Present
                //this.Rolefilters['trash'] = route.data.trash ? route.data.trash : '';
                funArray = [this.getRoles(this.Rolefilters)];
            }else{
                // alert("else call")
                //Roles Filtering according to users page or staff page or roles list page
                this.Rolefilters['status']      = route.data.status ? route.data.status : '';
                this.Rolefilters['type']        = route.data.roleType ? route.data.roleType : '';
                //Set sorting for ID
                this.Rolefilters['column']      = 'id';
                this.Rolefilters['direction']   = 'desc';
                //Set Trash From Router If Present
                this.Rolefilters['trash'] = route.data.trash ? route.data.trash : '';
                funArray = [this.getRoles(this.Rolefilters)];
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
     * Get roles
     *
     * @returns {Promise<any>}
     */
    getRoles(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/roles`,{params:filters})
            .subscribe((response: any) => {
                this.roles = response;
                this.onRolesChanged.next(this.roles);
                resolve(response);
            }, reject);
        });
    }
    /**
     * Get Single Role
     *
     * @returns {Promise<any>}
     */
    getRole(roleId:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let params = new HttpParams();
            params = params.set('id', roleId.toString());
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/roles`,{params:params})
                .subscribe((response: any) => {
                    this.role = response.roleinfo;
                    this.onRoleChanged.next(this.role);
                    resolve(response);
                }, reject);
        });
    }
    /** SAVE Role */
    saveRole(roleInfo:any,update:boolean=false): Observable<any>{
        //set api endpoint accroding edit or add view 
        let apiendpoint = update == true ? 'update/roles' : 'create/roles';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,roleInfo)
                .pipe(catchError(this.errorHandler));
    }
    /** DELETE USERS */
    deleteRoles(deleteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/roles`,deleteInfo)
                .pipe(catchError(this.errorHandler));
    }
    /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message);
    }
}
