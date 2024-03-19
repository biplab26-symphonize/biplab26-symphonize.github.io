import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { CommonService, SettingsService, AppConfig } from 'app/_services';
import { CommonUtils } from 'app/_helpers';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class HomeComponent implements OnInit {

  public returnUrl: string;
  public homeSettings: any = {};
  public generalSettings: any = {};
  public AppConfig: any;
  public MEDIA_URL: any;
  public roleId: number = 0;
  public homeSettingsdata: any;
  guestroom: boolean = false;
  ShowDateTime: boolean = false;
  ShowWeather: boolean = false;
  ShowHomeAnnouncement: boolean = false;
  HomeAnnouncementLayout: boolean = false;
  ShowScrollAnnouncement: boolean = false;
  Showevent_ann: boolean = false;
  ShowDining_ann: boolean = false;
  ShowBulletinBoard: boolean = false;
  ShowMyForm: boolean = false;
  ShowMEvent: boolean = false;
  ShowMy_Dining: boolean = false;
  ShowMy_Appointment: boolean = false;
  Showmy_tablereservation: boolean = false;
  ShowTodays_event: boolean = false;
  ShowImg: boolean = false;
  ShowNeighbors: boolean = false;
  ShowStaff: boolean = false;
  Show_bulletin: boolean = false;
  ShowQuicklink: boolean = false;
  foodreservation: boolean = false;
  meetingroom: boolean = false;
  my_favorite_event: boolean = false;
  Kisko_User: any;
  public Image_URL: any;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private settingsservices: SettingsService,
    private _commonService: CommonService) {
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.AppConfig = AppConfig.Settings;
    this.MEDIA_URL = this.AppConfig.url.mediaUrl;
    this.roleId = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).role_id : this.roleId;
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.applyHomeSettings();

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void { }

  applyHomeSettings() {
    if(this.homeSettings && this.generalSettings){
      this.Kisko_User = this.generalSettings.kiosk_user ? this.generalSettings.kiosk_user.split(',').map(Number) : '';

      this.ShowDateTime = this.homeSettings.datetime == 'Y' ? true : false;
      this.ShowWeather = this.homeSettings.weather_set == 'Y' ? true : false;
      this.ShowHomeAnnouncement = this.homeSettings.home_ann == 'Y' ? true : false;
      this.HomeAnnouncementLayout = this.homeSettings && this.homeSettings.home_ann == 'Y' && this.homeSettings.announcement_layout ? this.homeSettings.announcement_layout : '';

      this.ShowScrollAnnouncement = this.homeSettings.scroll_ann == 'Y' ? true : false;
      this.Showevent_ann = this.homeSettings.event_ann == 'Y' ? true : false;
      this.ShowDining_ann = this.homeSettings.dining_ann == 'Y' ? true : false;
      this.ShowBulletinBoard = this.homeSettings.is_bulletin == 'Y' ? true : false;

      if (this.Kisko_User && this.Kisko_User.length > 0 && !this.Kisko_User.includes(this.roleId)) {
        this.ShowMEvent = this.homeSettings.my_events == 'Y' ? true : false;
        this.ShowMyForm = this.homeSettings.my_forms == 'Y' ? true : false;
        this.ShowMy_Dining = this.homeSettings.my_dining == 'Y' ? true : false;
        this.ShowMy_Appointment = this.homeSettings.my_appointment == 'Y' ? true : false;
        this.Showmy_tablereservation = this.homeSettings.my_tablereservation == 'Y' ? true : false;
        this.foodreservation = this.homeSettings.my_foodreservation == 'Y' ? true : false;
        this.ShowTodays_event = this.homeSettings.todays_event == 'Y' ? true : false;
        this.meetingroom = this.homeSettings.meeting_room == 'Y' ? true : false;
        this.guestroom = this.homeSettings.my_guest == 'Y' ? true : false;
        this.my_favorite_event = this.homeSettings.my_favorite_events == 'Y' ? true : false;
      }

      this.ShowNeighbors = this.homeSettings.is_newest_neighbors == 'Y' ? true : false;
      this.ShowStaff = this.homeSettings.is_newest_staff == 'Y' ? true : false;
      this.Show_bulletin = this.homeSettings.is_bulletin == 'Y' ? true : false;
      this.ShowQuicklink = this.homeSettings.quicklink_set == 'Y' ? true : false;
      this.ShowImg = this.homeSettings.featured_image == 'Y' ? true : false;
      this.Image_URL = this.homeSettings.featured_image == 'Y' ? this.MEDIA_URL + this.homeSettings.featured_image_url : '';
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

