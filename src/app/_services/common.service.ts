import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AppConfig, AuthService } from 'app/_services';
import { FileSaverService } from 'ngx-filesaver';
import { DatePipe } from '@angular/common';
import { User } from 'app/_models';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonUtils } from 'app/_helpers';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment-timezone';


//UPLOAD FILE DATA OPTION HEADERS
const HttpUploadOptions = {
    headers: new HttpHeaders({ "Accept": "multipart/form-data" })
}

@Injectable({
    providedIn: 'root'
})


export class CommonService {

    dateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: 'h:mm a' };
    appConfig: any;
    usersettings: any;
    metaFields: any = [];

    filterMetaFields = new BehaviorSubject(null);
    filterMetaObservable = this.filterMetaFields.asObservable();

    dynamiclistdata: any = [];
    public data: any = [];
    public checkboxdata: any = [];
    public serachData: any = [];
    public listdata: any = [];
    // create BehaviorSubject to get value and send to dynamic fields

    resetMataFields = new BehaviorSubject(null);
    resetMataFieldsObservable = this.resetMataFields.asObservable();

    usersettings1: any;

    constructor(
        private _httpClient: HttpClient,
        private _fileSaverService: FileSaverService,
        private _appConfig: AppConfig,
        private _authService: AuthService,
        private _datepipe: DatePipe) {
        this.appConfig = AppConfig.Settings;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const formtype = route.data.type;

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getFields(formtype)
            ])
                .then(() => { resolve(); }, reject);
        });
    }

    /** CHANGE STATUS */
    changeStatus(statusInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/commonstatusbulk`, statusInfo)
            .pipe(catchError(this.errorHandler));
    }
    /** RESTORE ITEMS LIKE Users,Forms,Events..... */
    restoreItems(restoreInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/${restoreInfo.endPoint}`, restoreInfo)
            .pipe(catchError(this.errorHandler));
    }
    /** UPLOAD BASE64 IMAGE */
    saveMedia(imageInfo: any, apimediaUrl: string = "media/upload") {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apimediaUrl}`, imageInfo, HttpUploadOptions)
            .pipe(catchError(this.errorHandler));
    }
    uploadMedia(imageInfo: any, apimediaUrl: string = "media/globalmediaupdate") {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apimediaUrl}`, imageInfo, HttpUploadOptions)
            .pipe(catchError(this.errorHandler));
    }
    uploadMediaTextFile(imageInfo: any, apimediaUrl: string = "media/globalmediainsert") {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apimediaUrl}`, imageInfo, HttpUploadOptions)
            .pipe(catchError(this.errorHandler));
    }

    // Upload Fields ///
    uploadfiles(imageInfo: any) {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}media/upload`, imageInfo, HttpUploadOptions)
            .pipe(catchError(this.errorHandler));
    }

    /**Remove Media */
    removeMedia(delImageInfo: any) {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}media/delete`, delImageInfo, HttpUploadOptions)
            .pipe(catchError(this.errorHandler));
    }
    // Restore data
    restore(url, restoreData: any) {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, restoreData)
            .pipe(catchError(this.errorHandler));
    }

    /** EXPORT USERS */
    exportUsers(exportInfo: any): Observable<any> {
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/users`, { params: exportInfo })
            .subscribe(exportres => {
                if (exportres.exportinfo.filepath) {
                    window.open(this.appConfig.url.mediaUrl + exportres.exportinfo.filepath, "_blank");
                    return;
                }
            });
        return;
    }

    exportActivityLog(exportInfo: any): Observable<any> {
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/activitylog`, { params: exportInfo })
            .subscribe(exportres => {
                if (exportres.exportinfo.filepath) {
                    window.open(this.appConfig.url.mediaUrl + exportres.exportinfo.filepath, "_blank");
                    return;
                }
            });
        return;
    }
    /** EXPORT STAFF */
    exportStaff(exportInfo: any): Observable<any> {
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/staff`, { params: exportInfo })
            .subscribe(exportres => {
                if (exportres.exportinfo.filepath) {
                    window.open(this.appConfig.url.mediaUrl + exportres.exportinfo.filepath, "_blank");
                    return;
                }
            });
        return;
    }

    downloadFile(downloadInfo: any): Observable<any> {
        this._httpClient.get(`${this.appConfig.url.mediaUrl + downloadInfo.exportInfo.exportinfo.filepath}`, {
            observe: 'response',
            responseType: 'blob'
        }).subscribe(res => {
            this._fileSaverService.save(res.body, `userExport${downloadInfo.type}`);
        });
        return;
    }

    /** *GET COMMON LISTS **/
    getCommonLists(req_params: any): Observable<any> {
        let params = new HttpParams();
        req_params.forEach(param => {
            let key = Object.keys(param)[0];
            let value = param[key];
            if (value) {
                params = params.append(key, value.toString());
            }
        });
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/commonlists`, { params: params })
            .pipe(catchError(this.errorHandler));
    }
    //GET PLAYLIST INFO
    getPlaylists(requestInfo: any): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/playlist`, { params: requestInfo })
            .pipe(catchError(this.errorHandler));
    }
    // Download Import formats for csv and xlsx files on users or events pages
    downloadImportFormat(formatData: any) {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}import/formats`, { params: formatData })
            .pipe(catchError(this.errorHandler));
    }
    /** Get Fields for Export Users/Events/Content..... */
    getExportFields(exportData: any, apiendPoint: string = 'export/fields') {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl + apiendPoint}`, { params: exportData })
                .subscribe((response: any) => {
                    this.usersettings = response;
                    resolve(response);
                }, reject);
        });
    }

    getExportFieldsForDirectory(exportData = { type: 'users' }, apiendPoint: string = 'export/fields') {
        return this._httpClient.get(`${this.appConfig.url.apiUrl + apiendPoint}`, { params: exportData });
    }
    /** GET mySQLDate Format */
    getMySqlDate(dateInput: any) {
        return this._datepipe.transform(dateInput, 'yyyy-MM-dd');
    }
    /**get Minimum Age Limit */
    setDatepickerAgeLimit() {
        let minBirthdate = new Date();
        let dobLimit = this._appConfig._localStorage.value.settings.users_settings.dob_limit || 0;
        minBirthdate.setFullYear(minBirthdate.getFullYear() - dobLimit);
        return minBirthdate;
    }
    updateLocalStorageSettings(storageKey: string, jsonInfo: any) {
        if (storageKey && jsonInfo) {
            let localStroageUpdate = this._appConfig._localStorage.value;
            //update homeSettings
            if (storageKey == 'home_settings') {
                localStroageUpdate.settings.home_settings = jsonInfo;
                //Update localStorageKey
                let stringifySettings = JSON.stringify(localStroageUpdate.settings.home_settings);
                let jsonCoreSettings = JSON.parse(localStorage.getItem('settings')) || {};
                jsonCoreSettings.home_settings = stringifySettings;
                localStorage.setItem('settings', JSON.stringify(jsonCoreSettings));
            }
            // change users settings
            if (storageKey == 'users_settings') {
                localStroageUpdate.settings.users_settings = jsonInfo;
                //Update localStorageKey
                let stringifySettings = JSON.stringify({ 'users_settings': localStroageUpdate.settings.users_settings });
                let jsonCoreSettings = JSON.parse(localStorage.getItem('settings')) || {};
                jsonCoreSettings.users_settings = stringifySettings;
                localStorage.setItem('settings', JSON.stringify(jsonCoreSettings));
            }
            //event-settings
            if (storageKey == 'event-settings') {

                localStroageUpdate.settings['event-settings'] = jsonInfo;
                //Update localStorageKey
                let stringifySettings = JSON.stringify(localStroageUpdate.settings['event-settings']);
                let jsonCoreSettings = JSON.parse(localStorage.getItem('settings')) || {};
                jsonCoreSettings['event-settings'] = stringifySettings;
                localStorage.setItem('settings', JSON.stringify(jsonCoreSettings));
            }

            //Update themesettings
            if (storageKey == 'themesettings') {

                localStroageUpdate.settings.themesettings = jsonInfo;
                //Update localStorageKey
                let stringifyUserSettings = JSON.stringify({ 'themesettings': [localStroageUpdate.settings.themesettings] });
                let jsonCoreSettings = JSON.parse(localStorage.getItem('settings')) || {};
                jsonCoreSettings.themesettings = stringifyUserSettings;
                localStorage.setItem('settings', JSON.stringify(jsonCoreSettings));
            }

            if (storageKey == 'staff_settings') {

                localStroageUpdate.settings.staff_settings = jsonInfo;
                //Update localStorageKey
                let stringifyStaffSettings = JSON.stringify(localStroageUpdate.settings.staff_settings);
                let jsonCoreSettings = JSON.parse(localStorage.getItem('settings')) || {};
                jsonCoreSettings.staff_settings = stringifyStaffSettings;
                localStorage.setItem('settings', JSON.stringify(jsonCoreSettings));
            }
            if (storageKey == 'general_settings') {

                localStroageUpdate.settings.general_settings = jsonInfo;
                //Update localStorageKey
                let stringifyGeneralSettings = JSON.stringify(localStroageUpdate.settings.general_settings);
                let jsonCoreSettings = JSON.parse(localStorage.getItem('settings')) || {};
                jsonCoreSettings.general_settings = stringifyGeneralSettings;
                localStorage.setItem('settings', JSON.stringify(jsonCoreSettings));
            }
            this._appConfig._localStorage.next(localStroageUpdate);
            //Update Default Avatar And Cover
            this.UpdateDefaultPictures(jsonInfo)
        }
    }
    /**Set Updated Pictures */
    UpdateDefaultPictures(jsonInfo: any) {
        if (jsonInfo.defaultprofile) {
            this._appConfig.onDefaultAvatarChanged.next(jsonInfo.defaultprofile);
        }
        //Cover
        if (jsonInfo.defaultcover) {
            this._appConfig.onDefaultCoverChanged.next(jsonInfo.defaultcover);
        }
    }


    //GET DEFAULT DATE AND TIME FORMAT TO DISPLAY ON LISTING
    public get getDefaultDateTimeFormat() {
        if (this._appConfig.LocalSettings['general_settings']) {
            let generalSettings = CommonUtils.getStringToJson(this._appConfig.LocalSettings['general_settings']);
            if (generalSettings['date_format']) {
                this.dateTimeFormat.date_format = generalSettings['date_format'];
            }
            if (generalSettings['time_format']) {
                this.dateTimeFormat.time_format = generalSettings['time_format'];
            }
        }
        return this.dateTimeFormat;
    }

    /**Set Updated  profile Pictures */
    UpdateProfilePictures(jsonInfo: any) {
        console.log('in common service',jsonInfo);
        let UserInfo = new User().deserialize(jsonInfo, 'single');
        console.log('UserInfo',UserInfo);
        if (UserInfo) {
            this._appConfig.onProfileInfoChanged.next(UserInfo);
            localStorage.setItem('userInfo', JSON.stringify({ user_id: UserInfo.id, first_name: UserInfo.first_name, last_name: UserInfo.last_name, avatar_file: UserInfo.avatar_file }));
        }
    }
    /**GET META FIELDS */
    getFields(type: string) {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/fields`, { params: { 'field_form_type': type } })
                .subscribe((response: any) => {
                    this.metaFields = response.data;
                    resolve(response);
                }, reject);
        });
    }
    /**Get Settings From LocalSettings by Key */
    getLocalSettingsJson(key: string) {
        // setTimeout(() => {
        //     this._appConfig.updateLocalStorage();
        // }, 300);
        
        if (this._appConfig.LocalSettings[key]) {
            return CommonUtils.getStringToJson(this._appConfig.LocalSettings[key]);
        }
    }
    /**GET  Dynamic FIELDS data By Api */
    getdynmaiclist(obj: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/dynamiclist`, { params: obj })
                .subscribe((response: any) => {

                    this.dynamiclistdata = response.data;
                    resolve(response);
                }, reject);
        });
    }

    setdynamicdata(value)  //get the value from fields like upload,dynamic 
    {
        this.data = [];
        this.data = value;
    }
    getdynamicdata()  // assign the value to the entry list
    {
        return this.data;
    }

    setcheckboxdata(value)  //get the value from fields like upload,dynamic 
    {
        const checkIndex = this.checkboxdata.findIndex(item => { return item.field_id === value.field_id });
        if (checkIndex >= 0) {
            this.checkboxdata[checkIndex].field_value = value.field_value;
        }
        else {
            this.checkboxdata.push(value);
        }
    }
    getcheckboxdata()  // assign the value to the entry list
    {
        return this.checkboxdata;
    }
    //LIST FIELD DATA
    setlistdata(value) {
        if (value) {
            this.listdata = [...value];
        }
    }
    getlistdata() {
        return this.listdata;
    }

    getNextDateTime(dateInfo) {
        if (dateInfo.type == 'event_end_date') {
            let startDate = moment(dateInfo.dateTime);
            return startDate;
        }
        if (dateInfo.type == 'event_end_time') {
            let startTime = new Date(dateInfo.dateTime),
                endTime = new Date();
            endTime.setHours(startTime.getHours() + 1, startTime.getMinutes());
            return endTime;
        }
    }

    getDateFormat(date) {
        return this._datepipe.transform(date, "y-MM-dd")
    }

    getTimeFormat(date) {
        return this._datepipe.transform(date, "HH:mm:ss")
    }

    getDateTimeFormat(date) {
        return this._datepipe.transform(date, "y-MM-dd HH:mm:ss")
    }
    //GET MIN DATE 
    getMinDate() {
        //User Settings Fromn LocalStorage
        let ResidentDirSettings = this.getLocalSettingsJson('residentdirectorysearch');
        ResidentDirSettings = ResidentDirSettings ? ResidentDirSettings[0] : {};
        var minDays = '90';
        if (ResidentDirSettings && ResidentDirSettings['subtractdays']) {
            return ResidentDirSettings['subtractdays'];
        }
        return minDays;

    }
    //PASS META FILTER OBJECT TO COMPOENENTS
    getFilterMetaFields(metafields: any) {
        this.filterMetaFields.next(metafields)
    }


    //set data to resetMataFields BehaviorSubject- to reset fields
    clearMetaFields(value) {
        this.resetMataFields.next(value);
    }

    //  imports API start from here 

    //  save the import settings
    saveUserImportSettings(formInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/settings`, formInfo)
            .pipe(catchError(this.errorHandler));
    }

    // import the users settings
    saveUserOtherImportSettings(formInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}import/users`, formInfo)
            .pipe(catchError(this.errorHandler));
    }

    // import staff settings
    StaffImportSettings(formInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}import/staff`, formInfo)
            .pipe(catchError(this.errorHandler));
    }


    // import event  settings
    EventImportSettings(formInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}import/events`, formInfo)
            .pipe(catchError(this.errorHandler));
    }
    /** Add to FAVOURITE */
    addToFavourite(eventInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/addfavourite`, eventInfo)
            .pipe(catchError(this.errorHandler));
    }
    //REMOVE FAVOURITE
    removeFavourite(eventInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/deletefavourite`, eventInfo)
            .pipe(catchError(this.errorHandler));
    }

    //DISCARD CHANGES ON ROUTE CHANGE
    discardChanges(changeData: any) {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/discard`, changeData)
            .pipe(catchError(this.errorHandler));
    }

    // home page search bar 

    GetSerachdata(obj: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}actions/globalsearch`, { params: obj })
                .subscribe((response: any) => {
                    this.serachData = response.data;
                    resolve(response);
                }, reject);
        });
    }

    errorHandler(error: HttpErrorResponse) {
        return Observable.throw(error.message);
    }


}