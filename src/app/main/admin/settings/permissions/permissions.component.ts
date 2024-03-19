import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SettingsService, RolesService, OptionsList} from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { Settings } from 'app/_models';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PermissionsComponent implements OnInit {
  Roles:any             = [];
  PermissionsList:any   = [];
  assignedrolesList     = [];
  permissionactionList  = [];

  Checked : boolean     = false;
  isSubmit: boolean     = false;

  PermissionsSettingForm: FormGroup;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _formBuilder: FormBuilder,
    private _rolesService:RolesService,
    private _settingService : SettingsService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar    
  ) 
  {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Form Group
    this.setFormControls();
    //Pathc saved data to Form
    this.Roles =  this._rolesService.roles.data;
    this.permissionactionList = OptionsList.Options.permissionaction;
    this.getPermissionList({});
  }

  getPermissionList(value){
    this.assignedrolesList = [];
    this._settingService.getPermissions(value).subscribe(permissions=>{
      this.PermissionsList = permissions.permissioninfo.permissions || [];
      this.assignedrolesList = permissions.permissioninfo.assignedroles || [];
    })
  }

  // on change permission action
  onPermissionActionChange(event){
    this.getPermissionList({"type":event.value.toString()});
  }

  // on role change
  onRoleChange(event){
    
    this.assignedrolesList = [];
    this._settingService.getPermissions({"role_id":event.value}).subscribe(permissions=>{
      this.PermissionsList = permissions.permissioninfo.permissions || [];
      this.assignedrolesList = permissions.permissioninfo.assignedroles || [];
      if(this.assignedrolesList.length > 0){
        var Data = new Settings().deserialize(this.assignedrolesList,'permission');
        this.fillFormValues(Data);
      }
      else{
        this.PermissionsSettingForm.get('role_id').setValue(event.value);
        this.PermissionsSettingForm.get('permission').setValue([]);
      }
    });
  }

  /** define form group controls */
  setFormControls(){
    //Declare For fields
    this.PermissionsSettingForm = this._formBuilder.group({
        role_id : [[],Validators.required],
        permission : [[],Validators.required],
        permissionaction : [[]],     
    });
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(themeSettings:any){    
    this.PermissionsSettingForm.patchValue(themeSettings);
  }
  /** Save Settings */
  onSubmit(event:any){
    event.preventDefault();
    event.stopPropagation();
    
    if(this.PermissionsSettingForm.valid){
    
      let value = this.PermissionsSettingForm.value;
      this._settingService.createPermissions({"role_id":[value.role_id],"permission":value.permission}).subscribe(response=>{
        if(response.status == 200){
          this.showSnackBar(response.message,'SUCCESS');
        }
      },
      error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY');
     })
    }
    else{
      CommonUtils.validateAllFormFields(this.PermissionsSettingForm);
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

