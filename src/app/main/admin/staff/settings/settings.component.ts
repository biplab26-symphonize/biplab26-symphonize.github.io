import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { MatDialog,  MatSnackBar} from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SettingsService, RolesService, AppConfig, CommonService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { Settings } from 'app/_models/setting.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  roles_list: any = [];
  Checked: boolean = false;
  showprofileChecked: boolean = false;

  viewallChecked: boolean = false;
  mediaUrl: string = AppConfig.Settings.url.mediaUrl;
  staffSettings: any;

  SettingForm: FormGroup;
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'formControlName': 'defaultprofile', 'url': "", 'apimediaUrl': 'media/upload' },
  };

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private _formBuilder: FormBuilder,
    private _roleSetting: RolesService,
    private _settingService: SettingsService,
    private _commonService: CommonService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.roles_list = this._roleSetting.roles.data;
    console.log("this._roleSetting.roles.data", this._roleSetting.roles.data)
  }

  ngOnInit() {
    this.staffSettings = this._settingService.setting ? CommonUtils.getStringToJson(this._settingService.setting.settingsinfo.meta_value) : this.staffSettings;
    console.log("ngoninit staffsettings", this.staffSettings)
    //Form Group
    this.setFormControls();
    //Load Edit Form Values
    if (this.staffSettings) {
      this.fillFormValues();
    }

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
    this.SettingForm = this._formBuilder.group({
      defaultroleid: [0],
      defaultprofile: [''],
      showemptydepartment: ['N'],
      showprofile: [''],
      staff_name_sorting: [''],
      show_manager: [''],
      show_biography: ['N'],
      newest_staff: ['Y'],
      directoryview: ['tabs'],
      subtractdays: ['']
    });
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    let staffData = new Settings().deserialize(this.staffSettings, 'staff');
    this.SettingForm.patchValue(staffData);
    this.uploadInfo.avatar.url = staffData.defaultprofile ? AppConfig.Settings.url.mediaUrl + staffData.defaultprofile : "";
    this.Checked = staffData.showemptydepartment == "Y" ? true : false;
    this.showprofileChecked = staffData.showprofile == "Y" ? true : false;

  }

  /** SET MEDIA FIELD VALUE FROM EXTERNAL CPMNT */
  setMediaFieldValue($event: any) {
    if ($event.uploadResponse) {
      this.SettingForm.get($event.formControlName).setValue($event.uploadResponse.media.image || "");
    }
    else {
      this.SettingForm.get($event.formControlName).setValue("");
    }
  }

  /**SAVE FORM DATA */
  onSaveClick(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.SettingForm.valid) {
      //modify Post Values Before Send to Http
      let settingData = this.SettingForm.value;
      settingData.showemptydepartment = settingData.showemptydepartment == true ? "Y" : "N";
      settingData.showprofile = settingData.showprofile == true ? "Y" : "N";

      let Settingjson = { 'meta_type': 'S', 'meta_key': 'staff_settings', 'meta_value': JSON.stringify(settingData) }

      this._settingService.createSetting(Settingjson)
        .then(data => {
          if (data.status == 200) {
            this.showSnackBar("Staff Setting Updated Successfully", 'CLOSE');
            //Update LocalStorage Settings->staff_settings
            this._commonService.updateLocalStorageSettings('staff_settings', settingData);
          }
          else {
            this.showSnackBar(data.message, 'CLOSE');
          }
        },
          error => {
            // Show the error message
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
