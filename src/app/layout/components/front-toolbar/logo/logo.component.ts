import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  _mediaUrl:string=AppConfig.Settings.url.mediaUrl;
  _defaultsitelogo:string=AppConfig.Settings.url.defaultsiteLogo;
  _defaultsitetitle:string=AppConfig.Settings.url.defaultsiteTitle;
  _siteInfo: any={};
  constructor(
    private _appConfig:AppConfig
  ) {

  }

  ngOnInit() {
    this._siteInfo = CommonUtils.getStringToJson(this._appConfig.LocalSettings.general_settings || "");
  }

}
