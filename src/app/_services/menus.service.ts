import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig } from 'app/_services';

@Injectable({
  providedIn: 'root'
})

export class MenusService {
  appConfig: any;
  optionsList: any;
  filterParams: BehaviorSubject<any>;
  _ondynamicmenusList: BehaviorSubject<any>;
  

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient: HttpClient
  )
  {
    this.appConfig = AppConfig.Settings;
    this.filterParams = new BehaviorSubject({});    
    this._ondynamicmenusList = new BehaviorSubject(null);
  }
  /**Get Changed Navigation */
  get ondynamicmenusList(): Observable<any>
  {
      return this._ondynamicmenusList.asObservable();
  }

  /**
   * Get Menus
   *
   * @returns {Observable<Menus>}
   */
  getMenusList(filters:any): Observable<any>
  {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/menus`, {params:filters})
    .pipe(catchError(this.errorHandler));
  }
  // getMenusForGuard(): Observable<any>
  // {
  //   return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/menus`)
  //   .pipe(catchError(this.errorHandler));
  // }
  /**
   * Get Menu
   *
   * @returns {Observable<Menus>}
   */
  getMenu(filters:any): Observable<any>
  {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/menus`, {params:filters})
    .pipe(catchError(this.errorHandler));
  }
  /** Update Menu Order and parent Id */
  updateMenuorder(menuData: any){
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/menuorder`, menuData)
    .pipe(catchError(this.errorHandler));
  }
  /**Save New Menu  */
  saveMenus(menuData:any, update:boolean=false){
    //set api endpoint accroding edit or add view 
    console.log("api save menus", menuData);
    let apiendpoint = update == true ? 'update/menus' : 'create/menus';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`, menuData)
    .pipe(catchError(this.errorHandler));
  }
  /** DELETE USERS */
  deleteMenus(deleteInfo:any): Observable<any>{
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/menus`,deleteInfo)
    .pipe(catchError(this.errorHandler));
  }
  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse){
   return Observable.throw(error.message);
  }
}
