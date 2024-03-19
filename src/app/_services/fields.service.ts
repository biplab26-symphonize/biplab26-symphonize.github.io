import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { catchError } from 'rxjs/operators';
import { FileSaverService } from 'ngx-filesaver';

@Injectable()
export class FieldsService implements Resolve<any>
{
    searchText: string;
    filterBy: string;

    fields: any;
    filterFields: any;
    field: any;
    appConfig: any;
    optionsList: any;
    exportData;
    fieldfilters: object={};
    onFieldsChanged: BehaviorSubject<any>;
    onFieldChanged: BehaviorSubject<any>;
    selectedFields: string[] = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _fileSaverService:FileSaverService
    )
    {
        // Set the defaults
        this.onFieldsChanged    = new BehaviorSubject({}); 
        this.onFieldChanged     = new BehaviorSubject({}); 
        this.appConfig          = AppConfig.Settings;
        this.optionsList        = OptionsList.Options;
        this.fieldfilters       = this.optionsList.tables.pagination.filters;
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            
            let funArray:any[];
            //call functions on route path values
            if(route.routeConfig.path=='admin/fields/edit/:id' && route.params.id>0){
                funArray = [this.getField(route.params.id)];
            }
            else{
                this.fieldfilters['column'] = 'id';
                //Set Trash From Router If Present
                this.fieldfilters['trash']  = route.data.trash ? route.data.trash : '';
                funArray                    = [this.getFields(this.fieldfilters)];
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
     * Get fields
     *
     * @returns {Promise<any>}
     */
    getFields(fieldfilters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/fields`,{params:fieldfilters})
            .subscribe((response: any) => {
                this.fields = response;
                this.onFieldsChanged.next(this.fields);
                resolve(this.fields);

            }, reject);
        });
    }

    // get fields for filter meta fields array 

    getFieldsForFilter(fieldfilters?:any): Observable<any>
    {
        return this._httpClient.get(`${this.appConfig.url.apiUrl}list/fields`,{params:fieldfilters})
    }

     /**
     * Get Single Field
     *
     * @returns {Promise<any>}
     */
    getField(id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}view/fields`,{ params: {'id' : id.toString() } })
            .subscribe((response: any) => {
                this.field = response.fieldinfo;
                this.onFieldChanged.next(this.field);
                resolve(response);
            }, reject);
        });
    }
    // updateForm(recordId: any, type: any): Observable<any> {
    //     let params = new HttpParams();
    //     params = params.set('record_id', recordId);
    //     params = params.set('type', type);
    //     let apiendpoint = 'actions/editupdaterestriction';
    //     return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, params)
    //         .pipe(catchError(this.errorHandler));
    // }
    // getFieldContent(id: any,edit:any): Observable<any> {
    //     let params = new HttpParams();
    //     if (id != null) {
    //       params = params.set('id', id);
    //       params = params.set('edit', edit);
    //     }
    
    //     return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/fields`, { params: params })
    //       .pipe(catchError(this.errorHandler));
    //   }
    // Create fields
    createFields(formData:any,update:boolean = false):Observable<any>
    {    
        //set api endpoint accroding edit or add view 
        let apiendpoint = update == true ? 'update/fields' : 'create/fields';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`,formData)
         .pipe(catchError(this.errorHandler));   
    }

    // Import json file
    importFile(formData:any):Observable<any>
    {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}import/fieldsjson`,formData)
         .pipe(catchError(this.errorHandler));
    }


    /** EXPORT FIELDS */
    exportFields(exportInfo:any): Promise<any>{
        return new Promise((resolve, reject) => {
            this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/fieldsjson`,{params:exportInfo})
            .subscribe(response => {
                // if(response.exportinfo.filepath){
                //     window.open(this.appConfig.url.mediaUrl + response.exportinfo.filepath, "_blank");
                // }
                    resolve(response);
                }, reject);
          });
    }

    downloadFile(downloadInfo:any): Promise<any>{      
        return new Promise((resolve, reject) => {
        this._httpClient.get(`${this.appConfig.url.mediaUrl+downloadInfo.exportinfo.filepath}`, {
            observe: 'response',
            responseType: 'blob'
            }).subscribe(response => {
                this._fileSaverService.save(response.body, `FieldExport${downloadInfo.type}`);
                resolve(response);
            }, reject);
         });  
    }

     /**SOFT DELETE FIELDS */
    deleteFields(deleteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/fields`,deleteInfo)
                .pipe(catchError(this.errorHandler));
    }

    /**FORCE DELETE FIELDS */
    forceDeleteFields(deleteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/fieldpermanentdelete`,deleteInfo)
                .pipe(catchError(this.errorHandler));
    }

    /**RESTORE FIELDS */
    restoreFields(restoreInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/fieldrestore`,restoreInfo)
                .pipe(catchError(this.errorHandler));
    }

    /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
     return Observable.throw(error.message);
    }

}

