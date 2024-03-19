import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AppConfig, OptionsList } from '.';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostSmtpService {
  emaillog: any;
  onSmtpChanged: BehaviorSubject<any>;
  appConfig: any;
  optionsList: any;
  SmtpFilters: object={};
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient: HttpClient,
      private route : ActivatedRoute
  )
  {
      // Set the defaults
      this.onSmtpChanged  = new BehaviorSubject({});
      this.appConfig      = AppConfig.Settings;
      this.optionsList    = OptionsList.Options;
      this.SmtpFilters  = this.optionsList.tables.pagination.filters;
     
      
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
        if(route.routeConfig.path == 'admin/email-log/list'){
       
            this.SmtpFilters['column'] = 'id';
            this.SmtpFilters['direction'] = 'desc'			
            this.SmtpFilters['from_date']	= '';
            this.SmtpFilters['to_date']	='';
                  } 
          Promise.all([
              this.getemaillog(this.SmtpFilters)
          ]).then(
              () => {
                  resolve();
              },
              reject
          );
      });
  }

  /**
   * Get forms
   *
   * @returns {Promise<any>}
   */
  getemaillog(filters:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}actions/emailloglist`,{params:filters})
              .subscribe((response: any) => {
                this.emaillog = response.email_log;
                  this.onSmtpChanged.next(this.emaillog);
                  resolve(response);
              }, reject);
      });
  }

  //View Extras
  getEmailContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/emaillogview`, { params: params })
      .pipe(catchError(this.errorHandler));
  }

  // delete the email log  data 
  deleteEmailLog(url,deleteInfo:any): Observable<any>{
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+ url,deleteInfo)
    .pipe(catchError(this.errorHandler));
  }

 
  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message);
   }
}
