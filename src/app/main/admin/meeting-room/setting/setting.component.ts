import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { SettingsService, CommonService, AppConfig } from 'app/_services';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  animations: fuseAnimations
})
export class SettingComponent implements OnInit {

  public addMeetingRoomSetting: FormGroup;
  public tinyMceSettings = {};
  readonly EDITOR_TAB = 4;
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  @Output() designpartData = new EventEmitter();
  private file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  mediaInfo: any = [];
  constructor(private fb: FormBuilder,
    private _settingService: SettingsService,
    private _matSnackBar: MatSnackBar, private _commonService: CommonService) { }

  ngOnInit() {
    this.setControls();
    this.tinyMceSettings = CommonUtils.getTinymceSetting();

  }
  setControls() {
    this.addMeetingRoomSetting = this.fb.group({
      first_day_week: this.fb.control('sunday'),
      number_of_items_per_page: this.fb.control(''),
      accept_booking_earlier: this.fb.control(''),
      new_booking_received_email: this.fb.control('no'),
      image: this.fb.control(''),
      admin_booking_confirm_subject: this.fb.control('no'),
      admin_booking_confirmation_mail_body: this.fb.control(''),
      resident_booking_confirmation_subject: this.fb.control(''),
      resident_booking_confirmation_mail_body: this.fb.control(''),
      admin_booking_cancel_subject: this.fb.control(''),
      admin_booking_cancel_mail_body: this.fb.control(''),
      resident_booking_cancel_subject: this.fb.control(''),
      resident_booking_cancel_mail_body: this.fb.control(''),
      confirmed: this.fb.control('Confirmed'),
      pending: this.fb.control('Pending'),
      cancelled: this.fb.control('Cancelled'),
    });

    this._settingService.getMeetingRoomSetting({ 'meta_type': "meeting", 'meta_key': '', 'column': 'setting_id', 'direction': 'asc' }).then(res => {
      this.getMeetingSettingData(res.data);
    })
  }
  getMeetingSettingData(response) {
    let data;
    let first_day_week;
    let number_of_items_per_page;
    let accept_booking_earlier;
    let new_booking_received_email;
    let Default_img;
    let statusLabel;
    if (response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        if (response[i].meta_key == "email_notification") {
          data = JSON.parse(response[i].meta_value);
        }
        if (response[i].meta_key == "first_day_week") {
          first_day_week = response[i].meta_value;
        }
        if (response[i].meta_key == "number_of_items_per_page") {
          number_of_items_per_page = response[i].meta_value;
        }
        if (response[i].meta_key == "accept_booking_earlier") {
          accept_booking_earlier = response[i].meta_value;
        }
        if (response[i].meta_key == "Default_img") {
          Default_img = response[i].meta_value;
          console.log("default image", Default_img);
          this.filetype = true;
          this.logourl = Default_img;
        }
        if (response[i].meta_key == "new_booking_received_email") {
          new_booking_received_email = response[i].meta_value;
        }
        if (response[i].meta_key == "status_label") {
          statusLabel = JSON.parse(response[i].meta_value);
        }
      }
      this.addMeetingRoomSetting = this.fb.group({
        first_day_week: this.fb.control(first_day_week),
        number_of_items_per_page: this.fb.control(number_of_items_per_page),
        accept_booking_earlier: this.fb.control(accept_booking_earlier),
        new_booking_received_email: this.fb.control(new_booking_received_email),
        confirmed: this.fb.control(statusLabel.confirmed),
        pending: this.fb.control(statusLabel.pending),
        cancelled: this.fb.control(statusLabel.cancelled),
        admin_booking_confirm_subject: this.fb.control(data.admin_booking_confirmation.subject != "" ? data.admin_booking_confirmation.subject : ''),
        admin_booking_confirmation_mail_body: this.fb.control(data.admin_booking_confirmation.mail_body != "" ? data.admin_booking_confirmation.mail_body : ''),
        resident_booking_confirmation_subject: this.fb.control(data.resident_booking_confirmation.subject != "" ? data.resident_booking_confirmation.subject : ''),
        resident_booking_confirmation_mail_body: this.fb.control(data.resident_booking_confirmation.mail_body != "" ? data.resident_booking_confirmation.mail_body : ''),
        admin_booking_cancel_subject: this.fb.control(data.admin_booking_cancellation.subject != "" ? data.admin_booking_cancellation.subject : ''),
        admin_booking_cancel_mail_body: this.fb.control(data.admin_booking_cancellation.mail_body != '' ? data.admin_booking_cancellation.mail_body : ''),
        resident_booking_cancel_subject: this.fb.control(data.resident_booking_cancellation.subject != '' ? data.resident_booking_cancellation.subject : ''),
        resident_booking_cancel_mail_body: this.fb.control(data.resident_booking_cancellation.mail_body != '' ? data.resident_booking_cancellation.mail_body : ''),
      });
    }
  }
  onClickSave() {
    let value = this.addMeetingRoomSetting.value;
    console.log("fomr data", value);
    let formData = {
      "first_day_week": value.first_day_week,
      "number_of_items_per_page": value.number_of_items_per_page,
      "accept_booking_earlier": value.accept_booking_earlier,
      "new_booking_received_email": value.new_booking_received_email,
      "Default_img": this.uploadInfo.avatar.url,
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
        },
      }),
      "status_label": JSON.stringify({
        "confirmed": value.confirmed,
        "pending": value.pending,
        "cancelled": value.cancelled
      })
    }
    this._settingService.createMeetingRoomSetting(formData)
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
        this.mediaInfo.append('type', 'meetingroom');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "");
            if (uploadResponse.media.image) {
              this.logourl = event.target.result;
              this.designpartData.emit(this.addMeetingRoomSetting.value);
            }
          });

      }
    }

  }
}
