import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from './app.config.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { resolve } from 'url';

const HttpUploadOptions = {
  headers: new HttpHeaders({  "Accept":"multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService  {
  
  setting: any;
  diningSetting : any;
  foodSetting : any;
  appoitmentsetting :any;
  guestroomsetting :any;
  onSettingChanged: BehaviorSubject<any>;  
  onAppointementSettingChanged: BehaviorSubject<any>;
  onGuestRoomSettingChanged: BehaviorSubject<any>;
  currentUserInfo:BehaviorSubject<any>;
  onProfilePictureChanged: BehaviorSubject<any>;
  routeParams: object = {};
  routeParamsType: object = {}; 
  routeParamsFoodType: object = {};
  appConfig:any;

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
      this.appConfig      = AppConfig.Settings;

      this.onSettingChanged = new BehaviorSubject({});
      this.onAppointementSettingChanged = new BehaviorSubject({});
      this.onGuestRoomSettingChanged = new BehaviorSubject({});
  }

  /**
   * 
   *
   * @returns {Promise<any>}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
      return new Promise((resolve, reject) => {
        let funArray:any[]=[];
        this.routeParams['meta_key'] = route.data.key ? route.data.key : '';
        this.routeParamsType['meta_type'] = route.data.type ? route.data.type : '';
        this.routeParamsFoodType['meta_type'] = route.data.type ? route.data.type : '';
        //settings
        if(this.routeParams['meta_key']!==''){
          funArray.push(this.getSetting(this.routeParams));
        }
        //diningsettings
        if(this.routeParamsType['meta_type']!==''){
          funArray.push(this.getDiningSetting(this.routeParamsType));
        }
        //foodsettings
        if(this.routeParamsFoodType['meta_type']!==''){
          funArray.push(this.getFoodSetting(this.routeParamsFoodType));
        }
        Promise.all(funArray).then(
            () => {
                resolve();
            },
            reject
        );
    });


   
  }

  // view setting
  getSetting(routeParams :any): Promise<any>{
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}view/settings`,{ params: routeParams })
          .subscribe((response: any) => {
            this.setting = response;
            this.onSettingChanged.next(this.setting);
              resolve(response);
          }, reject);
    });
  }
  
  getSettingLoginPage(): Observable<any> {   
    return this._httpClient.get<any>(`${this.appConfig.url.loginApiUrl}portalsettings`)
      .pipe(catchError(this.errorHandler));
  }

   //Save Media
   saveMedia(mediaData: any):Promise<any>{
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.appConfig.url.apiUrl}media/userupload`,mediaData, HttpUploadOptions)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
  }

  // Create setting
  createSetting(formData:any):Promise<any>
  {
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.appConfig.url.apiUrl}create/settings`,formData)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
  }

  //CREATE DINING RESERVATION SETTING
  
  createDiningReservationSetting(formData:any):Promise<any>
  { 
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.appConfig.url.apiUrl}diningreservation/create/diningsettings`,formData)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
  }

  //CREATE FOOD RESERVATION SETTING
  createFoodReservationSetting(formData:any):Promise<any>
  { 
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.appConfig.url.apiUrl}foodreservation/create/foodsettings`,formData)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
  }

  //VIEW DINING RESERVATION SETTING
  getDiningSetting(routeParams :any): Promise<any>{
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}diningreservation/list/diningsettings`,{ params: routeParams })
          .subscribe((response: any) => {
            this.diningSetting = response;
            this.onSettingChanged.next(this.diningSetting);
              resolve(response);
          }, reject);
    });
  }


  getAppointmentBookingSetting(routeParams :any): Promise<any>{
    return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}appoinmentbooking/list/appoinmentsettings`,{ params: routeParams })
    .subscribe((response: any) => {
      this.appoitmentsetting =response;
      this.onAppointementSettingChanged.next(this.appoitmentsetting);
      resolve(response);
    },reject);
    });
  }

  getGuestRoomSetting(routeParams :any): Promise<any>{
    return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}guestroom/list/settings`,{ params: routeParams })
    .subscribe((response: any) => {
      this.guestroomsetting =response;
      this.onGuestRoomSettingChanged.next(this.guestroomsetting);
      resolve(response);
    },reject);
    });
  }


  // create the appointement booking settings

  createAppointmentBookingSetting(formData:any):Promise<any>
  { 
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.appConfig.url.apiUrl}appoinmentbooking/create/appoinmentsettings`,formData)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
  }

  createGuestRoomSetting(formData:any):Promise<any>
  { 
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.appConfig.url.apiUrl}guestroom/create/settings`,formData)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
  }

  

  // get meeting room settings
  getMeetingRoomSetting(routeParams :any): Promise<any>{
    return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}meetingroom/list/meetingsettings`,{ params: routeParams })
    .subscribe((response: any) => {
      this.appoitmentsetting =response;
      this.onAppointementSettingChanged.next(this.appoitmentsetting);
      resolve(response);
    },reject);
    });
  }
// create the meeting room settings

createMeetingRoomSetting(formData:any):Promise<any>
{ 
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.appConfig.url.apiUrl}meetingroom/create/meetingsettings`,formData)
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
    });
}

// Create the Table  Reservation 

  getTableReservaitionSetting(routeParams :any): Promise<any>{
    return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}tablereservation/list/tablesettings`,{ params: routeParams })
    .subscribe((response: any) => {
      this.appoitmentsetting =response;
      this.onAppointementSettingChanged.next(this.appoitmentsetting);
      resolve(response);
    },reject);
    });
  }


  // Create the  Table Reservation  settings

  createTableRseravtionSetting(formData:any):Promise<any>
  { 
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${this.appConfig.url.apiUrl}tablereservation/create/tablesettings`,formData)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
  }


  //VIEW FOOD RESERVATION SETTING
  getFoodSetting(routeParams :any): Promise<any>{
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}foodreservation/list/foodsettings`,{ params: routeParams })
          .subscribe((response: any) => {
            this.foodSetting = response;
            this.onSettingChanged.next(this.foodSetting);
              resolve(response);
          }, reject);
    });
  }

  //upload media
  uploadMedia(mediaData : any):Promise<any>{
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.appConfig.url.apiUrl}media/settingsupload`,mediaData,HttpUploadOptions)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
  }

  //change password
  changePassword(formData:any): Promise<any>{
     return new Promise((resolve, reject) => {
          this._httpClient.post(`${this.appConfig.url.apiUrl}actions/change`,formData)
              .subscribe((response: any) => {
                  resolve(response);
              }, reject);
      });
  }

  //check current password
  checkCurrentPassword(formData:any): Promise<any>{
    return new Promise((resolve, reject) => {
         this._httpClient.post(`${this.appConfig.url.apiUrl}actions/checkcurrentpassword`,formData)
             .subscribe((response: any) => {
                 resolve(response);
             }, reject);
     });
 }
// view setting
getThemeSetting(routeParams :any): Promise<any>{
  return new Promise((resolve, reject) => {
    this._httpClient.get(`${this.appConfig.url.apiUrl}view/themesettings`,{ params: routeParams })
        .subscribe((response: any) => {
          this.setting = response;
          this.onSettingChanged.next(this.setting);
            resolve(response);
        }, reject);
  });
}
 // Create themes
 createThemesSetting(formData:any):Promise<any>
 {
     return new Promise((resolve, reject) => {
       this._httpClient.post(`${this.appConfig.url.apiUrl}create/themes`,formData)
         .subscribe((response: any) => {
             resolve(response);
         }, reject);
     });
 }
  // get current user info
  getUserInfo(id: any):Promise<any>{
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`,{ params: {'id' : id.toString() } })
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
    });
  } 

  // Update user information
  updateUser(formData: any){
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.appConfig.url.apiUrl}update/user`,formData)
          .subscribe((response: any) => {
            resolve(response);
        }, reject);
    });
  }
  //Get Permissions List
  getPermissions(params: any){
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/permissionlist`, {params:params})
              .pipe(catchError(this.errorHandler));
  }
  //Create Permissions
  createPermissions(formData: any){
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/setpermission`, formData)
            .pipe(catchError(this.errorHandler));
  }
  //Update User Privacy Settings
  updatePrivacy(privacyInfo: any){
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/usrerprivacy`, privacyInfo)
            .pipe(catchError(this.errorHandler));
  }
  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message);
  }
}
