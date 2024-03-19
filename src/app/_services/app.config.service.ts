import { Injectable } from '@angular/core';
import { Config, LocalStorageSettings } from 'app/_models';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {

  onDefaultAvatarChanged: BehaviorSubject<any>;
  onDefaultCoverChanged: BehaviorSubject<any>;
  onProfileInfoChanged: BehaviorSubject<any>;
  onMenuLoaded: BehaviorSubject<any>;

  LocalSettings = localStorage.settings ? JSON.parse(localStorage.settings) : {};
  ThemeSettings = localStorage.themesettings ? JSON.parse(localStorage.themesettings) : {};
  TokenSettings = localStorage.token ? JSON.parse(localStorage.token) : {};

  static Settings: Config;
  _localStorage: BehaviorSubject<any>;

  private http: HttpClient;

  constructor(private httpBackEnd: HttpBackend, private _httpClient: HttpClient) {
    this.http = new HttpClient(httpBackEnd);
    this.onDefaultAvatarChanged = new BehaviorSubject("");
    this.onDefaultCoverChanged = new BehaviorSubject("");
    this.onProfileInfoChanged = new BehaviorSubject("");
    //getMenuinfo in breadcumb
    this.onMenuLoaded = new BehaviorSubject(null);

    this._localStorage = new BehaviorSubject(new LocalStorageSettings(this.LocalSettings, this.ThemeSettings, this.TokenSettings));
  }
  load() {
    const jsonFile = 'assets/app-config.json';
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: Config) => {
        AppConfig.Settings = <Config>response;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }
  /** Get Updated LocalStorage on Page Refresh */
  updateLocalStorage() {
    return this._httpClient.get<any>(`${AppConfig.Settings.url.apiUrl}list/refreshsettings`)
      .subscribe((response: any) => {
        if (response.status == 200) {
          if (response.settings) {
            // localStorage.setItem('settings',JSON.stringify(response.settings));
            // this.LocalSettings    = response.settings;
            response.settings.themesettings = JSON.stringify(response.themesettings.themesettings);
            localStorage.setItem('settings', JSON.stringify(response.settings));
            this.LocalSettings = response.settings;
          }
          //Update user roleid on refresh chanage on 30-6-2020
          if (response.userinfo && response.userinfo.user_roles.role_id > 0) {
            let userStorage = JSON.parse(localStorage.getItem('token'));
            userStorage['role_id'] = response.userinfo.user_roles.role_id;
            localStorage.setItem('token', JSON.stringify(userStorage));
          }
          if (response.themesettings) {
            localStorage.setItem('themesettings', JSON.stringify(response.themesettings));
            this.ThemeSettings = response.themesettings;
          }
          this._localStorage.next(new LocalStorageSettings(this.LocalSettings, this.ThemeSettings, this.TokenSettings));
        }
      });
       setTimeout(() => {
        this.LocalSettings = localStorage.settings ? JSON.parse(localStorage.settings) : {};
         }, 1000);
      
  }
  /**Default User Pictures */
  setLocalStorage(localResponse: any) {
    this.LocalSettings = localResponse.settings || this.LocalSettings;
    this.ThemeSettings = localResponse.themesettings || this.ThemeSettings;
    this.TokenSettings = localResponse.token || this.TokenSettings;
    this._localStorage.next(new LocalStorageSettings(this.LocalSettings, this.ThemeSettings, this.TokenSettings));
    return;
  }
  /**Set MenuInfo for breadcumb */
  get onMenuLoad(): Observable<any> {
    return this.onMenuLoaded.asObservable();
  }
}