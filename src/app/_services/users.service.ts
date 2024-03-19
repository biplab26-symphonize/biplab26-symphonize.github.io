import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig, CommonService, OptionsList } from 'app/_services';
import { AuthService } from './auth.service';
import moment from 'moment';

@Injectable()
export class UsersService implements Resolve<any>
{
    users: any;
    usersData: any = [];
    user: any = {};
    onUsersChanged: BehaviorSubject<any>;
    onUserChanged: BehaviorSubject<any>;
    onNotificationChanged: BehaviorSubject<any>;
    appConfig: any;
    optionsList: any;
    userMeta: any = [];
    notifications: any[] = [];
    userfilters: object = {};
    usersDataList: any;
    bookingList: any={data:[],paging:{}};
    onBookingChanged: BehaviorSubject<any>;
    bookingFilter: object = {};
    public userSetting: any;
    public community_id: any;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _commonService: CommonService,
        private _httpClient: HttpClient,
        private authenticationService: AuthService
    ) {
        // Set the defaults
        this.onUsersChanged = new BehaviorSubject({});
        this.onUserChanged = new BehaviorSubject({});
        this.onNotificationChanged = new BehaviorSubject({});
        this.appConfig = AppConfig.Settings;
        this.optionsList = OptionsList.Options;
        this.userfilters = this.optionsList.tables.pagination.filters;

        this.onBookingChanged = new BehaviorSubject({});
        this.bookingFilter = this.optionsList.tables.pagination.filters;
        this.userSetting = this._commonService.getLocalSettingsJson('users_settings');
        this.community_id = this.userSetting.fullcount_settings.community_id
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

            //call functions on route path values
            if ((route.routeConfig.path == 'admin/users/edit/:id' || route.routeConfig.path == 'admin/users/view/:id' || route.routeConfig.path == 'view-other-profile/:id') && route.params.id > 0) {
                funArray = [this.getUser(route.params.id)];
            }
            else if (route.routeConfig.path == 'admin/settings/profile' || route.routeConfig.path == 'edit-profile') {
                let UserId = this.authenticationService.currentUserValue.token.user.id;
                funArray = [this.getUser(UserId)];
            }
            else if (route.routeConfig.path == 'edit-other-profile/:id' && route.params.id > 0) {
                funArray = [this.getUser(route.params.id)];
            }
            else if (route.routeConfig.path == 'profile/notifications') {
                let UserId = this.authenticationService.currentUserValue.token.user.id;
                this.userfilters['id'] = UserId;
                this.userfilters['column'] = 'created_at';
                this.userfilters['direction'] = 'desc';
                funArray = [this.getNotifications(this.userfilters)];
            } else if (route.routeConfig.path == 'customer-charge-account-details/:acid/:cstid') {
                let cstid = route.params.cstid;
                let todayDate: any;
                todayDate = new Date();
                // let firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
                // todayDate = moment(firstDay).format('YYYY-MM-DD');
                this.bookingFilter['cid'] = this.community_id;
                this.bookingFilter['cstid'] = cstid;
                // this.bookingFilter['date'] = todayDate;
                funArray = [this.getChargeAccountDetailsList(this.bookingFilter)];
            } else if (route.routeConfig.path == 'customer-plan-account-details/:cstid/:acid') {
                let acid = route.params.acid;
                let cstid = route.params.cstid;
                // let todayDate: any;
                // todayDate = new Date();
                // let firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
                // todayDate = moment(firstDay).format('YYYY-MM-DD');
                this.bookingFilter['cid'] = this.community_id;
                this.bookingFilter['cstid'] = cstid;
                this.bookingFilter['acid'] = acid;
                // this.bookingFilter['date'] = todayDate;
                funArray = [this.getPalnAccountDetailsList(this.bookingFilter)];
            }
            else {
                this.userfilters['id'] = '';
                //Set sorting for ID
                this.userfilters['column'] = 'id';
                this.userfilters['direction'] = 'desc';
                //Set Trash From Router If Present
                this.userfilters['trash'] = route.data.trash ? route.data.trash : '';
                funArray = [this.getUsers(this.userfilters)];
                // console.log("funArray",funArray);
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
     * Get users
     *
     * @returns {Promise<any>}
     */
    getUsers(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/users`, { params: filters })
                .subscribe((response: any) => {
                    this.users = response;
                    this.onUsersChanged.next(this.users);
                    resolve(response);
                }, reject);
        });
    }
    getKisokUsers(filters: any, flag: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/users`, { params: filters })
                .subscribe((response: any) => {
                    this.usersDataList = response.data;
                    if (flag == 1) {
                        let i = 0;
                        this.usersDataList.forEach(item => {
                            if (item.userroles.role_id != 8) {
                                this.usersData[i] = item;
                                i = i + 1;
                            }
                        });

                        console.log("usersData", this.usersData);
                        this.users = this.usersData;
                        this.onUsersChanged.next(this.users);
                        resolve(this.usersData);
                    } else {
                        this.users = response.data;
                        this.onUsersChanged.next(this.users);
                        resolve(response.data);
                    }

                }, reject);
        });
    }
    /**
     * Get Single User
     *
     * @returns {Promise<any>}
     */
    getUser(userId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let params = new HttpParams();
            params = params.set('id', userId.toString());
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`, { params: params })
                .subscribe((response: any) => {
                    this.user = response.userinfo;
                    console.log("this.user", this.user);
                    this.userMeta = this.user.usermeta;
                    this.onUserChanged.next(this.user);
                    resolve(response);
                }, reject);
        });
    }
    getAuthUser(userId: number): Observable<any> {

        let params = new HttpParams();
        params = params.set('id', userId.toString());
        return this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`, { params: params })
    }

    getProfileValue(id: any): Observable<any> {
        console.log("id", id);
        let params = new HttpParams();
        params = params.set('id', id.toString());
        return this._httpClient.get(`${this.appConfig.url.apiUrl}list/categories`, { params: params })
            .pipe(catchError(this.errorHandler));
    }
    // Check username available or not
    checkUsername(username: any) {
        // console.log("check username",username);
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/username`, username)
            .pipe(catchError(this.errorHandler));
    }
    /** SAVE USER */
    saveUser(userInfo: any, update: boolean = false): Observable<any> {
        console.log("user Info", userInfo);
        //set api endpoint accroding edit or add view 
        let apiendpoint = update == true ? 'update/user' : 'create/user';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, userInfo)
            .pipe(catchError(this.errorHandler));
    }
    /** DELETE USERS */
    deleteUsers(deleteInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/users`, deleteInfo)
            .pipe(catchError(this.errorHandler));
    }
    /** Update welcome popup password & email */
    updateWelcomePassword(FormsData: any) {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/emailpasswordupdate`, FormsData)
            .pipe(catchError(this.errorHandler));
    }

    /** GET RESIDENT */
    getResident(params: any) {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/residentsearch`, { params: params })
            .pipe(catchError(this.errorHandler));
    }

    getResidentForFilter() {

        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/residentsearch`)
            .pipe(catchError(this.errorHandler));
    }
    getMetaFields(filters: any): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/fields`, { params: filters })
            .pipe(catchError(this.errorHandler));
    }

    // this is use in  element  component for autocomplete the field 
    alluser(): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/users`)
            .pipe(catchError(this.errorHandler));
    }
    //Get Auto Populate Users
    getAutoUsers(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/autocomplete`, { params: filters })
                .subscribe((response: any) => {
                    this.users = response;
                    this.onUsersChanged.next(this.users);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get users
     *
     * @returns {Promise<any>}
     */
    getNotifications(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/notifications`, { params: filters })
                .subscribe((response: any) => {
                    this.notifications = response;
                    this.onNotificationChanged.next(this.notifications);
                    resolve(response);
                }, reject);
        });
    }
    /** DELETE NOTIFICATIONS */
    deleteNotification(deleteInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/notifications`, deleteInfo)
            .pipe(catchError(this.errorHandler));
    }
    /** READ NOTIFICATIONS */
    readNotification(readInfo: any): Observable<any> {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/notifications`, readInfo)
            .pipe(catchError(this.errorHandler));
    }

    // cart watch api start here 

    //get the balance    
    Getbalance(): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}cardwatch/getbalance`)
            .pipe(catchError(this.errorHandler));
    }

    //get transection details 
    GetTransectionDetails(filters: any): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}cardwatch/gettransactions`, { params: filters })
            .pipe(catchError(this.errorHandler));
    }

    // get location
    GetLocation(): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}cardwatch/getlocations`)
            .pipe(catchError(this.errorHandler));
    }

    GetCycleMenu(filters: any): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}cardwatch/getmenus`, { params: filters })
            .pipe(catchError(this.errorHandler));
    }

    viewImg(filters: any): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}cardwatch/getitemphoto`, { params: filters })
            .pipe(catchError(this.errorHandler));
    }

    //  full count customer list
    getCustomerList(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}fullcount/getcustomers`, { params: filters })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    //  full count customer list
    getAccountList(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}fullcount/accountlist`, { params: filters })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    planAccountPeriods(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}fullcount/planaccountperiods`, { params: filters })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    chargeAccountPeriods(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}fullcount/chargeaccountperiods`, { params: filters })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    // getFullCountUser(userId: number): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         let params = new HttpParams();
    //         params = params.set('id', userId.toString());
    //         this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`, { params: params })
    //             .subscribe((response: any) => {

    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    getFullCountUser(id: any): Observable<any> {
        let params = new HttpParams();
        if (id != null) {
            params = params.set('id', id);
        }
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/user`, { params: params })
            .pipe(catchError(this.errorHandler));
    }

    // get charge account details
    getChargeAccountDetailsList(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}fullcount/gettransaction`, { params: filters })
                .subscribe((response: any) => {
                    if(response && response.data && response.data.length>0){
                        this.bookingList = response;
                        this.bookingList.data = this.bookingList.data.map(item=>{
                            item.transactionDateTime = moment(item.transactionDateTime).format('YYYY/MM/DD hh:mm:ss');
                            return item;
                        });
                    }
                    else{
                        this.bookingList = {data:[],paging:{}};
                    }
                    this.onBookingChanged.next(this.bookingList);
                    resolve(response);
                }, reject);
        });
    }
    // get plan account details
    getPalnAccountDetailsList(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}fullcount/getplantransaction`, { params: filters })
                .subscribe((response: any) => {
                    if(response && response.data && response.data.length>0){
                        this.bookingList = response;
                        this.bookingList.data = this.bookingList.data.map(item=>{
                            item.transactionDateTime = moment(item.transactionDateTime).format('YYYY/MM/DD hh:mm:ss');
                            return item;
                        });
                    }
                    else{
                        this.bookingList = {data:[],paging:{}};
                    }
                    this.onBookingChanged.next(this.bookingList);
                    resolve(response);
                }, reject);
        });
    }
    // print the charge account
    getPrintChargeAccountEntries(url, req_params: any) {
        let params = new HttpParams();
        req_params.forEach(param => {
            let key = Object.keys(param)[0];
            let value = param[key];
            if (value) {
                params = params.append(key, value.toString());
            }
        });
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}` + url, { params: params })
            .subscribe(printinfo => {
                window.open(this.appConfig.url.mediaUrl + printinfo.pdfinfo);
                return;
            });
        return;
    }
    // print the charge account
    getPrintPlanAccountEntries(url, req_params: any) {
        let params = new HttpParams();
        req_params.forEach(param => {
            let key = Object.keys(param)[0];
            let value = param[key];
            if (value) {
                params = params.append(key, value.toString());
            }
        });
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}` + url, { params: params })
            .subscribe(printinfo => {
                window.open(this.appConfig.url.mediaUrl + printinfo.pdfinfo);
                return;
            });
        return;
    }
    /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse) {
        return Observable.throw(error.message);
    }
}
