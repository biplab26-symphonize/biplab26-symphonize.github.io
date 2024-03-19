import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; //EXTRA Changes
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { navigation } from 'app/navigation/navigation';
import { AuthService,AppConfig } from 'app/_services';
import { User} from 'app/_models';


@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes
    horizontalNavbar: boolean=false;
    rightNavbar: boolean=false;
    hiddenNavbar: boolean=false;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    loginUserInfo: any;
    _defaultNavAvatar: string = "";
    _localUserSettings:any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        public _matDialog: MatDialog,
        private authenticationService: AuthService,
        private _appConfig:AppConfig,
        private router: Router
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon : 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon : 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon : 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'tr',
                title: 'Turkish',
                flag : 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._defaultNavAvatar = AppConfig.Settings.url.defaultAvatar;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                setTimeout(() => {
                    this.horizontalNavbar = settings.layout.navbar.position === 'top';
                    this.rightNavbar = settings.layout.navbar.position === 'right';
                    this.hiddenNavbar = settings.layout.navbar.hidden === true;
                }, 0);
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
        //Set User Info to display on navbar
        let UserInfo       = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
        this.loginUserInfo = new User().deserialize(UserInfo,'single');
        
        this._appConfig.onProfileInfoChanged.subscribe(ProfileInfo =>{
            if(ProfileInfo){
                this.loginUserInfo.avatar_file = ProfileInfo.avatar_file; 
                this.loginUserInfo.first_name = ProfileInfo.first_name; 
                this.loginUserInfo.last_name = ProfileInfo.last_name; 
            }  
        })
        
        this._localUserSettings  = this._appConfig._localStorage.value.settings || {};
        if(this._localUserSettings)
        {
            this._defaultNavAvatar  = this._localUserSettings.users_settings ? AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile : AppConfig.Settings.url.defaultAvatar; 
            //Update Default Avatar Runtime When Changed From Settings
            this._appConfig._localStorage.subscribe(LocalStorageSettings=>{
                if(LocalStorageSettings.settings.users_settings){
                    this._defaultNavAvatar = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultprofile;
                }
            });
        }
        if(localStorage.userInfo!==undefined && localStorage.userInfo!=='')
        {
            const loginLocalUser = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null;
            if(this.loginUserInfo && loginLocalUser){
                this.loginUserInfo.avatar_file = loginLocalUser.avatar_file;
                this.loginUserInfo.first_name  = loginLocalUser.first_name;
                this.loginUserInfo.last_name   = loginLocalUser.last_name;
            }
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    /**
     * Logout User
     */
    onLogout(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want To Logout ?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this.authenticationService.logout()
                    .pipe(first())
                    .subscribe(
                        data => {
                            this.router.navigate(['/authentication/login']);                            
                        });
                }
                this.confirmDialogRef = null;
            });
    }
    setDefaultPic(){
        this.loginUserInfo.thumb_file=this._defaultNavAvatar;
    }
}
