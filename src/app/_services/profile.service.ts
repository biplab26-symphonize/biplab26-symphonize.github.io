import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig, AuthService } from 'app/_services';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private appConfig:any;
  private userId:number;
  constructor(
    private _httpClient: HttpClient,
    private _authService : AuthService
    ) {
      this.appConfig      = AppConfig.Settings;
    }

  // get current user profileinfo
  getProfileInfo():Observable<any>{
      this.userId = this._authService.currentUserValue.token.user.id;
      return this._httpClient.get(`${this.appConfig.url.apiUrl}view/user`,{ params: {'id' : this.userId.toString() } });
    
  } 
}
