import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SettingsService, AppConfig, CommonService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
  animations: fuseAnimations

})
export class ThemeComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  navigationBarBkColor: any;
  categories: any = [];
  Checked: boolean = false;
  backgroundSizes: any[] = ['cover', 'contain', 'initial', 'inherit'];
  backgroundRepeats: any[] = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'space', 'round', 'initial', 'inherit'];
  mediaUrl: string = AppConfig.Settings.url.mediaUrl;
  isSubmit: boolean = false;
  ThemeSettingForm: FormGroup;
  themeSettings: any = {};
  uploadInfo: any = { 'type': 'breadcumb', 'media_id': 0, 'formControlName': 'breadimage', 'url': "", 'apimediaUrl': 'media/upload' };
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _settingService: SettingsService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Form Group
    this.setFormControls();
    //Pathc saved data to Form
    this._settingService.getThemeSetting({ 'setting_name': 'themesettings' }).then(themeData => {
      if (themeData.themesettingsinfo && themeData.status == 200) {
        this.themeSettings = CommonUtils.getStringToJson(themeData.themesettingsinfo.setting_value);

        if (Array.isArray(this.themeSettings) && this.themeSettings.length > 0) {
          this.fillFormValues(this.themeSettings[0]);
        }
      }
    });

    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
  }

  /** define form group controls */
  setFormControls() {
    //Declare For fields
    // this.ThemeSettingForm = this._formBuilder.group({
    //   breadcumbsettings:this._formBuilder.group({
    //     navigation_bar_background_color        : [''],
    //     breadimage        : [''],
    //     breadimage        : [''],
    //     breadimage        : [''],
    //     breadimage        : [''],
    //     breadimage        : [''],
    //     breadimage        : [''],
    //     breadimage        : [''],
    //     breadbgheight     : ['120',Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    //   }),     
    //   layoutsettings:this._formBuilder.group({ 
    //     Layout_width      : ['fullwidth']
    //   })  
    // });
    this.ThemeSettingForm = this._formBuilder.group({
      //primary_color: this._formBuilder.control(''),
      //secondary_color: this._formBuilder.control(''),
      front_navigation_bar_background_color: this._formBuilder.control(''),
      admin_navigation_bar_background_color: this._formBuilder.control(''),
      admin_navigation_bar_font_color: this._formBuilder.control(''),
      vertical_bar_background_color: this._formBuilder.control(''),
      //vertical_bar_font_color: this._formBuilder.control(''),
      vertical_bar_icon_background_color: this._formBuilder.control(''),
      footer_background_color: this._formBuilder.control(''),
      copy_right_background_color: this._formBuilder.control(''),
      //font_size: this._formBuilder.control(''),
      button_font_size: this._formBuilder.control(''),
      button_font_color: this._formBuilder.control(''),
      // button_hover_color: this._formBuilder.control(''),
      button_background_color: this._formBuilder.control(''),
      table_header_background_color: this._formBuilder.control(''),
      table_font_color: this._formBuilder.control(''),
      table_font_size: this._formBuilder.control(''),
      //side_bar_activation_color: this._formBuilder.control(''),
      //login_page_background_color: this._formBuilder.control(''),
      //forgotpassword_page_background_color: this._formBuilder.control(''),
    });
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(themeSettings: any) {
    this.ThemeSettingForm.patchValue(themeSettings);
    //set breadcumb image
    // if(this.ThemeSettingForm.get(['breadcumbsettings','breadimage']).value){
    //   this.uploadInfo['url'] = this.mediaUrl + this.ThemeSettingForm.get(['breadcumbsettings','breadimage']).value;
    // }
  }

  /** SET MEDIA FIELD VALUE FROM EXTERNAL CPMNT */
  // setMediaFieldValue($event: any){
  //   if($event.uploadResponse){
  //     this.ThemeSettingForm.get(['breadcumbsettings',$event.formControlName]).setValue($event.uploadResponse.media.image || "");
  //   }
  //   else if($event.uploadResponse==''){
  //     this.ThemeSettingForm.get(['breadcumbsettings',$event.formControlName]).setValue("");
  //   }
  // }
  /** Save Settings */
  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.ThemeSettingForm.valid) {
      this.isSubmit = true;
      let Settingjson = { 'meta_type': 'S', 'setting_name': 'themesettings', 'setting_value': JSON.stringify([this.ThemeSettingForm.value]) }
      this._settingService.createThemesSetting(Settingjson)
        .then(data => {
          this.isSubmit = false;
          if (data.status == 200) {
            this.showSnackBar(data.message, 'CLOSE');
            //Update theme settings in localstrorage
            this._commonService.updateLocalStorageSettings('themesettings', this.ThemeSettingForm.value);
            let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
            if (typeof themeData == 'string') {
              let currentData = JSON.parse(themeData);
              themeData = currentData[0];
            }
            this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
            this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
            this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
          }
          else {
            this.showSnackBar(data.message, 'CLOSE');
          }
        },
          error => {
            // Show the error message
            this.isSubmit = false;
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          })
    }
  }


  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  //get Color code and assign to form field
  onColorChanged($event: Event, fieldName: string) {
    this.ThemeSettingForm.get('' + fieldName + '').setValue($event);
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
