import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, AttendeesService, UsersService, CommonService } from 'app/_services';
import { EventsService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { GuestsComponent } from '../guests/guests.component';
import { CommonUtils } from 'app/_helpers';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {

  isSubmit: boolean = false;
  EventInfo: any = {};
  EventSettings: any = {};
  unamePattern = "^[a-zA-Z0-9\.]*$";
  editAttendeeForm: boolean = false;
  event_id: number;
  attendeeform: FormGroup;
  eventSpecialFields: FormArray;
  specialfieldsArray: any[] = [];
  StatusList: any;
  groupLimit: any[] = [];
  filteredUsers: any[] = [];
  disableSubmit: boolean = false;
  registerStatus: string = 'registered';
  isWaiting: string = 'N';
  disableRegister: boolean = false;
  @ViewChild(GuestsComponent, { static: true }) private guestInfo: GuestsComponent;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _attendeesService: AttendeesService,
    private _userService: UsersService,
    private _eventsService: EventsService,
    private _commonService: CommonService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.event_id = this.route.params['value'].event_id || 0;
    //Roles List
    this.StatusList = { ...OptionsList.Options.tables.status.attendeestatus };
    delete this.StatusList.cancelled;
    //EventSettings
    let eventSettings = this._commonService.getLocalSettingsJson('event-settings');
    this.EventSettings = eventSettings ? eventSettings[0] : {};



    //Get Event Info
    this._eventsService.getEventInfo(this.route.params['value'].event_id || 0)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(eventInfo => {
        this.EventInfo = eventInfo.eventinfo;
        //Set Attendee Limit
        this.setGroupLimit(this.EventInfo);
        //Set is_waiting and registration status to send in api change on 2552020
        if (this.EventInfo.availablespace.attendeespace > 0) {
          this.registerStatus = 'registered';
          this.isWaiting = 'N';
          delete this.StatusList.waitlist;
        }
        else if (this.EventInfo.availablespace.attendeespace <= 0) {
          this.registerStatus = 'waitlist';
          this.isWaiting = 'Y';
          delete this.StatusList.registered;
          delete this.StatusList.checkedin;

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
    this.attendeeform
      .get('username').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getUsers({ 'searchKey': value, autocomplete: '1' }))
      )
      .subscribe(users => this.filteredUsers = users.data);

  }
  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.attendeeform = this._formBuilder.group({
      attendee_id: [null],
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
      status: [this.registerStatus, [Validators.required]],
      guestinfo: [[]],
      is_waiting: this.isWaiting,
      eventattendeespecialfields: this._formBuilder.array([])
    });
  }
  //Fill Autocomplete Values
  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      //delete status of user
      delete userInfo.option.value.status;
      this.attendeeform.patchValue(userInfo.option.value);
      this.setRegistrationValues();
    }
  }
  setRegistrationValues() {
    this.attendeeform.get('is_waiting').setValue(this.isWaiting);
    this.attendeeform.get('status').setValue(this.registerStatus);
    // console.log(this.attendeeform.value);
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
  setGroupLimit(eventInfo: any) {
    let groupLimit = this.EventInfo.group_limit || 0;
    if (this.EventSettings.waitlist_settings.guest_attendee == 'Y') {
      if (this.EventInfo.availablespace.attendeespace > 0 && this.EventInfo.availablespace.attendeespace < this.EventInfo.group_limit) {
        groupLimit = this.EventInfo.availablespace.attendeespace;
      }
      else if (this.EventInfo.availablespace.attendeespace == 0 &&
        this.EventInfo.is_waitlist == 'Y' &&
        this.EventInfo.availablespace.waitlistspace > 0 && this.EventInfo.availablespace.waitlistspace < this.EventInfo.group_limit) {
        groupLimit = this.EventInfo.availablespace.waitlistspace;
      }
      else if ((this.EventInfo.availablespace.attendeebookedcount >= this.EventInfo.attendee_limit && this.EventInfo.is_waitlist == 'N') || (this.EventInfo.availablespace.waitlistbookedcount >= this.EventInfo.waitlist_limit && this.EventInfo.is_waitlist == 'Y')) {
        this.disableRegister = true;
      }
      else {
        groupLimit = groupLimit;
        this.disableRegister = false;
      }
    }
    this.groupLimit = Array.from(new Array(groupLimit), (val, index) => index + 1);
  }
  resetGroupLimit(resetCount: number = 1) {
    this.attendeeform.get('guestcount').setValue(resetCount);
  }
  //validate form from guest component
  validateParentForm($event) {
    this.disableSubmit = $event;
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
            this.router.navigate(['/admin/attendees/list', this.event_id]);
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