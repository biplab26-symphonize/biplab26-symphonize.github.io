import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig,OptionsList } from 'app/_services';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class StaffService  implements Resolve<any>{
  users: any;
  user: any={};
  onUsersChanged: BehaviorSubject<any>;
  onUserChanged: BehaviorSubject<any>;
  appConfig: any;
  optionsList: any;
  stafffilters: object={};
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
      this.onUsersChanged = new BehaviorSubject({});
      this.onUserChanged  = new BehaviorSubject({});
      this.appConfig      = AppConfig.Settings;
      this.optionsList    = OptionsList.Options;
      this.stafffilters        = this.optionsList.tables.pagination.filters;
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
          if(route.routeConfig.path=='admin/staff/edit/:id' && route.params.id>0){
            
              funArray = [this.getStaff(route.params.id)];
          }
          else{
              this.stafffilters['column'] = 'id';
              this.stafffilters['display'] = "list";
              this.stafffilters['direction'] = 'desc';
              //Set Trash From Router If Present
              this.stafffilters['trash'] = route.data.trash ? route.data.trash : '';
              funArray = [this.getStaffs(this.stafffilters)];
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
   * Get staffs
   *
   * @returns {Promise<any>}
   */
  getStaffs(stafffilters:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}list/staffs`,{params:stafffilters})
              .subscribe((response: any) => {
                  this.users = response;
                  this.onUsersChanged.next(this.users);
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
  /**
   * Get Single staff
   *
   * @returns {Promise<any>}
   */
  getStaff(userId:number): Promise<any>
  {
      return new Promise((resolve, reject) => {
          let params = new HttpParams();
          params = params.set('id', userId.toString());
          this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`,{params:params})
              .subscribe((response: any) => {
                  this.user = response.userinfo;
                  this.onUserChanged.next(this.user);
                  resolve(response);
              }, reject);
      });
  }
  getStaffContent(userId:number,edit:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
          let params = new HttpParams();
          params = params.set('id', userId.toString());
          params = params.set('edit', edit);
          this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`,{params:params})
              .subscribe((response: any) => {
                  this.user = response.userinfo;
                  this.onUserChanged.next(this.user);
                  resolve(response);
              }, reject);
      });
  }
  getStaffContents(userId:number): Promise<any>
  {
      return new Promise((resolve, reject) => {
          let params = new HttpParams();
          params = params.set('id', userId.toString());
          this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`,{params:params})
              .subscribe((response: any) => {
                  this.user = response.userinfo;
                  this.onUserChanged.next(this.user);
                  resolve(response);
              }, reject);
      });
  }
   /** HANDLE HTTP ERROR */
errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }
}
