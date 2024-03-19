import { DashboardService } from 'app/_services/dashboard.service';
import { Component, ViewChild, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public document2: any;
  public eventattendees2: any;
  public formentries2: any;
  public todayevents2: any;
  public userupdate2: any;
  public userroleId: any;
  public showCount: boolean = false;
  public dashboard_forms: boolean = false;
  public dashboard_forms_entries: boolean = false;
  public dashboard_user_updates: boolean = false;
  public dashboard_document: boolean = false;
  public dashboard_event_attendees: boolean = false;
  public dashboard_today_event: boolean = false;
  constructor(
    private _commonService: CommonService,
    private _fuseConfigService: FuseConfigService,
    private dashboardservice: DashboardService) {
    this._fuseConfigService.config = CommonUtils.setVerticalLayout();
    this._fuseConfigService.defaultConfig = CommonUtils.setVerticalLayout();
  }

  ngOnInit() {
    this.getDashboardData();

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };


    let adminRoles = this._commonService.getLocalSettingsJson('general_settings');
    if (adminRoles['dashboard_forms'] != '' && adminRoles['dashboard_forms'] !== undefined) {
      let userRole = adminRoles['dashboard_forms'].split(',').map(Number);
      let userStorage = JSON.parse(localStorage.getItem('token'));
      this.userroleId = userStorage !== null && userStorage !== undefined ? userStorage['role_id'] : 0;
      if (this.userroleId > 0 && userRole.includes(this.userroleId)) {
        this.dashboard_forms = true;
      }
    }
    if (adminRoles['dashboard_forms_entries'] != '' && adminRoles['dashboard_forms_entries'] !== undefined) {
      let userRole = adminRoles['dashboard_forms_entries'].split(',').map(Number);
      let userStorage = JSON.parse(localStorage.getItem('token'));
      this.userroleId = userStorage !== null && userStorage !== undefined ? userStorage['role_id'] : 0;
      if (this.userroleId > 0 && userRole.includes(this.userroleId)) {
        this.dashboard_forms_entries = true;
      }
    }
    if (adminRoles['dashboard_user_updates'] != '' && adminRoles['dashboard_user_updates'] !== undefined) {
      let userRole = adminRoles['dashboard_user_updates'].split(',').map(Number);
      let userStorage = JSON.parse(localStorage.getItem('token'));
      this.userroleId = userStorage !== null && userStorage !== undefined ? userStorage['role_id'] : 0;
      if (this.userroleId > 0 && userRole.includes(this.userroleId)) {
        this.dashboard_user_updates = true;
      }
    }
    if (adminRoles['dashboard_document'] != '' && adminRoles['dashboard_document'] !== undefined) {
      let userRole = adminRoles['dashboard_document'].split(',').map(Number);
      let userStorage = JSON.parse(localStorage.getItem('token'));
      this.userroleId = userStorage !== null && userStorage !== undefined ? userStorage['role_id'] : 0;
      if (this.userroleId > 0 && userRole.includes(this.userroleId)) {
        this.dashboard_document = true;
      }
    }
    if (adminRoles['dashboard_event_attendees'] != '' && adminRoles['dashboard_event_attendees'] !== undefined) {
      let userRole = adminRoles['dashboard_event_attendees'].split(',').map(Number);
      let userStorage = JSON.parse(localStorage.getItem('token'));
      this.userroleId = userStorage !== null && userStorage !== undefined ? userStorage['role_id'] : 0;
      if (this.userroleId > 0 && userRole.includes(this.userroleId)) {
        this.dashboard_event_attendees = true;
      }
    }
    if (adminRoles['dashboard_today_event'] != '' && adminRoles['dashboard_today_event'] !== undefined) {
      let userRole = adminRoles['dashboard_today_event'].split(',').map(Number);
      let userStorage = JSON.parse(localStorage.getItem('token'));
      this.userroleId = userStorage !== null && userStorage !== undefined ? userStorage['role_id'] : 0;
      if (this.userroleId > 0 && userRole.includes(this.userroleId)) {
        this.dashboard_today_event = true;
      }
    }
  }
  getDashboardData() {
    return this.dashboardservice.getDashboardCount().subscribe(Response => {
      if (Response) {
        this.showCount = true;
        this.document2 = Response.count.document;
        this.eventattendees2 = Response.count.eventattendees;
        this.formentries2 = Response.count.formentries;
        this.todayevents2 = Response.count.todayevents;
        this.userupdate2 = Response.count.userupdate;
      }
    });
  }

}
