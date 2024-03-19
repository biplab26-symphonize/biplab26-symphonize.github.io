import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil, first } from 'rxjs/operators';
import { navigation } from 'app/navigation/navigation';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { MenusService, AuthService, SettingsService } from 'app/_services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { AccountService } from 'app/layout/components/account/account.service';
@Component({
    selector     : 'navbar-front-horizontal-style-2',
    templateUrl  : './style-2.component.html',
    styleUrls    : ['./style-2.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarFrontHorizontalStyle2Component implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;
    public homeSettingsdata : any ;
    currentUser : any = {};
    // Private
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _accountService: AccountService,
        private _menusService:MenusService,
        private settingsservices : SettingsService,
        private authenticationService: AuthService,
        public _matDialog: MatDialog,
        private router: Router
    )
    {
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
        //SubScribe For Logout Variable When Click On Menu Link	
        this._accountService.onlogoutClick	
        .pipe(takeUntil(this._unsubscribeAll))	
        .subscribe(response => {	
            if (response == true) {	
                this.onLogout();	
            }	
        });
        
        var roleInfo    = this.authenticationService.currentUserValue;
        var user_role   = 0;
        if(roleInfo && roleInfo.token.user){
            user_role = roleInfo.token.role;
            this.currentUser = roleInfo.token.user
        }
    

        this._menusService.getMenusList({position:'M','frontdisplay':'1','roles':user_role,menu_status:'A'})
        .pipe(
            takeUntil(this._unsubscribeAll)
        )
        .subscribe(menuresponse=>{
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
     * Logout User
     */
    onLogout(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want To Logout ?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.authenticationService.logout()
                        .pipe(first())
                        .subscribe(
                            data => {
                                this.router.navigate(['/authentication/login']);
                            });
                }
                this.confirmDialogRef = null;
            });
        localStorage.removeItem("pickupTime");
        localStorage.removeItem("locationName");
        localStorage.removeItem("categoryId");
        localStorage.removeItem("lunch");
        localStorage.removeItem("side_number");
        localStorage.removeItem("phone");
        localStorage.removeItem("notes");
        localStorage.removeItem("product_name");
        localStorage.removeItem("building");
        localStorage.removeItem("extrasId ");
        localStorage.removeItem("dinner");
        localStorage.removeItem("delivery_date");
        localStorage.removeItem("quantity");
        localStorage.removeItem("location");
        localStorage.removeItem("sideDish");
        localStorage.removeItem("type");
        localStorage.removeItem("orderDataArr");
        localStorage.removeItem("numberOfSideAndExtras");
        localStorage.removeItem("sideDishId");
        localStorage.removeItem("extras");
        localStorage.removeItem("forntNotesArr");
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        //unregister current navigation
        this._fuseNavigationService.unregister('main');
        this._accountService.onlogoutClick.next(null);
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');
    }
}
