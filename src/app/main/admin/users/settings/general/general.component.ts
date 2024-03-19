import { Component, OnInit } from '@angular/core';
import { SettingsService, AppConfig, CommonService, RolesService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { Subject } from 'rxjs';
import { UserSettings } from 'app/_interface';
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  // Private
  private _unsubscribeAll: Subject<any>;
  public green_bg_header: any;
  public button: any;
  public accent: any;
  settingsform: FormGroup;
  generalSettings: UserSettings;
  mediaUrl: string = AppConfig.Settings.url.mediaUrl;
  defaultProfile: string = "";
  defaultCover: string = "";
  defaultAgeLimit: number = 0;
  defaultCharacterLimit: number = 10;
  allowChangeEmail: string = 'N';
  allowChat: string = 'N';
  domain_emails: string = 'N';
  restrict_form_roles: any[] = [];
  allowcardwatch: string = 'N';
  cardwatch: any;
  RoleList: any[] = [];
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'formControlName': 'defaultprofile', 'url': "", 'apimediaUrl': 'media/upload' },
    'cover': { 'type': 'defaultcover', 'media_id': 0, 'formControlName': 'defaultcover', 'url': "", 'apimediaUrl': 'media/upload' }
  };
  constructor(
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _settingsService: SettingsService,
    private _commonService: CommonService,
    private _rolesService: RolesService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.generalSettings = this._settingsService.setting ? CommonUtils.getStringToJson(this._settingsService.setting.settingsinfo.meta_value) : this.generalSettings;
    //set image urls to file-upload compoenents
    this.RoleList = this._rolesService.roles.data;
    this.defaultProfile = this.generalSettings.users_settings ? this.generalSettings.users_settings.defaultprofile : "";
    this.defaultCover = this.generalSettings.users_settings ? this.generalSettings.users_settings.defaultcover : "";
    this.defaultAgeLimit = this.generalSettings.users_settings ? this.generalSettings.users_settings.dob_limit : 0;
    this.defaultCharacterLimit = this.generalSettings.users_settings ? this.generalSettings.users_settings.biography_char_limit : 0;
    this.allowChangeEmail = this.generalSettings.users_settings ? this.generalSettings.users_settings.allow_change_email : 'N';
    this.allowChat = this.generalSettings.users_settings ? this.generalSettings.users_settings.allow_chat : 'N';
    this.domain_emails = this.generalSettings.users_settings ? this.generalSettings.users_settings.domain_emails : '';
    this.restrict_form_roles = this.generalSettings.users_settings ? this.generalSettings.users_settings.restrict_form_roles : [];
    this.cardwatch = JSON.parse(this._settingsService.setting.settingsinfo.meta_value);


    //Form Group
    this.setFormControls();

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }
  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.settingsform = this._formBuilder.group({
      defaultprofile: [''],
      defaultcover: [''],
      dob_limit: [0],
      biography_char_limit: [0],
      allow_change_email: ['N', [Validators.required]],
      allow_chat: ['N', [Validators.required]],
      domain_emails: [''],
      restrict_form_roles: [[]],
      cardwatch_settings: this._formBuilder.group({
        allow_card_watch: ['N'],
        consumer_key: ['D067DDA7-260C-4C8D-85AA-B59180A9D620'],
        consumer_secret: ['A08A222D-E29B-4E99-BE18-837E32A66282'],
        client_id: ['10100000038'],
        api_url: ['http://dev.cwposdev.com:8084/mobileapi/servoy-service/rest_ws/cdwapi/'],
        auth_token_param: ['authToken'],
        account_balance_param: ['balance'],
        customer_id: ['717'],
        transaction_param: ["transactions"],
        menu_item_param: ["menu"],
        menu_item_picture_param: ["itemPhoto"],
        location_list_param: ["locationList"]
      }),
      fullcount_settings: this._formBuilder.group({
        community_id: [''],
        client_id: [''],
        client_secret: [''],
        api_url: [''],
        plan_charge: [''],
        charge_details: ['']
      })
    });

    if (this.generalSettings) {
      this.fillFormValues();
    }
  }

  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    let data = this.generalSettings.users_settings;
    // this.settingsform.patchValue()

    this.settingsform.patchValue({ 'defaultprofile': this.defaultProfile, 'defaultcover': this.defaultCover, 'dob_limit': this.defaultAgeLimit, 'biography_char_limit': this.defaultCharacterLimit, 'allow_change_email': this.allowChangeEmail, 'allow_chat': this.allowChat, 'domain_emails': this.domain_emails, 'restrict_form_roles': this.restrict_form_roles });
    this.uploadInfo.avatar.url = this.defaultProfile ? AppConfig.Settings.url.mediaUrl + this.defaultProfile : "";
    this.uploadInfo.cover.url = this.defaultCover ? AppConfig.Settings.url.mediaUrl + this.defaultCover : "";

    // card watch settinges 
    this.settingsform.patchValue({ cardwatch_settings: { allow_card_watch: this.cardwatch.users_settings.cardwatch_settings.allow_card_watch } });
    this.settingsform.patchValue({ cardwatch_settings: { consumer_key: this.cardwatch.users_settings.cardwatch_settings.consumer_key } });
    this.settingsform.patchValue({ cardwatch_settings: { consumer_secret: this.cardwatch.users_settings.cardwatch_settings.consumer_secret } });
    this.settingsform.patchValue({ cardwatch_settings: { client_id: this.cardwatch.users_settings.cardwatch_settings.client_id } });
    this.settingsform.patchValue({ cardwatch_settings: { api_url: this.cardwatch.users_settings.cardwatch_settings.api_url } });
    this.settingsform.patchValue({ cardwatch_settings: { auth_token_param: this.cardwatch.users_settings.cardwatch_settings.auth_token_param } });
    this.settingsform.patchValue({ cardwatch_settings: { account_balance_param: this.cardwatch.users_settings.cardwatch_settings.account_balance_param } });
    this.settingsform.patchValue({ cardwatch_settings: { customer_id: this.cardwatch.users_settings.cardwatch_settings.customer_id } });
    this.settingsform.patchValue({ cardwatch_settings: { transaction_param: this.cardwatch.users_settings.cardwatch_settings.transaction_param } });
    this.settingsform.patchValue({ cardwatch_settings: { menu_item_param: this.cardwatch.users_settings.cardwatch_settings.menu_item_param } });
    this.settingsform.patchValue({ cardwatch_settings: { menu_item_picture_param: this.cardwatch.users_settings.cardwatch_settings.menu_item_picture_param } });
    this.settingsform.patchValue({ cardwatch_settings: { location_list_param: this.cardwatch.users_settings.cardwatch_settings.location_list_param } });

    this.settingsform.patchValue({ fullcount_settings: { community_id: this.cardwatch.users_settings.fullcount_settings.community_id } });
    this.settingsform.patchValue({ fullcount_settings: { client_id: this.cardwatch.users_settings.fullcount_settings.client_id } });
    this.settingsform.patchValue({ fullcount_settings: { client_secret: this.cardwatch.users_settings.fullcount_settings.client_secret } });
    this.settingsform.patchValue({ fullcount_settings: { api_url: this.cardwatch.users_settings.fullcount_settings.api_url } });
    this.settingsform.patchValue({ fullcount_settings: { plan_charge: this.cardwatch.users_settings.fullcount_settings.plan_charge } });
    this.settingsform.patchValue({ fullcount_settings: { charge_details: this.cardwatch.users_settings.fullcount_settings.charge_details } });

  }
  /** SET MEDIA FIELD VALUE FROM EXTERNAL CPMNT */
  setMediaFieldValue($event: any) {
    if ($event.uploadResponse) {
      this.settingsform.get($event.formControlName).setValue($event.uploadResponse.media.image || "");
    }
    else {
      this.settingsform.get($event.formControlName).setValue("");
      //Update LocalStorage Settings->users_settings
      this._commonService.updateLocalStorageSettings('users_settings', this.settingsform.value);
    }
  }
  /**SAVE FORM DATA */
  onSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.settingsform.valid) {
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'users_settings', 'meta_value': JSON.stringify({ 'users_settings': this.settingsform.value }) }
      this._settingsService.createSetting(Settingjson)
        .then(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
            //Update LocalStorage Settings->users_settings
            console.log(this.settingsform.value);
            this._commonService.updateLocalStorageSettings('users_settings', this.settingsform.value);
          }
          else {
            this.showSnackBar(response.message, 'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message, 'CLOSE');
        });

    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
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

}
