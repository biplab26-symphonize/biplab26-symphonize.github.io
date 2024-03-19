import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { MatDialog, MatSnackBar, MatDatepickerInputEvent } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, UsersService, CategoryService, StaffService, AppConfig, SettingsService, ChatService, AuthService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { User } from 'app/_models';
import { StaffmetaComponent } from '../staffmeta/staffmeta.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { TakeOverComponent } from '../../forms/add/take-over/take-over.component';
import { environment } from 'environments/environment';
import { EditRestrictionComponent } from '../../forms/add/edit-restriction/edit-restriction.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {

  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<any>>;

  public green_bg_header: any;
  public button: any;
  public accent: any;
  // minBirthdate: Date = new Date();
  isSubmit: boolean = false;
  editstaffForm: boolean = false;
  editUserId: number = 0;
  validEmailmsg: string = "Email is required!";
  departments: any = [];
  designations: any = [];
  userMeta: any = [];
  staffForm: FormGroup;
  StatusList: any;
  public url_id: any;
  public userId: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public MetaUploadInfo: any[] = [];
  @ViewChild(StaffmetaComponent, { static: true }) private usermeta: StaffmetaComponent;

  //public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public tinyMceSettings = {};
  uploadInfo: any = {
    'avatar': { 'type': 'avatar', 'media_id': 0, 'formControlName': 'avatar_media_id', 'url': "", 'apimediaUrl': 'media/userupload' }
  };
  // Private
  private _unsubscribeAll: Subject<any>;
  checkUsernameRes: any;
  staffSettings: any;
  _defaultAvatar: string;

  constructor(
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _commonService: CommonService,
    private _staffService: StaffService,
    private _usersService: UsersService,
    private _settingService: SettingsService,
    private _commonUtils: CommonUtils,
    private _categoryService: CategoryService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    // this.minBirthdate = this._commonService.setDatepickerAgeLimit();
    if (this.route.routeConfig.path == 'admin/staff/edit/:id' && this.route.params['value'].id > 0) {
      this.editUserId = this.route.params['value'].id;
      this.url_id = this.route.params['value'].id;
      this.editstaffForm = true;
    }

    this.departments = this._commonUtils.getFormatElementofDepartment(this._categoryService.DepartmentList.data);
    //this.designations = this._categoryService.Categorys.data;
    this._categoryService.getCategorys({ 'category_type': 'DESIGNATION', 'status': 'A', 'column':'category_name', 'direction':'asc' }).then(response => {
      this.designations = response.data;
    });
    this.StatusList = OptionsList.Options.tables.status.users;
    this.tinyMceSettings = CommonUtils.getTinymceSetting();

    this.staffSettings = this._settingService.setting ? CommonUtils.getStringToJson(this._settingService.setting.settingsinfo.meta_value) : this.staffSettings;
  }

  validateEmail() {
    let validEmail = CommonUtils.validCustomEmail(this.staffForm.get('email').value);
    if (validEmail == false) {
      this.validEmailmsg = 'Email is invalid';
      // this.staffForm.get('email').setErrors({'incorrect':true});
      // this.staffForm.get('email').markAsTouched();
    }
    // else{
    //   this.validEmailmsg = 'Email is required';
    //   this.staffForm.get('email').setErrors(null);
    // }
  }

  ngOnInit() {

    if (this.staffSettings) {
      this._defaultAvatar = AppConfig.Settings.url.mediaUrl + this.staffSettings.defaultprofile || AppConfig.Settings.url.defaultAvatar;
    }

    //Form Group
    this.setFormControls();
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }

  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.staffForm = this._formBuilder.group({
      id: [null],
      username: [''],
      email: [''],
      //first_name        : ['',[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      first_name: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      // middle_name       : ['',[Validators.pattern('^[a-zA-Z ]*$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      biography: [''],
      phone: [''],
      status: ['A', [Validators.required]],
      thumb_file: [''],
      avatar_media_id: [0],
      department: [''],
      subdepartment: [''],
      designation: [''],
      staffmanager: ['N'],
      usermeta: []
    });

    /*Get MetafieldsArray From API*/
    this._usersService.getMetaFields({ field_form_type: 'S' }).subscribe(meta => {
      if (meta.status == 200 && meta.data.length > 0) {
        this.MetaUploadInfo = meta.data || [];

      }

    })

    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/staff/edit/:id') {
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      //this.fillFormValues();
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this._staffService.getStaffs({ 'direction': 'desc', 'column': 'id', 'display': 'list' }).then(Response => {
      this.serviceList = Response.stafflist.data;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.userId) {
              let edit: boolean = true;
              this.fillFormValues(edit);
            }
            if (item.editrestriction.user.id != this.userId) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {
            let edit: boolean = true;
            this.fillFormValues(edit);
          }
        }
      });
      this.showDialog();
    });

  }
  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._matDialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'printentries',
        data: { type: 'staff', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/staff/list']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictStaff();
        }
      });
    }
  }
  editRestrictStaff() {
    this._staffService.updateForm(this.url_id, 'staff').subscribe(response => {
      let edit: boolean = true;
      this.fillFormValues(edit);
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.staff_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter == 1) {
        this.showPopup();
      }

    });
  }
  showPopup() {
    const dialogRef = this._matDialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'staff', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/staff/list']);
      }
    });
  }
    // according the phone number add the masking  for phone number field
    PhoneNumberValidations(event) {
    
      if(event.target.value.length == 7){
      let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
        event.target.value =  values[1] + '-' + values[2]
        this.staffForm.get('phone').setValue(event.target.value);
      }
      else{
  
       if(event.target.value.length == 10){
        let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
        event.target.value =  values[1] + '-' + values[2] + '-' + values[3];
        this.staffForm.get('phone').setValue(event.target.value);
      }else{
            if((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7]=='-' &&  event.target.value.length == 12)){
              this.staffForm.get('phone').setValue(event.target.value);
            }else{
              this.staffForm.get('phone').setValue('');
            }
         }
    }
    }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.userId;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'staff';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  //fillFormValues(){
  //var userData = new User().deserialize(this._staffService.user,'singlestaff');
  //this.staffForm.patchValue(userData);
  //send file urls and mediaId to file-upload compoenent
  //this.uploadInfo['avatar'].media_id = this.staffForm.get('avatar_media_id').value;
  //file urls
  // this.uploadInfo['avatar'].url      =  this.staffForm.get('thumb_file').value || this._defaultAvatar;
  /// }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(edit: any) {
    this._staffService.getStaffContent(this.url_id, edit).then(response => {
      console.log("response",response);
      var userData = new User().deserialize(response.userinfo, 'singlestaff');
      console.log("userData",userData);
      this.staffForm.patchValue(userData); 
      //send file urls and mediaId to file-upload compoenent
      this.uploadInfo['avatar'].media_id = this.staffForm.get('avatar_media_id').value;
      //file urls
      this.uploadInfo['avatar'].url = this.staffForm.get('thumb_file').value || this._defaultAvatar;
    }); 
  }
  /** SET MEDIA FIELD VALUE FROM EXTERNAL CPMNT */
  setMediaFieldValue($event: any) {
    if ($event.uploadResponse) {
      this.staffForm.get($event.formControlName).setValue($event.uploadResponse.media || 0);
    }

  }


  setMetaFieldValue($event: any) {
    if ($event) {
      this.userMeta = $event.usermeta
    }
  }

  /**SAVE FORM DATA */
  onSubmit(formData: any) {
    this.savingEntry = true;
    event.preventDefault();
    event.stopPropagation();
    if (this.staffForm.valid) {
      this.isSubmit = true;
      //modify Post Values Before Send to Http
      // this.setChangedControlValues();
      // GET FORM VALUE
      let value = formData;
      var val = Math.floor(1000 + Math.random() * 9000);
      value.username = value.first_name.trim() + '.' + value.last_name.trim() + val;

      // CREATE DEPARTMENT AND SUBDEPARTMENT AS SEPERATE ARRAY AND ASSIGN
      let mainDept = [];
      let subdept = [];
      value.department.forEach((dept) => {
        let d = dept.split(',');
        mainDept.push(d[0]);
        subdept.push(d[1]);
      });
      value.department = mainDept.toString();
      value.subdepartment = subdept.toString();
      // assign the usermeta value
      value.usermeta = JSON.stringify(value.usermeta);

      this._usersService.saveUser(value, this.editstaffForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              this.showSnackBar(data.message, 'CLOSE');
              this.router.navigate(['/admin/staff/list']);
            }
            else {
              // this.showSnackBar(data.message.username,'CLOSE');
              this.showSnackBar(data.message, 'CLOSE');
            }
          },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });
    }
  }
  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  /** SET BIRTHDATE */
  // setChangedControlValues(){
  //   //change birthday format 
  //   this.staffForm.get('birthdate').setValue(this._commonService.getMySqlDate(this.staffForm.get('birthdate').value));
  // }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
