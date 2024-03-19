import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { navigation } from 'app/navigation/navigation';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { MenusService, AuthService, SettingsService, CommonService } from 'app/_services';
@Component({
    selector: 'navbar-front-horizontal-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarFrontHorizontalStyle1Component implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    public homeSettingsdata: any;
    showNavBar: boolean = true;
    public Display_content: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _commonService: CommonService,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _menusService: MenusService,
        private settingsservices: SettingsService,
        private authenticationService: AuthService,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // this.settingsservices.getSetting({'meta_type': 'S', 'meta_key': 'home_settings'}).then(response =>{
        //     if(response && response.settingsinfo.meta_value){
        //         this.homeSettingsdata  = JSON.parse(response.settingsinfo.meta_value);
        //         if(this.homeSettingsdata.featured_image == "Y"){
        //             this.Display_content = this.homeSettingsdata.front_title;
        //         }
        //     }
        //  });
        this.homeSettingsdata = this._commonService.getLocalSettingsJson('home_settings');
        if (this.homeSettingsdata.featured_image == "Y") {
            this.Display_content = this.homeSettingsdata.front_title;
        }
        var currentUser = this.authenticationService.currentUserValue;
        var user_role = currentUser.token.role;

        this._menusService.getMenusList({ position: 'M', 'frontdisplay': '1', 'roles': user_role, menu_status: 'A' })
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(menuresponse => {
                this.navigation = menuresponse.data || [];

                // Register the navigation to the service
                this._fuseNavigationService.register('main', this.navigation);

                // Set the main navigation as our current navigation
                this._fuseNavigationService.setCurrentNavigation('main');

                //set menu navinagiton
                this._menusService._ondynamicmenusList.next(this.navigation);
            });


        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        //unregister current navigation
        this._fuseNavigationService.unregister('main');

        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');
    }
}
