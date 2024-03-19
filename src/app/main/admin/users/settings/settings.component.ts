import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CommonService } from 'app/_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations   : fuseAnimations
})
export class SettingsComponent implements OnInit {

  public green_bg_header: any;
    public button: any;
    public accent: any;
  constructor(private _commonService: CommonService,) {
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
        let currentData = JSON.parse(themeData);
        themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }; 
   }

  ngOnInit() {
  }

}
