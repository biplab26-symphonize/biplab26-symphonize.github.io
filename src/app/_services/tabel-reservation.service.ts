import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { AppConfig } from './app.config.service';
import { OptionsList } from './options.list.service';
import { CommonUtils } from 'app/_helpers';
const HttpUploadOptions = {
  headers: new HttpHeaders({  "Accept":"multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class TabelReservationService {
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
  detailData : any;

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
    if (route.routeConfig.path == 'admin/restaurant-reservations/services/list') {
      this.serviceFilter['column']        = 'order';
      this.serviceFilter['direction']     = 'asc';
      this.serviceFilter['searchKey'] = '';
      this.serviceFilter['status'] = '';
      this.serviceFilter['trash'] = route.data.trash ? route.data.trash : '';
      funArray = [this.getServiceList(this.serviceFilter)];
      Promise.all(funArray).then(
        () => {
        resolve();
        },
        reject );
    }
    else if (route.routeConfig.path =='admin/restaurant-reservations/services/list/trash') {
      this.serviceFilter['searchKey'] = '';
       this.serviceFilter['column']        = 'order';
      this.serviceFilter['direction']     = 'asc';
      this.serviceFilter['status'] = '';
      this.serviceFilter['trash'] = route.data.trash ? route.data.trash : '';
      funArray = [this.getServiceList(this.serviceFilter)];
      Promise.all(funArray).then(
        () => {
        resolve();
        },
        reject );
    }
    else if(route.routeConfig.path == 'my-reservations')
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
    this._httpClient.get(`${this.appConfig.url.apiUrl}tablereservation/list/tablebooking`, { params: filters })
      .subscribe((response: any) => {
        response.data.map(item => {
          if (item.booking_start_date && item.booking_start_time && item.booking_start_time != '00:00:00') {
            item.booking_start_time = CommonUtils.getStringToDate(item.booking_start_date+' '+item.booking_start_time);                         
          }
        });
        this.bookingList = response;
        this.onBookingsChanged.next(this.bookingList);
        resolve(response);
      }, reject);
  });
}


getBookingDashboaList(filters: any): Promise<any> {
  return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}tablereservation/list/tabledashboard`, { params: filters })
      .subscribe((response: any) => {
        this.bookingList = response;
        this.onBookingsChanged.next(this.bookingList);
        resolve(response);
      }, reject);
  });
}

updateBookingStatus(BookingData: any) {
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}tablereservation/actions/tablebookingupdatestatus`, BookingData)
    .pipe(catchError(this.errorHandler));
}

getGuestRestrictions(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tablesettings`, { params: documentInfo })
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

saveSorting(sortingInfo:any){
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}tablereservation/update/serviceorder`, sortingInfo, HttpUploadOptions)
    .pipe(catchError(this.errorHandler));    
}

// get the servies list in the  dashborad
getServices(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/list/tableservices`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

getTimeSlots(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/actions/tablebookingtimeslot`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

getPartySize(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}appoinmentbooking/list/getpartysize`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

getTableSize(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/actions/tablebookingservicetable`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

getTableImages(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tablesettings`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
}

getDefaultImages(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tablesettings`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
}

addBooking(documentInfo: any, edit: boolean = false): Observable<any> {
  let apiendpoint = edit == true ? 'tablereservation/update/tablebooking' : 'tablereservation/create/tablebooking';
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
    .pipe(catchError(this.errorHandler));
}

// view the  booking in the dashborad
getBookingContent(id: any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
  }

  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tablebooking`, { params: params })
    .pipe(catchError(this.errorHandler));
}
getBookingContents(id: any,edit): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
    params = params.set('edit', edit);
  }

  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tablebooking`, { params: params })
    .pipe(catchError(this.errorHandler));
}


getPreviewBooking(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/actions/tablebookingrecurrencedate`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}

// view appointment booking  services 
viewService(viewinfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tableservices`, { params: viewinfo })
    .pipe(catchError(this.errorHandler));
}

/** HANDLE HTTP ERROR */
errorHandler(error: HttpErrorResponse) {
  return Observable.throw(error.message);
}

//  add the tabel booking reservetion service

addAppointmentBooking(documentInfo: any, edit: boolean = false): Observable<any> {
  let apiendpoint = edit == true ? 'tablereservation/update/tableservices' : 'tablereservation/create/tableservices';
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
    .pipe(catchError(this.errorHandler));
}


//  table reservetion   Display the services list 
 getServiceList(filters: any): Promise<any> {
  return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}tablereservation/list/tableservices`, { params: filters })
      .subscribe((response: any) => {
        this.serviceList = response;
        this.onServiceChanged.next(this.serviceList);
        resolve(response);
      }, reject);
  });
}
 // call the event on edit  
 updateForm(recordId: any, type: any): Observable<any> {
  let params = new HttpParams();
  params = params.set('record_id', recordId);
  params = params.set('type', type);
  let apiendpoint = 'actions/editupdaterestriction';
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, params)
      .pipe(catchError(this.errorHandler));
}

//  update service status
updateServiceStatus(BookingData: any) {
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}tablereservation/update/tableservicesstatus`, BookingData)
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

// get the data on edit list 
 getServiceContent(id: any): Observable<any> {
   let params = new HttpParams();
   if (id != null) {
     params = params.set('id', id);
   }
   return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tableservices`, { params: params })
     .pipe(catchError(this.errorHandler));
 }
getServiceContents(id: any,edit:any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
    params = params.set('edit', edit);
  }
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tableservices`, { params: params })
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

setViewBookingDetailData(value){
  this.detailData = value;
}

getViewBookingDetailData()  // assign the value to the entry list
{
  return this.detailData;
}

/**Add Google Calendar */
exportGoogleCal(exportInfo:any): Observable<any>{
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/actions/googlecal`,{params:exportInfo})
    .pipe(catchError(this.errorHandler));
}
// calendar start  which day setting 
getMaxDays(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}tablereservation/view/tablesettings`,{ params: documentInfo })
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
