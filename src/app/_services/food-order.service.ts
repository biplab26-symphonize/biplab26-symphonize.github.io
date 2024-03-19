import { Injectable } from '@angular/core';
import { AppConfig } from './app.config.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { OptionsList } from './options.list.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { CommonUtils } from 'app/_helpers';

@Injectable({
    providedIn: 'root'
})
export class FoodOrderService {

    appConfig: any;
    orderList: any;
    onOrderChanged: BehaviorSubject<any>;
    orderFilter: object = {};
    optionsList: any;

    constructor(private _httpClient: HttpClient) {
        this.appConfig = AppConfig.Settings;
        this.onOrderChanged = new BehaviorSubject({});
        this.optionsList = OptionsList.Options;
        this.orderFilter = this.optionsList.tables.pagination.filters;
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
            this.orderFilter['direction'] = 'desc';
            this.orderFilter['searchKey'] = '';
            this.orderFilter['column'] = 'booking_start_date';
            this.orderFilter['status'] = '';
            this.orderFilter['type'] = '';
            Promise.all([
                this.getOrderList(this.orderFilter),
                //this.getServiceList(this.serviceFilter),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


    getOrderList(filters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodorder`, { params: filters })
                .subscribe((response: any) => {
                    response.data.map(item => {
                        if (item.booking_start_date && item.booking_start_time && item.booking_start_time != '00:00:00' && item.booking_start_time != 'ASAP') {
                          item.booking_start_time = CommonUtils.getStringToDate(item.booking_start_date+' '+item.booking_start_time);                         
                        }
                      });
                    this.orderList = response;
                    this.onOrderChanged.next(this.orderList);
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
    updateBookingStatus(BookingData: any) {
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}foodreservation/update/foodorderstatus`, BookingData)
            .pipe(catchError(this.errorHandler));
    }

    addLocation(documentInfo: any, edit: boolean = false): Observable<any> {
        let apiendpoint = edit == true ? 'foodreservation/update/foodlocation' : 'foodreservation/create/foodlocation';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
            .pipe(catchError(this.errorHandler));
    }

    /**Delete the booking */
    deleteOrders(url, locationData: any) {
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

    addOrder(documentInfo: any, edit: boolean = false): Observable<any> {
        let apiendpoint = edit == true ? 'foodreservation/update/foodorder' : 'foodreservation/create/foodorder';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
            .pipe(catchError(this.errorHandler));
    }

    getOrderContent(id: any,edit:any): Observable<any> {
        let params = new HttpParams();
        if (id != null) {
            params = params.set('id', id);
            params = params.set('edit', edit);
        }

        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/view/foodorder`, { params: params })
            .pipe(catchError(this.errorHandler));
    }
    getProducts(documentInfo: any): Observable<any> {
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}foodreservation/list/frontfoodproduct`, { params: documentInfo })
            .pipe(catchError(this.errorHandler));
    }
    // add order after confirm
    confirmOrder(documentInfo: any): Observable<any> {
        let apiendpoint = 'foodreservation/create/foodorder';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, documentInfo)
            .pipe(catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
        return Observable.throw(error.message);
    }
}