import { Component, OnInit, Input, Output,EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MediaComponent } from 'app/layout/components/page-editor/media/media.component';
import { MenusService } from 'app/_services';
import { ValidateUrl } from 'app/_resolvers/url.validator';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsDialogComponent implements OnInit {

  mediaDialogref: MatDialogRef<MediaComponent>;
  pageSettingsForm   : FormGroup;
  currentIndex       : number; 
  pageOptions        : any;
  settingType        : string; 
  menusList          : any[]=[]; 
  containerData      : any;
  columnData         : any;
  editEntry          : boolean = false; 
  constructor(
    private _formBuilder:FormBuilder,
    public _matDialog: MatDialog,
    public _menuService: MenusService,
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  ngOnInit() {
    this.currentIndex   = this.dialogData.currentIndex;  
    this.pageOptions    = this.dialogData.pageOptions;  
    this.containerData  = this.dialogData.containerData;  
    this.columnData     = this.dialogData.columnData;  
    this.editEntry      = this.dialogData.editEntry;  
    this.settingType    = this.dialogData.type || 'container';  
    //IF SETTINGS TYPE = column
    if(this.settingType=='column'){
      this.getMenusList();
    }
    this.pageSettingsForm = this._formBuilder.group({
      general: this._formBuilder.group({
        type:[this.settingType],
        name:[''],
        hundred_percent:['Y'],
        hundred_percent_height:['Y'],
        hundred_percent_height_scroll:['Y'],
        hundred_percent_height_center_content:['Y'],
        columnspacing:[''],
        link_type:['C'],
        link_url:[''],
        link_target:['_self'],
        equal_height_columns:['Y'],
        menu_anchor:['',[ValidateUrl]],
        hide_on_mobile:['small-visibility'],
        status:['A'],
        cssclass:[''],
        cssid:['']
      }),
      background: this._formBuilder.group({
        bgcolor:['#000000'],
        bgimage:[''],
        bgvideo:['']
      }),
      design: this._formBuilder.group({
        bordersize:[''],
        margin:this._formBuilder.group({
          top:[''],
          bottom:[''],
        }),
        padding:this._formBuilder.group({
          top:[''],
          bottom:[''],
          left:[''],
          right:[''],
        }),
      })
    });

    if(this.editEntry==true && this.containerData.length>0){
      this.patchFormValues(this.containerData[0]);
    }
    else if(this.columnData!==undefined && this.columnData!==''){
      console.log("this.columnData>>>",this.columnData);
      this.patchFormValues(this.columnData);
    }

  }
  //PATCH DATA ON EDIT FORM
  patchFormValues(formInfo:any){
    this.pageSettingsForm.patchValue(formInfo);
  }
  /** OPEN CROPPPER DIALOG HERE */
  OpenMediaDialog(mediaInfo: any){
    this.mediaDialogref = this._matDialog.open(MediaComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:mediaInfo
  });
  this.mediaDialogref.afterClosed()
      .subscribe(result => {
          if ( result ){
            this.setMediaFieldValues(result);
          }
          this.mediaDialogref = null;
      });
  }

  //Set Media Field Value After Popup Closed
  setMediaFieldValues(fieldInfo:any){
    let groupName = this.pageSettingsForm.get(fieldInfo.group) as FormGroup;
    groupName.get(fieldInfo.type).setValue(fieldInfo.url);
  }

  ResetField(fieldInfo:any){
    let groupName = this.pageSettingsForm.get(fieldInfo.group) as FormGroup;
    groupName.get(fieldInfo.type).reset();
  }
  //SEND FORM VALUE TO CONTAINER/COLUMN AREA
  sendSettingsInfo(event:any){
    this.dialogRef.close({formData:this.pageSettingsForm.value,index:this.currentIndex}); 
  }
  //MENUS
  getMenusList(){
    setTimeout(() => {
      this._menuService.getMenusList({status:'A'}).subscribe(menuinfo=>{
        if(menuinfo.status==200){
          this.menusList = menuinfo.data || [];
        }
      });
    }, 0);
  }

}
