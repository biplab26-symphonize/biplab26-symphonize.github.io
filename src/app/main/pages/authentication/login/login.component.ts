import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; //EXTRA Changes
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService,AppConfig, CommonService, SettingsService } from 'app/_services';


@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    submitted = false;
    returnUrl: string;
    public appConfig: any;
    pwdhide = true;
    public generalSettings:any = {};
    public AppConfig : any ;
    public MEDIA_URL : any ;
    public img_url : any;
    public exGeneral: any;
    public logoUrl: any;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {MatSnackBar} _matSnackBar
	 * @param {_settingService} SettingsService
     */
    constructor(
		private _settingService: SettingsService,
        private _fuseConfigService: FuseConfigService,
        
        private _matSnackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthService,
        private  settingsservices : SettingsService,       
        private _appConfig:AppConfig
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            colorTheme   : 'theme-viibrant',
            layout: {
                style    : 'vertical-layout-1',
                front    : false,
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
        this.appConfig          = AppConfig.Settings;
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate([this.appConfig.url.redirectAfterLogin]);
        }

		//this.MEDIA_URL = this.AppConfig.url.mediaUrl;
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
        // this.settingsservices.getSetting({'meta_type': 'S', 'meta_key': 'general_settings'}).then(response =>{
        //     this.generalSettings =response;
        //     console.log(this.generalSettings);
        //     this.AppConfig        = AppConfig.Settings;
        //     this.MEDIA_URL        = this.AppConfig.url.mediaUrl;
        //     if(this.generalSettings.small_logo !== undefined){
        //       this.img_url = this.MEDIA_URL +this.generalSettings.small_logo;
        //     }
        //    });
        this.loginForm = this._formBuilder.group({
            username   : ['', [Validators.required]],
            password: ['', Validators.required],
            remember: [true]
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
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onLogin() {
        this.submitted = true;
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || this.appConfig.url.redirectAfterLogin;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.authenticationService.login(this.f.username.value, this.f.password.value, this.f.remember.value)
            .pipe(first(),takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    let duration = data.status==200 ? 2000 : 50000;
                    // Show the success message
                    this._matSnackBar.open(data.message, 'CLOSE', {
                        verticalPosition: 'top',
                        horizontalPosition:'right',
                        duration        : duration
                    });
                    
                    //Set LocalStorage On App Config
                    this._appConfig.setLocalStorage(data);

                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    // Show the error message
                    this._matSnackBar.open(error.message, 'Retry', {
                        verticalPosition: 'top',
                        horizontalPosition:'right',
                        duration        : 2000
                });
            });
    }

    //logut User
    onLogout() {
        this.authenticationService.logout()
            .pipe(first(),takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    // Show the success message
                    this._matSnackBar.open(data.message, 'CLOSE', {
                        verticalPosition: 'top',
                        horizontalPosition:'right',
                        duration        : 2000
                    });
                    console.log("data",data);
                    this.router.navigate(['/authentication/login']);
                },
                error => {
                    // Show the success message
                    this._matSnackBar.open(error.message, 'Retry', {
                        verticalPosition: 'top',
                        horizontalPosition:'right',
                        duration        : 2000
                    });
                    this.router.navigate(['/authentication/login']);
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
