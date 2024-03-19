import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CommonService, SettingsService } from 'app/_services';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  public FromSettings: FormGroup;


  constructor(
    private _commonService: CommonService,
    private fb: FormBuilder,
    private settingsservices: SettingsService,
    private _matSnackBar: MatSnackBar) { }

  ngOnInit() {

    this.FromSettings = this.fb.group({
      approved: this.fb.control('Approved'),
      submitted: this.fb.control('Submitted'),
      completed: this.fb.control('Completed'),
      pending: this.fb.control('Pending'),
      cancelled: this.fb.control('Cancelled'),
      denied: this.fb.control('Denied '),
      rejected: this.fb.control('Rejected')
    });

    let response = this.settingsservices.setting;
    this.patchValue(response)

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

  // settings patch value
  patchValue(data) {
    let settingdata = JSON.parse(data.settingsinfo.meta_value);
    this.FromSettings.patchValue(settingdata);
  }

  //  save the setting data
  SaveSettings() {
    let settingData = this.FromSettings.value
    let saveData = {
      meta_type: 'F',
      meta_key: 'form-settings',
      meta_value: JSON.stringify(settingData)
    };
    this.settingsservices.createSetting(saveData)
      .then(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
      },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration: 2000
          });
        });
  }

}
