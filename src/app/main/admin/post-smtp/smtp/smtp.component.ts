import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { RolesService, CommonService, SettingsService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SmtpComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public SmtpSettingForm: FormGroup;
  public SmtpSettingsData: any = [];

  constructor(private fb: FormBuilder,
    private _commonService: CommonService,
    private _matSnackBar: MatSnackBar,
    private _settingService: SettingsService,
  ) { }

  ngOnInit() {

    this.SmtpSettingForm = this.fb.group({
      driver: this.fb.control(''),
      host: this.fb.control(''),
      from_address: this.fb.control('', [Validators.required]),
      from_name: this.fb.control(''),
      Security: this.fb.control(''),
      Authentication: this.fb.control(''),
      encryption: this.fb.control(''),
      port: this.fb.control(''),
      username: this.fb.control(''),
      password: this.fb.control(''),
      replyto: this.fb.control(''),
      cc: this.fb.control(''),
      bcc: this.fb.control(''),
      to: this.fb.control(''),
      enable_logging: this.fb.control(''),
      maximum_transcript_size: this.fb.control(''),
      max_log_entries: this.fb.control(''),
      custom_headers: this.fb.control('')
    })
    this.patchValue(this._settingService.setting);

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

  patchValue(response) {
    console.log(response);
    let data = response.settingsinfo.meta_value.replace(/[\[\]]+/g, "");
    this.SmtpSettingsData = JSON.parse(data);
    console.log(this.SmtpSettingsData);
    this.SmtpSettingForm.patchValue(this.SmtpSettingsData);
  }


  onSaveFieldClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.SmtpSettingForm.valid) {
      let smtpSettingData = [];
      smtpSettingData.push(this.SmtpSettingForm.value);
      let saveData = { meta_type: 'S', meta_key: 'SMTP_Settings', meta_value: JSON.stringify(smtpSettingData) };
      this._settingService.createSetting(saveData).then(response => {
        if (response.status == 200) {
          // update local storage
          this._commonService.updateLocalStorageSettings('SMTP_Settings', smtpSettingData);
          // Show the success message
          this._matSnackBar.open('SMTP settings added/updated successfully !', 'Success', {
            verticalPosition: 'top', duration: 2000
          });
        }
      },
        error => console.log(error));
    }
    else {
      CommonUtils.validateAllFormFields(this.SmtpSettingForm)
    }
  }

}
