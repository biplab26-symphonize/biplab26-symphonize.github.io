import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UsersService, OptionsList, DiningReservationService, CommonService, ChatService, AuthService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
//import { MatSnackBar, MatDialog, MatDialogRef  } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { DiningReservationmodel, User } from 'app/_models';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DiningGuestsComponent } from '../dining-guests/dining-guests.component';
import { Observable, of } from 'rxjs';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { environment } from 'environments/environment';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public addBookingForm: FormGroup;
  public title: string = '';
  filteredUsers: any[] = [];
  filteredGuests: any[] = [];
  public recurring_everyList: any = [];
  public services: any;
  public selectedService: any;
  public serviceID: any;
  public serviceDate: any;
  public getTimeSlots: any = [];
  public partySize: any = [];
  public selectedDate: any;
  public getGuestsCount: any = [];
  public guestVal: any;
  public currentTimeSlot: any;
  public url_id: any;
  public week_days: any = [];
  public editBookingData: boolean = false;
  public recucrrencedate: any;
  public recurrenceEditDate: any;
  public recurring_meta: any;
  public recurringEditMeta: any = [];
  public availableDates: any = [];
  public isUpdateVal: any;
  public isRecurring: any;
  public buttonTitle: any;
  public parent_booking_id: any;
  public groupLimit: any[] = [];
  public minDate: any;
  public displayServiceFull: boolean = false;
  public disableSubmit: boolean = false;
  public serviceStartDate: any;
  public serviceEndDate: any;
  public dateSelectedCal: any;
  public guestRequired: any;
  public userId: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;


  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  @ViewChild(DiningGuestsComponent, { static: true }) private guestInfo: DiningGuestsComponent;

  constructor(private fb: FormBuilder,
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private _userService: UsersService,
    private _diningService: DiningReservationService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _commonService: CommonService) {
    if (this.route.routeConfig.path == 'admin/dining-reservation/bookings/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editBookingData = true;
    }
    this.url_id ? this.title = "Update Bookings" : this.title = "New Reservation";
    this.url_id ? this.buttonTitle = "Update" : this.buttonTitle = "Save";
    this.minDate = new Date();

  }

  ngOnInit() {

    this._diningService.getGuestRestrictions({ 'meta_key': 'guest_field_required' }).subscribe(response => {

      this.guestRequired = response.settingsinfo.meta_value;
    });

    this.recurring_everyList = OptionsList.Options.recurring_everyList;
    //this.week_days           = OptionsList.Options.dining_week_days;
    this.week_days = OptionsList.Options.week_days;

    this.setControls();
    this.addBookingForm
      .get('first_name').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getUsers({ 'searchKey': value, autopopulate:1 }))
      )
      .subscribe(users => this.filteredUsers = users.data);
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    
  }

  setControls() {
    this.addBookingForm = this.fb.group({
      first_name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      phone: this.fb.control('', [Validators.required]),
      services: this.fb.control(''),
      notes: this.fb.control(''),
      booking_start_date: this.fb.control(new Date()),
      is_recurring: this.fb.control('N'),
      recurringrepeat: this.fb.control(''),
      repeat: this.fb.control(''),
      byday: this.fb.control(''),
      bymonthday: this.fb.control(''),
      interval: this.fb.control(''),
      occurence: this.fb.control(''),
      end_date: this.fb.control(''),
      guestcount: this.fb.control(1),
      repeat_by: this.fb.control(''),
      guestinfo: [[]],
      id: this.fb.control('')
    });

    this._diningService.getServices({ 'status': 'A' }).subscribe(response => {
      this.services = response.data;
      if (this.route.routeConfig.path != 'admin/dining-reservation/bookings/edit/:id') {
        this.addBookingForm.patchValue({ services: this.services[0].id });
        this.serviceStartDate = this.services[0].service_start_date;
        this.serviceEndDate = this.services[0].service_end_date;
        this.serviceID = this.addBookingForm.get('services').value;
        this.serviceDate = moment(this.addBookingForm.get('booking_start_date').value).format('YYYY-MMM-DD');
        this.dateSelectedCal = moment(this.serviceDate).format('YYYY-MM-DD');
        this.timeSlots(this.serviceID, this.serviceDate);
      }


    });

    /**set the default value booking recurring */
    this.addBookingForm.patchValue({ recurringrepeat: 'DAILY' });

    /**set the default value for the every dropdown */
    this.addBookingForm.patchValue({ interval: this.recurring_everyList[0] });
    if (this.route.routeConfig.path == 'admin/dining-reservation/bookings/edit/:id') {
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      //this.fillBookingValues();
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this._diningService.getBookingList({ 'direction': 'desc', 'column': 'id' }).then(Response => {
      this.serviceList = Response.data;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.userId) {
              let edit: boolean = true;
              this.fillBookingValues();
            }
            if (item.editrestriction.user.id != this.userId) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {
            this.fillBookingValues();
          }
        }
      });
      this.showDialog();
    });

  }
  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._dialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'printentries',
        data: { type: 'UpdateDiningBookings', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/dining-reservation/bookings/list']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.savingEntry = true;
          this.editRestrictService();
        }
      });
    }
  }
  editRestrictService() {
    this._diningService.updateForm(this.url_id, 'diningbooking').subscribe(response => {
      this.fillBookingValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.dining_booking_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter == 1) {
        this.showPopup();
      }

    });
  }
  showPopup() {
    const dialogRef = this._dialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'UpdateDiningBookings', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/dining-reservation/bookings/list']);
      }
    });
  }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.userId;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'diningbooking';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }

  fillBookingValues() {
    let edit: boolean = true;
    this._diningService.getBookingContents(this.url_id, edit).subscribe(response => {
      let formData = response.bookinginfo;
      this.addBookingForm.patchValue(formData);
      this.addBookingForm.patchValue({ first_name: formData.name });
      this.addBookingForm.patchValue({ services: formData.service_id });
      this.addBookingForm.patchValue({ id: formData.user_id });
      this.serviceID = formData.service_id
      var d = new Date(formData.booking_start_date);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
      this.selectedDate = d;
      this.serviceDate = formData.booking_start_date;
      this.isRecurring = formData.is_recurring;
      this.parent_booking_id = formData.parent_booking_id;
      //this.addBookingForm.patchValue({guestcount:formData.guestcount});
      if (formData.is_recurring != 'N') {
        let recurringMeta = JSON.parse(formData.recurring_meta);
        const Byday = typeof recurringMeta.BYDAY == 'string' ? recurringMeta.BYDAY.split('') : (recurringMeta.BYDAY.toString()).split('');
        this.addBookingForm.patchValue({ recurringrepeat: recurringMeta.FREQ });
        this.addBookingForm.patchValue({ byday: Byday });
        this.addBookingForm.patchValue({ occurence: recurringMeta.COUNT });
        this.addBookingForm.patchValue({ interval: recurringMeta.INTERVAL });
        this.addBookingForm.patchValue({ repeat_by: recurringMeta.REPEAT_BY });
        this.addBookingForm.patchValue({ end_date: moment(recurringMeta.UNTIL).format('YYYY-MM-DD') });

        if (recurringMeta.COUNT != '') {
          this.addBookingForm.patchValue({ repeat: 'occurance' });

          this.addBookingForm.get('end_date').disable();
        } if (recurringMeta.UNTIL != '') {
          this.addBookingForm.patchValue({ repeat: 'date' });
          this.addBookingForm.get('occurence').disable();
          this.addBookingForm.get('occurence').reset();

        }
        this.recurrenceEditDate = formData.recurrences;
        if (this.recurrenceEditDate.length != 0) {
          for (var i = 0; i < this.recurrenceEditDate.length; i++) {
            this.availableDates.push(moment(this.recurrenceEditDate[i].booking_start_date).format('YYYY-MM-DD'));
          }
        }
        //this.recucrrencedate = response.recucrrencedate;  
        this.recurringEditMeta = formData.recurring_meta;



      }
      let restricted_by = formData.service.restricted_by;
      let restricted_on_day = formData.service.restricted_on_day;
      let max_residents_per_interval = formData.service.max_residents_per_interval;
      let max_admin_reservations = formData.service.max_admin_reservations;
      let per_day_booking = formData.service.per_day_booking;
      let booked_count = formData.bookedcount;
      let max_party_size = formData.service.max_party_size;
      let guestcnt = formData.guestcount;
      this.getEditPartySizes(formData.booking_start_time, restricted_by, restricted_on_day, max_residents_per_interval, max_admin_reservations, per_day_booking, booked_count, max_party_size, guestcnt);
      // this.timeSlots(formData.service_id,formData.booking_start_date);
      this.editTimeSlots(formData.service_id, formData.booking_start_date);

    });
  }


  timeSlots(serviceID, serviceDate) {
    this.partySize = [];
    this._diningService.getTimeSlots({ 'service_id': serviceID, 'date': serviceDate }).subscribe(response => {
      this.getTimeSlots = response.timeslot;
      this.addBookingForm.get('guestcount').setValue(1);
      //this.getPartySizes(this.currentTimeSlot);
      if (this.getTimeSlots.length != 0) {

        this.getPartySizes(this.currentTimeSlot);
      }
    });

  }

  editTimeSlots(serviceID, serviceDate) {
    this.partySize = [];
    this._diningService.getTimeSlots({ 'service_id': serviceID, 'date': serviceDate }).subscribe(response => {
      this.getTimeSlots = response.timeslot;

    });

  }



  onSelectDate(event) {

    this.serviceDate = moment(event).format('YYYY-MMM-DD');
    this.dateSelectedCal = moment(event).format('YYYY-MM-DD');
    this.selectedDate = event;
    this.timeSlots(this.serviceID, this.serviceDate);
    if (this.addBookingForm.get('is_recurring').value == 'Y' && (this.addBookingForm.get('occurence').value != '' || this.addBookingForm.get('end_date').value != '')) {
      this.getPreviewBookings(this.serviceDate);
    }
  }

  getServices(event) {


    if (this.services && event.value) {
      let status = this.services.filter(s => s.id == event.value);
      if (status) {
        this.serviceStartDate = status[0].service_start_date;
        this.serviceEndDate = status[0].service_end_date;
      } else {
        this.serviceStartDate = '';
        this.serviceEndDate = '';
      }
      this.serviceID = event.value;
      this.timeSlots(this.serviceID, this.serviceDate);
      if (this.addBookingForm.get('is_recurring').value == 'Y' && (this.addBookingForm.get('occurence').value != '' || this.addBookingForm.get('end_date').value != '')) {
        this.getPreviewBookings(this.serviceID);
      }

    }
  }

  getEditPartySizes(timeslot, restricted_by, restricted_on_day, max_residents_per_interval, max_admin_reservations, per_day_booking, booked_count, max_party_size, guestcnt) {

    this.currentTimeSlot = moment(timeslot, 'HH:mm').format('hh:mm A');
    this.partySize = [];
    let max_residents = (restricted_by == 'resident') || (restricted_on_day == 'N') ? (parseInt(max_residents_per_interval) + parseInt(max_admin_reservations)) : (parseInt(per_day_booking) + parseInt(max_admin_reservations));
    let allotedsize = booked_count;
    let subpartysize = max_residents + parseInt(guestcnt) - parseInt(allotedsize);
    let remaining_party_size = (max_residents - allotedsize) + guestcnt;
    this._diningService.getPartySize({ 'service_id': this.serviceID, 'date': this.serviceDate, 'timeslot': timeslot }).subscribe(response => {
      if (restricted_by == 'service') {
        if (remaining_party_size > 0) {
          for (var i = 1; i <= remaining_party_size; i++) {
            this.partySize.push(i);
          }
        }
      } else if (restricted_by == 'parties') {
        if (max_party_size > 0) {
          for (var i = 1; i <= max_party_size; i++) {
            this.partySize.push(i);
          }
        }
      } else {
        let finalPartySize = (subpartysize < max_party_size) ? subpartysize : max_party_size;
        if (finalPartySize > 0) {
          for (var i = 1; i <= finalPartySize; i++) {
            this.partySize.push(i);
          }
        } else {
          this.displayServiceFull = true;
        }
      }
      let groupLimit = response.partysize || 0;
      this.groupLimit = Array.from(new Array(groupLimit), (val, index) => index + 1);
    });

  }

  getPartySizes(timeslot) {

    this.currentTimeSlot = timeslot;
    this.partySize = [];
    this._diningService.getPartySize({ 'service_id': this.serviceID, 'date': this.serviceDate, 'timeslot': timeslot }).subscribe(response => {
      for (var i = 1; i <= response.partysize; i++) {
        this.partySize.push(i);
      }
      let groupLimit = response.partysize || 0;
      this.groupLimit = Array.from(new Array(groupLimit), (val, index) => index + 1);
    });
    if (this.addBookingForm.get('is_recurring').value == 'Y' && (this.addBookingForm.get('occurence').value != '' || this.addBookingForm.get('end_date').value != '')) {
      this.getPreviewBookings(this.currentTimeSlot);
    }
  }

  getGuests(event) {
    this.getGuestsCount = [];
    this.guestVal = event.value - 1;
    for (var i = 0; i < this.guestVal; i++) {
      this.getGuestsCount.push(i);
    }
  }


  resetGroupLimit(resetCount: number = 1) {
    this.addBookingForm.get('guestcount').setValue(resetCount);
  }
  /** Update Guest Info From Array */
  setguestInfoFieldValue($event: any) {
    this.addBookingForm.get('guestinfo').setValue($event);
  }

  //validate form from guest component
  validateParentForm($event){
    //this.disableSubmit = $event;
    if(this.guestRequired == 'Y'){
      this.disableSubmit = $event;
    }else{
      this.disableSubmit = false;
    }  
  }

  createItem() {
    return this.fb.group({
      guest_name: ['', Validators.required],
    })
  }

  //Set guest Fields
  setguestFormfields($event, index) {

    if ($event.option.value) {
      var guestFieldControls = this.addBookingForm.get('guestinfo') as FormArray;
      guestFieldControls.at(index).patchValue($event.option.value);
    }

  }

  onIsRecurringChange(event) {
    this.addBookingForm.get('occurence').disable();
    this.addBookingForm.get('end_date').disable();
  }

  recBookingUpdate(type) {
    this.savingEntry = true;
    if (this.editBookingData == true && type == 'Y') {
      const dialogRef = this._dialog.open(FormFieldsComponent, {
        disableClose: true,
        width: '50%',
        data: { type: 'recurringUpdateBooking', body: '<h2>Recurring Confirmation</h2>' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != 'N') {
          this.isUpdateVal = result;
          this.onSaveFieldClick();
        }

      });
    } else {
      this.onSaveFieldClick();
      this.isUpdateVal = '';
    }
  }

  onSaveFieldClick() {
    this.savingEntry = true;
    let value = this.addBookingForm.value;
    let formData = {
      'name': value.first_name,
      'email': value.email,
      'phone': value.phone,
      'service_id': value.services,
      'notes': value.notes,
      'booking_start_date': this.serviceDate,
      'booking_start_time': this.currentTimeSlot,
      'address': '',
      'attendee_type': 'M',
      'status': 'confirmed',
      'is_recurring': value.is_recurring,
      'recurring_meta': (this.recurring_meta != '' && this.recurring_meta != undefined) ? JSON.stringify(this.recurring_meta) : this.recurringEditMeta,
      'recurrences': this.availableDates.length != 0 ? JSON.stringify(this.availableDates) : '',
      'guestcount': value.guestcount,
      'guestinfo': JSON.stringify(value.guestinfo),
      'user_id': value.id,
      'id': this.editBookingData == true ? this.url_id : '',
      'update': this.isUpdateVal,
      'parent_booking_id': this.parent_booking_id
    }
    if (this.addBookingForm.valid) {
      this._diningService.addBooking(formData, this.editBookingData)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/dining-reservation/bookings/list']);

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


  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.addBookingForm.patchValue(userInfo.option.value);
      this.addBookingForm.get('first_name').setValue(userInfo.option.value.first_name + ' ' + userInfo.option.value.last_name);
    }
  }

  disableOccurance(event) {
    this.addBookingForm.get('occurence').disable();
    this.addBookingForm.get('occurence').reset();
    this.addBookingForm.get('end_date').enable();
    this.addBookingForm.patchValue({ repeat: event.value });
  }

  disableDate(event) {
    this.addBookingForm.get('occurence').enable();
    this.addBookingForm.get('end_date').disable();
    this.addBookingForm.patchValue({ repeat: event.value });
  }

  getRepeatByVal(event) {
    this.addBookingForm.patchValue({ repeat_by: event.value });
    this.getPreviewBookings(event.value);
  }

  /**Get Preview Bookings */
  getPreviewBookings(event) {
    this.availableDates = [];
    let value = this.addBookingForm.value;
    if (this.currentTimeSlot != '' && this.currentTimeSlot != undefined && this.addBookingForm.get('repeat').value != '') {
      //let recurring_week_day  = this.addBookingForm.get('byday').value;
      this._diningService.getPreviewBooking({
        'recurringrepeat': value.recurringrepeat,
        'repeat_by': this.addBookingForm.get('repeat_by').value,
        'interval': value.interval,
        'start_date': this.serviceDate,
        'byday': value.byday.toString(),
        'bymonthday': value.bymonthday,
        'occurence': this.addBookingForm.get('repeat').value == 'occurance' ? this.addBookingForm.get('occurence').value : '',
        'end_date': this.addBookingForm.get('repeat').value == 'date' ? moment(value.end_date).format('YYYY-MMM-DD') : '',
        'service_id': value.services,
        'time': this.currentTimeSlot,
        'guestcount': value.guestcount
      }).subscribe(response => {
        this.recucrrencedate = response.recucrrencedate;
        this.recurring_meta = response.recurringmeta;
        if (this.recucrrencedate.length != 0) {
          for (var i = 0; i < this.recucrrencedate.length; i++) {
            if (this.recucrrencedate[i].class == 'available') {
              this.availableDates.push(moment(this.recucrrencedate[i].date).format('YYYY-MM-DD'));
            }
          }
        }

      });
    }

  }

}
