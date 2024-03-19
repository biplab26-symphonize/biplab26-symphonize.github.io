import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AppConfig, OptionsList } from '.';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormentriesService {
  formentry: any;
  homeformentry : any ;
  onFormentryChanged: BehaviorSubject<any>;
  appConfig: any;
  optionsList: any;
  formEntryFilters: object={};
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
      this.onFormentryChanged = new BehaviorSubject({});
      this.appConfig      = AppConfig.Settings;
      this.optionsList    = OptionsList.Options;
      this.formEntryFilters  = this.optionsList.tables.pagination.filters;
     
      
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
        if(route.routeConfig.path == 'admin/forms/entries'){
            this.formEntryFilters['trash']='';
            this.formEntryFilters['column'] = 'entry_id';
            this.formEntryFilters['form_id'] = '00';
            this.formEntryFilters['column'] = route.data.entryid ? route.data.entryid : '';
          
        } 
        else if(route.routeConfig.path == 'admin/entries/trash') {
              
          this.formEntryFilters['trash']   = 1;
          this.formEntryFilters['column'] ='';  
       }
        else if(route.routeConfig.path == 'admin/forms/entries/:form_id')
        {
        this.formEntryFilters['trash']=''
            this.formEntryFilters['column'] = 'entry_id';
            this.formEntryFilters['form_id'] =  route.params.form_id ? route.params.form_id : '';
        }
        
        if(route.routeConfig.path == 'forms/my-entries')
        {
         this.formEntryFilters['front'] = 1;
          this.formEntryFilters['trash'] = '';
          this.formEntryFilters['created_by'] = JSON.parse(localStorage.getItem('token')).user_id;
          this.formEntryFilters['column'] = route.data.entryid ? route.data.entryid : '';
          
        }

        

          Promise.all([
              this.getformentry(this.formEntryFilters)
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
  getformentry(filters:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}list/entries`,{params:filters})
              .subscribe((response: any) => {
                this.formentry = response.formentriesinfo.entryList;
                  this.onFormentryChanged.next(this.formentry);
                  resolve(response);
              }, reject);
      });
  }
  getworkxhubEntry(): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}list/workxhub`)
              .subscribe((response: any) => {
                  resolve(response);
              }, reject);
      });
  }

  getHomePageEnrties(filters:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}list/homepageentries`,{params:filters})
              .subscribe((response: any) => {
                this.homeformentry = response.formentriesinfo;
                  this.onFormentryChanged.next(this.homeformentry);
                  resolve(response);
              }, reject);
      });
  }
  //View Extras
  getWorkXHubContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('order_id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/workxhub`, { params: params })
      .pipe(catchError(this.errorHandler));
  }


  getPrintfromlistentries(url,req_params: any,){
    let params = new HttpParams();
    req_params.forEach(param => {
      let key = Object.keys(param)[0];
      let value = param[key];
      if(value){
        params = params.append(key, value.toString());
      }
    });
    this._httpClient.get<any>(`${this.appConfig.url.apiUrl}`+url,{params: params})
    .subscribe(printinfo=>
      {
    
        window.open(this.appConfig.url.mediaUrl + printinfo.pdfinfo);
        return;
      });
      return;
  }

  getPrintfromentry(url,req_params: any){
    let params = new HttpParams();
    req_params.forEach(param => {
      let key = Object.keys(param)[0];
      let value = param[key];
      if(value){
        params = params.append(key, value.toString());
      }
    });
    this._httpClient.get<any>(`${this.appConfig.url.apiUrl}`+url,{params: params})
    .subscribe(printinfo=>
      {
    
        window.open(this.appConfig.url.mediaUrl + printinfo.entryinfo.url);
        return;
      });
      return;
  }
  
  formEntryStatus(FormsData: any)
  {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/formentrystatus`, FormsData)
    .pipe(catchError(this.errorHandler));
  }

  deleteFormEntry(url,FormsData: any)
  {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+url, FormsData)
    .pipe(catchError(this.errorHandler));
  }
  deleteWorkxhubEntry(url,FormsData: any)
  {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+url, FormsData)
    .pipe(catchError(this.errorHandler));
  }

  updateEntry(url,FormsData: any)
  {
   
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, FormsData)
    .pipe(catchError(this.errorHandler));
  }


    // get entries print
    getformentryprint(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/entries`,{params:filters})
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
  // add the notes settings 

  addTheNotes(FormsData: any)
  {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/formentriesnote`, FormsData)
    .pipe(catchError(this.errorHandler));
  }

  deleteNotes(formdata :any){
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/formentriesnote`, formdata)
    .pipe(catchError(this.errorHandler));
  }

  CopyEntry(formdata){
    
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/copyformentry`, formdata)
    .pipe(catchError(this.errorHandler));
  }


   // GET FORM DATA BY ID
  getEntries(formData: any){
    
      let params = new HttpParams();
      if(formData != null){
        params = params.set('entry_id', formData);
      }
     return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/entries`,{ params: params })
     .pipe(catchError(this.errorHandler));
  }

  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message);
   }
}