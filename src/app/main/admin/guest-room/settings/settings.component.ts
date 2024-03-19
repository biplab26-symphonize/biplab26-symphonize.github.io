import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { AppConfig, CommonService, RolesService, SettingsService, UsersService } from 'app/_services';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: fuseAnimations
})
export class SettingsComponent implements OnInit {
  public addGuestRoomSetting: FormGroup;
  public tinyMceSettings = {};

  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  @Output() designpartData = new EventEmitter();
  private file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  public selectedUsers :  any=[];
  public roleList      :  any=[];
  public userList      :  any=[];
  mediaInfo: any = [];

  constructor(private fb: FormBuilder,
    private _settingService: SettingsService,
    private _matSnackBar: MatSnackBar,
    private _commonService: CommonService,
    private _usersService: UsersService,
    private _rolesService    : RolesService
  ) { }

  ngOnInit() {
    this.setControls();
    console.log('roles service',this._rolesService.roles);
    this.roleList    = this._rolesService.roles.data;  
    console.log("roleList",this.roleList);
    this.tinyMceSettings = CommonUtils.getTinymceSetting();
  }
  setControls() {
    this.addGuestRoomSetting = this.fb.group({
      first_day_week: this.fb.control('sunday'),
      default_booking_status: this.fb.control('confirmed'),
      reservation_time_price_on: this.fb.control('day'),
      room_reservation_pending_time: this.fb.control(''),
      admin_booking_confirm_subject: this.fb.control(''),
      admin_booking_confirmation_mail_body: this.fb.control(''),
      resident_booking_confirmation_subject: this.fb.control(''),
      resident_booking_confirmation_mail_body: this.fb.control(''),
      admin_booking_cancel_subject: this.fb.control(''),
      admin_booking_cancel_mail_body: this.fb.control(''),
      resident_booking_cancel_subject: this.fb.control(''),
      resident_booking_cancel_mail_body: this.fb.control(''),
      image: this.fb.control(''),
      userrole_id: this.fb.control('', [Validators.required]),
      admin_user: this.fb.control('', [Validators.required]),
      custom_admin_email: this.fb.control(''),
    });
    this._settingService.getGuestRoomSetting({ meta_type: "guest" }).then(res => {
      this.getGuestSettingData(res.data);
    })
  }
  getGuestSettingData(response) {
    let data;
    let first_day_week;
    let default_booking_status;
    let reservation_time_price_on;
    let room_reservation_pending_time;
    let Default_img;
    let userrole_id;
    let admin_user;
    let custom_admin_email;
    if (response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        if (response[i].meta_key == "email_notification") {
          data = JSON.parse(response[i].meta_value);
        }
        if (response[i].meta_key == "room_reservation_pending_time") {
          room_reservation_pending_time = response[i].meta_value;
        }
        if (response[i].meta_key == "reservation_time_price_on") {
          reservation_time_price_on = response[i].meta_value;
        }
        if (response[i].meta_key == "default_booking_status") {
          default_booking_status = response[i].meta_value;
        }
        if (response[i].meta_key == "first_day_week") {
          first_day_week = response[i].meta_value;
        }
        if (response[i].meta_key == "Default_img") {
          Default_img = response[i].meta_value;
          console.log("default image", Default_img);
          this.filetype = true;
          this.logourl = Default_img;
        }
        if (response[i].meta_key == "userrole_id") {

          userrole_id = response[i].meta_value;
          this._usersService.getUsers({ 'roles': userrole_id.split(',').map(Number) }).then(Response => {
            console.log('response', Response);
            this.userList = Response.data;
          });
        }
        if (response[i].meta_key == "admin_user") {
          admin_user = response[i].meta_value;
          console.log(admin_user);
        }
        if (response[i].meta_key == "custom_admin_email") {
          custom_admin_email = response[i].meta_value;
        }
      }

      this.addGuestRoomSetting = this.fb.group({
        first_day_week: this.fb.control(first_day_week),
        default_booking_status: this.fb.control(default_booking_status),
        reservation_time_price_on: this.fb.control(reservation_time_price_on),
        room_reservation_pending_time: this.fb.control(room_reservation_pending_time),
        admin_booking_confirm_subject: this.fb.control(data.admin_booking_confirmation.subject != "" ? data.admin_booking_confirmation.subject : ''),
        admin_booking_confirmation_mail_body: this.fb.control(data.admin_booking_confirmation.mail_body != "" ? data.admin_booking_confirmation.mail_body : ''),
        resident_booking_confirmation_subject: this.fb.control(data.resident_booking_confirmation.subject != "" ? data.resident_booking_confirmation.subject : ''),
        resident_booking_confirmation_mail_body: this.fb.control(data.resident_booking_confirmation.mail_body != "" ? data.resident_booking_confirmation.mail_body : ''),
        admin_booking_cancel_subject: this.fb.control(data.admin_booking_cancellation.subject != "" ? data.admin_booking_cancellation.subject : ''),
        admin_booking_cancel_mail_body: this.fb.control(data.admin_booking_cancellation.mail_body != '' ? data.admin_booking_cancellation.mail_body : ''),
        resident_booking_cancel_subject: this.fb.control(data.resident_booking_cancellation.subject != '' ? data.resident_booking_cancellation.subject : ''),
        resident_booking_cancel_mail_body: this.fb.control(data.resident_booking_cancellation.mail_body != '' ? data.resident_booking_cancellation.mail_body : ''),
        custom_admin_email: this.fb.control(custom_admin_email),
        userrole_id: this.fb.control(userrole_id.split(',').map(Number)),
        admin_user: this.fb.control(admin_user.split(',').map(Number)),
        image                                     : this.fb.control(this.logourl),
      });
    }
  }

  //access the user according the roles 
  selectedRoll(event) {
    console.log('in selected role', event.value);
    this._usersService.getUsers({ 'roles': event.value }).then(Response => {
      console.log('response', Response);
      this.userList = Response.data;
    });
  }
  selectedUser($event) {
    this.selectedUsers = $event;
  }
  onClickSave() {

    let value = this.addGuestRoomSetting.value;
    console.log("value",value);
    let formData = {
      "first_day_week": value.first_day_week,
      "default_booking_status": value.default_booking_status,
      "reservation_time_price_on": value.reservation_time_price_on,
      "room_reservation_pending_time": value.room_reservation_pending_time,
      "Default_img": this.logourl,
      'userrole_id' : value.userrole_id.toString(),
      "admin_user": value.admin_user.toString(),
      "custom_admin_email": value.custom_admin_email,
      "email_notification": JSON.stringify({
        "admin_booking_confirmation": {
          "subject": value.admin_booking_confirm_subject,
          "mail_body": value.admin_booking_confirmation_mail_body
        },
        "resident_booking_confirmation": {
          "subject": value.resident_booking_confirmation_subject,
          "mail_body": value.resident_booking_confirmation_mail_body
        },
        "admin_booking_cancellation": {
          "subject": value.admin_booking_cancel_subject,
          "mail_body": value.admin_booking_cancel_mail_body
        },
        "resident_booking_cancellation": {
          "subject": value.resident_booking_cancel_subject,
          "mail_body": value.resident_booking_cancel_mail_body
        }
      })
    }


    this._settingService.createGuestRoomSetting(formData)
      .then(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
      },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration: 2000
          });
        });

  }

  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed

        this.mediaInfo = new FormData();
        this.mediaInfo.append('image', this.file);
        this.mediaInfo.append('type', 'guestroom');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "");
            if (uploadResponse.media.image) {
              this.logourl = event.target.result;
              this.designpartData.emit(this.addGuestRoomSetting.value);
            }
          });

      }
    }

  }
}
