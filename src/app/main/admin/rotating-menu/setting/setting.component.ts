import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SettingsService, CategoryService, AppConfig, CommonService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class SettingComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  Checked: boolean = false;
  mediaUrl: string = AppConfig.Settings.url.mediaUrl;
  rotating_menu_settings: any;
  isSubmit: boolean = false;
  SettingForm: FormGroup;
  uploadInfo: any = {
    'defaultpdf': { 'type': 'defaultpdf', 'media_id': 0, 'formControlName': 'defaultpdf', 'url': "", 'apimediaUrl': 'media/defaultupload' },
  };

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _settingService: SettingsService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }

  ngOnInit() {
    this.rotating_menu_settings = this._settingService.setting ? CommonUtils.getStringToJson(this._settingService.setting.settingsinfo.meta_value) : this.rotating_menu_settings;
    this.rotating_menu_settings = this.rotating_menu_settings.length > 0 ? this.rotating_menu_settings[0] : {};
    //Form Group
    this.setFormControls();
    //Load Edit Form Values
    if (this.rotating_menu_settings) {
      this.fillFormValues();
    }

    // apply theme settings
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
    this.SettingForm = this._formBuilder.group({

      allowfileupload: ['Y'],
      maxpdfsize: [1, Validators.pattern("^[0-9]*$")],
      defaultpdf: [''],
      accesstime: [10, Validators.pattern("^[0-9]*$")]
    });
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    this.SettingForm.patchValue(this.rotating_menu_settings);
  }

  /** SET DEFAULT PDF URL */
  setDefaultPdf($event: any) {
    if ($event.uploadResponse) {
      this.SettingForm.get('defaultpdf').setValue($event.uploadResponse.upload);
    }
  }
  /** Save Settings */
  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.SettingForm.valid) {
      this.isSubmit = true;
      let Settingjson = { 'meta_type': 'D', 'meta_key': 'rotating_menu_settings', 'meta_value': JSON.stringify([this.SettingForm.value]) }
      this._settingService.createSetting(Settingjson)
        .then(data => {
          this.isSubmit = false;
          if (data.status == 200) {
            this.showSnackBar(data.message, 'CLOSE');
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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}