import { Injectable } from '@angular/core';
import { AppConfig } from './app.config.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { OptionsList } from './options.list.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  appConfig: any;
  eventlist: any;
  entrieslist: any;
  attendeeslist: any;
  onEventChanged: BehaviorSubject<any>;
  onEntriesChanged: BehaviorSubject<any>;
  onAttendeesChanged: BehaviorSubject<any>;
  formEntriesFilter: object = {};
  attendeesFilter: object = {};
  eventFilter: object = {};
  optionsList: any;
  constructor(private http: HttpClient) {
    this.optionsList = OptionsList.Options;
    this.appConfig = AppConfig.Settings;
    this.onEventChanged = new BehaviorSubject({});
    this.onEntriesChanged = new BehaviorSubject({});
    this.onAttendeesChanged = new BehaviorSubject({});
    this.formEntriesFilter = this.optionsList.tables.pagination.filters;
    this.attendeesFilter = this.optionsList.tables.pagination.filters;
    this.eventFilter = this.optionsList.tables.pagination.filters;
  }

  getList(url): Observable<any> {
    return this.http.get<any>(url).pipe(catchError(this.errorHandler));
  }
  getDashboardCount(): Observable<any> {
    return this.http.get<any>(`${this.appConfig.url.apiUrl}actions/dashboardstatistics`)
      .pipe(catchError(this.errorHandler));
  }
  getFormEntriesList(filters: any): Observable<any> {
    return this.http.get(`${this.appConfig.url.apiUrl}actions/dashboardFormEntries`, { params: filters },)
      .pipe(catchError(this.errorHandler));
  }
  getAttendeesList(filters: any): Observable<any> {
    return this.http.get(`${this.appConfig.url.apiUrl}actions/dashboardattendees`, { params: filters },)
      .pipe(catchError(this.errorHandler));
  }
  getEventList(filters: any): Observable<any> {
    return this.http.get(`${this.appConfig.url.apiUrl}actions/dashboardtodaysevent`, { params: filters },)
      .pipe(catchError(this.errorHandler));
  }
  getFormsList(filters: any): Observable<any> {
    return this.http.get(`${this.appConfig.url.apiUrl}actions/dashboardforms`, { params: filters },)
      .pipe(catchError(this.errorHandler));
  }

  getDocumentList(filters: any): Observable<any> {
    return this.http.get(`${this.appConfig.url.apiUrl}actions/dashboarddocumentupload`, { params: filters },)
      .pipe(catchError(this.errorHandler));
  }
  getUserList(filters: any): Observable<any> {
    return this.http.get(`${this.appConfig.url.apiUrl}actions/dashboardusers`, { params: filters },)
      .pipe(catchError(this.errorHandler));
  }
  
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }

}
