import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonUtils } from 'app/_helpers';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthService, SettingsService, AppConfig } from 'app/_services';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'app/_models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  // @Input() aboutInfo: any;
  user_id: number = 0 ;
  userMeta : any = [];
  errorMsg: any;
  userData: any = {};
  isSubmit: boolean;
  loginUserInfo: any = {first_name:'',last_name:''};
  _localUserSettings: any;
  _defaultAvatar: string;
  _defaultCover: string;
  tmp_avatar_img: string;
  tmp_cover_img: string;
 
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar
   */
  constructor(
      private _fuseConfigService: FuseConfigService,
      private _appConfig            : AppConfig,
      private authenticationService : AuthService,
      private _settingService       : SettingsService,
      public _matDialog             : MatDialog){
  
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.user_id = this.authenticationService.currentUserValue.token.user.id;
   
  }
 
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  { 
    //Set User Info to display on navbar
      let UserInfo       = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
      this.loginUserInfo = new User().deserialize(UserInfo,'single');
      this.loginUserInfo.first_name = this.loginUserInfo.first_name +' '+this.loginUserInfo.showpreffix+' '+this.loginUserInfo.middle_name+' '+this.loginUserInfo.last_name;
      
      this._appConfig.onProfileInfoChanged.subscribe(ProfileInfo =>{
        if(ProfileInfo && ProfileInfo.first_name){
          let preffixName = ProfileInfo.preffix!=='' ? ' "' + ProfileInfo.preffix + '" ' : '';
          this.loginUserInfo.first_name = ProfileInfo.first_name + preffixName + ProfileInfo.last_name; 
        }
      })

      this._localUserSettings = this._appConfig._localStorage.value.settings;
    
      if(this._localUserSettings){
          this._defaultAvatar  = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar; 
          this._defaultCover = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultcover || AppConfig.Settings.url.defaultCover;
      
          //Update Default Avatar Runtime When Changed From Settings
          this._appConfig._localStorage.subscribe(LocalStorageSettings=>{
              if(LocalStorageSettings.settings.users_settings.defaultprofile){
                  this._defaultAvatar = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultprofile;
              }
              if(LocalStorageSettings.settings.users_settings.defaultcover){
                this._defaultCover = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultcover;
              }
          });
      }

      if(localStorage.userInfo!==undefined && localStorage.userInfo!=='')
        {
            const loginLocalUser = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null;

            if(this.loginUserInfo && loginLocalUser){
                let preffixName = loginLocalUser.preffix!=='' ? ' "' + loginLocalUser.preffix + '" ' : '';
                this.loginUserInfo.first_name  = loginLocalUser.first_name + preffixName + loginLocalUser.last_name; 
            }
        }

      this.tmp_avatar_img = this._defaultAvatar;
      this.tmp_cover_img = this._defaultCover;
    
      this.getUserInfo();
  }

  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(response){
    this.userData = new User().deserialize(response,'single');
    // set image preview
    this.tmp_avatar_img = this.userData.thumb_file || this.userData.avatar_file || this._defaultAvatar;
    this.tmp_cover_img = this.userData.cover_file || this._defaultCover;
    this.loginUserInfo.first_name  =  this.userData.first_name + ' ' + this.userData.showpreffix + ' ' + this.userData.last_name;
  }

// get user information
  getUserInfo() {
    this._settingService.getUserInfo(this.user_id)
      .then(response =>{ 
                if(response.status == 200){
                  this.fillFormValues(response.userinfo);                 
                }
       },error => this.errorMsg = error);
  }
}


