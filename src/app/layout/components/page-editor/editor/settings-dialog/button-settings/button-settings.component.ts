import { Component, OnInit, Input, Output,EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MenusService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
//UI Icons List
import { IconsComponent } from 'app/layout/components/icons/icons.component';

@Component({
  selector: 'app-button-settings',
  templateUrl: './button-settings.component.html',
  styleUrls: ['./button-settings.component.scss']
})
export class ButtonSettingsComponent implements OnInit {

  iconsDialogref: MatDialogRef<IconsComponent>; //EXTRA Changes  
  public tinyMceSettings  = {};
  buttonSettingsForm      : FormGroup;
  currentIndex            : number; 
  menusList               : any[]=[]; 
  pageOptions             : any={};
  
  constructor(
    private _formBuilder:FormBuilder,
    public _matDialog: MatDialog,
    public _menuService: MenusService,
    public dialogRef: MatDialogRef<ButtonSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.tinyMceSettings = CommonUtils.getTinymceSetting('replies');
  }

  ngOnInit() {
    this.getMenusList();
    
    this.currentIndex       = this.dialogData.currentIndex;  
    this.pageOptions        = this.dialogData.pageOptions;  
    
    this.buttonSettingsForm  = this._formBuilder.group({
      type                  :['button'],
      link_type             :['C'],
      link_url              :[''],
      buttontext            :['Button Text'],
      texttransform         :['uppercase'],
      titleattr             :[''],
      link_target           :['_self'],
      alignment             :['justify'],
      visiblity             :['large-visibility'],
      cssclass              :[''],
      cssid                 :[''],
      buttonstyle           :['default'],
      gradienttop           :[this.pageOptions.buttonparams.defaultcolors.gradient],
      gradientbottom        :[this.pageOptions.buttonparams.defaultcolors.gradient],
      gradienttophover      :[this.pageOptions.buttonparams.defaultcolors.gradient],
      gradientbottomhover   :[this.pageOptions.buttonparams.defaultcolors.gradient],
      buttontextcolor       :[this.pageOptions.buttonparams.defaultcolors.color],
      buttontexthover       :[this.pageOptions.buttonparams.defaultcolors.hover],
      buttontype            :['flat'],
      borderwidth           :[''],
      buttonsize            :['small'],
      buttonspan            :['Y'],
      buttonshape           :['square'],
      icon                  :[''],
      iconposition          :['left'],
      icondivider           :['N']
    });
    //Edit Data Patch With Form
    if(this.dialogData.elementData){
      this.patchFormValues();
    }
  }
  patchFormValues(){
    this.buttonSettingsForm.patchValue(this.dialogData.elementData);
  }
  /** SELECT MENU ICONS APPEAR WITH TITLE */
  selectMenuIcon(){
    this.iconsDialogref = this._matDialog.open(IconsComponent, {
      disableClose: false,
      data:{type:'fontawesome'}
  });        
  this.iconsDialogref.afterClosed()
      .subscribe(result => {
          if ( result ) {
            this.buttonSettingsForm.get('icon').setValue(result);
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
  //SEND FORM VALUE TO COLUMN AREA
  sendButtonSettingsInfo(event:any){
    this.dialogRef.close(this.buttonSettingsForm.value); 
  }


}
