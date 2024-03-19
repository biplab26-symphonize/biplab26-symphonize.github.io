import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'app/navigation/navigation';
import { CommonService, AppConfig, AuthService, SettingsService, EventbehavioursubService } from 'app/_services';
import { Router } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
    selector     : 'front-horizontal-layout-1',
    templateUrl  : './front-layout-1.component.html',
    styleUrls    : ['./front-layout-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FrontHorizontalLayout1Component implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;
    _navariant:string='front-navbar-style-1';
    _homeSettings: any = {};
    _generalSettings:any = {};
    breadcumbSettings: any = {};
    homeSettingsdata : any ;
    showSideBar : boolean = false ;
    localSettings: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private router:Router,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _commonService: CommonService,
        private settingsservices : SettingsService,
        private _authService:AuthService,
        private _appConfig:AppConfig,
        private _eventbehavioursubService:EventbehavioursubService
       
    )
    {
        //unregister current navigation
        this._fuseNavigationService.unregister('main');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void 
    {
        //announcmentSettings
        this._homeSettings      = this._commonService.getLocalSettingsJson('home_settings');
        this._generalSettings   = this._commonService.getLocalSettingsJson('general_settings');

        if(this._homeSettings && this._homeSettings.navbar_layout){
            this._navariant = this._homeSettings.navbar_layout;
        }
        // Subscribe to config changes
        this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config) => {
            setTimeout(() => {
                this.fuseConfig = config;
            }, 0);          
        });
        //Set Form Edit Restriction for subscriberusers
        this.SetEditRestriction();        
    }
    SetEditRestriction(){
        this._eventbehavioursubService.restrictFormEdit.next(false);
        this.localSettings  = this._appConfig._localStorage.value.settings;
        let currentuserRole = JSON.parse(localStorage.getItem('token')).role_id;
        if(currentuserRole>0 && this.localSettings && this.localSettings.users_settings && this.localSettings.users_settings.restrict_form_roles){
            if(this.localSettings.users_settings.restrict_form_roles.includes(currentuserRole)==true){
                this._eventbehavioursubService.restrictFormEdit.next(true);
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
}
