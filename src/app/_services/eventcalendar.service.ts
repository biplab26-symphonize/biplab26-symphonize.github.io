import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Subject, Observable, from } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from '.';

@Injectable({
  providedIn: 'root'
})
export class EventcalendarService implements Resolve<any>{
  events: any;
  onEventsUpdated: Subject<any>;
  appConfig       : any;
  filter;
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
      this.onEventsUpdated = new Subject();
      this.appConfig       = AppConfig.Settings;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
          Promise.all([
              this.getEvents(this.filter)
          ]).then(
              ([events]: [any]) => {
                  resolve();
              },
              reject
          );
      });
  }

  /**
   * Get events
   *
   * @returns {Promise<any>}
   */
  getEvents(filter): Promise<any>
  {
      return new Promise((resolve, reject) => {

          this._httpClient.get(`${this.appConfig.url.apiUrl}list/events`,{params : filter})
              .subscribe((response: any) => {
                  this.events = response.data;
                //   console.log("event in service",this.events);
                  this.onEventsUpdated.next(this.events);
                  resolve(response);
              }, reject);
      });
  }

  /**
   * Update events
   *
   * @param events
   * @returns {Promise<any>}
   */
  updateEvents(events): Promise<any>
  {

      return new Promise((resolve, reject) => {
          this._httpClient.post(`${this.appConfig.url.apiUrl}list/events`, {
              id  : 'events',
              data: [...events]
          })
              .subscribe((response: any) => {
                  this.getEvents(this.filter);
              }, reject);
      });
  }
  //print events calendar in pdf format
  printEventsCalendar($params:any){
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/events` ,{params : $params})
        .subscribe(exportres => {
            if(exportres.pdfinfo){
                window.open(this.appConfig.url.mediaUrl+exportres.pdfinfo, "_blank");
                return;
            }
        });
  }

  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message);
  }

}
