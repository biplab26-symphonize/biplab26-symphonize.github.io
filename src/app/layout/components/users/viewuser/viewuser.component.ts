import { Component, OnInit } from '@angular/core';
import { User } from 'app/_models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsersService, CommonService, AppConfig, AuthService, OptionsList } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { FuseConfigService } from '@fuse/services/config.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.scss'],
  animations: fuseAnimations
})
export class ViewuserComponent implements OnInit {
  public UserInfo: any = {};
  public _localUserSettings: any;
  public _defaultAvatar: string = "";
  public _defaultCover: string = "";
  public userMeta: any[] = [];
  public showNavBar: boolean = false;
  public routerUrl: string = '/admin/users/list'
  public exceptFieldsArray: any[] = ['date'];
  public loginUserId: number = 0;
  public CustomFormats: any = '';
  public editUserAccess: boolean = false;
  // Private
  private _unsubscribeAll: Subject<any>;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public fieldOptions       :any = {profilecorefields:[],profilemetafields:[]};
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private authenticationService: AuthService,
    private _usersService: UsersService,
    private _commonService: CommonService,
    private _appConfig: AppConfig
  ) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    if (this.route.routeConfig.path == 'view-other-profile/:id' && this.route.params['value'].id > 0) {
      this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
      this.showNavBar = true;
      this.routerUrl = '/resident-directory';
    }
  }

  ngOnInit() {
    this.CustomFormats = OptionsList.Options.customformats;
    //Get MetaFields Array For Filtering
    this._commonService.getExportFieldsForDirectory()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data =>{
      if(data['directoryfields']){
        this.fieldOptions  = data['directoryfields'];
      }
    });
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this._localUserSettings    = this._appConfig._localStorage.value.settings;
    //Allow User to edit other user Profile
    this._localUserSettings.edit_user_access        = this._localUserSettings.edit_user_access ? this._localUserSettings.edit_user_access : []; 
    this.loginUserId           = this.authenticationService.currentUserValue.token.user.id;
    this.editUserAccess        =  this._localUserSettings.edit_user_access.includes(this.loginUserId) ? true : false;    
    
    var userData = new User().deserialize(this._usersService.user, 'single');    
    this.UserInfo = userData;
    if (this.UserInfo && this.UserInfo.usermeta) {
      this.userMeta = CommonUtils.getMetaValues(this.UserInfo.usermeta);
    }

    if (this._localUserSettings) {
      this._defaultAvatar = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar;      
      this._defaultCover = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultcover || AppConfig.Settings.url.defaultCover;      
    }

  }
  metaFields(index, item) {
    return item.field_id
  }
  getBackground(coverFile) {
    if (coverFile != "") {      
      return coverFile;
    }
    else {
      //this._defaultCover = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultcover || AppConfig.Settings.url.defaultCover;      
      return this._defaultCover;
    }
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}
