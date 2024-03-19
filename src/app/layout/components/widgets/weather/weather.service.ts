import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from 'app/_services';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private appConfig: any;
  constructor(
    private _httpClient: HttpClient
  ) {
    this.appConfig          = AppConfig.Settings;
  }
  //Get WeatherInfo
  getWeatherInfo(weatherParams:any){
    return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}actions/weather`, {params:weatherParams})
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message);
  }
}
