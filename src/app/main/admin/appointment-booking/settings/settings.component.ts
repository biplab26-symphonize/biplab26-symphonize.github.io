import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { MatSnackBar } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { CommonService, SettingsService } from 'app/_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: fuseAnimations
})
export class SettingsComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public addAppointementBookingSetting: FormGroup;
  public tinyMceSettings = {};
  readonly EDITOR_TAB = 4;

  constructor(
    private _commonService: CommonService,
    private fb: FormBuilder,
    private _settingService: SettingsService,
    private _matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.setControls();
    this.tinyMceSettings = CommonUtils.getTinymceSetting();

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

  setControls() {
    this.addAppointementBookingSetting = this.fb.group({
      first_day_week: this.fb.control('sunday'),
      default_booking_status: this.fb.control('confirmed'),
      accept_booking_earlier: this.fb.control(''),
      accept_cancel_earlier: this.fb.control(''),
      accept_booking_days_earlier: this.fb.control(''),
      admin_booking_confirm_subject: this.fb.control(''),
      admin_booking_confirmation_mail_body: this.fb.control(''),
      resident_booking_confirmation_subject: this.fb.control(''),
      resident_booking_confirmation_mail_body: this.fb.control(''),
      admin_booking_cancel_subject: this.fb.control(''),
      admin_booking_cancel_mail_body: this.fb.control(''),
      resident_booking_cancel_subject: this.fb.control(''),
      resident_booking_cancel_mail_body: this.fb.control(''),
      display_past_dates: this.fb.control('N'),
      restrict_service_registration_only_once: this.fb.control('N'),
      guest_field_required: this.fb.control('Y'),
      update_service_resident_mail: this.fb.control(''),
      update_service_resident_mail_mail_body: this.fb.control(''),
      confirmed: this.fb.control('Confirmed'),
      pending: this.fb.control('Pending'),
      cancelled: this.fb.control('Cancelled')
    });

    this._settingService.getAppointmentBookingSetting({ meta_type: "appointment" }).then(res => {
      this.getDiningSettingData(res.data);
    })

  }

  getDiningSettingData(response) {
    console.log('response', response);
    let data;
    let first_day_week;
    let default_booking_status;
    let accept_booking_earlier;
    let accept_cancel_earlier;
    let accept_booking_days_earlier;
    let restrict_service_registration_only_once;
    let display_past_dates;
    let guest_field_required;
    let statusLabel;
    if (response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        if (response[i].meta_key == "email_notification") {
          data = JSON.parse(response[i].meta_value);
        }
        if (response[i].meta_key == "restrict_service_registration_only_once") {
          restrict_service_registration_only_once = response[i].meta_value;
        }
        if (response[i].meta_key == "accept_booking_days_earlier") {
          accept_booking_days_earlier = response[i].meta_value;
        }
        if (response[i].meta_key == "accept_cancel_earlier") {
          accept_cancel_earlier = response[i].meta_value;
        }
        if (response[i].meta_key == "accept_booking_earlier") {
          accept_booking_earlier = response[i].meta_value;
        }
        if (response[i].meta_key == "default_booking_status") {
          default_booking_status = response[i].meta_value;
        }
        if (response[i].meta_key == "first_day_week") {
          first_day_week = response[i].meta_value;
        }
        if (response[i].meta_key == "display_past_dates") {
          display_past_dates = response[i].meta_value;
        }
        if (response[i].meta_key == "guest_field_required") {
          guest_field_required = response[i].meta_value;
        }
        if (response[i].meta_key == "status_label") {
          statusLabel = JSON.parse(response[i].meta_value);
        }

      }

      this.addAppointementBookingSetting = this.fb.group({
        first_day_week: this.fb.control(first_day_week),
        default_booking_status: this.fb.control(default_booking_status),
        accept_booking_earlier: this.fb.control(accept_booking_earlier),
        accept_cancel_earlier: this.fb.control(accept_cancel_earlier),
        accept_booking_days_earlier: this.fb.control(accept_booking_days_earlier),
        admin_booking_confirm_subject: this.fb.control(data.admin_booking_confirmation.subject != "" ? data.admin_booking_confirmation.subject : ''),
        admin_booking_confirmation_mail_body: this.fb.control(data.admin_booking_confirmation.mail_body != "" ? data.admin_booking_confirmation.mail_body : ''),
        resident_booking_confirmation_subject: this.fb.control(data.resident_booking_confirmation.subject != "" ? data.resident_booking_confirmation.subject : ''),
        resident_booking_confirmation_mail_body: this.fb.control(data.resident_booking_confirmation.mail_body != "" ? data.resident_booking_confirmation.mail_body : ''),
        admin_booking_cancel_subject: this.fb.control(data.admin_booking_cancellation.subject != "" ? data.admin_booking_cancellation.subject : ''),
        admin_booking_cancel_mail_body: this.fb.control(data.admin_booking_cancellation.mail_body != '' ? data.admin_booking_cancellation.mail_body : ''),
        resident_booking_cancel_subject: this.fb.control(data.resident_booking_cancellation.subject != '' ? data.resident_booking_cancellation.subject : ''),
        resident_booking_cancel_mail_body: this.fb.control(data.resident_booking_cancellation.mail_body != '' ? data.resident_booking_cancellation.mail_body : ''),
        display_past_dates: this.fb.control(display_past_dates),
        restrict_service_registration_only_once: this.fb.control(restrict_service_registration_only_once),
        update_service_resident_mail: this.fb.control(data.update_service_resident.subject != "" ? data.update_service_resident.subject : ''),
        update_service_resident_mail_mail_body: this.fb.control(data.update_service_resident.mail_body != "" ? data.update_service_resident.mail_body : ''),
        guest_field_required: this.fb.control(guest_field_required),
        confirmed: this.fb.control(statusLabel.confirmed),
        pending: this.fb.control(statusLabel.pending),
        cancelled: this.fb.control(statusLabel.cancelled)

      });
    }


  }

  onClickSave() {

    let value = this.addAppointementBookingSetting.value;
    console.log('formdata', value);
    let formData = {
      "first_day_week": value.first_day_week,
      "default_booking_status": value.default_booking_status,
      "accept_booking_earlier": value.accept_booking_earlier,
      "accept_cancel_earlier": value.accept_cancel_earlier,
      "accept_booking_days_earlier": value.accept_booking_days_earlier,
      "guest_field_required": value.guest_field_required,
      "display_past_dates": value.display_past_dates,
      "restrict_service_registration_only_once": value.restrict_service_registration_only_once,
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
        'update_service_resident': {
          "subject": value.update_service_resident_mail,
          "mail_body": value.update_service_resident_mail_mail_body
        }
      }),
      "status_label": JSON.stringify({
        "confirmed": value.confirmed,
        "pending": value.pending,
        "cancelled": value.cancelled
      })
    }


    this._settingService.createAppointmentBookingSetting(formData)
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



}

