import { Component, OnInit } from '@angular/core';
import { SettingsService,CommonService, RolesService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  // Private
  private _unsubscribeAll: Subject<any>;
  importfieldsform: FormGroup;
  exportfieldsform: FormGroup;
  userSettings:any;
  FieldsArray: any = {
    coreFieldsArray:[],
    metaFieldsArray:[],
    savedImportFieldsArray:{
      corefields:[],
      metafields:[],
      userroles:''
    },
    savedExportFieldsArray:{
      corefields:[],
      metafields:[]
    }
  };
  RoleList: any;
  
  constructor( 
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar ,
    private _settingsService:SettingsService,
    private _commonService:CommonService,
    private _rolesService:RolesService
  ) {
    this._unsubscribeAll = new Subject();
    
  }

  ngOnInit() {
    this.RoleList         = this._rolesService.roles.data;  
    //Form Group
    this.setFormControls();
    //Get Fields Data On Load
    this.patchFieldsArray(this._commonService.usersettings);
  }
  /** define form group controls */
  setFormControls(){
    //Declare For fields
    this.importfieldsform = this._formBuilder.group({
      corefields    : [[],[Validators.required]],
      metafields    : [[],[Validators.required]],
      userroles     : ['',[Validators.required]],
    });
    //Export Fields Form
    this.exportfieldsform = this._formBuilder.group({
      corefields    : [[],[Validators.required]],
      metafields    : [[],[Validators.required]]
    });
  }
  /** Patch FieldsArray Values with Api Response */
  patchFieldsArray(fieldsData:any){
    this.FieldsArray.coreFieldsArray  = fieldsData.corefields ? fieldsData.corefields : [];
    this.FieldsArray.metaFieldsArray  = fieldsData.metafields ? fieldsData.metafields : [];
    this.FieldsArray.savedImportFieldsArray.corefields = fieldsData.savedimportfields ? fieldsData.savedimportfields.corefields : this.FieldsArray.savedImportFieldsArray.corefields;
    this.FieldsArray.savedImportFieldsArray.metafields = fieldsData.savedimportfields ? fieldsData.savedimportfields.metafields : this.FieldsArray.savedImportFieldsArray.metafields;
    this.FieldsArray.savedImportFieldsArray.userroles  = fieldsData.savedimportfields ? fieldsData.savedimportfields.roleid : this.FieldsArray.savedImportFieldsArray.userroles;
    //Export Fields
    this.FieldsArray.savedExportFieldsArray.corefields = fieldsData.savedexportfields ? fieldsData.savedexportfields.corefields : this.FieldsArray.savedExportFieldsArray.coreFields;
    this.FieldsArray.savedExportFieldsArray.metafields = fieldsData.savedexportfields ? fieldsData.savedexportfields.metafields : this.FieldsArray.savedExportFieldsArray.metaFields;

    //PatchValues To Form
    this.fillFormValues();
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(){
    //Import fields Values
    this.importfieldsform.patchValue(this.FieldsArray.savedImportFieldsArray);
    //Export fields values
    this.exportfieldsform.patchValue(this.FieldsArray.savedExportFieldsArray);  
  }
  
  /**SAVE IMPORT FIELDS DATA */
  onImportSubmit(formData: any){
    event.preventDefault();
    event.stopPropagation();
    if(this.importfieldsform.valid){
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.importfieldsform.value,'userimportfields',this.FieldsArray);
      let Settingjson      = {'meta_type': 'U','meta_key': 'userimportfields','meta_value' : JsonFormatValues}
      this._settingsService.createSetting(Settingjson)
      .then(response =>
        {
          if(response.status==200){
            this.showSnackBar(response.message,'CLOSE');
          }
          else{
            this.showSnackBar(response.message,'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message,'CLOSE');
        });
            
    }
  }
  /** ON EXPORT SUBMIT DATA */
  onExportSubmit(formData: any){
    event.preventDefault();
    event.stopPropagation();
    if(this.exportfieldsform.valid){
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.exportfieldsform.value,'userexportfields',this.FieldsArray);
      let Settingjson      = {'meta_type': 'U','meta_key': 'userexportfields','meta_value' : JsonFormatValues}
      this._settingsService.createSetting(Settingjson)
      .then(response =>
        {
          if(response.status==200){
            this.showSnackBar(response.message,'CLOSE');
          }
          else{
            this.showSnackBar(response.message,'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message,'CLOSE');
        });
            
    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}
