import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ImageCropperComponent } from 'app/layout/components/image-cropper/image-cropper.component';
import { AuthService, AppConfig ,SettingsService, EventbehavioursubService, CommonService, UsersService, CategoryService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { User } from 'app/_models';
import { first, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'edit-other-profile',
  templateUrl: './edit-other-profile.component.html',
  styleUrls: ['./edit-other-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EditOtherProfileComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  cropperDialogRef: MatDialogRef<ImageCropperComponent>;
 
  public EditUserProfileForm: FormGroup;
  public cropperType: string = 'avatar';
  public inputAccpets       : string = ".jpeg, .jpg, .png";
  private user_id           : number = 0;
  public tmp_avatar_img     : string ;
  public tmp_cover_img      : string ;
  public userMeta           : any = [];      
  public errorMsg           : string;
  public minBirthdate       : Date = new Date();
  public _defaultAvatar     : string = "";
  public _defaultCover      : string = "";
  public _localUserSettings : any;
  public isSubmit           : boolean = false;
  private tmp_avatar_file   : any;
  private tmp_cover_file    : any;
  public MetaUploadInfo     : any;
  public otherUserInfo      : User;
  public UserInfo           : any;
  public fieldConfig        : any;
  public : any; any = [];
  clubsList: any[]= [];
  public interestList       : any = [];
  public tinyMceSettings  = {};
  field:string;

  // Private
  private _unsubscribeAll: Subject<any>;

/**
 * Constructor
 *
 */
  constructor( 
    private eventbehavioursub : EventbehavioursubService,
    private el: ElementRef,
    private _formBuilder          : FormBuilder, 
    private _commonService        : CommonService,
    private route		              : ActivatedRoute,
    private router                : Router,
    private _usersService         : UsersService,
    private _matSnackBar          : MatSnackBar,
    private _appConfig            : AppConfig,
    private _fuseConfigService    : FuseConfigService,
    private authenticationService : AuthService,
    private _categoryService      : CategoryService, 
    private _settingService       : SettingsService,
    public _matDialog             : MatDialog ){
      // Set the private defaults
      this._unsubscribeAll = new Subject();

      // Configure the layout
      this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
      this.minBirthdate = this._commonService.setDatepickerAgeLimit();
      
      // GET USER ID
      if(this.route.params['value'].id){
        this.user_id = this.route.params['value'].id;
      }
      /*** GET CLUBS AND COMMITTEES***/ 
      this._categoryService.getCategorys({'category_type':'CLUBS','status':'A','column':'category_name','direction':'asc'}).then(response =>{
        this.clubsList = response.data;
      });
      /*** GET INTEREST***/ 
      this._categoryService.getCategorys({'category_type':'INTEREST','status':'A','column':'category_name','direction':'asc'}).then(response =>{
        this.interestList = response.data;
      });
  }

  ngOnInit(){ 
      // GET USER META FIELDS
      this.fieldConfig      = this._commonService.metaFields;
      
      this.MetaUploadInfo   = {'user':{'type':'field','fieldConfig':this.fieldConfig}};
      // SET FROM CONTROLS
      this.EditUserProfileForm = this._formBuilder.group({
          id              : this._formBuilder.control(this.user_id),
          roles           : this._formBuilder.control(''),
          preffix         : this._formBuilder.control(''),
          email           : this._formBuilder.control('',[Validators.email,Validators.required]),
          first_name      : this._formBuilder.control('',[Validators.required,Validators. pattern('^[a-zA-Z ]*$')]),
          middle_name     : this._formBuilder.control('',[Validators. pattern("^[a-zA-Z\.]*$")]),
          last_name       : this._formBuilder.control('',[Validators.required,Validators. pattern('^[a-zA-Z ]*$')]),
          username        : this._formBuilder.control('',[Validators.required]),
          biography       : this._formBuilder.control(''),
          birthdate       : this._formBuilder.control('',[Validators.required]),
          phone           : this._formBuilder.control('',[Validators.required]),
          avatar_file     : this._formBuilder.control(null),
          avatar_media_id : this._formBuilder.control(0),
          cover_file      : this._formBuilder.control(null),
          cover_media_id  : this._formBuilder.control(0),
          show_profile_res_dir                : this._formBuilder.control('Y',[Validators.required]),
          hide_email_res_dir                  : this._formBuilder.control('N',[Validators.required]),
          hide_phone_res_dir                  : this._formBuilder.control('N',[Validators.required]),
          recive_all_resident_email_notify    : this._formBuilder.control('N',[Validators.required],),
          message_notification_privacy        : this._formBuilder.control('everyone',[Validators.required],),
          usermeta        : []
      });

      

       //Set User Info to display on navbar
       let UserInfo       = this._usersService.user;
       this.otherUserInfo = new User().deserialize(UserInfo,'single');
       
       this._appConfig.onProfileInfoChanged.subscribe(ProfileInfo =>{
          if(ProfileInfo){
            let preffixName = ProfileInfo.preffix!=='' ? ' "' + ProfileInfo.preffix + '" ' : '';
            this.otherUserInfo.first_name = ProfileInfo.first_name + preffixName + ProfileInfo.last_name; 
          }
       })

      this._localUserSettings = this._appConfig._localStorage.value.settings;
    
      if(this._localUserSettings){
          
          this._localUserSettings.users_settings.biography_char_limit = this._localUserSettings.users_settings.biography_char_limit ? this._localUserSettings.users_settings.biography_char_limit : 5000;
          this.tinyMceSettings = CommonUtils.getTinymceSetting('user',this._localUserSettings.users_settings.biography_char_limit);
          this._defaultAvatar  = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar; 
          this._defaultCover = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultcover || AppConfig.Settings.url.defaultCover;
      
          //Update Default Avatar Runtime When Changed From Settings
          this._appConfig._localStorage.subscribe(LocalStorageSettings=>{
              if(LocalStorageSettings.settings.users_settings.defaultprofile){
                  this._defaultAvatar = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultprofile;
              }
              if(LocalStorageSettings.settings.users_settings.defaultcover){
                this._defaultCover = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultcover;
              }
          });
      }

      this.tmp_avatar_img = this._defaultAvatar;
      this.tmp_cover_img = this._defaultCover;

      this.fillFormValues();
      
  }

  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(){

    var userData    = new User().deserialize(this._usersService.user,'single');
    this.UserInfo   = userData;
    this.EditUserProfileForm.patchValue(userData);
    
    // set image preview
    this.tmp_avatar_img            = userData.thumb_file || this.EditUserProfileForm.get('avatar_file').value || this._defaultAvatar;
    this.tmp_cover_img             = this.EditUserProfileForm.get('cover_file').value || this._defaultCover;
    this.otherUserInfo.first_name  =  this.EditUserProfileForm.get('first_name').value + ' ' + userData.showpreffix + ' ' + this.EditUserProfileForm.get('last_name').value;
    
  }

   /** SET META FIELD VALUE FROM EXTERNAL CPMNT */
   setMetaFieldValue($event: any){
    if($event){
      this.userMeta = $event.usermeta 
    }
  }

  //SET BIRTHDATE FROM CHILD COMPONENET
  setBirthdate($event){
    this.EditUserProfileForm.get('birthdate').setValue($event);
  }

  // Update profile
  onClickUpdateProfile(event){
    event.preventDefault();
    event.stopPropagation();
    if (this.EditUserProfileForm.valid)
    {
        this.isSubmit = true;
        // sent value of form group to usermeta component
        this.setChangedControlValues();
        //this.usermeta.validateUserMetaForm(this.isSubmit);
        
        let value = this.EditUserProfileForm.value;
        

        let resultArr = [];
        // resultArr= resultArr.concat(this.userMeta);
        // resultArr= resultArr.concat(value.interestusermeta);
        let formValue = {
          'id'                              : value.id, 
          'email'                           : value.email,
          'username'                        : value.username,
          'first_name'                      : value.first_name,
          'middle_name'                     : value.middle_name,
          'last_name'                       : value.last_name,
          'birthdate'                       : value.birthdate,
          'phone'                           : value.phone,
          'roles'                           : value.roles,
          'biography'                       : value.biography,
          'avatar_media_id'                 : value.avatar_media_id,
          'cover_media_id'                  : value.cover_media_id,
          'show_profile_res_dir'            : value.show_profile_res_dir,
          'hide_email_res_dir'              : value.hide_email_res_dir,
          'hide_phone_res_dir'              : value.hide_phone_res_dir,
          'message_notification_privacy'    : value.message_notification_privacy,
          'recive_all_resident_email_notify': value.recive_all_resident_email_notify,
          'usermeta'                        : JSON.stringify(this.EditUserProfileForm.get('usermeta').value)
        };
        
        this._usersService.saveUser(formValue,true)
        .pipe(first(),takeUntil(this._unsubscribeAll))
        .subscribe( response =>{
          if(response.status==200){
            this.isSubmit = false;
            this.showSnackBar(response.message,'CLOSE');
            this.router.navigate(['view-other-profile',this.user_id]);
          }
          else{
            this.showSnackBar(response.message,'CLOSE');
          }
        })
    }
    else
    {
      CommonUtils.validateAllFormFields(this.EditUserProfileForm);
      CommonUtils.scrollToFirstInvalidControl(this.el);
      //Validate UsermetaFields      
      this.eventbehavioursub.userMetaValidate.next(true);
    }
  }

    /** SHOW SNACK BAR */
    showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }


  /** SET BIRTHDATE */
  setChangedControlValues(){
    //change birthday format 
    this.EditUserProfileForm.get('birthdate').setValue(this._commonService.getMySqlDate(this.EditUserProfileForm.get('birthdate').value));
  }
    
  setPreviewImage(event : any, type: string) {
    this.cropperType = type || 'avatar';
    if (event.target.files && event.target.files[0]) {
      let index = event.target.files[0].name.lastIndexOf(".")+1;
      let extFile = event.target.files[0].name.substr(index,event.target.files[0].size).toLocaleLowerCase();
      if( extFile == "jpeg" || extFile == "jpg" || extFile == "png")
      {
        if(type == 'avatar'){
          this.tmp_avatar_file = event.target.files[0];
        }
        else{
          this.tmp_cover_file = event.target.files[0];
        }
        this.getBase64(event.target.files[0], type);
      }else{
        if(type == 'avatar'){
          this.tmp_avatar_img = this._defaultAvatar;
          this.tmp_avatar_file = '';
          this.EditUserProfileForm.controls['avatar_file'].setValue(this.tmp_avatar_img);
          this.EditUserProfileForm.controls['avatar_media_id'].setValue(0);
        }
        else{
          this.tmp_cover_img = this._defaultCover;
          this.tmp_cover_file = '';
          this.EditUserProfileForm.controls['cover_file'].setValue(this.tmp_cover_img);
          this.EditUserProfileForm.controls['cover_media_id'].setValue(0);
        }
      }
    }
  }
    
  openCropper(base64, type) {
    
      this.cropperDialogRef = this._matDialog.open(ImageCropperComponent, {
      disableClose:true,
      width: '700px',height:'400px',
      data: {type: 'crop_img', body:{'base64': base64}, 'cropperType': this.cropperType }
    });

    this.cropperDialogRef.afterClosed().subscribe(result => {
      
      if(result){
        let userProfileImg = new FormData();
        let media_id = (type == 'avatar') ? this.EditUserProfileForm.controls['avatar_media_id'].value : this.EditUserProfileForm.controls['cover_media_id'].value;
        let tmp_file = (type == 'avatar') ? this.tmp_avatar_file : this.tmp_cover_file;
        userProfileImg.append('type',type);
        userProfileImg.append('image',tmp_file);
        userProfileImg.append('base64',result);
        userProfileImg.append('media_id',media_id);
        this._settingService.saveMedia(userProfileImg)
            .then(response =>{
              if(response.status == 200){
                if(type == 'avatar'){
                  this.tmp_avatar_img = result;
                  this.EditUserProfileForm.controls['avatar_media_id'].setValue(response.media);
                  this.showSnackBar('Profile Image uploaded successfully','SUCCESS')
                }
                else if(type == 'cover'){
                  this.tmp_cover_img = result;
                  this.EditUserProfileForm.controls['cover_media_id'].setValue(response.media);
                  this.showSnackBar('Cover Image uploaded successfully','SUCCESS')
                }
                else{
                  this.showSnackBar(response.message,'CLOSE');
                }
              }
            },
          error => this.errorMsg = error);
      }
      this.cropperDialogRef = null;
    });
  }    
      
  getBase64(file, type) {
    var reader = new FileReader();
    reader.readAsDataURL(file); // read file as data url

    reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.openCropper(event.target.result, type);
    }
  }
    
  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: any) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
          // This will call another method that will create image from url
          img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
      }
    });
  }
    
  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image    
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
  }

/**
 * Remove Profile Picture
 */
  removePicture(type): void
  {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {width: '700px',disableClose: false});

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove your '+type+' picture and display default '+type+' picture?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
              
        if ( result )
        {
          if(type == 'avatar'){
            this.tmp_avatar_img = this._defaultAvatar;
            this.tmp_avatar_file = '';
            this.EditUserProfileForm.controls['avatar_file'].setValue(this.tmp_avatar_img);
            this.EditUserProfileForm.controls['avatar_media_id'].setValue(0);
          }
          else{
            this.tmp_cover_img = this._defaultCover;
            this.tmp_cover_file = '';
            this.EditUserProfileForm.controls['cover_file'].setValue(this.tmp_cover_img);
            this.EditUserProfileForm.controls['cover_media_id'].setValue(0);
          }
        }
        this.confirmDialogRef = null;
    });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this.eventbehavioursub.userMetaValidate.next(false);
  }
}