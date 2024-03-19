import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { OptionsList,CommonService, AppConfig } from 'app/_services';
@Component({
    selector     : 'profile-about',
    templateUrl  : './about.component.html',
    styleUrls    : ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileAboutComponent implements OnInit, OnDestroy
{
    public localSettings      :any={users_settings:{}};
    @Input() aboutInfo: any;
    public CustomFormats: any = '';
    public showBirthdate:boolean = false;
    public userMeta:any=[];
    public exceptFieldsArray: any[] = ['dynamic','date'];
    public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
    // Private
    private _unsubscribeAll: Subject<any>;
    public fieldOptions       :any = {profilecorefields:[],profilemetafields:[]};

    /**
     * Constructor
     *
     * 
     */
    constructor(
        private _commonService:CommonService,
        private _appConfig:AppConfig
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
        this.localSettings      = this._appConfig._localStorage.value.settings;

        this.CustomFormats = OptionsList.Options.customformats;
        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        //Get MetaFields Array For Filtering
        this._commonService.getExportFieldsForDirectory()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data =>{
            if(data['directoryfields']){
            this.fieldOptions  = data['directoryfields'];
            }
        });
        //Get UserMeta Fields To Print
        if(this.aboutInfo && this.aboutInfo.usermeta){
            this.userMeta = CommonUtils.getMetaValues(this.aboutInfo.usermeta);
        }
        //Hide Testing Emails
        this.hideDomainMails();
    }
    hideDomainMails(){
        if(this.localSettings.users_settings && this.localSettings.users_settings.domain_emails){
            let domainMails = this.localSettings.users_settings.domain_emails.split(',');
            let emailDomain = this.aboutInfo.email.split("@").pop();
            const hideEmail = domainMails.includes(emailDomain);
            if(hideEmail==true){
                this.aboutInfo.email='';
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

    metaFields(index,item){
        return item.field_id
    }
}
