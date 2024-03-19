import { Injectable } from '@angular/core';
import { AppConfig } from './app.config.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { OptionsList } from './options.list.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestRoomService {
  appConfig: any;
  roomList: any;
  extrasList:any;
  onRoomChanged: BehaviorSubject<any>;
  onlimitChanged: BehaviorSubject<any>;
  onExtrasChanged: BehaviorSubject<any>;  
  
  roomFilter: object = {};
  extrasFilter: object = {};
  optionsList: any;
  limitList :any;
  bookingList: any;
  invoicesList : any;
  onBookingChanged: BehaviorSubject<any>;
  oninvlocesChanged : BehaviorSubject<any>;
  bookingFilter: object = {};
  public listdata: any;
  constructor(private _httpClient: HttpClient) {
    this.appConfig = AppConfig.Settings;
    this.onRoomChanged = new BehaviorSubject({});
    this.onlimitChanged = new BehaviorSubject({});
    this.onExtrasChanged = new BehaviorSubject({});
    this.oninvlocesChanged = new BehaviorSubject({})
    this.optionsList = OptionsList.Options;
    this.roomFilter = this.optionsList.tables.pagination.filters;
    this.extrasFilter = this.optionsList.tables.pagination.filters;

    this.onBookingChanged = new BehaviorSubject({});
    this.bookingFilter = this.optionsList.tables.pagination.filters;
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
      let funArray: any[];
      if (route.routeConfig.path == 'admin/guest-room/list') {
        this.roomFilter['direction'] = 'desc';
        this.roomFilter['searchKey'] = '';
        this.roomFilter['column'] = '';
        this.roomFilter['status'] = '';
        this.roomFilter['trash'] = '';
        Promise.all([
          this.getRoomList(this.roomFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if (route.routeConfig.path == 'admin/guest-room/list/trash') {
        this.roomFilter['direction'] = 'desc';
        this.roomFilter['searchKey'] = '';
        this.roomFilter['column'] = '';
        this.roomFilter['status'] = '';
        this.roomFilter['trash'] = route.data.trash ? route.data.trash : '';
        Promise.all([
          this.getRoomList(this.roomFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/room/extras/lists'){
        this.extrasFilter['direction'] = 'desc';
        this.extrasFilter['searchKey'] = '';
        this.extrasFilter['column'] = '';
        this.extrasFilter['status'] = '';
        Promise.all([
          this.getExtrasList(this.extrasFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/room/limit/lists'){
        this.extrasFilter['direction'] = 'desc';
        this.extrasFilter['searchKey'] = '';
        this.extrasFilter['column'] = '';
        this.extrasFilter['status'] = '';
        Promise.all([
          this.getLimitsList(this.extrasFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/room/invoices/lists'){
        this.extrasFilter['direction'] = 'desc';
        this.extrasFilter['searchKey'] = '';
        this.extrasFilter['column'] = '';
        this.extrasFilter['status'] = '';
        Promise.all([
          this.getInvoicesList(this.extrasFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/booking/list'){
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getBookingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/booking/list/:status'){
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = route.params.status;;
        Promise.all([
          this.getBookingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/unavailable/list'){
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getUnavailableList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/package/list'){
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getpackagesList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/free-night/list'){
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getFreeNightsList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path=='admin/guest-room/promo-code/list'){
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getPromoCodeList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path == 'admin/guest-room/more-price/list/:id'){
        this.bookingFilter['package_id'] = route.params.id;
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getMorePriceList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path == 'admin/guest-room/building/list'){
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getBuildingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if(route.routeConfig.path == 'my-guestroom')
      {
        this.bookingFilter['front'] = 1;
        this.bookingFilter['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
        //this.bookingFilter['column'] = route.data.id ? route.data.id : '';
        this.bookingFilter['column'] = '';
          Promise.all([
          this.getBookingList(this.bookingFilter),
          ]).then(
          () => {
            resolve();
          },
          reject
        );
          
      }
    });
  }
// get booking list
getBookingList(filters: any): Promise<any> {
  return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/booking`, { params: filters })
      .subscribe((response: any) => {
        this.bookingList = response;
        this.onBookingChanged.next(this.bookingList);
        resolve(response);
      }, reject);
  });
}
  // get room list
  getRoomList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/room`, { params: filters })
        .subscribe((response: any) => {
          this.roomList = response;
          this.onRoomChanged.next(this.roomList);
          resolve(response);
        }, reject);
    });
  }

  getLimitsList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/limits`, { params: filters })
        .subscribe((response: any) => {
          this.limitList = response;
          this.onlimitChanged.next(this.limitList);
          resolve(response);
        }, reject);
    });
  }

  getInvoicesList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/invoice`, { params: filters })
        .subscribe((response: any) => {
          this.invoicesList = response;
          this.oninvlocesChanged.next(this.invoicesList);
          resolve(response);
        }, reject);
    });
  }
   // get room list
   getPriceList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/price`, { params: filters })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getAllCelendarEvent(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/actions/bookingcalendar`, { params: filters })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  
   // update room status
   updateRoomStatus(BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}guestroom/update/roomstatus
    `, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  // update the booking status 
   updateBookingStatus(BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}guestroom/update/bookingstatus
    `, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Delete the service */
  deleteRooms(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  
 /**Delete the service */
 deleteBooking(url, BookingData: any) {
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
    .pipe(catchError(this.errorHandler));
}
  /**Permenant Delete  Rooms */
  permenentDeleteRooms(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  permenentDeleteinvoices(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }
   /**Permenant Delete  Rooms */
   permenentDeleteBooking(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Restore the Rooms */
  restoreRooms(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }
// add edit room
  addRoom(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/room' : 'guestroom/create/room';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  addlimit(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/limits' : 'guestroom/create/limits';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  
  BookRoom(documentInfo: any,edit: boolean = false): Observable<any> {
   let apiendpoint = edit == true ? 'guestroom/update/booking':'guestroom/create/booking'
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  // print the guest room booking 
  getPrintguestroomBookingEntries(url,req_params: any){
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
  
  // get guest room content
  getRoomsContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/room`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getRoomsContent(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/room`, { params: params })
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
  getBookingRoomsContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/booking`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getBookingRoomsContent(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/booking`, { params: params })
      .pipe(catchError(this.errorHandler));
  }

  getAllRoomprice(formdata: any): Observable<any> {
    let apiendpoint =  'guestroom/actions/getroomsprice'
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl+ apiendpoint}`,{ params:formdata})
      .pipe(catchError(this.errorHandler));
  }
  
  AddtheExtrasinRoom(formdata: any): Observable<any> {
    let apiendpoint =  'guestroom/actions/getextrasprice'
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl+ apiendpoint}`,{ params:formdata})
      .pipe(catchError(this.errorHandler));
  }
  
  
  //  delete price tab
  deletePriceTab(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  addExtras(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/extra' : 'guestroom/create/extra';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  deleteExtras(url, ExtraData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, ExtraData)
      .pipe(catchError(this.errorHandler));
  }

  getExtrasList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/extra`, { params: filters })
        .subscribe((response: any) => {
          this.extrasList = response;
          this.onExtrasChanged.next(this.extrasList);
          resolve(response);
        }, reject);
    });
  }

  updateExtrasStatus(ExtrasData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}guestroom/update/extrastatus
    `, ExtrasData)
      .pipe(catchError(this.errorHandler));
  }
  updateInvoicesStatus(ExtrasData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}guestroom/update/invoicestatus
    `, ExtrasData)
      .pipe(catchError(this.errorHandler));
  }
  
  updateLimtStatus(ExtrasData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}guestroom/update/limitstatus
    `, ExtrasData)
      .pipe(catchError(this.errorHandler));
  }
  getExtraContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/extra`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getExtraContent(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/extra`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getlimitsContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/limits`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getinvoicesContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/invoice`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getinvoicesemail(value: any): Observable<any> {
    let params = new HttpParams();
    if (value.id != null) {
      params = params.set('id', value.id);
      params = params.set('email',value.email)
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/invoice`, { params: params })
      .pipe(catchError(this.errorHandler));
  }

  
  updateinvoice(documentInfo: any): Observable<any> {
    let apiendpoint ='guestroom/update/invoice';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  getPrintfromlistentries(url,req_params: any,){
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
  // add edit price
  addPrice(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/create/price' : 'guestroom/create/price';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  /**Clear the booking */
  clearBooking(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  
// get dashbord data
  getBookingCount(): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/actions/allbookingcount`)
      .pipe(catchError(this.errorHandler));
  }
  getLatesBooking(): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/actions/latestbookings`)
      .pipe(catchError(this.errorHandler));
  }
  getBookingGraph(): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/actions/getgraphs`)
      .pipe(catchError(this.errorHandler));
  }
  getUnavailableList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/roomrestriction`, { params: filters })
        .subscribe((response: any) => {
          this.extrasList = response;
          this.onExtrasChanged.next(this.extrasList);
          resolve(response);
        }, reject);
    });
  }
  addUnavaliable(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/roomrestriction' : 'guestroom/create/roomrestriction';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  deleteUnavaliableRooms(url, ExtraData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, ExtraData)
      .pipe(catchError(this.errorHandler));
  }
  getUnavaliableContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/roomrestriction`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  setGuestRoomlistdata(value) {
    if (value) {
      this.listdata = [...value];
      console.log("listdata", this.listdata);
    }
  }
  GetGuestRoomsListData() {
    return this.listdata;
  }
  setEmptyListData() {
    this.listdata = [];
  }
  // get guest room content
  getRoomsPrice(room_id: any,guestcount: any,date_from: any,date_to: any): Observable<any> {
    let params = new HttpParams();
    if (room_id != null) {
      params = params.set('room_id', room_id);
      params = params.set('guestcount', guestcount);
      params = params.set('date_from', date_from);
      params = params.set('date_to', date_to);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/actions/getroomsprice`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  // get guest room content
  getExtrasPrice(date_from: any,date_to: any,extra_id: any,room_price: any,person: any,room_id:any,promo_code:any): Observable<any> {
    let params = new HttpParams();
    if (date_from != null) {
      params = params.set('date_from', date_from);
      params = params.set('date_to', date_to);
      params = params.set('extra_id', extra_id);
      params = params.set('roomprice', room_price);
      params = params.set('person', person);
      params = params.set('rooms', room_id);
      params = params.set('promocode', promo_code);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/actions/getextrasprice`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  // add edit room
  addFrontBooking(documentInfo: any): Observable<any> {
    let apiendpoint = 'guestroom/create/booking';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //discount packages list
  getpackagesList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/package`, { params: filters })
        .subscribe((response: any) => {
          this.extrasList = response;
          this.onExtrasChanged.next(this.extrasList);
          resolve(response);
        }, reject);
    });
  }
  deleteRecords(url, ExtraData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, ExtraData)
      .pipe(catchError(this.errorHandler));
  }
  //get packages content
  getpackageContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/package`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  // add package
  addPackage(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/package' : 'guestroom/create/package';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //discount more price list
  getMorePriceList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/packageitem`, { params: filters })
        .subscribe((response: any) => {
          this.extrasList = response;
          this.onExtrasChanged.next(this.extrasList);
          resolve(response);
        }, reject);
    });
  }
  // add package item
  addPackageItem(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/packageitem' : 'guestroom/create/packageitem';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //get packages item content
  getPackageItemContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/packageitem`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  //get free nights list
  getFreeNightsList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/freenight`, { params: filters })
        .subscribe((response: any) => {
          this.extrasList = response;
          this.onExtrasChanged.next(this.extrasList);
          resolve(response);
        }, reject);
    });
  }
  // add Free nights
  addFreeNight(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/freenight' : 'guestroom/create/freenight';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
   //get Free night content
   getFreeNightContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/freenight`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  //get free nights list
  getPromoCodeList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/promocode`, { params: filters })
        .subscribe((response: any) => {
          this.extrasList = response;
          this.onExtrasChanged.next(this.extrasList);
          resolve(response);
        }, reject);
    });
  }
  // add discount Promo Code
  addPromoCode(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/promocode' : 'guestroom/create/promocode';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //get Promo Code content
  getPromoCodeContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/promocode`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  //get Free night content
  getBookingReport(date_from: any,date_to:any): Observable<any> {
    let params = new HttpParams();
    if (date_from != null) {
      params = params.set('date_from', date_from);
      params = params.set('date_to', date_to);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/actions/reports`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  // print the guest room booking 
  getBookingReportPrint(url,req_params: any){
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
  getCalenderPrint(url,req_params: any){
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
  // building list
  getBuildingList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/building`, { params: filters })
        .subscribe((response: any) => {
          this.extrasList = response;
          this.onExtrasChanged.next(this.extrasList);
          resolve(response);
        }, reject);
    });
  }
  // building status change
  updateBuildingStatus(ExtrasData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}guestroom/update/buildingstatus
    `, ExtrasData)
      .pipe(catchError(this.errorHandler));
  }
  // get building contents
  getBuildingContents(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}guestroom/view/building`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  // add buildings
  addBuilding(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'guestroom/update/building' : 'guestroom/create/building';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }
}
