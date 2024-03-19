import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { MatSnackBar } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { SettingsService, ActivitylogService, CommonService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: fuseAnimations
})
export class SettingsComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public addActivityLogSetting: FormGroup;
  public tinyMceSettings = {};
  readonly EDITOR_TAB = 4;
  public logChecked: boolean = false;

  constructor(private _commonService: CommonService,public _matDialog: MatDialog, private fb: FormBuilder, private _ActivityLogService: ActivitylogService, private _matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.setControls();
    this.tinyMceSettings = CommonUtils.getTinymceSetting();

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

  setControls() {
    this.addActivityLogSetting = this.fb.group({
      log_days: this.fb.control(''),
      log_enable: this.fb.control(''),
    });

    let response = this._ActivityLogService.activityLogSetting;
    this.getActivityLogSettingData(response);
  }

  getActivityLogSettingData(data) {
    let settingdata = JSON.parse(data.settingsinfo.meta_value);
    this.addActivityLogSetting.patchValue(settingdata);
    if (settingdata.log_enable == 'Y') {
      this.logChecked = true;
    } else {
      this.logChecked = false;
    }
  }
  onClickSave() {
    let value = this.addActivityLogSetting.value;
    value.log_enable = value.log_enable == true ? 'Y' : 'N';

    let saveData = { meta_type: 'S', meta_key: 'activity_log_settings', meta_value: JSON.stringify(value) };
    this._ActivityLogService.createActivityLogSetting(saveData)
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
  // resetDatabase2(){
  //   this._ActivityLogService.resetDatabase('log')
  //     .then(response => {
  //       this._matSnackBar.open(response.message, 'CLOSE', {
  //         verticalPosition: 'top',
  //         duration: 2000
  //       });
  //     },
  //       error => {
  //         // Show the error message
  //         this._matSnackBar.open(error.message, 'Retry', {
  //           verticalPosition: 'top',
  //           duration: 2000
  //         });
  //       });
  // }

  resetDatabase() {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want To Delete Reset Database ?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this._ActivityLogService.resetDatabase('log')
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
        this.confirmDialogRef = null;
      });
  }



}
