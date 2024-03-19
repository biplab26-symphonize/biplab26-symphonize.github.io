import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConfig, OptionsList } from '.';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {


  formentry             : any;
  onFormapprovalChanged    : BehaviorSubject<any>;
  appConfig             : any;
  optionsList           : any;
  formapprovalFilters   : object={};
  form                  : any;
  aprovalArray = [];


  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
  ) { 

    this.onFormapprovalChanged   = new BehaviorSubject({});
    this.appConfig            = AppConfig.Settings;
    this.optionsList          = OptionsList.Options;
    this.formapprovalFilters  = this.optionsList.tables.pagination.filters;
   
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
        if(route.routeConfig.path == 'admin/form/approvals/:id'){
            this.formapprovalFilters['form_id'] = route.params.id;
            this.formapprovalFilters['column'] = route.data.formid ? route.data.formid : '';
             } 
            
      Promise.all([
        this.getApprovalsetting(this.formapprovalFilters)
    ]).then(
        () => {
            resolve();
        },
        reject
        );
     });


     
}

  
/**
     * Get userdatas
     *
     * @returns {Promise<any>}
     */
    getApprovalsetting(filters:any): Promise<any>
    {
    return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}list/approvalsetting`,{params:filters})
    .subscribe((response: any) => {
        this.form = response;
        console.log(this.form);
        this.onFormapprovalChanged.next( this.aprovalArray);
        resolve(response);
    }, reject);
    });
    }
  
 
      saveFormApprovalSettings(formInfo:any): Observable<any>
      {
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/approvalsetting`,formInfo )
      .pipe(catchError(this.errorHandler));
      }
  
      

     editapprovalsetting(formInfo:any): Observable<any>{    
            
      let params = new HttpParams();
      if(formInfo != null){
      params = params.set('id', formInfo);
      }
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/approvalsetting`,{ params: params })
      .pipe(catchError(this.errorHandler));
       }

       deletepaarovalsetting(url,deleteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+ url,deleteInfo)
        .pipe(catchError(this.errorHandler));
        }

        
        UpdateNApprovalstatus(formInfo:any):Observable<any> {
          return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/approvalsettingstatusupdate`,formInfo)
          .pipe(catchError(this.errorHandler))
      } 
   

    

       /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
      return Observable.throw(error.message);
      }
  }