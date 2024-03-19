
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig, OptionsList } from '.';
import { DatePipe } from '@angular/common';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import { catchError } from 'rxjs/operators';

const HttpUploadOptions = {
  headers: new HttpHeaders({  "Accept":"multipart/form-data" })
}

@Injectable()
export class AnnouncementService implements Resolve<any> {
  home          : any;
  topics        : any;
  edithome      : any;
  topic         : any;
  onAnnounceChanged: BehaviorSubject<any>;
  onTopicsChanged  : BehaviorSubject<any>;
  onEditChange  : BehaviorSubject<any>;
  appConfig     : any;
  optionsList   : any;
  announcementFilters: object={};
  trash         : any;
  scrollAnn     : string = "scroll-announcement";
  homeAnn       : string = "home-announcement";
  eventAnn      : string = "event-announcement";
  diningAnn     : string = "dining-announcement";
  forumtopics   : string = "forum"
    /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient : HttpClient,
      private datepipe    : DatePipe,
  )
  {
      // Set the defaults
      this.onAnnounceChanged  = new BehaviorSubject({});
      this.onEditChange       = new BehaviorSubject({});
      this.onTopicsChanged    = new BehaviorSubject({});
      this.appConfig          = AppConfig.Settings;
      this.optionsList        = OptionsList.Options;
      this.announcementFilters = this.optionsList.tables.pagination.filters;
    
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
        if(route.routeConfig.path=="admin/announcement/home")
        {
          this.announcementFilters['content_type']  = this.homeAnn;
           this.announcementFilters['column']        = 'order';
          this.announcementFilters['direction']     = 'desc';
         
         
        }
        if(route.routeConfig.path=="admin/announcement/event")
        {
          this.announcementFilters['content_type']  = this.eventAnn;
          this.announcementFilters['column']        = 'order';
          this.announcementFilters['direction']     = 'asc';
        
        
        }
        if(route.routeConfig.path=="admin/announcement/dining")
        {
          this.announcementFilters['content_type']  = this.diningAnn;
          this.announcementFilters['column']        = 'order';
          this.announcementFilters['direction']     = 'asc';
        
        }
        if(route.routeConfig.path=="admin/announcement/scrolling")
        {
          this.announcementFilters['content_type']  = this.scrollAnn;
          this.announcementFilters['column']        = 'order';
          this.announcementFilters['direction']     = 'desc';
       
          
        }
        if(route.routeConfig.path=="admin/forums/topics/all" || route.routeConfig.path=="admin/forum/topics/:forum_id" || route.routeConfig.path=="admin/forums/topics/trash")
        {
          this.announcementFilters['forum_id']      = route.params.forum_id > 0 ? route.params.forum_id : '';
          this.announcementFilters['content_type']  = this.forumtopics;
          this.announcementFilters['admin']         = 1;
          funArray = [this.getLists(this.announcementFilters)];
        }
        
        if(route.routeConfig.path=='admin/announcement/home/edit/:id' && route.params.id>0){
         // funArray = [this.getContent(route.params.id)];
         funArray = [];
        }
        else
        {
          if(route.routeConfig.path=='admin/announcement/event/edit/:id' && route.params.id>0){
            funArray = [this.getContent(route.params.id)];
          }else{
             
            if(route.routeConfig.path=='admin/announcement/dining/edit/:id' && route.params.id>0){
              funArray = [this.getContent(route.params.id)];
            }  
            if(route.routeConfig.path=='admin/announcement/scrolling/edit/:id' && route.params.id>0 ){
              //funArray = [this.getContent(route.params.id)];
              funArray = [];
            }
            else
            {
              //Set Trash From Router If Present
              this.announcementFilters['trash']   = route.data.trash ? route.data.trash : '';
              this.announcementFilters['column']  = 'order';
              this.announcementFilters['direction']     = 'desc';
              funArray = [this.getLists(this.announcementFilters)];
            }
          }
            
        }
       
        Promise.all(funArray).then(
          () => {
              resolve();
          },
          reject );
      });
  }

  /**
   * Get Content
   *
   * @returns {Promise<any>}
   */
  getLists(filters:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
          this._httpClient.get(`${this.appConfig.url.apiUrl}list/content`,{params:filters},)
              .subscribe((response: any) => {
                  this.home = response;
                  this.topics = response;
                  this.onAnnounceChanged.next(this.home);
                  this.onTopicsChanged.next(this.topics);
                  resolve(response);
              }, reject);
      });
  }

  /**
   * Get content
   *
   * @returns {Promise<any>}
   */
  getContent(content_id: any): Promise<any>{
    let params = new HttpParams();
    if(content_id != null){
      params = params.set('content_id', content_id.toString());
    }
    return new Promise((resolve, reject) => {
      this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/content`,{ params: params })
      .subscribe((response: any) => {
        this.edithome = response.contentinfo;
        this.topic    = response.contentinfo;
        this.onEditChange.next(this.edithome);
        resolve(response);
        }, reject);
    });
  }
  getEditContent(content_id: any,edit:any): Promise<any>{
    let params = new HttpParams();
    if(content_id != null){
      params = params.set('content_id', content_id.toString());
      params = params.set('edit', edit);
    }
    return new Promise((resolve, reject) => {
      this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/content`,{ params: params })
      .subscribe((response: any) => {
        this.edithome = response.contentinfo;
        this.topic    = response.contentinfo;
        this.onEditChange.next(this.edithome);
        resolve(response);
        }, reject);
    });
  }
  getTopicContent(content_id: any,edit:any): Promise<any>{
    let params = new HttpParams();
    if(content_id != null){
      params = params.set('content_id', content_id.toString());
      params = params.set('edit', edit);
    }
    return new Promise((resolve, reject) => {
      this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/content`,{ params: params })
      .subscribe((response: any) => {
        this.edithome = response.contentinfo;
        this.topic    = response.contentinfo;
        this.onEditChange.next(this.edithome);
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
  addNew(url,FormsData: any): Promise<any>{
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.appConfig.url.apiUrl}` + url ,FormsData)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
  }

  // 
  saveSorting(sortingInfo:any){
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/contentorder`, sortingInfo, HttpUploadOptions)
      .pipe(catchError(this.errorHandler));    
  }

  /** SAVE ANNOUNCEMENT */
  saveAnnouncement(formInfo:any,edit:boolean=false): Observable<any>{
        //set api endpoint accroding edit or add view 
        let apiendpoint = edit == true ? 'update/content' : 'create/content';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,formInfo)
                .pipe(catchError(this.errorHandler));
  }

   /** DELETE ANNOUNCEMENT */

  deleteField(url,deleteInfo:any): Observable<any>{
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+ url,deleteInfo)
            .pipe(catchError(this.errorHandler));
  }

  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message);
  }

}
