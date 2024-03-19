import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { AppConfig, AttendeesService, UsersService, LocationService, SettingsService, AuthService, CommonService, EventbehavioursubService } from 'app/_services';
import { EventsService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { GuestsComponent } from 'app/main/admin/events/attendees/guests/guests.component';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import moment from 'moment-timezone';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: fuseAnimations
})
export class RegistrationComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  isSubmit: boolean = false;
  restrictFormInfo: boolean = false;
  public EventInfo: any;
  public EventSettings: any;
  unamePattern = "^[a-zA-Z0-9\.]*$";
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  UserInfo: any = {};
  editAttendeeForm: boolean = false;
  disableSubmit: boolean = false;
  event_id: number;
  attendeeform: FormGroup;
  eventSpecialFields: FormArray;
  specialfieldsArray: any[] = [];
  StatusList: any;
  allowGroupRegister: boolean = false;
  groupLimit: any[] = [];
  regEnable: boolean = true;
  registrationpopclosed: boolean = false;
  registerStatus: string = 'registered';
  calendarSlug: string = '';
  isWaiting: string = 'N';
  filteredUsers: any[] = [];
  public role_id: any;
  public generalSettings: any = {};
  public autopopulateIds: any;
  public kioskUserRoles: any[] = AppConfig.Settings.permissions['kiosk'] || [];
  public userId: any = null;

  @ViewChild(GuestsComponent, { static: true }) private guestInfo: GuestsComponent;

  public _unsubscribeAll: Subject<any>;

  constructor(
    private authenticationService: AuthService,
    private _eventsService: EventsService,
    public _matDialog: MatDialog,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private _fuseConfigService: FuseConfigService,
    private _locationService: LocationService,
    private _settingService: SettingsService,
    private _commonService: CommonService,
    private _attendeesService: AttendeesService,
    private _eventbehavioursubService: EventbehavioursubService) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();

  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.event_id = this.route.params['value'].event_id || 0;
    //UserInfo
    this.UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    //Remove status Option from userInfo becuase we set status by using attendee space
    delete this.UserInfo.status;
    //EventSettings
    const eventsettings = this._settingService.setting;
    this.EventSettings = CommonUtils.getStringToJson(eventsettings.settingsinfo.meta_value);
    this.EventSettings = this.EventSettings.length > 0 ? this.EventSettings[0] : {};
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');

    //Get Event Info
    this._eventsService.getEventInfo(this.route.params['value'].event_id || 0)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(eventInfo => {
        this.EventInfo = eventInfo.eventinfo;
        this.calendarSlug = this.EventInfo && this.EventInfo.eventcalendar && this.EventInfo.eventcalendar.category_alias ? this.EventInfo.eventcalendar.category_alias : '';
        //Update Dates
        this.EventInfo.event_start_date = CommonUtils.getStringToDate(this.EventInfo.event_start_date + ' ' + this.EventInfo.event_start_time);
        if (this.EventInfo.event_end_time) {
          this.EventInfo.event_end_date = CommonUtils.getStringToDate(this.EventInfo.event_end_date + ' ' + this.EventInfo.event_end_time);
        }
        else {
          this.EventInfo.event_end_date = CommonUtils.getStringToDate(this.EventInfo.event_end_date);
        }

        if (this.EventInfo.registration_start && this.EventInfo.registration_start !== '') {
          this.EventInfo.registration_start = CommonUtils.getStringToDate(this.EventInfo.registration_start);
        }
        if (this.EventInfo.registration_end && this.EventInfo.registration_end !== '') {
          this.EventInfo.registration_end = CommonUtils.getStringToDate(this.EventInfo.registration_end);
        }
        //multiple locations alter
        if (this.EventInfo && this.EventInfo.eventlocations && this.EventInfo.eventlocations.length > 0) {
          let locationsString = this.EventInfo.eventlocations.map(item => {
            let locationName = item.eventlocation && item.eventlocation.category_name ? item.eventlocation.category_name : '';
            return locationName;
          });
          this.EventInfo.eventlocation.category_name = locationsString !== '' && locationsString !== undefined ? locationsString.join(', ') : '';
        }
        //Set Attendee Limit
        this.setGroupLimit(this.EventInfo);
        //Set is_waiting and registration status to send in api change on 2552020
        if (this.EventInfo.availablespace.attendeespace > 0) {
          this.registerStatus = 'registered';
          this.isWaiting = 'N';
        }
        else if (this.EventInfo.availablespace.attendeespace <= 0) {
          this.registerStatus = 'waitlist';
          this.isWaiting = 'Y';
        }
        if (this.attendeeform) {
          //Set is_waiting and status field values by using availablespace 
          this.setRegistrationValues();
        }
        this.patchSpecialFields();
      });
    //Form Group
    this.setFormControls();
    //Get Users Autocompletelist
    let ignoreIds = this.kioskUserRoles.includes(this.role_id) ? this.userId : '';
    this.attendeeform.get('username').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getUsers({ 'searchKey': value, ignore_ids: ignoreIds, autocomplete: '1' }))
      )
      .subscribe(users => this.filteredUsers = users.data);

    //RESTRICT RESIDENT USER FORM EDIT
    this._eventbehavioursubService.restrictFormEdit
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        if (response == true) {
          this.restrictFormInfo = true;
        }
      });

  }

  scrollEvent = (event: any): void => {
    if (this.autoComplete) {
      if (this.autoComplete.panelOpen)
        // this.autoComplete.closePanel();
        this.autoComplete.updatePosition();
    }
  }
  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.attendeeform = this._formBuilder.group({
      user_id: [''],
      event_id: [this.event_id || '', [Validators.required]],
      username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      middle_name: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required]],
      phone: [''],
      notes: [''],
      guestcount: [1],
      attendee_type: ['M', [Validators.required]],
      guestinfo: [[]],
      is_waiting: [this.isWaiting],
      status: [this.registerStatus],
      eventattendeespecialfields: this._formBuilder.array([])
    });
    if (this.UserInfo) {
      this.patchFormValues();
    }
  }
  //PatchFormValue
  patchFormValues() {
    this.role_id = this.UserInfo.user_roles.role_id;
    if (this.generalSettings.autopopulate) {
      this.autopopulateIds = this.generalSettings.autopopulate.split(',').map(Number);
      if (this.autopopulateIds.indexOf(this.role_id) !== -1) {
        this.attendeeform.get('username').enable();
      } else {
        this.attendeeform.get('username').disable();
      }
    }
    this.UserInfo.user_id = this.UserInfo.id;
    this.userId = this.UserInfo.user_id;
    //If Role is not kisok user
    if (!this.kioskUserRoles.includes(this.role_id)) {
      this.attendeeform.patchValue(this.UserInfo);
    }
  }
  //show special fields with user fields
  patchSpecialFields() {
    if (this.EventInfo && this.EventInfo.specialfields && this.EventInfo.specialfields.length > 0) {
      this.specialfieldsArray = this.EventInfo.specialfields.map(item => {
        if (item.options_text !== '' && item.options_text !== null) {
          item.options_text = JSON.parse(item.options_text);
        }
        return item;
      }) || [];
      if (this.specialfieldsArray && this.specialfieldsArray.length > 0) {
        this.specialfieldsArray.map((item, index) => {
          const tempObj = {};
          if (item.field_type == 'T') {
            tempObj[item.id] = new FormControl('');
          }
          else {
            tempObj[item.id] = new FormControl('');
            /*
            if(item && item.options_text!==null && item.options_text!==undefined && item.options_text.length>0){
              tempObj[item.id]  = this._formBuilder.array(this.createSpecialOptions(item));  
            }
            */
          }
          this.eventSpecialFields = this.attendeeform.get('eventattendeespecialfields') as FormArray;
          this.eventSpecialFields.push(this._formBuilder.group(tempObj));
        });
      }
      console.log("this.eventSpecialFields", this.eventSpecialFields);
    }
  }
  //Fill Autocomplete Values
  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      if (userInfo.option.value.status) {
        delete userInfo.option.value.status;
      }
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.attendeeform.patchValue(userInfo.option.value);
    }
  }

  PhoneNumberValidations(event) {
    console.log(event.target.value[3]);

    if (event.target.value.length == 7) {
      let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
      console.log(values[2].length);
      event.target.value = values[1] + '-' + values[2]
      this.attendeeform.get('phone').setValue(event.target.value);
    }
    else {

      if (event.target.value.length == 10) {
        let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
        event.target.value = values[1] + '-' + values[2] + '-' + values[3];
        this.attendeeform.get('phone').setValue(event.target.value);
      } else {
        if ((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7] == '-' && event.target.value.length == 12)) {
          this.attendeeform.get('phone').setValue(event.target.value);
        } else {
          this.attendeeform.get('phone').setValue('');
        }
      }
    }
  }

  setRegistrationValues() {
    this.attendeeform.get('is_waiting').setValue(this.isWaiting);
    this.attendeeform.get('status').setValue(this.registerStatus);
    // console.log(this.attendeeform.value);
  }
  setGroupLimit(eventInfo: any) {
    let groupLimit = this.EventInfo.group_limit || 0;
    if (this.EventSettings.waitlist_settings.guest_attendee == 'Y' && this.EventInfo.group_register == 'Y') {
      if (this.EventInfo.availablespace.attendeespace > 0 && this.EventInfo.availablespace.attendeespace < this.EventInfo.group_limit) {
        groupLimit = this.EventInfo.availablespace.attendeespace;
      }
      else if (this.EventInfo.availablespace.attendeespace == 0 && this.EventInfo.is_waitlist == 'Y' && this.EventInfo.availablespace.waitlistspace > 0 && this.EventInfo.availablespace.waitlistspace < this.EventInfo.group_limit) {
        groupLimit = this.EventInfo.availablespace.waitlistspace;
      }
      else {
        groupLimit = groupLimit;
      }
    }
    else if ((this.EventInfo.availablespace.attendeespace == 0 && this.EventSettings.waitlist_settings.guest_attendee == 'N') || this.EventInfo.group_register == 'N') {
      groupLimit = 1;
    }
    this.groupLimit = Array.from(new Array(groupLimit), (val, index) => index + 1);
  }
  resetGroupLimit(resetCount: number = 1) {
    this.attendeeform.get('guestcount').setValue(resetCount);
  }
  //validate form from guest component
  validateParentForm($event) {
    setTimeout(() => {
      this.disableSubmit = $event;
    }, 0);
  }
  /** Update Guest Info From Array */
  setguestInfoFieldValue($event: any) {
    this.attendeeform.get('guestinfo').setValue($event);
  }

  /**SAVE FORM DATA */
  onSubmit(value: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.attendeeform.valid) {
      let specialFieldArray = [];
      let submittedInfo = { ...this.attendeeform.value };
      if (submittedInfo && submittedInfo.eventattendeespecialfields) {
        submittedInfo.eventattendeespecialfields.map(item => {
          let specialObj = {};
          if (Object.keys(item) && Object.keys(item).length > 0 && Object.values(item).length > 0) {
            specialObj['special_field_id'] = Object.keys(item)[0];
            specialObj['special_field_value'] = Object.values(item)[0];
            specialFieldArray.push(specialObj);
          }
        });
      }

      this.isSubmit = true;
      let submitFormData = { ...this.attendeeform.getRawValue() };
      submitFormData.eventattendeespecialfields = specialFieldArray.length > 0 ? specialFieldArray : '';

      this._attendeesService.saveAttendee(submitFormData, this.editAttendeeForm)
        .subscribe(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
            if (response.attendeeinfo && response.attendeeinfo.attendee_id > 0)
              this.router.navigate(['/events/confirmed', response.attendeeinfo.attendee_id]);
          }
          else {
            this.showSnackBar(response.message, 'CLOSE');
          }
          this.isSubmit = false;
        },
          error => {
            this.showSnackBar(error.message, 'CLOSE');
          });
    }
  }
  //Show Dialog when RegTime pass away
  checkRegistrationTime($event) {
    if (this.EventInfo && this.EventInfo.registration_start && this.EventInfo.registration_end) {
      this.regEnable = moment(this.EventInfo.registration_end).isSameOrAfter(moment());
      if (this.regEnable == false && this.registrationpopclosed == false) {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Event Registration Closed, Register For Another Event ?';
        this.confirmDialogRef.afterClosed()
          .subscribe(result => {
            this.registrationpopclosed = true;
            if (result) {
              this.router.navigate(['events']);
            }
          });
      }
    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
