import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UsersService, OptionsList, AppointmentBookingService, CommonService, ChatService, AuthService } from 'app/_services';
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
import { CommonUtils } from 'app/_helpers';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
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
  public bookingList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  validEmailmsg: string = "Email Address Required";

  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  @ViewChild(DiningGuestsComponent, { static: true }) private guestsinfo: DiningGuestsComponent;

  constructor(private _chatService: ChatService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _appointmentService: AppointmentBookingService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _commonService: CommonService) {
    if (this.route.routeConfig.path == 'admin/fitness-reservation/bookings/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editBookingData = true;
    }
    this.url_id ? this.title = "Update Appointment Booking" : this.title = "New Appointment Booking";
    this.url_id ? this.buttonTitle = "Update" : this.buttonTitle = "Save";
    this.minDate = new Date();

  }

  ngOnInit() {

    this._appointmentService.getGuestRestrictions({ 'meta_key': 'guest_field_required' }).subscribe(response => {

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
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }


  setControls() {
    this.addBookingForm = this.fb.group({
      first_name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
      address	     : this.fb.control(''),
      services: this.fb.control(''),
      notes: this.fb.control(''),
      booking_start_date: this.fb.control(new Date()),
      end_date: this.fb.control(''),
      guestcount: this.fb.control(1),
      guestsinfo: [[]],
      id: this.fb.control('')
    });

    this._appointmentService.getServices({ 'status': 'A' }).subscribe(response => {
      this.services = response.data;
      if (this.route.routeConfig.path != 'admin/fitness-reservation/bookings/edit/:id') {
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
    if (this.route.routeConfig.path == 'admin/fitness-reservation/bookings/edit/:id') {
      // this.fillBookingValues();
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this._appointmentService.getBookingList({ 'direction': 'desc', 'column': 'id' }).then(Response => {
      this.bookingList = Response.BookingList.data;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      this.bookingList.forEach(item => {
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
          this.router.navigate(['/admin/fitness-reservation/bookings/list']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictBooking();
        }
      });
    }
  }
  // according the phone number add the masking  for phone number field
  PhoneNumberValidations(event) {
    console.log(event.target.value[3]);
  
    if(event.target.value.length == 7){
    let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
      event.target.value =  values[1] + '-' + values[2]
      this.addBookingForm.get('phone').setValue(event.target.value);
    }
    else{

     if(event.target.value.length == 10){
      let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
      event.target.value =  values[1] + '-' + values[2] + '-' + values[3];
      this.addBookingForm.get('phone').setValue(event.target.value);
    }else{
          if((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7]=='-' &&  event.target.value.length == 12)){
            this.addBookingForm.get('phone').setValue(event.target.value);
          }else{
            this.addBookingForm.get('phone').setValue('');
          }
       }
  }
  }
  editRestrictBooking() {
    this._appointmentService.updateForm(this.url_id, 'appointmentbooking').subscribe(response => {
      this.fillBookingValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.app_booking_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter != 2) {
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
        this.router.navigate(['/admin/fitness-reservation/bookings/list']);
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
      this.confirmDialogRef.componentInstance.type = 'appointmentbooking';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillBookingValues() {
    let edit: boolean = true;
    this._appointmentService.getBookingContents(this.url_id, edit).subscribe(response => {
      let formData = response.bookinginfo;
      this.addBookingForm.patchValue(formData);
      this.addBookingForm.patchValue({ first_name: formData.name });
      this.addBookingForm.patchValue({ services: formData.service_id });
      this.addBookingForm.patchValue({ id: formData.user_id });
      this.serviceID = formData.service_id
      this.selectedDate = formData.booking_start_date;
      this.serviceDate = formData.booking_start_date;
      this.parent_booking_id = formData.parent_booking_id;
      let restricted_by = formData.service.restricted_by;
      let restricted_on_day = formData.service.restricted_on_day;
      let max_residents_per_interval = formData.service.max_residents_per_interval;
      let max_admin_reservations = formData.service.max_admin_reservations;
      let per_day_booking = formData.service.per_day_booking;
      let booked_count = formData.bookedcount;
      let max_party_size = formData.service.max_party_size;
      let guestcnt = formData.guestcount;
      this.getEditPartySizes(formData.booking_start_time, restricted_by, restricted_on_day, max_residents_per_interval, max_admin_reservations, per_day_booking, booked_count, max_party_size, guestcnt);
      this.editTimeSlots(formData.service_id, formData.booking_start_date);
    });
  }


  timeSlots(serviceID, serviceDate) {
    this.partySize = [];
    this._appointmentService.getTimeSlots({ 'service_id': serviceID, 'date': serviceDate }).subscribe(response => {
      this.getTimeSlots = response.timeslot;
      this.addBookingForm.get('guestcount').setValue(1);
      if (this.getTimeSlots.length != 0) {

        this.getPartySizes(this.currentTimeSlot);
      }
    });

  }

  editTimeSlots(serviceID, serviceDate) {
    this.partySize = [];
    this._appointmentService.getTimeSlots({ 'service_id': serviceID, 'date': serviceDate }).subscribe(response => {
      this.getTimeSlots = response.timeslot;

    });

  }



  onSelectDate(event) {

    this.serviceDate = moment(event).format('YYYY-MMM-DD');
    this.dateSelectedCal = moment(event).format('YYYY-MM-DD');
    this.selectedDate = event;

    this.timeSlots(this.serviceID, this.serviceDate);


  }

  getServices(event) {

    if (this.services && event.value) {
      this.serviceID = event.value;
      let status = this.services.filter(s => s.id == event.value);
      if (status) {
        this.serviceStartDate = status[0].service_start_date;
        this.serviceEndDate = status[0].service_end_date;


      } else {
        this.serviceStartDate = '';
        this.serviceEndDate = '';
      }


    }
    this.timeSlots(this.serviceID, this.serviceDate);
  }

  getEditPartySizes(timeslot, restricted_by, restricted_on_day, max_residents_per_interval, max_admin_reservations, per_day_booking, booked_count, max_party_size, guestcnt) {
    this.currentTimeSlot = moment(timeslot, 'HH:mm').format('hh:mm A');
    this.partySize = [];
    let max_residents = (restricted_by == 'resident') || (restricted_on_day == 'N') ? (parseInt(max_residents_per_interval) + parseInt(max_admin_reservations)) : (parseInt(per_day_booking) + parseInt(max_admin_reservations));
    let allotedsize = booked_count;
    let subpartysize = parseInt(max_party_size) + parseInt(guestcnt) - parseInt(allotedsize);
    let remaining_party_size = (max_residents - allotedsize) + guestcnt;
    this._appointmentService.getPartySize({ 'service_id': this.serviceID, 'date': this.serviceDate, 'time': timeslot }).subscribe(response => {
      /*if(restricted_by=='service'){
        if(remaining_party_size>0){
          for(var i=1;i<=remaining_party_size;i++){
            this.partySize.push(i);
          }
        }
      }else*/
      if (restricted_by == 'parties') {
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
    this._appointmentService.getPartySize({ 'service_id': this.serviceID, 'date': this.serviceDate, 'time': timeslot }).subscribe(response => {
      for (var i = 1; i <= response.partysize; i++) {
        this.partySize.push(i);
      }
      let groupLimit = response.partysize || 0;
      this.groupLimit = Array.from(new Array(groupLimit), (val, index) => index + 1);

    });
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

    this.addBookingForm.get('guestsinfo').setValue($event);
  }

  //validate form from guest component
  validateParentForm($event) {
    //this.disableSubmit = $event;
    if (this.guestRequired == 'Y') {
      this.disableSubmit = $event;
    } else {
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
      var guestFieldControls = this.addBookingForm.get('guestsinfo') as FormArray;
      guestFieldControls.at(index).patchValue($event.option.value);
    }

  }


  onSaveFieldClick() {
    this.savingEntry = true;
    let value = this.addBookingForm.value;
    let formData = {
      'name': value.first_name,
      'email': value.email,
      'phone': value.phone,
      'address': value.address,
      'service_id': value.services,
      'notes': value.notes,
      'booking_start_date': this.serviceDate,
      'booking_start_time': this.currentTimeSlot,
      'attendee_type': 'M',
      'status': 'confirmed',
      'guestcount': value.guestcount,
      'guestsinfo': JSON.stringify(value.guestsinfo),
      'user_id': value.id,
      'id': this.editBookingData == true ? this.url_id : '',
      //'update'                : this.isUpdateVal,
      //'parent_booking_id'     : this.parent_booking_id  
    }
    if (this.addBookingForm.valid) {
      this._appointmentService.addBooking(formData, this.editBookingData)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/fitness-reservation/bookings/list']);

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
    let userMeta: any;
    console.log("userInfo",userInfo);
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.addBookingForm.patchValue(userInfo.option.value);
      this.addBookingForm.get('first_name').setValue(userInfo.option.value.first_name + ' ' + userInfo.option.value.last_name);
      this.addBookingForm.get('id').setValue(userInfo.option.value.id);
        //Get UserMeta Fields To Print
        if(userInfo && userInfo.option.value.usermeta){
          userMeta = CommonUtils.getMetaValues(userInfo.option.value.usermeta);
          console.log("userMeta",userMeta);
          for(let i=0;i<userMeta.length;i++){
            if(userMeta[i].field_name == 'Apartment' || userMeta[i].field_name == 'unit_number' || userMeta[i].field_name == 'Home' || userMeta[i].field_name == 'address' || userMeta[i].field_name == 'building'){
                this.addBookingForm.patchValue({address:userMeta[i].field_value});
            }
          }
        }

    }
  }


}
