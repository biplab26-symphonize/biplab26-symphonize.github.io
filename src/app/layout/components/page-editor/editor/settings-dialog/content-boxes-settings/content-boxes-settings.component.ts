import { Component, OnInit, Input, Output,EventEmitter, Inject, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonUtils } from 'app/_helpers';
import { MenusService } from 'app/_services';
import { MediaComponent } from 'app/layout/components/page-editor/media/media.component';
//UI Icons List
import { IconsComponent } from 'app/layout/components/icons/icons.component';

@Component({
  selector: 'app-content-boxes-settings',
  templateUrl: './content-boxes-settings.component.html',
  styleUrls: ['./content-boxes-settings.component.scss']
})
export class ContentBoxesSettingsComponent implements OnInit {

  iconsDialogref: MatDialogRef<IconsComponent>; //EXTRA Changes  
  public tinyMceSettings  = {};
  menusList               : any[]=[]; 
  quicklinksJson          : any[]=[]; 
  mediaDialogref          : MatDialogRef<MediaComponent>;
  boxSettingsDialogref    : MatDialogRef<any>;
  contentSettingsForm     : FormGroup;
  boxSettingsForm         : FormGroup;
  currentIndex            : number; 
  pageOptions             : any;
  @ViewChild('boxSettingsDialog', { static: true }) boxSettingsDialog: TemplateRef<any>; 
  
  constructor(
    private _formBuilder:FormBuilder,
    public _matDialog: MatDialog,
    public _menuService: MenusService,
    public dialogRef: MatDialogRef<ContentBoxesSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.tinyMceSettings = CommonUtils.getTinymceSetting('content');
  }

  ngOnInit() {
    this.getMenusList();
    this.currentIndex     = this.dialogData.currentIndex;  
    this.pageOptions      = this.dialogData.pageOptions;  
    
    this.contentSettingsForm = this._formBuilder.group({
        type                  : ['quicklinks'],
        boxlayout				      : ['icon-with-title'],
        columns					      : ['1'],
        titlesize				      : [''],
        headingsize				    : ['h2'],
        titlecolor				    : [this.pageOptions.contentboxparams.defaultcolors.title],
        bodycolor				      : [this.pageOptions.contentboxparams.defaultcolors.body],
        boxbgcolor				    : [this.pageOptions.contentboxparams.defaultcolors.boxbg],
        icon					        : [''],
        flipicon				      : ['N'],
        rotateicon				    : ['0'],
        spinicon				      : ['N'],
        iconcolor				      : [this.pageOptions.contentboxparams.defaultcolors.icon],
        iconbg					      : ['N'],
        iconbgcolor				    : [this.pageOptions.contentboxparams.defaultcolors.iconbg],
        iconbgradius			    : [''],
        iconinnerborder			  : [''],
        iconinnerbordercolor	: [this.pageOptions.contentboxparams.defaultcolors.iconbg],
        iconouterborder			  : [''],
        iconouterbordercolor	: [this.pageOptions.contentboxparams.defaultcolors.iconbg],
        iconsize				      : [''],
        iconhover				      : ['none'],
        iconhovercolor			  : [this.pageOptions.contentboxparams.defaultcolors.iconhover],
        iconcustomimg			    : [''],	
        iconcustomimgwidth		: [''],	
        iconcustomimgheight   : [''],	
        link_target				    : ['_self'],
        iconposition			    : ['L'],	
        margintop					    : [''],
        marginbottom					: [''],
        visiblity				      : ['large-visiblity'],
        cssclass				      : [''],
        cssid					        : [''],
        quicklinks            : [this.quicklinksJson]
    });
    //Box Settings FormGroup
    this.boxSettingsForm = this._formBuilder.group({
      title				          : [''],
      boxbgcolor		        : [this.pageOptions.contentboxparams.defaultcolors.boxbg],
      icon					        : [''],
      flipicon				      : ['N'],
      rotateicon				    : ['0'],
      spinicon				      : ['N'],
      iconcolor			        : [this.pageOptions.contentboxparams.defaultcolors.icon],
      iconbgcolor		        : [this.pageOptions.contentboxparams.defaultcolors.iconbg],
      iconinnerborder			  : [''],
      iconinnerbordercolor	: [this.pageOptions.contentboxparams.defaultcolors.iconbg],
      iconouterborder			  : [''],
      iconouterbordercolor	: [this.pageOptions.contentboxparams.defaultcolors.iconbg],
      iconcustomimg	        : [''],
      iconcustomimgwidth    : [''],	
      iconcustomimgheight   : [''],	
      link_type             : ['C'], 	
      link_url              : [''],
      content               : ['']
    }); 

    //Edit Data Patch With Form
    if(this.dialogData.elementData){
      this.patchFormValues();
    }
  }
  patchFormValues(){
    this.contentSettingsForm.patchValue(this.dialogData.elementData);
    //Patch quicklinkJson Array
    if(this.dialogData.elementData.quicklinks){
      this.quicklinksJson = [...this.dialogData.elementData.quicklinks];
    }
  }
  /** SELECT MENU ICONS APPEAR WITH TITLE */
  selectMenuIcon(formGroup:string='contentSettingsForm'){
    this.iconsDialogref = this._matDialog.open(IconsComponent, {
      disableClose: false,
      data:{type:'fontawesome'}
  });        
  this.iconsDialogref.afterClosed()
      .subscribe(result => {
          if ( result ) {
            if(formGroup=='contentSettingsForm'){
              this.contentSettingsForm.get('icon').setValue(result);
            }
            else{
              this.boxSettingsForm.get('icon').setValue(result);
            }
            
          }
      });    
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
    if(fieldInfo.group=='boxSettingsForm'){
      this.boxSettingsForm.get(fieldInfo.type).setValue(fieldInfo.url);
    }
    else{
      this.contentSettingsForm.get(fieldInfo.type).setValue(fieldInfo.url);
    }
  }

  ResetField(fieldInfo:any){
    if(fieldInfo.group=='boxSettingsForm'){
      this.boxSettingsForm.get(fieldInfo.type).reset();
    }
    else{
      this.contentSettingsForm.get(fieldInfo.type).reset();
    }
  }
  //DEFAUTL JSON OF QUIKCLINK BOX
  pushContentBoxDefaultJson(){
    this.quicklinksJson.push(this.pageOptions.contentboxparams.deafaultcontentjson);
    this.contentSettingsForm.get('quicklinks').setValue(this.quicklinksJson);
  }
  //COPY CONTENT BOX
  copyContentBox(cboxindex:number){
    let copiedBox = JSON.parse(JSON.stringify(this.quicklinksJson[cboxindex]));
    this.quicklinksJson.push(copiedBox);
    this.contentSettingsForm.get('quicklinks').setValue(this.quicklinksJson);
  }
  removeContentBox(cboxindex:number){
    this.quicklinksJson.splice(cboxindex,1); 
    this.contentSettingsForm.get('quicklinks').setValue(this.quicklinksJson);
  }
  //OPEN BOX SETTINGS FIELDS
  openContentBoxSettings(quicklinkObj:any,index:number){
    //patchValue to boxSettingsForm
    this.patchBoxValue(quicklinkObj);

    this.boxSettingsDialogref = this._matDialog.open(this.boxSettingsDialog, {
      disableClose: false,
      panelClass: 'full-screen-dialog'
    });
    this.boxSettingsDialogref.afterClosed()
      .subscribe(result => {
          if ( result ){
            this.quicklinksJson[index] = result;
            console.log("this.quicklinksJson>>>",this.quicklinksJson);
            //this.contentSettingsForm.get('quicklinks').setValue(this.quicklinksJson);
          }
          this.boxSettingsDialogref = null;
    });
  }
  //PATHC BOX VALUE TO FORM
  patchBoxValue(boxObject){
    this.boxSettingsForm.patchValue(boxObject);
  }
  //SEND FORM VALUE TO COLUMN AREA
  sendContentSettingsInfo(event:any){
    this.dialogRef.close(this.contentSettingsForm.value); 
  }
  //SAVE BOX SETTINGS INFO INTO contentboxJson
  sendBoxSettingsInfo($event:any){
    this.boxSettingsDialogref.close(this.boxSettingsForm.value);
  }
}
