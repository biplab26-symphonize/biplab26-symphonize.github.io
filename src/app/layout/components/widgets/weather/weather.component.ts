import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from './weather.service';
import { AppConfig, OptionsList, CommonService, AuthService, SettingsService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import * as moment from 'moment';

@Component({
  selector: 'widget-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  @Input() homesettings: any;
  weatherUrl: string = AppConfig.Settings.url.weatherUrl;
  public weatherInfo: any = null;
  public forecastWeatherInfo: any = null;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public UserInfo: {};
  public _defaultTimeZone: string = OptionsList.Options.homesettings.timezone || "";
  public _currentTime: String | Date;
  public homeSettingsdata;

  constructor(
    private _weatherService: WeatherService,
    private _commonService: CommonService,
    private settingsservices: SettingsService,
    private _authService: AuthService,
  ) {
  }

  ngOnInit() {

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    // this.settingsservices.getSetting({ 'meta_type': 'S', 'meta_key': 'home_settings' }).then(response => {
    //   this.homeSettingsdata = JSON.parse(response.settingsinfo.meta_value);
    //   if (this.homeSettingsdata.weather_set == 'Y') {
    //     // GET WEATHER INFORMATION 
    //     // GET NEXT FORECAST WEATHER INFORMATION
    //     let dayCount = parseInt(this.homeSettingsdata.forecast) + 1;
    //     this._weatherService.getWeatherInfo({ 'id': this.homeSettingsdata.city_id, 'appid': this.homeSettingsdata.app_id, 'units': this.homeSettingsdata.unit, 'cnt': dayCount }).subscribe(weatheres => {
    //       if (weatheres.weatherinfo && weatheres.weatherinfo.current && weatheres.weatherinfo.current.cod == "200") {
    //         this.weatherInfo = weatheres.weatherinfo.current;
    //       }
    //       //Forecast
    //       if (weatheres.weatherinfo && weatheres.weatherinfo.forecast && weatheres.weatherinfo.forecast.cod == "200") {
    //         this.forecastWeatherInfo = weatheres.weatherinfo.forecast.list;
    //         if (this.forecastWeatherInfo.length > 0) {
    //           this.forecastWeatherInfo.map(item => {
    //             item.dt = moment(item.dt * 1000).format('ddd');
    //             item.weather = item.weather.length > 0 ? item.weather[0] : [];
    //             return item;
    //           });
    //         }
    //       }
    //     });

    //     //GET CURRENT USER INFORMATION 
    //     this.UserInfo = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : null;

    //     let timeZoneSettings = this._commonService.getLocalSettingsJson('general_settings');
    //     if (timeZoneSettings['APP_TIMEZONE']) {
    //       this._defaultTimeZone = timeZoneSettings['APP_TIMEZONE'];
    //     }
    //     //Set Datetime Into Specific TimeZone
    //     setInterval(() => {
    //       let currentTime = new Date().toLocaleString("en-US", { timeZone: this._defaultTimeZone });
    //       this._currentTime = new Date(currentTime);
    //     }, 1000);

    //   } else {
    //     this.weatherInfo = null;
    //   }
    // })

    this.homeSettingsdata = this._commonService.getLocalSettingsJson('home_settings');
    console.log("weather_set", this.homeSettingsdata.weather_set)
    if (this.homeSettingsdata.weather_set == 'Y') {
      // GET WEATHER INFORMATION 
      // GET NEXT FORECAST WEATHER INFORMATION
      let dayCount = parseInt(this.homeSettingsdata.forecast) + 1;
      this._weatherService.getWeatherInfo({ 'id': this.homeSettingsdata.city_id, 'appid': this.homeSettingsdata.app_id, 'units': this.homeSettingsdata.unit, 'cnt': dayCount }).subscribe(weatheres => {
        if (weatheres.weatherinfo && weatheres.weatherinfo.current && weatheres.weatherinfo.current.cod == "200") {
          this.weatherInfo = weatheres.weatherinfo.current;
        }
        //Forecast
        if (weatheres.weatherinfo && weatheres.weatherinfo.forecast && weatheres.weatherinfo.forecast.cod == "200") {
          this.forecastWeatherInfo = weatheres.weatherinfo.forecast.list;
          if (this.forecastWeatherInfo.length > 0) {
            this.forecastWeatherInfo.map(item => {
              item.dt = moment(item.dt * 1000).format('ddd');
              item.weather = item.weather.length > 0 ? item.weather[0] : [];
              return item;
            });
          } 
        }
      });

      //GET CURRENT USER INFORMATION 
      this.UserInfo = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : null;

      let timeZoneSettings = this._commonService.getLocalSettingsJson('general_settings');
      if (timeZoneSettings['APP_TIMEZONE']) {
        this._defaultTimeZone = timeZoneSettings['APP_TIMEZONE'];
      }
      //Set Datetime Into Specific TimeZone
      setInterval(() => {
        let currentTime = new Date().toLocaleString("en-US", { timeZone: this._defaultTimeZone });
        this._currentTime = new Date(currentTime);
      }, 1000);

    } else {
      this.weatherInfo = null;
    }
  }
}
