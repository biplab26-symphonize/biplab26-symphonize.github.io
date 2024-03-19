import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AppConfig,OptionsList } from 'app/_services';

@Injectable({
  providedIn: 'root'
})
export class PagebuilderService {
  appConfig: any;
  pages: any;
  page: any={};
  monthyears: any;
  onPagesChanged: BehaviorSubject<any>;
  onPageChanged: BehaviorSubject<any>;
  onMonthYearsChanged: BehaviorSubject<any>;
  optionsList: any;
  pageFilters: any;
  constructor(
    private _httpClient: HttpClient
  ) {
    // Set the defaults
    this.onPagesChanged      = new BehaviorSubject({});
    this.onPageChanged       = new BehaviorSubject({});
    this.onMonthYearsChanged = new BehaviorSubject({});
    this.appConfig           = AppConfig.Settings;
    this.optionsList         = OptionsList.Options;
    this.pageFilters         = this.optionsList.tables.pagination.filters;
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
          //Set sorting for ID
          this.pageFilters['column'] = 'order';
          this.pageFilters['direction'] = 'asc';
          //Set Trash From Router If Present
          this.pageFilters['trash'] = route.data.trash ? route.data.trash : '';
          funArray = [this.getPages(this.pageFilters), this.dateFilterlist({type:'Page'})];
          Promise.all(funArray).then( () => { resolve(); }, reject );
      });
  }
  //GET PAGES LIST
  getPages(filters:any): Promise<any>
  {
    return new Promise((resolve, reject) => {
        this._httpClient.get(`${this.appConfig.url.apiUrl}list/pages`,{params:filters})
            .subscribe((response: any) => {
                this.pages = response;
                this.onPagesChanged.next(this.pages);
                resolve(response);
            }, reject);
    });
  }
  //Save Page
  savePage(pageData:any, update:boolean=false){
    //set api endpoint accroding edit or add view 
    let apiendpoint = update == true ? 'update/pages' : 'create/pages';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`, pageData)
    .pipe(catchError(this.errorHandler));
  }
  //GET SINGLE PAGE INFO
  getPageInfo(pageData : any){
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/pages`, {params:pageData})
    .pipe(catchError(this.errorHandler));
  }
  /** DELETE USERS */
  deletePages(deleteInfo:any): Observable<any>{
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/trashpages`,deleteInfo)
            .pipe(catchError(this.errorHandler));
  }
  //CHANGE STATUS
  changeStatus(pageInfo:any): Observable<any>{
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/pagesstatuschange`,pageInfo)
            .pipe(catchError(this.errorHandler));
  }
  /** Upload Multiple Documents for archive types */
  saveSorting(sortingInfo:any){
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/pagesorderchange`, sortingInfo)
      .pipe(catchError(this.errorHandler));    
  }
  //DateFilters
  dateFilterlist(dateFilter:any){
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}actions/details`,{params:dateFilter})
        .subscribe((response: any) => {
            this.monthyears = response.page;
            this.onMonthYearsChanged.next(this.monthyears);
            resolve(response);
        }, reject);
    });
  }
  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message);
  }
}
