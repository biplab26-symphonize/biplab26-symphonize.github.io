import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppConfig, CommonService, OptionsList } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { WeatherService } from '../weather/weather.service';

import * as moment from 'moment';

@Component({
  selector: 'widget-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DatetimeComponent implements OnInit {

  @Input() homesettings: any;
  public weatherInfo: any;
  public forecastWeatherInfo: any = null;
  _defaultTimeZone: string = OptionsList.Options.homesettings.timezone || "";
  _currentTime: String | Date;
  weatherUrl:string=AppConfig.Settings.url.weatherUrl;
  constructor(
    private _weatherService: WeatherService,
    private _commonService: CommonService,
    
  ) { }

  ngOnInit() {
    let timeZoneSettings = this._commonService.getLocalSettingsJson('general_settings');
    if(timeZoneSettings['APP_TIMEZONE']){
      this._defaultTimeZone = timeZoneSettings['APP_TIMEZONE'];
    }
    //Set Datetime Into Specific TimeZone
    setInterval(() => {
      let currentTime   = new Date().toLocaleString("en-US", {timeZone: this._defaultTimeZone});
      this._currentTime = new Date(currentTime);
    },1000);
    console.log(this.homesettings);
    if (this.homesettings.city_id && this.homesettings.app_id && this.homesettings.unit) {
      let dayCount = parseInt(this.homesettings.forecast) + 1;
      this._weatherService.getWeatherInfo({ 'id': this.homesettings.city_id, 'appid': this.homesettings.app_id, 'units': this.homesettings.unit, 'cnt': dayCount }).subscribe(weatheres => {
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
        console.log(this.weatherInfo)
      });
    } else {
      this.weatherInfo = null;
    }

  }


}
