import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, first, tap, switchMap, debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { EventbehavioursubService, OptionsList, CommonService, UsersService, RolesService, AppConfig } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { User } from 'app/_models';
import { UsermetaComponent } from '../usermeta/usermeta.component';
import { GalleryComponent } from 'app/layout/components/dialogs/gallery/gallery.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {

  @ViewChild('existsUsername', { static: true })
  existsUsername: ElementRef;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  galleryDialogRef: MatDialogRef<GalleryComponent>; //EXTRA Changes  
  public green_bg_header: any;
  public button: any;
  public accent: any;
  UserInfo: any;
  minBirthdate: Date = new Date();
  isSubmit: boolean = false;
  showSuffix: boolean = false;
  isSearching: boolean = false;
  editUserForm: boolean = false;
  editUserId: number = 0;
  validEmailmsg: string = "Email is required!";
  userNameReqmsg: string = "Username is required!";
  pwdhide = true;
  userform: FormGroup;
  unamePattern = "^[a-zA-Z0-9\.]*$";
  checkUsernameRes: any;
  fieldConfig: any = [];
  field: string;
  RoleList: any = {};
  userMeta: any = [];
  StatusList: any;
  MetaUploadInfo: any;
  characterLimit;
  public tinyMceSettings = {};
  public userSetting: any;
  public community_id: any;
  uploadInfo: any = {
    'avatar': { 'type': 'avatar', 'media_id': 0, 'formControlName': 'avatar_media_id', 'url': "", 'apimediaUrl': 'media/userupload' },
    'cover': { 'type': 'cover', 'media_id': 0, 'formControlName': 'cover_media_id', 'url': "", 'apimediaUrl': 'media/userupload' }
  };
  public fullCountCustomerList: any = [];
  // Private
  private _unsubscribeAll: Subject<any>;

  @ViewChild(UsermetaComponent, { static: true }) private usermeta: UsermetaComponent;

  constructor(
    private route: ActivatedRoute,
    private eventbehavioursub: EventbehavioursubService,
    private el: ElementRef,
    private router: Router,
    private _rolesService: RolesService,
    private _commonService: CommonService,
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _appConfig: AppConfig
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.minBirthdate = this._commonService.setDatepickerAgeLimit();

    this.characterLimit = this._appConfig._localStorage.value.settings.users_settings.biography_char_limit || 0;

    this.tinyMceSettings = CommonUtils.getTinymceSetting('user', this.characterLimit);

    if (this.route.routeConfig.path == 'admin/users/edit/:id' && this.route.params['value'].id > 0) {
      this.editUserId = this.route.params['value'].id;
      this.editUserForm = true;
    }

  }


  validateEmail() {
    let validEmail = CommonUtils.validCustomEmail(this.userform.get('email').value);
    if (validEmail == false) {
      this.validEmailmsg = 'Email is invalid';
    }
  }

  ngOnInit() {
    //Roles List
    this.RoleList = this._rolesService.roles.data;
    this.fieldConfig = this._commonService.metaFields;
    this.StatusList = OptionsList.Options.tables.status.users;
    //Set MetaUploadInfo
    this.MetaUploadInfo = this._commonService.metaFields;
    this.userSetting = this._commonService.getLocalSettingsJson('users_settings');
    this.community_id = this.userSetting.fullcount_settings.community_id;
    
    //Form Group
    this.setFormControls();
    //Username check exists on add / edit form
    if (!this.editUserForm) {
      fromEvent(this.existsUsername.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        , filter(res => res.length > 2)
        , debounceTime(500)
        , distinctUntilChanged()
        // subscription for response
      ).subscribe((userNameString: string) => {
        if (!this.userform.get('username').errors) {
          this.isSearching = true;
          this._usersService.checkUsername({ 'username': userNameString }).subscribe((res) => {

            if (res.isavailable == false) {
              this.userNameReqmsg = 'username is already taken. Suggestion- ' + res.username;
              this.userform.get('username').setErrors({ 'incorrect': true });
              this.userform.get('username').markAsTouched();
            }
            else {
              this.userNameReqmsg = "Username is required!";
              this.userform.get('username').setErrors(null);
            }
            this.isSearching = false;
          }, (err) => {
            this.isSearching = false;
          });
        }
        else if (this.userform.get('username').errors.pattern) {
          this.userNameReqmsg = "Username is invalid!";
        }
        else {
          this.userNameReqmsg = "Username is required!";
          this.userform.get('username').setErrors(null);
        }
      });
    }
    
    //fullcount info fetch for autocomplete
    this.userform.get('fc_name').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._usersService.getCustomerList({ 'lastName': value, 'id': this.community_id, autocomplete: '1' }))
      )
      .subscribe(Response => this.fullCountCustomerList = Response.data);


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
    this.userform = this._formBuilder.group({
      id: [null],
      preffix: [''],
      suffix: ['', [Validators.pattern(this.unamePattern)]],
      username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
      email: ['', [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      middle_name: ['', [Validators.pattern("^[a-zA-Z0-9\.]*$")]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      password: !this.editUserForm ? ['', [Validators.required]] : [''],
      birthdate: [''],
      phone: [''],
      roles: ['', [Validators.required]],
      status: ['A', [Validators.required]],
      avatar_file: [''],
      avatar_media_id: [0],
      cover_file: [''],
      cover_media_id: [0],
      sendmail: [false],
      show_profile_res_dir: [false],
      hide_email_res_dir: [false],
      hide_phone_res_dir: [false],
      recive_all_resident_email_notify: [false],
      message_notification_privacy: ['nobody'],
      biography: [''],
      fc_id: [''],
      fc_name:[''],
      usermeta: []
    });
    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/users/edit/:id') {
      this.fillFormValues();
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    var userData = new User().deserialize(this._usersService.user, 'single');
    this.UserInfo = userData;
    this.userSetting = this._commonService.getLocalSettingsJson('users_settings');
    this.community_id = this.userSetting.fullcount_settings.community_id;
    
    if (userData.show_profile_res_dir == 'N') {
      userData.show_profile_res_dir = "";
    }
    if (userData.show_profile_res_dir == 'Y') {
      userData.show_profile_res_dir = true;
    }
    if (userData.hide_email_res_dir == 'N') {
      userData.hide_email_res_dir = "";
    }
    if (userData.hide_email_res_dir == 'Y') {
      userData.hide_email_res_dir = true;
    }

    userData.hide_phone_res_dir = userData.hide_phone_res_dir == 'N' ? '' : true;
    userData.recive_all_resident_email_notify = userData.recive_all_resident_email_notify == 'N' ? '' : true;


    this.userform.patchValue(userData);
    //send file urls and mediaId to file-upload component
    this.uploadInfo['avatar'].media_id = this.userform.get('avatar_media_id').value;
    this.uploadInfo['cover'].media_id = this.userform.get('cover_media_id').value;
    //file urls
    this.uploadInfo['avatar'].url = this.userform.get('avatar_file').value;
    this.uploadInfo['cover'].url = this.userform.get('cover_file').value;
    this.userform.get('fc_id').setValue(this.UserInfo.fc_id);
    this.userform.get('fc_name').setValue(this.UserInfo.fc_name);
    if(this.UserInfo.fc_id>0){
      
      this.getCustomerList();
    }
  }

  // add the masking accoding the phone number 
  PhoneNumberValidations(event) {
    if (event.target.value.length == 7) {
      let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
      event.target.value = values[1] + '-' + values[2]
      this.userform.get('phone').setValue(event.target.value);
    }
    else {

      if (event.target.value.length == 10) {
        let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
        event.target.value = values[1] + '-' + values[2] + '-' + values[3];
        this.userform.get('phone').setValue(event.target.value);
      } else {
        if ((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7] == '-' && event.target.value.length == 12)) {
          this.userform.get('phone').setValue(event.target.value);
        } else {
          this.userform.get('phone').setValue('');
        }
      }
    }
  }
  /** SET MEDIA FIELD VALUE FROM EXTERNAL CPMNT */
  setMediaFieldValue($event: any) {
    if ($event.uploadResponse) {
      this.userform.get($event.formControlName).setValue($event.uploadResponse.media || 0);
    }
  }
  //SET BIRTHDATE FROM CHILD COMPONENET
  setBirthdate($event) {
    this.userform.get('birthdate').setValue($event);
  }
  /** SET META FIELD VALUE FROM EXTERNAL CPMNT */
  setMetaFieldValue($event: any) {
    if ($event) {
      this.userMeta = $event.usermeta
    }
  }
  getCustomerList(){    
    this.userSetting = this._commonService.getLocalSettingsJson('users_settings');
    this.community_id = this.userSetting.fullcount_settings.community_id; //,'lastName':event.target.value 
    this._usersService.getCustomerList({ 'id': this.community_id}).then(Response => {
      this.fullCountCustomerList = Response.data;
      
      let selectedCustomerId = this.fullCountCustomerList.find(item=>{ return item.id==this.UserInfo.fc_id});
      
      if(selectedCustomerId && selectedCustomerId.id>0){
        this.userform.get('fc_name').setValue(selectedCustomerId.firstName+' '+selectedCustomerId.lastName);
      }
    });
    this.userform.get('fc_id').setValue(''); 
  }
  //Fill Autocomplete Values
  setFullcountfields(fullcountInfo: any) {
    
    if (fullcountInfo && fullcountInfo.option.value.id) {      
      this.userform.get('fc_id').setValue(fullcountInfo.option.value.id);
      this.userform.get('fc_name').setValue(fullcountInfo.option.value.firstName+' '+fullcountInfo.option.value.lastName);
    }
  }
  /**SAVE FORM DATA */
  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.userform.valid) {
      this.isSubmit = true;
      let value = this.userform.value;
      this.setChangedControlValues();
      let formValue = {
        'id': value.id,
        'fc_id': value.fc_id,
        'fc_name': value.fc_name,
        'preffix': value.preffix,
        'suffix': value.suffix,
        'email': value.email,
        'username': value.username,
        'password': value.password,
        'first_name': value.first_name,
        'last_name': value.last_name,
        'middle_name': value.middle_name,
        'birthdate': value.birthdate,
        'phone': value.phone,
        'roles': value.roles,
        'status': value.status,
        'avatar_media_id': value.avatar_media_id,
        'cover_media_id': value.cover_media_id,
        'sendmail': value.sendmail,
        'usermeta': JSON.stringify(this.userform.get('usermeta').value),
        'show_profile_res_dir': value.show_profile_res_dir == true ? 'Y' : 'N',
        'hide_email_res_dir': value.hide_email_res_dir == true ? 'Y' : 'N',
        'hide_phone_res_dir': value.hide_phone_res_dir == true ? 'Y' : 'N',
        'recive_all_resident_email_notify': value.recive_all_resident_email_notify == true ? 'Y' : 'N',
        'biography': value.biography,
        'message_notification_privacy': value.message_notification_privacy
      };

      //modify Post Values Before Send to Http
      this._usersService.saveUser(formValue, this.editUserForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              this.showSnackBar(data.message, 'CLOSE');
              this.router.navigate(['/admin/users/list']);
            }
            else {
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
    else {
      //CommonUtils.validateAllFormFields(this.userform);
      //CommonUtils.scrollToFirstInvalidControl(this.el);
      //Validate UsermetaFields      
      this.eventbehavioursub.userMetaValidate.next(true);
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
  setChangedControlValues() {
    //change birthday format 
    if (this.userform.get('birthdate').value != '') {
      this.userform.get('birthdate').setValue(this._commonService.getMySqlDate(this.userform.get('birthdate').value));
    }
    //set sendmail to 1/0
    this.userform.get('sendmail').setValue(this.userform.get('sendmail').value == true ? 1 : 0);
  }
  /** OPEN GALLERY VIEW ON TINYMCE */
  openGallery(fieldName: string = '') {
    this.galleryDialogRef = this._matDialog.open(GalleryComponent, {
      disableClose: false,
      data: { fieldName: fieldName }
    });
    this.galleryDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {

        }
        this.galleryDialogRef = null;
      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.eventbehavioursub.userMetaValidate.next(false);
  }

}
