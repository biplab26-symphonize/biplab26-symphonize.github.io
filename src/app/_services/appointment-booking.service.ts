import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentBookingService implements Resolve<any> {

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
    if (route.routeConfig.path == 'admin/fitness-reservation/services/list') {
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
    else if (route.routeConfig.path =='admin/fitness-reservation/services/list/trash') {
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
    else if(route.routeConfig.path == 'my-fitness-reservation')
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
    this._httpClient.get(`${this.appConfig.url.apiUrl}appoinmentbooking/list/appoinmentbooking`, { params: filters })
      .subscribe((response: any) => {
        this.bookingList = response.BookingList;
        this.onBookingsChanged.next(this.bookingList);
        resolve(response);
      }, reject);
  });
}
// update event restriction
updateForm(recordId: any, type: any): Observable<any> {
  let params = new HttpParams();
  params = params.set('record_id', recordId);
  params = params.set('type', type);
  let apiendpoint = 'actions/editupdaterestriction';
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, params)
      .pipe(catchError(this.errorHandler));
}
updateBookingStatus(BookingData: any) {
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/update/appoinmentbookingstatuschange`, BookingData)
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

// get the servies list in the  dashborad
getServices(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/list/appoinmentservices`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

getTimeSlots(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/list/gettimeslots`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

getPartySize(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/list/getpartysize`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

addBooking(documentInfo: any, edit: boolean = false): Observable<any> {
  let apiendpoint = edit == true ? 'appoinmentbooking/update/appoinmentbooking' : 'appoinmentbooking/create/appoinmentbooking';
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
    .pipe(catchError(this.errorHandler));
}

// view the  booking in the dashborad
 getBookingContent(id: any): Observable<any> {
   let params = new HttpParams();
   if (id != null) {
     params = params.set('id', id);
   }

   return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentbooking`, { params: params })
     .pipe(catchError(this.errorHandler));
 }
getBookingContents(id: any,edit:any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
    params = params.set('edit', edit);
  }

  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentbooking`, { params: params })
    .pipe(catchError(this.errorHandler));
}
getBookingContentsDashboard(id: any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
  }

  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentbooking`, { params: params })
    .pipe(catchError(this.errorHandler));
}


getPreviewBooking(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}diningreservation/actions/diningbookingrecurrencedates`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

// view appointment booking  services 
viewService(viewinfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentservices`, { params: viewinfo })
    .pipe(catchError(this.errorHandler));
}

/** HANDLE HTTP ERROR */
errorHandler(error: HttpErrorResponse) {
  return Observable.throw(error.message);
}

//  add the appointment booking service

addAppointmentBooking(documentInfo: any, edit: boolean = false): Observable<any> {
  let apiendpoint = edit == true ? 'appoinmentbooking/update/appoinmentservices' : 'appoinmentbooking/create/appoinmentservices';
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
    .pipe(catchError(this.errorHandler));
}


//  appointent booking  Display the services list 
 getServiceList(filters: any): Promise<any> {
  return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}appoinmentbooking/list/appoinmentservices`, { params: filters })
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
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/update/appoinmentservicesstatuschange`, BookingData)
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

getServiceContent(id: any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
  }
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentservices`, { params: params })
    .pipe(catchError(this.errorHandler));
}
getServiceContents(id: any,edit:any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
    params = params.set('edit', edit);
  }
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentservices`, { params: params })
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
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/list/googlecal`,{params:exportInfo})
    .pipe(catchError(this.errorHandler));
}
// calendar start  which day setting 
getMaxDays(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentsettings`,{ params: documentInfo })
    .pipe(catchError(this.errorHandler));
}


getLabels(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentsettings`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

getGuestRestrictions(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/view/appoinmentsettings`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
}

getPrintDiningBookingEntries(url,req_params: any){
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
