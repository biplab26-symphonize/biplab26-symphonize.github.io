import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { catchError } from 'rxjs/operators';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements Resolve<any>{
  event: any;
  myevent: any;
  favourites: any;
  editevent: any;
  onEditEventChanged: BehaviorSubject<any>;
  onEventChanged: BehaviorSubject<any>;
  onMyEventChanged: BehaviorSubject<any>;
  appConfig: any;
  optionsList: any;
  eventFilters: object = {};
  eventMeta: any = [];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private _fileSaverService: FileSaverService
  ) {
    // Set the defaults
    this.onEventChanged = new BehaviorSubject({});
    this.onEditEventChanged = new BehaviorSubject({});
    this.onMyEventChanged = new BehaviorSubject({});
    this.appConfig = AppConfig.Settings;
    this.optionsList = OptionsList.Options;
    this.eventFilters = OptionsList.Options.tables.pagination.filters;
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

      this.eventFilters['column'] = '';
      this.eventFilters['direction'] = '';
      this.eventFilters['disp_req_register'] = '';

      let funArray: any[];
      if (route.routeConfig.path == 'admin/events/edit/:id' && route.params.id > 0) {
        funArray = [this.viewEvent(route.params.id)];
      }
      else if (route.routeConfig.path == 'my-events' || route.routeConfig.path == 'my-event/:slug') {

        this.eventFilters['column'] = 'event_id';
        this.eventFilters['direction'] = 'asc';
        this.eventFilters['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
        this.eventFilters['slug'] = route.params.slug || '';
        funArray = [this.getMyEvents(this.eventFilters), this.getFavouriteEvents(this.eventFilters)];
      }
      else if (route.routeConfig.path !== 'event/:slug' && route.routeConfig.path !== 'calendar/:slug') {
        this.eventFilters = OptionsList.Options.tables.pagination.filters;
        this.eventFilters['column'] = 'event_id';
        this.eventFilters['direction'] = 'desc';
        this.eventFilters['disp_req_register'] = 'N'; //get Only register required events
        this.eventFilters['trash'] = route.data.trash ? 1 : '';
        this.eventFilters['slug'] = route.params.slug || '';
        funArray = [this.getEvents(this.eventFilters)];

      }

      Promise.all(funArray).then(
        () => {
          resolve();
        },
        reject);
    });
  }

  /**
   * Get roles
   *
   * @returns {Promise<any>}
   */
  getEvents(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}list/events`, { params: filters })
        .subscribe((response: any) => {
          this.event = response;
          this.onEventChanged.next(this.event);
          resolve(response);
        }, reject);
    });
  }

  /**
 * Get my events
 *
 * @returns {Promise<any>}
 */
  getMyEvents(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}list/myevents`, { params: filters })
        .subscribe((response: any) => {
          this.myevent = response.attendee;
          this.onMyEventChanged.next(this.myevent);
          resolve(this.myevent);
        }, reject);
    });
  }

  /** SAVE & EDIT  */
  saveEvent(formInfo: any, edit: boolean = false): Observable<any> {
    //set api endpoint accroding edit or add view 
    let apiendpoint = edit == true ? 'update/events' : 'create/events';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, formInfo)
      .pipe(catchError(this.errorHandler));
  }

  /**
  * Get roles
  *
  * @returns {Promise<any>}
  */
  viewEvent(id: any): Promise<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('event_id', id.toString());
    }
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}view/events`, { params: params })
        .subscribe((response: any) => {
          this.editevent = response.eventinfo;
          this.eventMeta = response.eventinfo && response.eventinfo.usermeta ? response.eventinfo.usermeta : [];
          this.onEditEventChanged.next(this.editevent);
          resolve(response);
        }, reject);
    });
  }
  viewEvents(id: any, edit: any): Promise<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('event_id', id.toString());
      params = params.set('edit', edit);
    }
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}view/events`, { params: params })
        .subscribe((response: any) => {
          this.editevent = response.eventinfo;
          this.eventMeta = response.eventinfo && response.eventinfo.usermeta ? response.eventinfo.usermeta : [];
          this.onEditEventChanged.next(this.editevent);
          resolve(response);
        }, reject);
    });
  }
  //Fav Events
  getFavouriteEvents(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}list/favoriteevents`, { params: filters })
        .subscribe((response: any) => {
          this.favourites = response.favouriteeventsinfo;
          this.onMyEventChanged.next(this.favourites);
          resolve(this.favourites);
        }, reject);
    });
  }
  removeFavouriteEvents(eventInfo: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/deletefavourite`, eventInfo)
      .pipe(catchError(this.errorHandler));
  }
  //call the event on edit  
  updateForm(recordId: any, type: any): Observable<any> {
    let params = new HttpParams();
    params = params.set('record_id', recordId);
    params = params.set('type', type);
    let apiendpoint = 'actions/editupdaterestriction';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, params)
      .pipe(catchError(this.errorHandler));
  }
  /***** VIEW EVENT ******/
  getEventInfo(id: any) {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('event_id', id.toString());
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/events`, { params: params })
      .pipe(catchError(this.errorHandler));
  }

  /** NEW REGISTRATION & NEW ATTENDEE*/
  addNew(FormsData: any, url: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, FormsData)
      .pipe(catchError(this.errorHandler));
  }

  /** DELETE EVENTS */
  deleteEvent(url, deleteInfo: any): Observable<any> {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, deleteInfo)
      .pipe(catchError(this.errorHandler));
  }
  /** FRONT CANCEL EVENTS */
  cancelEvent(cancelinfo: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/eventcancelled`, cancelinfo)
      .pipe(catchError(this.errorHandler));
  }
  /** ON EDIT CHANGE EVENT STATUS*/
  eventStatusChange(FormsData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/eventstatuschange`, FormsData)
      .pipe(catchError(this.errorHandler));
  }

  getPrint(url, req_params: any) {
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
  /** EXPORT EVENTS */
  exportevents(exportInfo: any): Observable<any> {
    this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/events`, { params: exportInfo })
      .subscribe(exportres => {
        console.log(exportres);
        if (exportres.exportinfo.filepath) {
          window.open(this.appConfig.url.mediaUrl + exportres.exportinfo.filepath, "_blank");
          return;
        }
      });
    return;
  }

  downloadFile(downloadInfo: any): Observable<any> {
    this._httpClient.get(`${this.appConfig.url.mediaUrl + downloadInfo.exportInfo.exportinfo.filepath}`, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      this._fileSaverService.save(res.body, `eventsExport${downloadInfo.type}`);
    });
    return;
  }

  getEventMetaFields(metaInfo: any): Observable<any> {
    //set api endpoint accroding edit or add view 
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/fields`, { params: metaInfo })
      .pipe(catchError(this.errorHandler));
  }
  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }
}
