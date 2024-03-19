import { Component, OnInit, Input, Output,EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-text-settings',
  templateUrl: './text-settings.component.html',
  styleUrls: ['./text-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TextSettingsComponent implements OnInit {

  public tinyMceSettings  = {};
  textSettingsForm   : FormGroup;
  currentIndex       : number; 
  pageOptions        : any[]=[];
  rulestyles         : any[]=[];
  visibilityOptions   : any[]=[];
  public editElementData: any;
  constructor(
    private _formBuilder:FormBuilder,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<TextSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.tinyMceSettings = CommonUtils.getTinymceSetting('replies');
  }

  ngOnInit() {
    this.currentIndex     = this.dialogData.currentIndex;  
    this.pageOptions      = this.dialogData.pageOptions;  
    this.rulestyles       = this.pageOptions['rulestyles'];
    this.visibilityOptions = this.pageOptions['visibilityOptions'];
    this.textSettingsForm = this._formBuilder.group({
      type:['text'],
      columns:['1'],
      columnminwidth:[''],
      columnspacing:[''],
      borderstyle:[''],
      borderwidth :[''],
      bordercolor:['#000000'],
      content:['test data'],
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
    this.textSettingsForm.patchValue(this.dialogData.elementData);
  }
  validateNumber(event: any) {
    const pattern = /[0-9\+\-]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //SEND FORM VALUE TO COLUMN AREA
  sendTextSettingsInfo(event:any){
    this.dialogRef.close(this.textSettingsForm.value); 
  }
}
