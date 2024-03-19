import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from 'app/_models';
import { AppConfig } from 'app/_services';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<Login>;
    public portalUser: Observable<Login>;
    public appConfig: any;
    public isAccess: boolean=false;
    public urlparams: any;
    constructor(
        private http: HttpClient,
        private _fuseProgressBarService: FuseProgressBarService,
        private route: Router) {
        this.currentUserSubject = new BehaviorSubject<Login>(JSON.parse(localStorage.getItem('token')));
        this.portalUser         = this.currentUserSubject.asObservable();
        this.appConfig          = AppConfig.Settings;
    }

    public get currentUserValue() {
        const  jwtHelper  = new JwtHelperService();
        const  Isexpired  = this.currentUserSubject.value ? jwtHelper.isTokenExpired(this.currentUserSubject.value.token) : true;
        const  guardInfo  = {
            'token':this.currentUserSubject.value ? jwtHelper.decodeToken(this.currentUserSubject.value.token) : null || '', 
            'isExpired':Isexpired,
            'last_login':this.currentUserSubject.value ? this.currentUserSubject.value.last_login : '',
            'tokenstring':this.currentUserSubject.value ? this.currentUserSubject.value.token : null || '', 
            // 'user_id':this.currentUserSubject.value ? this.currentUserSubject.value.user_id : null || '', 
        };
        return guardInfo;
    }
    /** set current uservalue after update welcome popup */
    public set currentUserValue(tokenInfo:any) {
        this.currentUserSubject.next(tokenInfo);
    }

    login(username: string, password: string, remember: boolean) {

        //SHOW LOADER BAR #EXTRA Changes
        this._fuseProgressBarService.show();

        let rememberMe = remember==true ? 'Y' : 'N'; //EXTRA Changes
        return this.http.post<any>(`${this.appConfig.url.apiUrl}auth/login`, { username, password, rememberMe })
            .pipe(map(loginResponse => {
                this._fuseProgressBarService.hide();
                // login successful if there's a jwt token in the response
                if (loginResponse && loginResponse.tokeninfo && loginResponse.status==200) {
                    // store loginResponse details and jwt token in local storage to keep loginResponse logged in between page refreshes
                    localStorage.setItem('token', JSON.stringify(loginResponse.tokeninfo));
                    localStorage.setItem('settings', JSON.stringify(loginResponse.settings));
                    localStorage.setItem('themesettings', JSON.stringify(loginResponse.themesettings));
                    this.currentUserSubject.next(loginResponse.tokeninfo);
                }
                loginResponse.redirectUrl = this.appConfig.url.redirectAfterLogin
                return loginResponse;
            }),catchError(err => { return throwError("Error thrown from Server");}));
    }
    
    logout() {
        
        //SHOW LOADER BAR #EXTRA Changes
        this._fuseProgressBarService.show();

        const token = {'token':this.currentUserValue.tokenstring};
        
        //remove from database 
        return this.http.post<any>(`${this.appConfig.url.apiUrl}auth/logout`, token)
            .pipe(map(logoutResponse => {
                // login successful if there's a jwt token in the response
              
                this._fuseProgressBarService.hide();
                if (logoutResponse) {
                    // store loginResponse details and jwt token in local storage to keep loginResponse logged in between page refreshes
                    localStorage.removeItem('token');
                    localStorage.removeItem('settings');
                    localStorage.removeItem('themesettings');
                    localStorage.removeItem('userInfo');
                    this.currentUserSubject.next(null);
                }
                return logoutResponse;
            }),catchError(err => { return throwError("Error in logout");}));
        this.currentUserSubject.next(null);
    }
    /** 
     * forgot pwd request
    */
    forgot(username: string) {
        //SHOW LOADER BAR #EXTRA Changes
        this._fuseProgressBarService.show();
        return this.http.post<any>(`${this.appConfig.url.apiUrl}auth/forgot`, { username })
            .pipe(map(forgotResponse => {
                this._fuseProgressBarService.hide();
                return forgotResponse;
            }),catchError(err => { return throwError("Error thrown from Server");}));
    }
    /** 
     * reset pwd request 
    */
    reset(resetInfo: any) {
        //SHOW LOADER BAR #EXTRA Changes
        this._fuseProgressBarService.show();
        return this.http.post<any>(`${this.appConfig.url.apiUrl}auth/reset`, resetInfo)
            .pipe(map(forgotResponse => {
                this._fuseProgressBarService.hide();
                return forgotResponse;
            }),catchError(err => { return throwError("Error thrown from Server");}));
    }
    //Set Url in Variable to send in api
    setUrlParam(urlObject:any){
        this.urlparams = urlObject;
        return this.urlparams;
    }
    //Function for accessing menus with user role assigned
    permissionAccess(){
        return this.http.get<any>(`${this.appConfig.url.apiUrl}actions/menuaccess`,{params:this.urlparams})
        .pipe(map(accessResponse => {
            this._fuseProgressBarService.hide();
            return accessResponse;
        }),catchError(err => { return throwError(false);}));
    }
    get isAccessible(): Observable<any> {
        return this.permissionAccess().pipe(tap(data => {
            this.isAccess = data.menuinfo;
            return this.isAccess;
        }));
    }
}