import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { IDiningServiceData } from 'app/main/admin/dining-reservation/services/add/IDiningServiceData';
@Injectable({
  providedIn: 'root'
})
export class DiningReservationService implements Resolve<any> {
  appConfig: any;

  services: any;
  bookingList: any;
  serviceList: any;
  onBookingsChanged: BehaviorSubject<any>;
  bookingFilter: object = {};
  optionsList: any;
  onServiceChanged: BehaviorSubject<any>;
  serviceFilter: object = {};
  data: any;

  /**
    * Constructor
    *
    * @param {HttpClient} _httpClient
    */
  constructor(private _httpClient: HttpClient) {
    this.appConfig = AppConfig.Settings;
    this.onBookingsChanged = new BehaviorSubject({});
    this.optionsList = OptionsList.Options;
    this.bookingFilter = this.optionsList.tables.pagination.filters;

    this.onServiceChanged = new BehaviorSubject({});
    this.serviceFilter = this.optionsList.tables.pagination.filters;
  }

  //Booking list
  /**
  * Resolver
  *
  * @param {ActivatedRouteSnapshot} route
  * @param {RouterStateSnapshot} state
  * @returns {Observable<any> | Promise<any> | any}
  */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    return new Promise((resolve, reject) => {
      let funArray:any[];
      if (route.routeConfig.path == 'admin/dining-reservation/services/list') {
        this.serviceFilter['direction'] = 'desc';
        this.serviceFilter['searchKey'] = '';
        this.serviceFilter['column'] = '';
        this.serviceFilter['status'] = '';
        this.serviceFilter['trash'] = route.data.trash ? route.data.trash : '';
        funArray = [this.getServiceList(this.serviceFilter)];
        Promise.all(funArray).then(
          () => {
          resolve();
          },
          reject );
      }
      else if (route.routeConfig.path == 'admin/dining-reservation/services/list/trash') {
        console.log("trash");
        this.serviceFilter['direction'] = 'desc';
        this.serviceFilter['searchKey'] = '';
        this.serviceFilter['column'] = '';
        this.serviceFilter['status'] = '';
        this.serviceFilter['trash'] = route.data.trash ? route.data.trash : '';
        funArray = [this.getServiceList(this.serviceFilter)];
        Promise.all(funArray).then(
          () => {
          resolve();
          },
          reject );
      }
      else if(route.routeConfig.path == 'my-dining')
      {
        this.bookingFilter['front'] = 1;
        this.bookingFilter['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
        //this.bookingFilter['column'] = route.data.id ? route.data.id : '';
        this.bookingFilter['column'] = 'booking_start_date';
          Promise.all([
          this.getBookingList(this.bookingFilter),
          ]).then(
          () => {
            resolve();
          },
          reject
        );
          
      }
      else {
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = 'id';
        this.bookingFilter['service_id'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getBookingList(this.bookingFilter),
          //this.getServiceList(this.serviceFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }


    });
  }



  /**
  * Get forms
  *
  * @returns {Promise<any>}
  */


  /**Booking list */


  getBookingList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}diningreservation/list/diningbooking`, { params: filters })
        .subscribe((response: any) => {
          this.bookingList = response;
          this.onBookingsChanged.next(this.bookingList);
          resolve(response);
        }, reject);
    });
  }

  updateBookingStatus(BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}diningreservation/actions/diningbookingupdatestatus`, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Delete the booking */
  deleteBooking(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Clear the booking */
  clearBooking(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  getServices(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/list/diningservices`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }

  getTimeSlots(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/actions/diningbookingtimeslot`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }

  getPartySize(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/actions/diningbookingpartysize`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }

  addBooking(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'diningreservation/update/diningbooking' : 'diningreservation/create/diningbooking';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }


  getBookingContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/view/diningbooking`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getBookingContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/view/diningbooking`, { params: params })
      .pipe(catchError(this.errorHandler));
  }


  getPreviewBooking(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/actions/diningbookingrecurrencedates`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }

  // view services 
  viewService(viewinfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/view/diningservices`, { params: viewinfo })
      .pipe(catchError(this.errorHandler));
  }

  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }

  // add service function
  // addDiningReservation(serviceInfo: any): Observable<any> {
  //   console.log("inside service");
  //   console.log(serviceInfo);
  //   return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}diningreservation/create/diningservices`, serviceInfo)
  //     .pipe(catchError(this.errorHandler));
  // }

  addDiningReservation(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'diningreservation/update/diningservices' : 'diningreservation/create/diningservices';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  // list service function 

  // getServiceList(): Observable<any>{       
  //   return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/list/diningservices`)
  //   .pipe(catchError(this.errorHandler));
  // }

  getServiceList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}diningreservation/list/diningservices`, { params: filters })
        .subscribe((response: any) => {
          console.log('booking response', response);
          this.serviceList = response;
          this.onServiceChanged.next(this.serviceList);
          resolve(response);
        }, reject);
    });
  }

  // update service status
  updateServiceStatus(BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}diningreservation/update/diningservicesstatus
    `, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  updateForm(recordId: any, type: any): Observable<any> {
    let params = new HttpParams();
    params = params.set('record_id', recordId);
    params = params.set('type', type);
    let apiendpoint = 'actions/editupdaterestriction';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, params)
        .pipe(catchError(this.errorHandler));
}
  /**Delete the service */
  deleteService(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Restore the service */
  restoreService(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Permenant Delete  service */
  permenentDeleteService(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  getServiceContent(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/view/diningservices`, { params: params })
      .pipe(catchError(this.errorHandler));
  }

  setViewBookingData(value)  //get the value from fields like upload,dynamic 
  {
    this.data = value;
  }
  getViewBookingData()  // assign the value to the entry list
  {
    return this.data;
  }

  /**Add Google Calendar */
  exportGoogleCal(exportInfo:any): Observable<any>{
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/actions/googlecal`,{params:exportInfo})
      .pipe(catchError(this.errorHandler));
  }

  getMaxDays(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/view/diningsettings`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }

  getLabels(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/view/diningsettings`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }

  getGuestRestrictions(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/view/diningsettings`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }

  getPrintDiningBookingEntries(url,req_params: any,){
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

  /**Print view entries */
  getPrintDiningentry(url,req_params: any){
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
  

}
