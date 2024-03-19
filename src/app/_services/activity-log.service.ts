import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
const HttpUploadOptions = {
    headers: new HttpHeaders({ "Accept": "multipart/form-data" })
}
@Injectable({
    providedIn: 'root'
})
export class ActivitylogService implements Resolve<any>{

    logs: any;
    approvalsetting: any
    onlogChanged: BehaviorSubject<any>;
    appConfig: any;
    optionsList: any;
    ActivitylogFilter: object = {};
    activityLogSetting: any;
    onSettingChanged: BehaviorSubject<any>;
    routeParams: object = {};
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) {
        // Set the defaults
        this.onlogChanged = new BehaviorSubject({});
        this.onSettingChanged = new BehaviorSubject({});
        this.appConfig = AppConfig.Settings;
        this.optionsList = OptionsList.Options;
        this.ActivitylogFilter = this.optionsList.tables.pagination.filters;
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
            this.routeParams['meta_key'] = 'activity_log_settings';
            if (route.routeConfig.path == "admin/activity-log/list") {
                this.ActivitylogFilter['direction'] = 'desc';
                this.ActivitylogFilter['role_id'] = '';
                this.ActivitylogFilter['column'] = '';
                this.ActivitylogFilter['type'] = '';
                this.ActivitylogFilter['action'] = '';
                this.ActivitylogFilter['user_id'] = '';
                this.ActivitylogFilter['time'] = '';
            }
            Promise.all([
                this.getLogs(this.ActivitylogFilter),
                this.getSetting(this.routeParams),
            ]).then(
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
    getLogs(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/activityloglist`, { params: filters })
                .subscribe((response: any) => {
                    this.logs = response;
                    this.onlogChanged.next(this.logs);
                    resolve(response);
                }, reject);
        });
    }

    getFilterData(): Observable<any> {

        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}actions/getactivitylogfields`)
            .pipe(catchError(this.errorHandler));
    }
    createActivityLogSetting(formData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${this.appConfig.url.apiUrl}create/settings`, formData)
                .subscribe((response: any) => {
                    this.activityLogSetting = response;
                    this.onSettingChanged.next(this.activityLogSetting);
                    resolve(response);
                }, reject);
        });
    }
    getSetting(routeParams: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/settings`, { params: routeParams })
                .subscribe((response: any) => {
                    this.activityLogSetting = response;
                    this.onSettingChanged.next(this.activityLogSetting);
                    resolve(response);
                }, reject);
        });
    }
    resetDatabase(formData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${this.appConfig.url.apiUrl}delete/activitylog`, formData)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse) {
        return Observable.throw(error.message);
    }


}