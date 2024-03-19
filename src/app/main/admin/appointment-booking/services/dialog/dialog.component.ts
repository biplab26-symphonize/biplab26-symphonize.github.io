import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup, FormBuilder} from '@angular/forms';
import { CommonService } from 'app/_services';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public button: any;
  public serviceDialog: FormGroup;
  public Savedata        : any [];
  constructor(
    private _commonService: CommonService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef < DialogComponent >,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.setControls();
     // apply theme settings
     let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
     if (typeof themeData == 'string') {
         let currentData = JSON.parse(themeData);
         themeData = currentData[0];
     }     
     this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }   
  }
  setControls() {
    this.serviceDialog = this.fb.group({
      sendmail: this.fb.control(''),     
    });
  }
  onYesClick() {
    this.dialogRef.close('Y');
}

onNoClick(): void {
    this.dialogRef.close('N');
}
onClickCancel() {
  this.dialogRef.close('N');
  }
onSubmitRecBooking() {
  this.dialogRef.close(this.serviceDialog.value);
}
}

