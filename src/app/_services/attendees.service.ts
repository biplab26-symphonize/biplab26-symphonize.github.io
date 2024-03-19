import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})
export class AttendeesService implements Resolve<any> {
  attendee: any;
  attendeeEventInfo: any;
  editAttendee:any;
  onAttendeeChanged: BehaviorSubject<any>;
  onEditAttendeeChange: BehaviorSubject<any>;
  appConfig: any;
  optionsList: any;
  attendeeFilters: object={};
  event_id:any;
  attendeeid : any;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient       : HttpClient,
      private route             : ActivatedRoute,
      private _fileSaverService : FileSaverService,
  )
  {
      // Set the defaults
      this.onAttendeeChanged    = new BehaviorSubject({});
      this.onEditAttendeeChange = new BehaviorSubject({});
      this.appConfig            = AppConfig.Settings;
      this.optionsList          = OptionsList.Options;
      this.attendeeFilters      = this.optionsList.tables.pagination.filters;     
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
        this.attendeeFilters['trash'] = '';
        if(route.routeConfig.path=='admin/attendees/list/:event_id' || route.routeConfig.path=='admin/attendees/trash/:event_id'){
          this.attendeeFilters['event_id']  = route.params.event_id ?  route.params.event_id :'' ;
          this.attendeeFilters['column']    = 'attendee_id';
          this.attendeeFilters['status']    = '';
          this.attendeeFilters['trash']     = route.data.trash ? route.data.trash : '';
          funArray = [this.getAttendees(this.attendeeFilters)];  
        }

        if(route.routeConfig.path=='admin/attendees/edit/:id' )
        { 
            this.attendeeFilters['attendee_id'] = route.params.id;
            funArray = [this.getAttendee(this.attendeeFilters)];
        }        

        Promise.all(funArray).then(
          () => {
              resolve();
          },
          reject )
      });
  }

  /**
   * Get roles
   *
   * @returns {Promise<any>}
   */
  getAttendees(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/attendeelist`,{params:filters})
            .subscribe((response: any) => {
                this.attendee = response.attendeeList;
                this.attendeeEventInfo = response.eventinfo;
                this.onAttendeeChanged.next(this.attendee);
                resolve(response);
            }, reject);
        });
    }
    /**
   * Get content
   *
   * @returns {Promise<any>}
   */
    getAttendee(filters:any): Promise<any>{
    
        return new Promise((resolve, reject) => {
        this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/viewattendees`,{ params: filters })
        .subscribe((response: any) => {
            this.editAttendee = response.attendeeinfo;
            this.onEditAttendeeChange.next(this.editAttendee);
            resolve(response);
            }, reject);
        });
    }

    /** EXPORT ATTENDEE */
    exportAttendee(exportInfo:any): Observable<any>{
      this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/eventattendees`,{params:exportInfo})
      .subscribe(exportres => {
          if(exportres.exportinfo.filepath){
              window.open(this.appConfig.url.mediaUrl+exportres.exportinfo.filepath, "_blank");
              return;
          }
      });
      return;
    }

    downloadFile(downloadInfo:any): Observable<any>{        
        this._httpClient.get(`${this.appConfig.url.mediaUrl+downloadInfo.exportInfo.exportinfo.filepath}`, {
        observe: 'response',
        responseType: 'blob'
        }).subscribe(res => {
            this._fileSaverService.save(res.body, `attendeeExport${downloadInfo.type}`);
        });
        return;
    }
    
    /** SAVE ATTENDEE */
    saveAttendee(formInfo:any,edit:boolean=false): Observable<any>{
      //set api endpoint accroding edit or add view 
      let apiendpoint = edit == true ? 'actions/manualattendeeupdate' : 'actions/eventregister';
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,formInfo)
              .pipe(catchError(this.errorHandler));
    }

    statusUpdate(FormsData: any){
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/attendeestatusupdate`,FormsData)
      .pipe(catchError(this.errorHandler));
    }

    /** DELETE ATTENDEE */
    deleteAttendee(url,deleteInfo:any){
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+ url,deleteInfo)
              .pipe(catchError(this.errorHandler));
    }

    /***** SEND MAIL TO SELECTED ATTENDEE *****/
    sendMail(FormsData: any){
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/eventnotification`,FormsData)
              .pipe(catchError(this.errorHandler));
    }

    exportGoogleCal(exportInfo:any): Observable<any>{
       return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}export/googlecal`,{params:exportInfo})
        .pipe(catchError(this.errorHandler));
    }
    
    /***** GET ATTENDEES PRINT URL *****/
    viewEvents(params: any){
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/events`,{params : params})
              .pipe(catchError(this.errorHandler));
    }

     /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message);
    }
}
