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
export class MeetingRoomService {

  appConfig: any;
  drinkList: any;
  equipmentList: any;
  onDrinkChanged: BehaviorSubject<any>;
  onEquipmentChanged: BehaviorSubject<any>;
  onRoomLayoutChanged: BehaviorSubject<any>;
  drinkFilter: object = {};
  roomLayoutFilter: any;
  equipmentFilter: object = {};
  optionsList: any;
  serviceList: any;
  onServiceChanged: BehaviorSubject<any>;
  bookingFilter: any;
  bookingList: any;
  onBookingChanged: BehaviorSubject<any>;
  listdata: any;


  constructor(private _httpClient: HttpClient) {
    this.appConfig = AppConfig.Settings;
    this.onDrinkChanged = new BehaviorSubject({});
    this.onEquipmentChanged = new BehaviorSubject({});
    this.onRoomLayoutChanged = new BehaviorSubject({});
    this.onServiceChanged = new BehaviorSubject({});
    this.onBookingChanged = new BehaviorSubject({});
    this.optionsList = OptionsList.Options;
    this.drinkFilter = this.optionsList.tables.pagination.filters;
    this.equipmentFilter = this.optionsList.tables.pagination.filters;
    this.roomLayoutFilter = this.optionsList.tables.pagination.filters;
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
      if (route.routeConfig.path == 'admin/meeting-room/room-layout/list') {
        this.roomLayoutFilter['direction'] = 'desc';
        this.roomLayoutFilter['searchKey'] = '';
        this.roomLayoutFilter['column'] = '';
        this.roomLayoutFilter['status'] = '';
        Promise.all([
          this.getRoomLayoutList2(this.roomLayoutFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'admin/meeting-room/amenities/list') {
        this.drinkFilter['direction'] = 'desc';
        this.drinkFilter['searchKey'] = '';
        this.drinkFilter['column'] = '';
        this.drinkFilter['status'] = '';
        Promise.all([
          this.getDrinkList(this.drinkFilter),
          //this.getServiceList(this.serviceFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'admin/meeting-room/services/list') {
        this.equipmentFilter['direction'] = 'desc';
        this.equipmentFilter['searchKey'] = '';
        this.equipmentFilter['column'] = '';
        this.equipmentFilter['status'] = '';
        Promise.all([
          this.getEquipmentList(this.equipmentFilter),
          //this.getServiceList(this.serviceFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'admin/meeting-room/rooms/list') {
        let funArray: any[];
        this.drinkFilter['direction'] = 'desc';
        this.drinkFilter['searchKey'] = '';
        this.drinkFilter['column'] = '';
        this.drinkFilter['status'] = '';
        this.drinkFilter['trash'] = route.data.trash ? route.data.trash : '';
        Promise.all([
          this.getRoomsList(this.drinkFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'admin/meeting-room/rooms/list/trash') {
        let funArray: any[];
        this.drinkFilter['direction'] = 'desc';
        this.drinkFilter['searchKey'] = '';
        this.drinkFilter['column'] = '';
        this.drinkFilter['status'] = '';
        this.drinkFilter['trash'] = route.data.trash ? route.data.trash : '';
        Promise.all([
          this.getRoomsList(this.drinkFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'my-meeting-room') {
        let funArray: any[];
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        this.bookingFilter['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
        Promise.all([
          this.getMeetingRoomBookingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if (route.routeConfig.path == 'admin/meeting-room/booking/list') {
        let funArray: any[];
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = '';
        Promise.all([
          this.getMeetingRoomBookingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'admin/meeting-room/booking/pending/list') {
        let funArray: any[];
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = 'pending';
        Promise.all([
          this.getMeetingRoomBookingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'admin/meeting-room/booking/confirmed/list') {
        let funArray: any[];
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = 'confirmed';
        Promise.all([
          this.getMeetingRoomBookingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      } else if (route.routeConfig.path == 'admin/meeting-room/booking/cancelled/list') {
        let funArray: any[];
        this.bookingFilter['direction'] = 'desc';
        this.bookingFilter['searchKey'] = '';
        this.bookingFilter['column'] = '';
        this.bookingFilter['status'] = 'cancelled';
        Promise.all([
          this.getMeetingRoomBookingList(this.bookingFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }


    });
  }


  getDrinkList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetfoodanddrinks`, { params: filters })
        .subscribe((response: any) => {

          this.drinkList = response;
          this.onDrinkChanged.next(this.drinkList);
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

  getEquipmentList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetequipments`, { params: filters })
        .subscribe((response: any) => {

          this.equipmentList = response;
          this.onEquipmentChanged.next(this.equipmentList);
          resolve(response);
        }, reject);
    });
  }

  /**Delete the booking */
  deleteDrinks(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }


  //View Location
  getDrinkContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('food_drinks_id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetfoodanddrinks`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getDrinkContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('food_drinks_id', id);
      params = params.set('edit', edit);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetfoodanddrinks`, { params: params })
      .pipe(catchError(this.errorHandler));
  }

  getEquipmentContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetequipments`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getEquipmentContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetequipments`, { params: params })
      .pipe(catchError(this.errorHandler));
  }



  addDrink(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'meetingroom/update/meetfoodanddrinks' : 'meetingroom/create/meetfoodanddrinks';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  addEquipment(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'meetingroom/update/meetequipments' : 'meetingroom/create/meetequipments';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  /*EQUIPMENT*/
  deleteEquipments(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }

  getRoomLayoutList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetroomlayouts
      `)
        .subscribe((response: any) => {
          this.drinkFilter = response;
          this.onDrinkChanged.next(this.drinkFilter);
          resolve(response);
        }, reject);
    });
  }
  getEquipmentData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetequipments
      `)
        .subscribe((response: any) => {
          this.drinkFilter = response;
          this.onDrinkChanged.next(this.drinkFilter);
          resolve(response);
        }, reject);
    });
  }
  // list of rooms
  getRoomsList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetrooms`, { params: filters })
        .subscribe((response: any) => {

          this.serviceList = response;
          this.onServiceChanged.next(this.serviceList);
          resolve(response);
        }, reject);
    });
  }
  //  add rooms
  addRooms(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'meetingroom/update/meetrooms' : 'meetingroom/create/meetrooms';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //View rooms
  getRoomsContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('room_id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetrooms`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getPrintBookingEntries(url,req_params: any){
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
  // view metting room
  ViewBookingRoomsContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetbookings`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  //  /**Delete the fornt booking */
  deleteRoomsbooking(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  getRoomsContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('room_id', id);
      params = params.set('edit', edit);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetrooms`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getRoomsCapacity(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('room_id', id);
    }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetrooms`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  /**Delete the service */
  deleteService(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Permenant Delete  service */
  permenentDeleteService(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }

  /**Restore the service */
  restoreService(url, BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  // update service status
  updateServiceStatus(BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}meetingroom/update/meetroomsstatus
    `, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  // list of room layout
  getRoomLayoutList2(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetroomlayouts`, { params: filters })
        .subscribe((response: any) => {

          this.roomLayoutFilter = response;
          this.onRoomLayoutChanged.next(this.roomLayoutFilter);
          resolve(response);
        }, reject);
    });
  }
  /**Delete the extras */
  deleteRoomLayout(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }
  //  add room layout
  addRoomLayout(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'meetingroom/update/meetroomlayouts' : 'meetingroom/create/meetroomlayouts';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //View room layout
  getRoomLayoutContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetroomlayouts`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getRoomLayoutContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetroomlayouts`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  updateWorkingTime(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'meetingroom/update/meetroomsworkingtimes' : 'meetingroom/update/meetroomsworkingtimes';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  // get dashboard details
  getMeetbookingcountDashboardData(): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/actions/meetbookingcount`, {})
      .pipe(catchError(this.errorHandler));
  }
  getMeetlatestbookingDashboardData(): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/actions/meetlatestbooking`, {})
      .pipe(catchError(this.errorHandler));
  }
  // list of room layout
  getBookingList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetdashboard`, { params: filters })
        .subscribe((response: any) => {

          this.roomLayoutFilter = response;
          this.onRoomLayoutChanged.next(this.roomLayoutFilter);
          resolve(response);
        }, reject);
    });
  }
  // get time slot
  getTimeSlot(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/getslots`, { params: filters })
        .subscribe((response: any) => {

          this.roomLayoutFilter = response;
          this.onRoomLayoutChanged.next(this.roomLayoutFilter);
          resolve(response);
        }, reject);
    });
  }
  getMeetingRoomBookingList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetbookings`, { params: filters })
        .subscribe((response: any) => {

          this.serviceList = response;
          this.onServiceChanged.next(this.serviceList);
          resolve(response);
        }, reject);
    });
  }
  getBookingRoomsList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetrooms`, { params: filters })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  updateBookingStatus(BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}meetingroom/update/meetbookingsupdatestatus
  `, BookingData)
      .pipe(catchError(this.errorHandler));
  }
  // get duration list 
  getDuration(Data): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/list/getduration`, { params: Data })
      .pipe(catchError(this.errorHandler));
  }

  //LIST FIELD DATA
  setMeetinglistdata(value) {
    if (value) {
      this.listdata = [...value];
      console.log("listdata",this.listdata);
    }
  }
  Getroomslistdata() {
    return this.listdata;
  }
  setEmptyListData(){
    this.listdata = [];
  }
  getEquipmentAndLayoutList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/getequipmentandlayouts`, { params: filters })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
   // add meeting room booking
   addBooking(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'meetingroom/update/meetbookings' : 'meetingroom/create/meetbookings';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  // get booking content
  getBookingContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/view/meetbookings`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getPreviewBooking(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/list/meetingbookingrecurrencedates`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  }
  // add the meeting room
  AddRoomBooking(formInfo: any, edit: boolean = false): Observable<any> {
    //set api endpoint accroding edit or add view 
    let apiendpoint = edit == true ? 'meetingroom/update/meetbookings' : 'meetingroom/create/meetbookings';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, formInfo)
        .pipe(catchError(this.errorHandler));
}
getLabels(documentInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}meetingroom/list/meetingsettings`, { params: documentInfo })
    .pipe(catchError(this.errorHandler));
}
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }
}
