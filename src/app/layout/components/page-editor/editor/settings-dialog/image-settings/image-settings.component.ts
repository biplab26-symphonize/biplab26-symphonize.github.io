import { Component, OnInit, Input, Output,EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonUtils } from 'app/_helpers';
import { MenusService } from 'app/_services';
import { MediaComponent } from 'app/layout/components/page-editor/media/media.component';

@Component({
  selector: 'app-image-settings',
  templateUrl: './image-settings.component.html',
  styleUrls: ['./image-settings.component.scss']
})
export class ImageSettingsComponent implements OnInit {

  mediaDialogref: MatDialogRef<MediaComponent>;
  imageSettingsForm   : FormGroup;
  currentIndex        : number; 
  menusList           : any[]=[]; 
  pageOptions         : any;
  
  constructor(
    private _formBuilder:FormBuilder,
    public _matDialog: MatDialog,
    public _menuService: MenusService,
    public dialogRef: MatDialogRef<ImageSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
  }

  ngOnInit() {
    this.getMenusList();
    this.currentIndex      = this.dialogData.currentIndex;  
    this.pageOptions       = this.dialogData.pageOptions;  

    this.imageSettingsForm = this._formBuilder.group({
      type:['image'],
      imageurl:[''],
      maxwidth:[''],
      imagestyle:['none'],
      imagehover:['none'],
      borderwidth :[''],
      bordercolor:['#000000'],
      borderradius:[''],
      alignment:['justify'],
      imagealttext:[''],
      link_type:['C'],
      link_url:[''],
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
    this.imageSettingsForm.patchValue(this.dialogData.elementData);
  }
  validateNumber(event: any) {
    const pattern = /[0-9\+\-]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
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

  //Disable json sort
  disableSort(){
    return 0;
  }
  //Set Media Field Value After Popup Closed
  setMediaFieldValues(fieldInfo:any){
    this.imageSettingsForm.get(fieldInfo.type).setValue(fieldInfo.url);
  }

  ResetField(fieldInfo:any){
    this.imageSettingsForm.get(fieldInfo.type).reset();
  }
  //SEND FORM VALUE TO COLUMN AREA
  sendImageSettingsInfo(event:any){
    this.dialogRef.close(this.imageSettingsForm.value); 
  }
}
