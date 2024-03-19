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
export class FoodReservationService {
  appConfig: any;
  locationList: any;
  extraslist: any;
  onLocationChanged: BehaviorSubject<any>;
  locationFilter: object = {};
  onExtrasChanged: BehaviorSubject<any>;
  extrasFilter: object = {};
  optionsList: any;
  bookingList: any;
  onBookingsChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient) {
    this.appConfig = AppConfig.Settings;
    this.onLocationChanged = new BehaviorSubject({});
    this.optionsList = OptionsList.Options;
    this.locationFilter = this.optionsList.tables.pagination.filters;

    this.onExtrasChanged = new BehaviorSubject({});
    this.extrasFilter = this.optionsList.tables.pagination.filters;
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
      if (route.routeConfig.path == 'my-order-past-entry') {
        this.extrasFilter['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
        //this.extrasFilter['column'] = route.data.id ? route.data.id : '';
        this.extrasFilter['column'] = 'booking_start_date';
        this.extrasFilter['current'] = '1';
          Promise.all([
          this.getBookingList(this.extrasFilter),
          ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if (route.routeConfig.path == 'my-order') {
        this.extrasFilter['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
        //this.extrasFilter['column'] = route.data.id ? route.data.id : '';
        this.extrasFilter['column'] = 'booking_start_date';
          Promise.all([
          this.getBookingList(this.extrasFilter),
          ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if (route.routeConfig.path == 'admin/food-reservation/menu/extras/list') {
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
      } else if (route.routeConfig.path == 'admin/food-reservation/menu/categories/list') {
        this.extrasFilter['direction'] = 'desc';
        this.extrasFilter['searchKey'] = '';
        this.extrasFilter['column'] = '';
        this.extrasFilter['status'] = '';
        Promise.all([
          this.getCategoryList(this.extrasFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if (route.routeConfig.path == 'admin/food-reservation/menu/sidedish/list') {
        this.extrasFilter['direction'] = 'desc';
        this.extrasFilter['searchKey'] = '';
        this.extrasFilter['column'] = '';
        this.extrasFilter['status'] = '';
        Promise.all([
          this.getSideDishList(this.extrasFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }else if (route.routeConfig.path == 'admin/food-reservation/menu/product/list') {
        this.extrasFilter['direction'] = 'desc';
        this.extrasFilter['searchKey'] = '';
        this.extrasFilter['column'] = '';
        this.extrasFilter['status'] = '';
        Promise.all([
          this.getProductList(this.extrasFilter),
        ]).then(
          () => {
            resolve();
          },
          reject
        );
      }
      else {
        this.locationFilter['direction'] = 'desc';
        this.locationFilter['searchKey'] = '';
        this.locationFilter['column'] = '';
        this.locationFilter['status'] = '';
        Promise.all([
          this.getLocationList(this.locationFilter),
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


  getLocationList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodlocation`, { params: filters })
        .subscribe((response: any) => {
          
          this.locationList = response;
          this.onLocationChanged.next(this.locationList);
          resolve(response);
        }, reject);
    });
  }

  addLocation(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'foodreservation/update/foodlocation' : 'foodreservation/create/foodlocation';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  /**Delete the booking */
  deleteLocation(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }

  //View Location
  getLocationContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodlocation`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getLocationContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodlocation`, { params: params })
      .pipe(catchError(this.errorHandler));
  }

  // Food Reservation Extras

  addExtras(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'foodreservation/update/foodextras' : 'foodreservation/create/foodextras';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  getExtrasList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodextras`, { params: filters })
        .subscribe((response: any) => {          
          this.extraslist = response;
          this.onExtrasChanged.next(this.extraslist);
          resolve(response);
        }, reject);
    });
  }
  //View Extras
  getExtrasContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodextras`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getExtrasContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodextras`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  /**Delete the extras */
  deleteExtras(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }

  // Food Reservation Categories

  addCategories(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'foodreservation/update/foodcategories' : 'foodreservation/create/foodcategories';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //View Category
  getCategoriesContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodcategories`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getCategoryList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodcategories`, { params: filters })
        .subscribe((response: any) => {
          this.extraslist = response;
          this.onExtrasChanged.next(this.extraslist);
          resolve(response);
        }, reject);
    });
  }
  /**Delete the extras */
  deleteCategory(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }
  // update category status
  updateCategoryStatus(BookingData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}foodreservation/update/foodcategoriesstatus
    `, BookingData)
      .pipe(catchError(this.errorHandler));
  }


  // Food Reservation Side Dish

  addSideDish(documentInfo: any, edit: boolean = false): Observable<any> {
    let apiendpoint = edit == true ? 'foodreservation/update/foodsidedish' : 'foodreservation/create/foodsidedish';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }
  //View Category
  getSideDishContent(id: any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodsidedish`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getSideDishContents(id: any,edit:any): Observable<any> {
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
      params = params.set('edit', edit);
    }

    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodsidedish`, { params: params })
      .pipe(catchError(this.errorHandler));
  }
  getSideDishList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodsidedish`, { params: filters })
        .subscribe((response: any) => {
          this.extraslist = response;
          this.onExtrasChanged.next(this.extraslist);
          resolve(response);
        }, reject);
    });
  }
  /**Delete the extras */
  deleteSideDish(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }
  /*GET PRODUCT LIST*/
  getProduct(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/list/foodproduct`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  } 

  /*GET LOCATION LIST*/
  getLocation(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/list/foodlocation`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  } 

  /**GET EXTRA SIDE DISH */
  
  getSidedishExtra(documentInfo: any): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodproduct`, { params: documentInfo })
      .pipe(catchError(this.errorHandler));
  } 


  // list product
  getProductList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodproduct`, { params: filters })
        .subscribe((response: any) => {
          this.extraslist = response;
          this.onExtrasChanged.next(this.extraslist);
          resolve(response);
        }, reject);
    });
  }
   /**Delete Product */
   deleteProduct(url, locationData: any) {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, locationData)
      .pipe(catchError(this.errorHandler));
  }

  getProductCategoryList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodcategories`, { params: filters })
        .subscribe((response: any) => {
          this.extraslist = response;
          this.onExtrasChanged.next(this.extraslist);
          resolve(response);
        }, reject);
    });
  }

  getProductExtrasList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodextras`, { params: filters })
        .subscribe((response: any) => {          
          this.extraslist = response;
          this.onExtrasChanged.next(this.extraslist);
          resolve(response);
        }, reject);
    });
  }
  getProductSideDishList(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodsidedish`, { params: filters })
        .subscribe((response: any) => {          
          this.extraslist = response;
          this.onExtrasChanged.next(this.extraslist);
          resolve(response);
        }, reject);
    });
  }
// Food Reservation Add product

addProduct(documentInfo: any, edit: boolean = false): Observable<any> {
  let apiendpoint = edit == true ? 'foodreservation/update/foodproduct' : 'foodreservation/create/foodproduct';
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
    .pipe(catchError(this.errorHandler));
}
 // update product status
 updateProductStatus(BookingData: any) {
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}foodreservation/update/foodproductstatusupdate
  `, BookingData)
    .pipe(catchError(this.errorHandler));
}
//View Product
getProductContent(id: any,edit:any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
    params = params.set('edit', edit);
  }

  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodproduct`, { params: params })
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
  addWorkingTimes(documentInfo: any): Observable<any> {    
    let apiendpoint = 'foodreservation/update/foodworkingtimes';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
      .pipe(catchError(this.errorHandler));
  }

  getFoodReservationDashboardData(): Observable<any> {
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/list/fooddashboard`, { })
    .pipe(catchError(this.errorHandler));
}
// front order print
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

updateBookingStatus(BookingData: any) {
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}foodreservation/update/foodorderstatus`, BookingData)
    .pipe(catchError(this.errorHandler));
}
/**Clear the booking */
clearBooking(url, BookingData: any) {
  return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}` + url, BookingData)
    .pipe(catchError(this.errorHandler));
}
getBookingList(filters: any): Promise<any> {
  return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodorder`, { params: filters })
      .subscribe((response: any) => {
        this.locationList = response;        
        this.onLocationChanged.next(this.locationList);
        resolve(response);
      }, reject);
  });
}

// view my order 
getOrderContent(id: any): Observable<any> {
  let params = new HttpParams();
  if (id != null) {
    params = params.set('id', id);
  }

  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodorder`, { params: params })
    .pipe(catchError(this.errorHandler));
}
 /**Print view entries */
 getPrintOrdergentry(url,req_params: any){
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
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }
}
