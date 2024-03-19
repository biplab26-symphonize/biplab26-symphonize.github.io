import { Component, OnInit, Input, Output,EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonUtils } from 'app/_helpers';
import { ValidateVideo } from 'app/_resolvers/video.validator';

@Component({
  selector: 'app-video-settings',
  templateUrl: './video-settings.component.html',
  styleUrls: ['./video-settings.component.scss']
})
export class VideoSettingsComponent implements OnInit {

  public tinyMceSettings  = {};
  videoSettingsForm       : FormGroup;
  currentIndex            : number; 
  pageOptions             : any[]=[];
  rulestyles              : any[]=[];
  visibilityOptions       : any[]=[];
  alignments              : any[]=[];
  
  constructor(
    private _formBuilder:FormBuilder,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<VideoSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.tinyMceSettings = CommonUtils.getTinymceSetting('replies');
  }

  ngOnInit() {
    this.currentIndex       = this.dialogData.currentIndex;  
    this.pageOptions        = this.dialogData.pageOptions;  
    this.visibilityOptions  = this.pageOptions['visibilityOptions'];
    this.alignments         = this.pageOptions['alignment'];
    this.videoSettingsForm  = this._formBuilder.group({
      type:['media'],
      videotype:['youtube'],
      videoid:['',[ValidateVideo]],
      alignment:['justify'],
      playerwidth:[''],
      playerheight:[''],
      autoplay:['Y'],
      apiparams:[''],
      visiblity:['large-visibility'],
      cssclass:[''],
      cssid:['']
    });
    //Edit Data Patch With Form
    if(this.dialogData.elementData){
      this.patchFormValues();
    }
  }
  patchFormValues(){
    this.videoSettingsForm.patchValue(this.dialogData.elementData);
  }
  validateNumber(event: any) {
    const pattern = /[0-9\+\-]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  //Disable json sort
  disableSort(){
    return 0;
  }
  //SEND FORM VALUE TO COLUMN AREA
  sendVideoSettingsInfo(event:any){
    this.dialogRef.close(this.videoSettingsForm.value); 
  }

}
