import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';

const HttpUploadOptions = {
  headers: new HttpHeaders({  "Accept":"multipart/form-data" })
}



@Injectable({
  providedIn: 'root'
})
export class RotatingMenuService {

  menuChanged: BehaviorSubject<any>;
  appConfig: any;
  rotatingmenu: any;
  optionsList: any;
  manutype : string = "RDM";
  routationmenuFilters: object={};
   /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
  ) { 
    this.menuChanged = new BehaviorSubject({});
    this.appConfig      = AppConfig.Settings;
    this.optionsList    = OptionsList.Options;
    this.routationmenuFilters     = this.optionsList.tables.pagination.filters;
    
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
        if(route.routeConfig.path == 'admin/all-rotating-menu/list'){
          this.routationmenuFilters['trash']        = '';
          this.routationmenuFilters['column']       = '';
          this.routationmenuFilters['type']         = 'display';
          this.routationmenuFilters['menu_source']  = this.manutype;
        } 

          Promise.all([
              this.getroatingmenu(this.routationmenuFilters)
          ]).then(
              () => {
                  resolve();
              },
              reject
          );
      });
  }


   /**
   * Get  menu list
   *
   * @returns {Promise<any>}
   */
  getroatingmenu(filters:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}list/menus`,{params:filters})
              .subscribe((response: any) => {
                this.rotatingmenu = response;
                  this.menuChanged.next(this.rotatingmenu);
                  resolve(response);
              }, reject);
      });
  }

  
     // SAVE NEW  DATA
     saverotatingmenuData(menuInfo:any): Observable<any>
     {    
     return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/rotatingmenus`, menuInfo)
     .pipe(catchError(this.errorHandler));
     }
  // view the rotating menu
     viewRotatingmenu(Info:any): Observable<any>{
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/rotatingmenus`,{params :Info})
        .pipe(catchError(this.errorHandler));
    }

    //  upload the Pdf setting
    UploadthePdf(uploadInfo:any): Observable<any>
    {    
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/rotatingmenuspdf`, uploadInfo)
    .pipe(catchError(this.errorHandler));
    }
    // delete the Pdf
    Deletethepdf(id:any): Observable<any>
    {    
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/rotatingmenuspdf`, id)
    .pipe(catchError(this.errorHandler));
    }

    viewallrotatingmenu(Info:any) :Observable<any>{
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/allrotations`,{params :Info})
        .pipe(catchError(this.errorHandler));

    }

    

 
    
       /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
      return Observable.throw(error.message);
     }
 

}
