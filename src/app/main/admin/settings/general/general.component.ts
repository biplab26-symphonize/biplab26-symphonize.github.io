import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { DateTimeFormatList, AppConfig, SettingsService, CommonService, RolesService } from 'app/_services';


@Component({
	selector: 'app-general',
	templateUrl: './general.component.html',
	styleUrls: ['./general.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations
})
export class GeneralComponent implements OnInit {

	public green_bg_header: any;
	public button: any;
	public accent: any;
	public socialChecked: boolean = false;
	public contactChecked: boolean = false;
	public maskChecked: boolean = false;
	public isFeviconLogo: boolean = false;
	public isSmallLogo: boolean = false;
	public iPhone_Retina_Icon : boolean = false;
	public iPhone_iPad_Icons : boolean = false;
	public iPhone_max_Icons : boolean = false;
	public iPhone_40_Icons : boolean = false;
	public iPhone_32_Icons : boolean = false;
	public iPhone_57_Icons : boolean = false;
	public iPhone_72_Icons : boolean = false;
	public iPhone_114_Icons : boolean = false;
	public iPhone_144_Icons : boolean = false;
	public iPhone_iPad_Retina_Icon : boolean = false;

	public iPhone_Icon : boolean = false;
	public isPortalLogo: boolean = false;
	public isLargeLogo: boolean = false;
	public isFaviconLargeLogo: boolean = false;
	public isLargeLogoLogin: boolean = false;
	public isSubmit: boolean = false;

	public largeLoginLogoMessage: string;
	public largeLogoMessage: string;
	public iPhone_iPad_IconLogoMessage : string;
	public iPhone_max_IconLogoMessage : string;
	public iPhone_40_IconLogoMessage : string;
	public iPhone_32_IconLogoMessage : string;
	public iPhone_57_IconLogoMessage : string;
	public iPhone_72_IconLogoMessage : string;
	public iPhone_114_IconLogoMessage : string;
	public iPhone_144_IconLogoMessage : string;
	public feviconLogoMessage: string;
	public FaviconlargeLogoMessage: string;
	public iPhone_IconLogoMessage : string;
	public iPhone_Retina_IconLogoMessage : string;
	public iPhone_iPad_Retina_IconLogoMessage : string;
	public smallLogoMessage: string;
	public portalLogoMessage: string;
	public MEDIA_URL: string;
	public inputAccpets: string = ".jpeg, .jpg, .png";

	public generalSettingForm: FormGroup;
	//   public follow_us_content: FormArray;	

	public rolesList: any = [];
	public dateFormats: any = [];
	public timeFormats: any = [];
	public WeekDays: any = [];
	public pastDays: any = [];
	public timezones: any = [];
	public roles: any = [];

	public largeLogoURL: any;
	public largeLoginLogoURL: any;
	public iPhone_Icon_LogoURL : any;
	public iPhone_max_Icon_LogoURL : any;
	public iPhone_40_Icon_LogoURL : any;
	public iPhone_32_Icon_LogoURL : any;
	public iPhone_57_Icon_LogoURL : any;
	public iPhone_72_Icon_LogoURL : any;
	public iPhone_114_Icon_LogoURL : any;
	public iPhone_144_Icon_LogoURL : any;
	
	public FeviconlargeLoginLogoURL: any;
	public iPhone_iPad_Icon_LogoURL : any ;
	public iPhone_iPad_Retina_Icon_LogoURL : any;
	public largeFaviconLogoURL : any;
	public feviconLogoURL: any;
	public smallLogoURL: any;
	public iPhone_Retina_Icon_LogoURL : any ;
	public errorMsg: any;
	public portalLogoURL: any;
	public AppConfig: any;

	public facebook: boolean = false;
	public twitter: boolean = false;
	public instgram: boolean = false;
	public tinyMceSettings = {};
	// Private
	private _unsubscribeAll: Subject<any>;

	/**
	 * Constructor
	 *
	 * @param {fb} FormBuilder
	 * @param {_matSnackBar} MatSnackBar
	 * @param {_settingService} SettingsService
	 */
	constructor(
		private fb: FormBuilder,
		private _commonService: CommonService,
		private _matSnackBar: MatSnackBar,
		private _settingService: SettingsService,
		private _roleService: RolesService,
		private _commonUtils: CommonUtils
	) {
		// Set the private defaults
		this._unsubscribeAll = new Subject();

		// this.follow_us_content = this.fb.array([]); 
		this.AppConfig = AppConfig.Settings;
		this.MEDIA_URL = this.AppConfig.url.mediaUrl;

		// get timezoes, time and date  format
		this.timezones = DateTimeFormatList.Options.list.timezones;
		this.dateFormats = DateTimeFormatList.Options.list.dateFormats;
		this.timeFormats = DateTimeFormatList.Options.list.timeFormats;
		this.WeekDays = DateTimeFormatList.Options.list.WeekDays;
		this.pastDays = DateTimeFormatList.Options.list.pastDays;

		this.tinyMceSettings = CommonUtils.getTinymceSetting('general');
	}

	ngOnInit() {
		// Subscribe to update setting on changes

		this.getGeneralSettings(this._settingService.setting);
		this.roles = this._roleService.roles.data;

		// this.generalSettingForm.addControl('follow_us_content', this.follow_us_content); 

		// apply theme settings
		let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
		if (typeof themeData == 'string') {
			let currentData = JSON.parse(themeData);
			themeData = currentData[0];
		}
		this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };		
	}
	// create form of general setting 
	createSettingForm() {
		return this.fb.group({
			site_name: this.fb.control('', [Validators.required]),
			large_logo: this.fb.control(''),
			login_page_logo: this.fb.control(''),
			small_logo: this.fb.control(''),
			iPhone_iPad_Icon_logo : this.fb.control(''),
			iPhone_max_Icon_logo : this.fb.control(''),
			iPhone_40_Icon_logo : this.fb.control(''),
			iPhone_32_Icon_logo : this.fb.control(''),
			iPhone_57_Icon_logo : this.fb.control(''),
			iPhone_72_Icon_logo : this.fb.control(''),
			iPhone_114_Icon_logo : this.fb.control(''),
			iPhone_144_Icon_logo : this.fb.control(''),
			iPhone_Retina_Icon_file : this.fb.control(''),
			iPhone_iPad_Retina_Icon_logo : this.fb.control(''),
			fevicon_logo: this.fb.control(''),
			portal_logo: this.fb.control(''),
			Faviconlarge_logo : this.fb.control(''),
			iPhone_Icon_logo : this.fb.control(''),
			url: this.fb.control('', [Validators.required]),
			APP_TIMEZONE: this.fb.control(''),
			date_format: this.fb.control(''),
			time_format: this.fb.control(''),
			week_starts_on: this.fb.control('Sunday'),
			admin_email: this.fb.control('', [Validators.required]),
			is_contact_info: this.fb.control(''),
			contact_address: this.fb.control(''),
			email: this.fb.control(''),
			contact_number: this.fb.control(''),
			is_follow_us: this.fb.control(''),
			masking: this.fb.control(''),
			pastdays: this.fb.control(''),
			content_follow_name_facebook: this.fb.control(''),
			content_follow_url_facebook: this.fb.control(''),
			content_follow_name_twitter: this.fb.control(''),
			content_follow_url_twitter: this.fb.control(''),
			content_follow_name_instagram: this.fb.control(''),
			content_follow_url_instagram: this.fb.control(''),
			is_facebook_checked: this.fb.control(''),
			is_twitter_checked: this.fb.control(''),
			is_instagram_checked: this.fb.control(''),
			copyright_content: this.fb.control(''),
			kiosk_user: this.fb.control(''),
			dashboard_forms: this.fb.control(''),
			dashboard_forms_entries: this.fb.control(''),
			dashboard_user_updates: this.fb.control(''),
			dashboard_document: this.fb.control(''),
			dashboard_event_attendees: this.fb.control(''),
			dashboard_today_event: this.fb.control(''),

		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}



	getGeneralSettings(response) {
		// alert("first call")

		let exGeneral = response.settingsinfo.meta_value ? JSON.parse(response.settingsinfo.meta_value) : [];
		console.log("exgeneral setting", exGeneral);
		if (exGeneral.large_logo) {
			this.isLargeLogo = true;
			this.largeLogoURL = this.MEDIA_URL + exGeneral.large_logo;
		}

		if (exGeneral.login_page_logo) {
			this.isLargeLogoLogin = true;
			this.largeLoginLogoURL = this.MEDIA_URL + exGeneral.login_page_logo;
		}
		if (exGeneral.Faviconlarge_logo) {
			this.isFaviconLargeLogo = true;
			this.largeFaviconLogoURL =  exGeneral.Faviconlarge_logo;
		}
		if (exGeneral.iPhone_Icon_logo) {
			this.iPhone_Icon = true;
			this.iPhone_Icon_LogoURL =  exGeneral.iPhone_Icon_logo;
		}
		if (exGeneral.iPhone_max_Icon_logo) {
			this.iPhone_max_Icons = true;
			this.iPhone_max_Icon_LogoURL =  exGeneral.iPhone_max_Icon_logo;
		}
		if (exGeneral.iPhone_40_Icon_logo) {
			this.iPhone_40_Icons = true;
			this.iPhone_40_Icon_LogoURL =  exGeneral.iPhone_40_Icon_logo;
		}
		if (exGeneral.iPhone_32_Icon_logo) {
			this.iPhone_32_Icons = true;
			this.iPhone_32_Icon_LogoURL =  exGeneral.iPhone_32_Icon_logo;
		}
		if (exGeneral.iPhone_57_Icon_logo) {
			this.iPhone_57_Icons = true;
			this.iPhone_57_Icon_LogoURL =  exGeneral.iPhone_57_Icon_logo;
		}
		if (exGeneral.iPhone_72_Icon_logo) {
			this.iPhone_72_Icons = true;
			this.iPhone_72_Icon_LogoURL =  exGeneral.iPhone_72_Icon_logo;
		}
		if (exGeneral.iPhone_114_Icon_logo) {
			this.iPhone_114_Icons = true;
			this.iPhone_114_Icon_LogoURL =  exGeneral.iPhone_114_Icon_logo;
		}
		if (exGeneral.iPhone_144_Icon_logo) {
			this.iPhone_144_Icons = true;
			this.iPhone_144_Icon_LogoURL =  exGeneral.iPhone_144_Icon_logo;
		}
		console.log('fevicon_logo', exGeneral.fevicon_logo)
		if (exGeneral.fevicon_logo) {
			this.isFeviconLogo = true;
			this.feviconLogoURL = this.MEDIA_URL + exGeneral.fevicon_logo;
		}
		if (exGeneral.small_logo) {
			this.isSmallLogo = true;
			this.smallLogoURL = this.MEDIA_URL + exGeneral.small_logo;
		}
		if(exGeneral.iPhone_Retina_Icon_file){
			this.iPhone_Retina_Icon =true;
			this.iPhone_Retina_Icon_LogoURL = exGeneral.iPhone_Retina_Icon_file
		}
		if(exGeneral.iPhone_iPad_Icon_logo){
			this.iPhone_iPad_Icons =true;
			this.iPhone_iPad_Icon_LogoURL = exGeneral.iPhone_iPad_Icon_logo
		}
		if(exGeneral.iPhone_iPad_Retina_Icon_logo){
			this.iPhone_iPad_Retina_Icon=true;
			this.iPhone_iPad_Retina_Icon_LogoURL = exGeneral.iPhone_iPad_Retina_Icon_logo
		}
		
		if (exGeneral.portal_logo) {
			this.isPortalLogo = true;
			this.portalLogoURL = this.MEDIA_URL + exGeneral.portal_logo;
		}
		// let roles = response.settingsinfo.meta_value.map(function (role) {
		// 	return role.role_id;
		// });
		this.socialChecked = exGeneral.is_follow_us == 'Y' ? true : false;
		this.contactChecked = exGeneral.is_contact_info == 'Y' ? true : false;
		this.maskChecked = exGeneral.masking == 'Y' ? true : false;

		this.facebook = exGeneral.is_facebook_checked == 'Y' ? true : false;

		this.twitter = exGeneral.is_twitter_checked == 'Y' ? true : false;

		this.instgram = exGeneral.is_instagram_checked == 'Y' ? true : false;


		this.generalSettingForm = this.fb.group({
			site_name: this.fb.control(exGeneral.site_name, [Validators.required]),
			large_logo: this.fb.control(exGeneral.large_logo),
			login_page_logo: this.fb.control(exGeneral.login_page_logo),
			Faviconlarge_logo: this.fb.control(exGeneral.Faviconlarge_logo),
			iPhone_Icon_logo: this.fb.control(exGeneral.iPhone_Icon_logo),
			iPhone_max_Icon_logo: this.fb.control(exGeneral.iPhone_max_Icon_logo),
			iPhone_40_Icon_logo: this.fb.control(exGeneral.iPhone_40_Icon_logo),
			iPhone_32_Icon_logo: this.fb.control(exGeneral.iPhone_32_Icon_logo),
			iPhone_57_Icon_logo: this.fb.control(exGeneral.iPhone_57_Icon_logo),
			iPhone_72_Icon_logo: this.fb.control(exGeneral.iPhone_72_Icon_logo),
			iPhone_114_Icon_logo: this.fb.control(exGeneral.iPhone_114_Icon_logo),
			iPhone_144_Icon_logo: this.fb.control(exGeneral.iPhone_144_Icon_logo),
			iPhone_iPad_Retina_Icon_logo : this.fb.control(exGeneral.iPhone_iPad_Retina_Icon_logo),
			small_logo: this.fb.control(exGeneral.small_logo),
			iPhone_Retina_Icon_file : this.fb.control(exGeneral.iPhone_Retina_Icon_file),
			iPhone_iPad_Icon_logo : this.fb.control(exGeneral.iPhone_iPad_Icon_logo),
			fevicon_logo: this.fb.control(exGeneral.fevicon_logo),
			portal_logo: this.fb.control(exGeneral.portal_logo),
			url: this.fb.control(exGeneral.url, [Validators.required]),
			APP_TIMEZONE: this.fb.control(exGeneral.APP_TIMEZONE, [Validators.required]),
			date_format: this.fb.control(exGeneral.date_format),
			time_format: this.fb.control(exGeneral.time_format),
			week_starts_on: this.fb.control(exGeneral.week_starts_on, [Validators.required]),
			admin_email: this.fb.control(exGeneral.admin_email),
			is_contact_info: this.fb.control(this.contactChecked, [Validators.required]),
			contact_address: this.fb.control(exGeneral.contact_address),
			email: this.fb.control(exGeneral.email),
			contact_number: this.fb.control(exGeneral.contact_number),
			is_follow_us: this.fb.control(this.socialChecked, [Validators.required]),
			masking: this.fb.control(this.maskChecked, [Validators.required]),
			pastdays: this.fb.control(exGeneral.pastdays),
			kiosk_user: exGeneral.kiosk_user ? this.fb.control(exGeneral.kiosk_user.split(',').map(Number)) : this.fb.control(''),
			autopopulate: exGeneral.autopopulate ? this.fb.control(exGeneral.autopopulate.split(',').map(Number)) : this.fb.control(''),
			adminaccess: exGeneral.adminaccess ? this.fb.control(exGeneral.adminaccess.split(',').map(Number)) : this.fb.control(''),
			dashboard_forms: exGeneral.dashboard_forms ? this.fb.control(exGeneral.dashboard_forms.split(',').map(Number)) : this.fb.control(''),
			dashboard_forms_entries: exGeneral.dashboard_forms_entries ? this.fb.control(exGeneral.dashboard_forms_entries.split(',').map(Number)) : this.fb.control(''),
			dashboard_user_updates: exGeneral.dashboard_user_updates ? this.fb.control(exGeneral.dashboard_user_updates.split(',').map(Number)) : this.fb.control(''),
			dashboard_document: exGeneral.dashboard_document ? this.fb.control(exGeneral.dashboard_document.split(',').map(Number)) : this.fb.control(''),
			dashboard_event_attendees: exGeneral.dashboard_event_attendees ? this.fb.control(exGeneral.dashboard_event_attendees.split(',').map(Number)) : this.fb.control(''),
			dashboard_today_event: exGeneral.dashboard_today_event ? this.fb.control(exGeneral.dashboard_today_event.split(',').map(Number)) : this.fb.control(''),
			content_follow_name_facebook: this.fb.control(exGeneral.content_follow_name_facebook),
			content_follow_url_facebook: this.fb.control(exGeneral.content_follow_url_facebook),
			content_follow_name_twitter: this.fb.control(exGeneral.content_follow_name_twitter),
			content_follow_url_twitter: this.fb.control(exGeneral.content_follow_url_twitter),
			content_follow_name_instagram: this.fb.control(exGeneral.content_follow_name_instagram),
			content_follow_url_instagram: this.fb.control(exGeneral.content_follow_url_instagram),
			// content_follow_name_facebook : this.fb.control('facebook'),
			// content_follow_url_facebook : this.fb.control('https://www.facebook.com'),
			// content_follow_name_twitter : this.fb.control('twitter'),
			// content_follow_url_twitter : this.fb.control('https://twitter.com'),
			// content_follow_name_instagram : this.fb.control('Instagram'),
			// content_follow_url_instagram : this.fb.control('https://www.instagram.com'),
			is_facebook_checked: this.fb.control(this.facebook),
			is_twitter_checked: this.fb.control(this.twitter),
			is_instagram_checked: this.fb.control(this.instgram),
			copyright_content: this.fb.control(exGeneral.copyright_content),
		});
		//this.generalSettingForm.get('autopopulate').setValue(roles);


	}

	logoPreview(event: any, files, type) {
		if (files.length === 0)
			return;

		var mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			let message = "Only images are supported.";
			if (type == 'login') {
				this.largeLoginLogoMessage = message;
			}
			if (type == 'Large') {
				this.largeLogoMessage = message;
			}
			if (type == 'FaviconLarge') {
				this.FaviconlargeLogoMessage = message;
			}
			if (type == 'iPhone_Icon') {
				this.iPhone_IconLogoMessage = message;
			}
			
			if(type=='iPhone_Retina_Icon'){
			this.iPhone_Retina_IconLogoMessage = message;
			}
			if(type=='iPhone_ipad_Icon'){
				this.iPhone_iPad_IconLogoMessage = message;
			}
			if(type=='iPhone_max_Icon'){
				this.iPhone_max_IconLogoMessage = message;
			}
			if(type=='iPhone_40_Icon'){
				this.iPhone_40_IconLogoMessage = message;
			}
			if(type=='iPhone_32_Icon'){
				this.iPhone_32_IconLogoMessage = message;
			}
			if(type=='iPhone_57_Icon'){
				this.iPhone_57_IconLogoMessage = message;
			}
			if(type=='iPhone_114_Icon'){
				this.iPhone_114_IconLogoMessage = message;
			}
			if(type=='iPhone_144_Icon'){
				this.iPhone_144_IconLogoMessage = message;
			}
			if(type=='iPhone_iPad_Retina_Icon'){
				this.iPhone_iPad_Retina_IconLogoMessage = message;
			}
		
			if (type == 'small') {
				this.smallLogoMessage = message;
			}
			if (type == 'Fevicon') {
				this.feviconLogoMessage = message;
			}
			if (type == 'Portal') {
				this.feviconLogoMessage = message;
			}
			

			return;
		}

		let LogoImg = new FormData();
		LogoImg.append('type', 'logo');
		LogoImg.append('image', event.target.files[0]);

		this._settingService.uploadMedia(LogoImg)
			.then(response => {
				if (response.status == 200) {
					if (type == 'Large') {
						this.largeLogoURL = this.MEDIA_URL + response.media;
						this.isLargeLogo = true;
						this.generalSettingForm.get('large_logo').setValue(response.media);
					}
					if (type == 'FaviconLarge') {
						this.largeFaviconLogoURL = this.MEDIA_URL + response.media;
						this.isFaviconLargeLogo = true;
						this.generalSettingForm.get('Faviconlarge_logo').setValue(this.MEDIA_URL + response.media);
					}
					if (type == 'iPhone_Icon') {
						this.iPhone_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.iPhone_Icon = true;
						this.generalSettingForm.get('iPhone_Icon_logo').setValue(this.MEDIA_URL + response.media);
					}
					if(type == 'iPhone_iPad_Icon'){
						
						this.iPhone_iPad_Icons = true;
						this.iPhone_iPad_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_iPad_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_max_Icon'){
						
						this.iPhone_max_Icons = true;
						this.iPhone_max_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_max_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_40_Icon'){
						
						this.iPhone_40_Icons = true;
						this.iPhone_40_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_40_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_32_Icon'){
						
						this.iPhone_32_Icons = true;
						this.iPhone_32_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_32_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_57_Icon'){
						
						this.iPhone_57_Icons = true;
						this.iPhone_57_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_57_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_72_Icon'){
						
						this.iPhone_72_Icons = true;
						this.iPhone_72_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_72_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_114_Icon'){
						
						this.iPhone_114_Icons = true;
						this.iPhone_114_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_114_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_144_Icon'){
						
						this.iPhone_144_Icons = true;
						this.iPhone_144_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_144_Icon_logo').setValue(this.MEDIA_URL + response.media);
					
					}
					if(type == 'iPhone_iPad_Retina_Icon'){
						this.iPhone_iPad_Retina_Icon = true;
						this.iPhone_iPad_Retina_Icon_LogoURL = this.MEDIA_URL + response.media;
						this.generalSettingForm.get('iPhone_iPad_Retina_Icon_logo').setValue(this.MEDIA_URL + response.media);
					}
					if (type == 'login') {
						this.largeLoginLogoURL = this.MEDIA_URL + response.media;
						this.isLargeLogoLogin = true;
						this.generalSettingForm.get('login_page_logo').setValue(response.media);
					}
					if (type == 'Small') {
						this.smallLogoURL = this.MEDIA_URL + response.media;
						this.isSmallLogo = true;
						this.generalSettingForm.get('small_logo').setValue(response.media);
					}
					if(type=='iPhone_Retina_Icon'){
						this.iPhone_Retina_Icon_LogoURL =this.MEDIA_URL + response.media;
						this.iPhone_Retina_Icon =true;
						this.generalSettingForm.get('iPhone_Retina_Icon_file').setValue(this.MEDIA_URL + response.media);
					}
					if (type == 'Fevicon') {
						this.feviconLogoURL = this.MEDIA_URL + response.media;
						this.isFeviconLogo = true;
						this.generalSettingForm.get('fevicon_logo').setValue(response.media);
					}
					if (type == 'Portal') {
						this.portalLogoURL = this.MEDIA_URL + response.media;
						this.isPortalLogo = true;
						this.generalSettingForm.get('portal_logo').setValue(response.media);
					}
					// Show the success message
					this._matSnackBar.open(type + ' ' + 'logo is added successfully !', 'Success', {
						verticalPosition: 'top',
						duration: 2000
					});
				}
				else {
					if (type == 'Large') {
						this.generalSettingForm.get('large_logo').setValue('');
					}
					if (type == 'login') {
						this.generalSettingForm.get('login_page_logo').setValue('');
					}
					if (type == 'Mobile') {
						this.generalSettingForm.get('small_logo').setValue('');
					}
					if (type == 'Fevicon') {
						this.generalSettingForm.get('fevicon_logo').setValue('');
					}
					if (type == 'iPhone_Icon') {
						this.generalSettingForm.get('iPhone_Icon_logo').setValue('');
					}
					if(type == 'iPhone_max_Icon'){						
						
						this.generalSettingForm.get('iPhone_max_Icon_logo').setValue('');
					
					}
					if(type == 'iPhone_40_Icon'){						
						
						this.generalSettingForm.get('iPhone_40_Icon_logo').setValue('');
					
					}
					if(type == 'iPhone_32_Icon'){						
						
						this.generalSettingForm.get('iPhone_32_Icon_logo').setValue('');
					
					}
					if(type == 'iPhone_57_Icon'){						
						
						this.generalSettingForm.get('iPhone_57_Icon_logo').setValue('');
					
					}
					if(type == 'iPhone_72_Icon'){						
						
						this.generalSettingForm.get('iPhone_72_Icon_logo').setValue('');
					
					}
					if(type == 'iPhone_114_Icon'){						
						
						this.generalSettingForm.get('iPhone_114_Icon_logo').setValue('');
					
					}
					if(type == 'iPhone_144_Icon'){						
						
						this.generalSettingForm.get('iPhone_144_Icon_logo').setValue('');
					
					}
					if(type == 'iPhone_iPad_Icon'){
						this.generalSettingForm.get('iPhone_iPad_Icon_logo').setValue('');
					
					}
					if(type=='iPhone_Retina_Icon'){
						this.generalSettingForm.get('iPhone_Retina_Icon_file').setValue('');
					}
					if(type == 'iPhone_iPad_Retina_Icon'){
						
						this.generalSettingForm.get('iPhone_iPad_Retina_Icon_logo').setValue('');
					}
					if (type == 'FaviconLarge') {
						this.generalSettingForm.get('Faviconlarge_logo').setValue('');
					}
					if (type == 'Portal') {
						this.generalSettingForm.get('portal_logo').setValue('');
					}
					// Show the error message
					this._matSnackBar.open(type + 'logo is not added ! !', 'Error', {
						verticalPosition: 'top',
						duration: 2000
					});
				}
			},
				error => this.errorMsg = error);
	}

	removeLogo(type) {
		if (type == 'large') {
			this.largeLogoURL = '';
			this.isLargeLogo = false;
			this.generalSettingForm.get('large_logo').setValue('');
		}
		if (type == 'login') {
			this.largeLoginLogoURL = '';
			this.isLargeLogoLogin = false;
			this.generalSettingForm.get('login_page_logo').setValue('');
		}
		else if (type == 'mobile') {
			this.smallLogoURL = '';
			this.isSmallLogo = false;
			this.generalSettingForm.get('small_logo').setValue('');
		}
		else if (type == 'iPhone_Icon') {
			this.iPhone_Icon_LogoURL = '';
			this.iPhone_Icon = false;
			this.generalSettingForm.get('iPhone_Icon_logo').setValue('');
		}
		else 	if(type == 'iPhone_iPad_Icon'){
						
			this.iPhone_iPad_Icons =false;
			this.iPhone_iPad_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_iPad_Icon_logo').setValue('');
		
		}else if(type == 'iPhone_max_Icon'){
						
			this.iPhone_max_Icons = false;
			this.iPhone_max_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_max_Icon_logo').setValue('');
		
		}
		else if(type == 'iPhone_40_Icon'){
						
			this.iPhone_40_Icons = false;
			this.iPhone_40_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_40_Icon_logo').setValue('');
		
		}
		else if(type == 'iPhone_32_Icon'){
						
			this.iPhone_32_Icons = false;
			this.iPhone_32_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_32_Icon_logo').setValue('');
		
		}
		else if(type == 'iPhone_57_Icon'){
						
			this.iPhone_57_Icons = false;
			this.iPhone_57_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_57_Icon_logo').setValue('');
		
		}
		else if(type == 'iPhone_72_Icon'){
						
			this.iPhone_72_Icons = false;
			this.iPhone_72_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_72_Icon_logo').setValue('');
		
		}
		else if(type == 'iPhone_114_Icon'){
						
			this.iPhone_114_Icons = false;
			this.iPhone_114_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_114_Icon_logo').setValue('');
		
		}
		else if(type == 'iPhone_144_Icon'){
						
			this.iPhone_144_Icons = false;
			this.iPhone_144_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_144_Icon_logo').setValue('');
		
		}
		else 	if(type=='iPhone_Retina_Icon'){
			this.iPhone_Retina_Icon_LogoURL =''
			this.iPhone_Retina_Icon =false;
			this.generalSettingForm.get('iPhone_Retina_Icon_file').setValue('');
		}
		else 	if(type == 'iPhone_iPad_Retina_Icon'){
			this.iPhone_iPad_Retina_Icon = false;
			this.iPhone_iPad_Retina_Icon_LogoURL = '';
			this.generalSettingForm.get('iPhone_iPad_Retina_Icon_logo').setValue('');
		}
		else if (type == 'fevicon') {
			this.feviconLogoURL = '';
			this.isFeviconLogo = false;
			this.generalSettingForm.get('fevicon_logo').setValue('');
		}
		else if (type == 'FaviconLarge') {
			this.largeFaviconLogoURL = '';
			this.isFaviconLargeLogo = false;
			this.generalSettingForm.get('Faviconlarge_logo').setValue('');
		}
		else {
			this.portalLogoURL = '';
			this.isPortalLogo = false;
			this.generalSettingForm.get('portal_logo').setValue('');
		}
	}

	validatePhone(event: any) {
		const pattern = /[0-9\+\-]/;

		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	onSaveGeneralClick(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (this.generalSettingForm.valid) {

			this.isSubmit = true;
			let generalSettingData = this.generalSettingForm.value;

			generalSettingData.is_follow_us = generalSettingData.is_follow_us == true ? 'Y' : 'N';
			generalSettingData.is_contact_info = generalSettingData.is_contact_info == true ? 'Y' : 'N';
			generalSettingData.masking = generalSettingData.masking == true ? 'Y' : 'N';
			generalSettingData.is_facebook_checked = generalSettingData.is_facebook_checked == true ? 'Y' : 'N';
			generalSettingData.is_twitter_checked = generalSettingData.is_twitter_checked == true ? 'Y' : 'N';
			generalSettingData.is_instagram_checked = generalSettingData.is_instagram_checked == true ? 'Y' : 'N';
			generalSettingData.autopopulate = this._commonUtils.getArrayToString(generalSettingData.autopopulate);
			generalSettingData.adminaccess = this._commonUtils.getArrayToString(generalSettingData.adminaccess);
			generalSettingData.kiosk_user = this._commonUtils.getArrayToString(generalSettingData.kiosk_user);
			generalSettingData.dashboard_forms = this._commonUtils.getArrayToString(generalSettingData.dashboard_forms);
			generalSettingData.dashboard_forms_entries = this._commonUtils.getArrayToString(generalSettingData.dashboard_forms_entries);
			generalSettingData.dashboard_user_updates = this._commonUtils.getArrayToString(generalSettingData.dashboard_user_updates);
			generalSettingData.dashboard_document = this._commonUtils.getArrayToString(generalSettingData.dashboard_document);
			generalSettingData.dashboard_event_attendees = this._commonUtils.getArrayToString(generalSettingData.dashboard_event_attendees);
			generalSettingData.dashboard_today_event = this._commonUtils.getArrayToString(generalSettingData.dashboard_today_event);

			let saveData = { meta_type: 'S', meta_key: 'general_settings', meta_value: JSON.stringify(generalSettingData) };

			this._settingService.createSetting(saveData)
				.then(response => {
					this.isSubmit = false;
					if (response.status == 200) {
						// update local storage
						this._commonService.updateLocalStorageSettings('general_settings', generalSettingData);
						//Show the success message
						this._matSnackBar.open('General setting updated successfully !', 'Success', {
							verticalPosition: 'top', duration: 2000
						});
					}
				},
					error => console.log(error));
		}
		else {
			CommonUtils.validateAllFormFields(this.generalSettingForm)
		}
	}

	is_contact_infoChange(event) {
		if (event == false) {
			this.generalSettingForm.get('contact_address').clearValidators();
			this.generalSettingForm.get('email').clearValidators();
			this.generalSettingForm.get('contact_number').clearValidators();
		}
		if (event == true) {
			this.generalSettingForm.get('contact_address');
			this.generalSettingForm.get('email');
			this.generalSettingForm.get('contact_number');
		}
		this.generalSettingForm.get('contact_address').setValue('');
		this.generalSettingForm.get('email').setValue('');
		this.generalSettingForm.get('contact_number').setValue('');
		this.generalSettingForm.get('contact_address').updateValueAndValidity();
		this.generalSettingForm.get('email').updateValueAndValidity();
		this.generalSettingForm.get('contact_number').updateValueAndValidity();
	}
	is_follow_usChange(social: any) {

	}

}

