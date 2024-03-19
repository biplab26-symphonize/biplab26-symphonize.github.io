import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from './app.config.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { OptionsList } from './options.list.service';
const HttpUploadOptions = {
    headers: new HttpHeaders({ "Accept": "multipart/form-data" })
}

@Injectable({
    providedIn: 'root'
})
export class FormsService implements Resolve<any>{
    editForm: any;
    editFormNotification: any;
    forms: any;
    form: any;
    myForms: any;
    approvalsetting: any
    onMyFormsChanged: BehaviorSubject<any>;
    onFormsChanged: BehaviorSubject<any>;
    onFormsDataChanged: BehaviorSubject<any>;
    onFormEditChange: BehaviorSubject<any>;
    onEditNotification: BehaviorSubject<any>;
    appConfig: any;
    optionsList: any;
    formFilter: object = {};
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) {
        // Set the defaults
        this.onFormsChanged = new BehaviorSubject({});
        this.onFormEditChange = new BehaviorSubject({});
        this.onMyFormsChanged = new BehaviorSubject({});
        this.onFormsDataChanged = new BehaviorSubject({});
        this.appConfig = AppConfig.Settings;
        this.optionsList = OptionsList.Options;
        this.formFilter = this.optionsList.tables.pagination.filters;
    }

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

            if (route.routeConfig.path == "admin/forms/all") {
                this.formFilter['column'] = route.data.formid ? route.data.formid : '';
                this.formFilter['direction'] = 'desc';
                this.formFilter['status'] = '';
                this.formFilter['front'] = '';
            }
            // if(route.routeConfig.path=='admin/forms/edit/:id' && route.params.id>0){
            // funArray = [this.getFormContent(route.params.id)];
            // }
            if (route.routeConfig.path == 'forms/view/:slug' && route.params.slug) {
                this.formFilter['column'] = '';
                this.formFilter['direction'] = '';
                this.formFilter['form_alias'] = route.params.slug ? route.params.slug : '';
                this.formFilter['front'] = '1';
                funArray = [this.getViewForm(this.formFilter)];
            }
            else {
                this.formFilter['trash'] = route.data.trash ? route.data.trash : '';
                funArray = [this.getForms(this.formFilter)];
            }
            Promise.all(funArray).then(
                () => {
                    resolve();
                },
                reject);
        });
    }

    /**
     * Get forms
     *
     * @returns {Promise<any>}
     */
    getForms(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/forms`, { params: filters })
                .subscribe((response: any) => {
                    this.forms = response;
                    this.onFormsChanged.next(this.forms);
                    resolve(response);
                }, reject);
        });
    }


    // GET FORM DATA BY ID
    /**
     * Get content
     *
     * @returns {Promise<any>}
     */
    getFormContent(formData: any): Observable<any> {

        let params = new HttpParams();
        if (formData != null) {
            params = params.set('form_id', formData);
        }

        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/forms`, { params: params })
            .pipe(catchError(this.errorHandler));
    }
    getFormContents(formData: any,edit:any): Observable<any> {

        let params = new HttpParams();
        if (formData != null) {
            params = params.set('form_id', formData);
            params = params.set('edit', edit);
        }

        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/forms`, { params: params })
            .pipe(catchError(this.errorHandler));
    }
    updateForm(recordId: any, type: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('record_id', recordId);
        params = params.set('type', type);
        let apiendpoint = 'actions/editupdaterestriction';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, params)
            .pipe(catchError(this.errorHandler));
      }

    //import fields,forms,users
    importFile(url: string, mediaData: any) {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, mediaData, HttpUploadOptions)
            .pipe(catchError(this.errorHandler));
    }


    // SAVE NEW FORM DATA
    saveFormData(formInfo: any, edit: boolean = false): Observable<any> {
        //set api endpoint accroding edit or add view 
        let apiendpoint = edit == true ? 'update/forms' : 'create/forms';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, formInfo)
            .pipe(catchError(this.errorHandler));
    }

    /** DELETE Forms */
    deleteForms(url, deleteInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, deleteInfo)
            .pipe(catchError(this.errorHandler));
    }

    // Delete The Forms Fields 
    deleteFields(id: any): Observable<any> {
        return this._httpClient.post<any[]>(`${this.appConfig.url.apiUrl}delete/formfield`, id)
            .pipe(catchError(this.errorHandler))
    }

    ///EXPORT FORMS
    getExportFile(url: string, req_params) {
        let params = new HttpParams();
        req_params.forEach(param => {
            let key = Object.keys(param)[0];
            let value = param[key];
            if (value) {
                params = params.append(key, value.toString());
            }
        });

        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}` + url, { params: params })
            .pipe(catchError(this.errorHandler));
    }

    // GET FORM PREVIEW
    formPreview(formData: any) {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/forms`, { params: formData })
            .pipe(catchError(this.errorHandler));
    }

    // GET FORM TO DISPLAY ON FRONT VIEW
    getViewForm(formparams: any) {
        return new Promise((resolve, reject) => {
            return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/forms`, { params: formparams })
                .subscribe((response: any) => {
                    this.form = response.forminfo;
                    resolve(response);
                }, reject);
        });
    }

    // notificaton setting API Start form here /////

    //  add the new notification   
    saveFormNotificationSettings(formInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/notificationsetting`, formInfo)
            .pipe(catchError(this.errorHandler));
    }


    // delete the notification
    deleteNotification(id): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/notificationsetting`, id)
            .pipe(catchError(this.errorHandler))
    }


    duplicateNotificationsetting(id): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/duplicatenotificationsetting`, id)
            .pipe(catchError(this.errorHandler))
    }
    
      /** EXPORT EVENTS */
      exportEntries(exportInfo:any): Observable<any>{
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/formentries`,{params:exportInfo})
        .subscribe(exportres => {
            if(exportres.filepath){
                window.open(this.appConfig.url.mediaUrl+exportres.filepath, "_blank");
                return;
            }
        });
        return;
      }

    UpdateNotificationstatus(formInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/notificationstatusupdate`, formInfo)
            .pipe(catchError(this.errorHandler))
    }

    editNotification(formInfo: any): Observable<any> {

        let params = new HttpParams();
        if (formInfo != null) {
            params = params.set('id', formInfo);
        }

        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/notificationsetting`, { params: params })
            .pipe(catchError(this.errorHandler));
    }

    // notification setting end here 




    //   

    /**
     * Get my events
     *
     * @returns {Promise<any>}
     */
    getMyForms(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/entries`, { params: filters })
                .subscribe((response: any) => {
                    this.myForms = response.formentriesinfo;
                    this.onMyFormsChanged.next(this.myForms);
                    resolve(response);
                }, reject);
        });

    }


    getFields(url, req_params: any): Observable<any> {
        let params = new HttpParams();
        req_params.forEach(param => {
            let key = Object.keys(param)[0];
            let value = param[key];
            if (value) {
                params = params.append(key, value.toString());
            }
        });
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}` + url, { params: params })
            .pipe(catchError(this.errorHandler));
    }
    /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse) {
        return Observable.throw(error.message);
    }
}
