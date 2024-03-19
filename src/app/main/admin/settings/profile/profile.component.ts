import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ImageCropperComponent } from 'app/layout/components/image-cropper/image-cropper.component';
import { AuthService, AppConfig, SettingsService, CommonService, UsersService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { User } from 'app/_models';
import { first, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProfileComponent implements OnInit {

  public EditUserProfileForm: FormGroup;
  public inputAccpets: string = ".jpeg, .jpg, .png";
  private user_id: number = 0;
  public tmp_avatar_img: string;
  public tmp_cover_img: string;
  public errorMsg: string;
  public minBirthdate: Date = new Date();
  public _defaultAvatar: string = "";
  public _defaultCover: string = "";
  public _localUserSettings: any;
  public isSubmit: boolean = false;
  private tmp_avatar_file: any;
  private tmp_cover_file: any;
  public showProfileEdit: boolean = false;
  characterLimit;
  // Private
  private _unsubscribeAll: Subject<any>;

  public tinyMceSettings = {};

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  cropperDialogRef: MatDialogRef<ImageCropperComponent>;
  loginUserInfo: User;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   * @param {_matSnackBar} MatSnackBar
   * @param {_authService} AuthService
   * @param {_settingService} SettingsService
   * @param {_matDialog} _matDialog
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _usersService: UsersService,
    private _matSnackBar: MatSnackBar,
    private _appConfig: AppConfig,
    private authenticationService: AuthService,
    private _settingService: SettingsService,
    public _matDialog: MatDialog) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.minBirthdate = this._commonService.setDatepickerAgeLimit();
    //this.tinyMceSettings = CommonUtils.getTinymceSetting();

    this.characterLimit = this._appConfig._localStorage.value.settings.users_settings.biography_char_limit || 0;

    this.tinyMceSettings = CommonUtils.getTinymceSetting('user', this.characterLimit);
    this.user_id = this.authenticationService.currentUserValue.token.user.id;
  }

  ngOnInit(): void {
    this.EditUserProfileForm = this._formBuilder.group({
      id: this._formBuilder.control(''),
      roles: this._formBuilder.control(''),
      email: this._formBuilder.control('', [Validators.email, Validators.required]),
      preffix: this._formBuilder.control(''),
      first_name: this._formBuilder.control('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      middle_name: this._formBuilder.control('', [Validators.pattern('^[a-zA-Z ]*$')]),
      last_name: this._formBuilder.control('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      username: this._formBuilder.control('', [Validators.required]),
      birthdate: this._formBuilder.control('', [Validators.required]),
      phone: this._formBuilder.control('', [Validators.required]),
      biography: this._formBuilder.control(''),
      avatar_file: this._formBuilder.control(null),
      avatar_media_id: this._formBuilder.control(0),
      cover_file: this._formBuilder.control(null),
      cover_media_id: this._formBuilder.control(0),
    });
    this.getUserInfo();

    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
    if (this.loginUserInfo) {
      this.showProfileEdit = true;
    }
    this._appConfig.onProfileInfoChanged.subscribe(ProfileInfo => {
      this.loginUserInfo.first_name = ProfileInfo.first_name + ' ' + ProfileInfo.last_name;
    })

    this._localUserSettings = this._appConfig._localStorage.value.settings;

    if (this._localUserSettings) {
      this._defaultAvatar = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar;
      this._defaultCover = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultcover || AppConfig.Settings.url.defaultCover;

      //Update Default Avatar Runtime When Changed From Settings
      this._appConfig._localStorage.subscribe(LocalStorageSettings => {
        if (LocalStorageSettings.settings.users_settings.defaultprofile) {
          this._defaultAvatar = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultprofile;
        }
        if (LocalStorageSettings.settings.users_settings.defaultcover) {
          this._defaultCover = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultcover;
        }
      });
    }

    if (localStorage.userInfo !== undefined && localStorage.userInfo !== '') {
      const loginLocalUser = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null;

      if (this.loginUserInfo && loginLocalUser) {
        this.loginUserInfo.first_name = loginLocalUser.first_name + ' ' + loginLocalUser.last_name;
      }
    }

    this.tmp_avatar_img = this._defaultAvatar;
    this.tmp_cover_img = this._defaultCover;
  }

  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(response) {
    var userData = new User().deserialize(response, 'single');
    this.EditUserProfileForm.patchValue(userData);

    // set image preview
    this.tmp_avatar_img = this.EditUserProfileForm.get('avatar_file').value || this._defaultAvatar;
    this.tmp_cover_img = this.EditUserProfileForm.get('cover_file').value || this._defaultCover;
    this.loginUserInfo.first_name = this.EditUserProfileForm.get('first_name').value + ' ' + this.EditUserProfileForm.get('last_name').value;
  }

  // get user information
  getUserInfo() {
    this._settingService.getUserInfo(this.user_id)
      .then(response => {
        if (response.status == 200) {
          let userInfo = response.userinfo;
          this.fillFormValues(userInfo);
        }
      },
        error => this.errorMsg = error);
  }
  //SET BIRTHDATE FROM CHILD COMPONENET
  setBirthdate($event) {
    setTimeout(() => {
      this.EditUserProfileForm.get('birthdate').setValue($event);
    }, 300);
    //this.EditUserProfileForm.get('birthdate').setValue($event);
  }

  // validate phone number
  validatePhone(event: any) {
    const pattern = /[0-9\+\-]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Update profile
  onClickUpdateProfile(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.EditUserProfileForm.valid) {
      this.isSubmit = true;
      let editFormdata = { ...this.EditUserProfileForm.value };
      //Set UserMeta if exists
      if (editFormdata && editFormdata.usermeta) {
        editFormdata.usermeta = JSON.stringify(editFormdata.usermeta) || "";
      }

      this.setChangedControlValues();
      this._usersService.saveUser(this.EditUserProfileForm.value, true)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          if (response.status == 200) {
            this.isSubmit = false;
            this._commonService.UpdateProfilePictures(response.userinfo)
            this.showSnackBar(response.message, 'CLOSE');
          }
          else {
            this.showSnackBar(response.message, 'CLOSE');
          }
        })
    }
    else {
      CommonUtils.validateAllFormFields(this.EditUserProfileForm);
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
    setTimeout(() => {
      this.EditUserProfileForm.get('birthdate').setValue(this._commonService.getMySqlDate(this.EditUserProfileForm.get('birthdate').value));
    }, 300);
  }

  setPreviewImage(event: any, type: string) {

    if (event.target.files && event.target.files[0]) {
      let index = event.target.files[0].name.lastIndexOf(".") + 1;
      let extFile = event.target.files[0].name.substr(index, event.target.files[0].size).toLocaleLowerCase();
      if (extFile == "jpeg" || extFile == "jpg" || extFile == "png") {
        if (type == 'avatar') {
          this.tmp_avatar_file = event.target.files[0];
        }
        else {
          this.tmp_cover_file = event.target.files[0];
        }
        this.getBase64(event.target.files[0], type);
      } else {
        if (type == 'avatar') {
          this.tmp_avatar_img = this._defaultAvatar;
          this.tmp_avatar_file = '';
          this.EditUserProfileForm.controls['avatar_file'].setValue(this.tmp_avatar_img);
          this.EditUserProfileForm.controls['avatar_media_id'].setValue(0);
        }
        else {
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
      disableClose: true,
      width: '700px', height: '400px',
      data: {
        cropperType: type,
        type: 'crop_img',
        body: { 'base64': base64 }
      }
    });

    this.cropperDialogRef.afterClosed().subscribe(result => {

      if (result) {
        let userProfileImg = new FormData();
        let media_id = (type == 'avatar') ? this.EditUserProfileForm.controls['avatar_media_id'].value : this.EditUserProfileForm.controls['cover_media_id'].value;
        let tmp_file = (type == 'avatar') ? this.tmp_avatar_file : this.tmp_cover_file;
        userProfileImg.append('type', type);
        userProfileImg.append('image', tmp_file);
        userProfileImg.append('media_id', media_id);
        this._settingService.saveMedia(userProfileImg)
          .then(response => {
            if (response.status == 200) {
              if (type == 'avatar') {
                this.tmp_avatar_img = result;
                this.EditUserProfileForm.controls['avatar_media_id'].setValue(response.media);
              }
              else if (type == 'cover') {
                this.tmp_cover_img = result;
                this.EditUserProfileForm.controls['cover_media_id'].setValue(response.media);
              }
              else {
                this.showSnackBar(response.message, 'CLOSE');
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
  removePicture(type): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      width: '700px',
      disableClose: false
    });

    //this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove your '+type+' picture and display default '+type+' picture?';
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove your profile picture and display default profile picture?';

    this.confirmDialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (type == 'avatar') {
          this.tmp_avatar_img = this._defaultAvatar;
          this.tmp_avatar_file = '';
          this.EditUserProfileForm.controls['avatar_file'].setValue(this.tmp_avatar_img);
          this.EditUserProfileForm.controls['avatar_media_id'].setValue(0);
        }
        else {
          this.tmp_cover_img = this._defaultCover;
          this.tmp_cover_file = '';
          this.EditUserProfileForm.controls['cover_file'].setValue(this.tmp_cover_img);
          this.EditUserProfileForm.controls['cover_media_id'].setValue(0);
        }
      }
      this.confirmDialogRef = null;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

