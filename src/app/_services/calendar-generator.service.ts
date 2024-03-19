import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient,HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig,OptionsList } from 'app/_services';
@Injectable({
  providedIn: 'root'
})
export class CalendarGeneratorService {
  appConfig: any;
  data     : any;
  messageSource : BehaviorSubject<any>;
  private savetemlatedata = new BehaviorSubject(null);  
  calendarList: any;
  savetempletaList :any;
  getAllData : any;
  onCalendarChanged: BehaviorSubject<any>;
  calendarListFilters: object={};
  constructor(private _httpClient: HttpClient) {
    this.appConfig      = AppConfig.Settings;
    this.messageSource  = new BehaviorSubject({});
    this.onCalendarChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            let funArray:any[];
            //Roles Filtering according to users page or staff page or roles list page

            this.calendarListFilters['column']        = 'id'; 
            this.calendarListFilters['direction']     = 'desc'; 
            this.calendarListFilters['limit']         = '10';
            this.calendarListFilters['template_id']   = '';
            funArray = [this.getCalendarList(this.calendarListFilters)];
            Promise.all(funArray).then(
            () => {
                resolve();
            },
            reject );
        });
    }

   /** SAVE USER */
  generateCalendar(formatData:any): Observable<any>{
    //set api endpoint accroding edit or add view 
    let apiendpoint = 'create/calendar';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,formatData)
            .pipe(catchError(this.errorHandler));
  }


  // save the holidays
  saveholiday( savedata:any): Observable<any>{
  
    let apiendpoint = 'create/customholiday';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,savedata)
            .pipe(catchError(this.errorHandler));
   
  }

  // display the holidays list
  displayholiday(formInfo): Observable<any>{

    let params = new HttpParams();
            if(formInfo != null){
            params = params.set('user_id', formInfo);
            }
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/customholiday`,{ params: params })
    .pipe(catchError(this.errorHandler));
  }

  deleteholiday(id): Observable<any> {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/customholiday`,id)
    .pipe(catchError(this.errorHandler))
  } 
  getsavetempletslist(categorytype): Promise<any>{
    
    let params = new HttpParams();
    if(categorytype != null){
    params = params.set('category_type', categorytype);
    }
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}list/categories`,{params:params})
          .subscribe((response: any) => {
              this.savetempletaList = response;
              this.savetemlatedata.next(this.savetempletaList);
              resolve(response);
          }, reject);
      });
  }

  

  setdynamicdata(value)  //get the value from fields like upload,dynamic 
  {
    this.data=value;  
  }
  getdynamicdata()  // assign the value to the entry list
  {
    return this.data;
  }
            
  getsavetemplete(){  
    return this.savetemlatedata.asObservable();  
  }  


   getCalendarData(categorytype): Promise<any>{
   
    let params = new HttpParams();
    if(categorytype != null){
      params = params.set('template_id', categorytype);
    }
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}list/calendar`,{params:params})
          .subscribe((response: any) => {
              
              this.getAllData = response;
              //this.savetemlatedata.next(this.getAllData);
              resolve(response);
              
          }, reject);
      });
  }

  getCalendarList(filters:any): Promise<any>
  {
      return new Promise((resolve, reject) => {
        this._httpClient.get(`${this.appConfig.url.apiUrl}list/calendar`,{params:filters})
            .subscribe((response: any) => {
                console.log('response',response);
                this.calendarList = response;
                this.onCalendarChanged.next(this.calendarList);
                resolve(response);
                /*this.eventcategory = response;
                this.onCategoryChanged.next(this.eventcategory);
                resolve(response);*/
            }, reject);
        });
  }
   

 
      setedittemplatedata(value)  //get the value from fields like upload,dynamic 
      {
          this.data=value;  
      }
      getedittemplatedata()  // assign the value to the entry list
      {
          return this.data;
      }





deleteTemplates(url,deleteInfo:any): Observable<any>{
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}`+ url,deleteInfo)
            .pipe(catchError(this.errorHandler));
}

errorHandler(error: HttpErrorResponse){
  return Observable.throw(error.message);
  }
}
