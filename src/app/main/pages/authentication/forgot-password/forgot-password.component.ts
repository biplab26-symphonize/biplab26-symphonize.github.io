import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; //EXTRA Changes
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { fuseAnimations } from '@fuse/animations';
import { AuthService, CommonService, AppConfig, SettingsService } from 'app/_services';


@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    submitted = false;
    public generalSettings:any = {};
    public AppConfig : any ;
    public MEDIA_URL : any ;
    public img_url : any;
    public logoUrl: any;
    public exGeneral: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
	 * @param {_settingService} SettingsService
     */
    constructor(
		private _settingService: SettingsService,
        private _fuseConfigService: FuseConfigService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matSnackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
       private settingsservices : SettingsService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            colorTheme   : 'theme-viibrant',
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

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
    //     this.settingsservices.getSetting({'meta_type': 'S', 'meta_key': 'general_settings'}).then(response =>{
    //     this.generalSettings =response;
    //     console.log(this.generalSettings);
    //     this.AppConfig        = AppConfig.Settings;
    //     this.MEDIA_URL        = this.AppConfig.url.mediaUrl;
    //     if(this.generalSettings.small_logo !== undefined){
    //       this.img_url = this.MEDIA_URL +this.generalSettings.small_logo;
    //     }
    //    });
     
        this.forgotPasswordForm = this._formBuilder.group({
            username: ['', [Validators.required]]
        });
        this.getGeneralSettings();
    }
    getGeneralSettings() {		
        this._settingService.getSettingLoginPage().subscribe(response =>{
            this.exGeneral = JSON.parse(response.settings.general_settings);
            this.logoUrl = this.exGeneral.login_page_logo;
            if(this.logoUrl == ''){
                this.logoUrl = 'assets/images/logos/default.png';
            }
            console.log("logoUrl",this.logoUrl);
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.forgotPasswordForm.controls; }

    //Send mail with token on forgot password
    onForgot(){
        this.submitted = true;
        // stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        //SHOW LOADER BAR #EXTRA Changes
        this._fuseProgressBarService.show();
        this.authenticationService.forgot(this.f.username.value)
            .pipe(first(),takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    
                    this._fuseProgressBarService.hide();
                    if(data.status==200){
                        // Show the success message
                        this._matSnackBar.open(data.message, 'CLOSE', {
                            verticalPosition: 'top',
                            duration        : 5000
                        });
                    }
                    else{
                        // Show the error message
                        this._matSnackBar.open(data.message, 'Retry', {
                            verticalPosition: 'top',
                            duration        : 5000
                        });
                    }
                    
                },
                error => {

                    this._fuseProgressBarService.hide();
                    
                    // Show the success message
                    this._matSnackBar.open(error.message, 'Retry', {
                        verticalPosition: 'top',
                        duration        : 5000
                    });
                });
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
