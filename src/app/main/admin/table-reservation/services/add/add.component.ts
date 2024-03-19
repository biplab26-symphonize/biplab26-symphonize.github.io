import { NgModule, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CommonService, AppConfig, AppointmentBookingService, TabelReservationService, ChatService, AuthService } from 'app/_services';
// import { IDiningServiceData } from './IDiningServiceData';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import moment from 'moment';
import { DialogComponent } from '../dialog/dialog.component';
import { ITabelReservationServiceData } from './ITableReservationServiceData';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from 'app/_models';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
  public isTimeCheck = { 'monday': true, 'tuesday': true, 'wednesday': true, 'thursday': true, 'friday': true, 'saturday': true, 'sunday': true };
  public totalSpots: any;
  public startDay: any;
  public chosenDate: Date;
  table: FormArray;
  private version: any;
  public url_id: any;
  public editServiceData: boolean = false;
  public addServiceForm: FormGroup;
  public title: string = '';
  public admin_override: boolean = false;
  public days_status = { 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'sunday': false };
  public party_status = { 'resident': false, 'parties': false, 'service': false };
  day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  // time = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'];
  party_type = ['resident', 'parties', 'service'];
  error: any = { isError: false, errorMessage: '' };
  resident_error: any = { isError: false, errorMessage: '' };
  start_date: any = { isError: false, errorMessage: '' };
  res_on_day_status = { 'Day': false, 'Service': false };
  selectedDate: any;
  public booking: any;
  public checkLength: any;

  public userId: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public toDate: any;
  public todayDate: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  @Output() designpartData = new EventEmitter();

  constructor(
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _dialog: MatDialog,
    private tableReservationservice: TabelReservationService,
    private router: Router,
    private route: ActivatedRoute,
    private _matSnackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private _commonService: CommonService) {
    this.title = 'Add Services';
    if (this.route.routeConfig.path == 'admin/restaurant-reservations/services/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editServiceData = true;
    }
    this.url_id ? this.title = "Update Service" : this.title = "New Service";

    this.tableReservationservice.getMaxDays({ 'meta_key': 'first_day_week' }).subscribe(response => {
      this.startDay = response.settingsinfo.meta_value;
      localStorage.setItem('startDay', this.startDay);
    });
    this.todayDate = new Date();
    this.toDate = new Date();
  }
  private file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  mediaInfo: any = [];


  ngOnInit() {
    this.setControls();

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
    this.addServiceForm = this.fb.group({
      service_title: this.fb.control('', [Validators.required]),
      service_start_date: this.fb.control(new Date(), [Validators.required]),
      service_end_date: this.fb.control(''),
      service_description: this.fb.control(''),
      current_day_reg_cutoff: this.fb.control(''),
      length: this.fb.control(''),
      allow_admin_override: this.fb.control('N'),
      max_admin_reservation: this.fb.control('0'),
      image: this.fb.control(''),
      status: this.fb.control(''),
      id: this.fb.control(''),
      admin_email: this.fb.control(''),
      working_times: this.fb.group({
        monday_from: this.fb.control(''),
        tuesday_from: this.fb.control(''),
        wednesday_from: this.fb.control(''),
        thursday_from: this.fb.control(''),
        friday_from: this.fb.control(''),
        saturday_from: this.fb.control(''),
        sunday_from: this.fb.control(''),

        monday_to: this.fb.control(''),
        tuesday_to: this.fb.control(''),
        wednesday_to: this.fb.control(''),
        thursday_to: this.fb.control(''),
        friday_to: this.fb.control(''),
        saturday_to: this.fb.control(''),
        sunday_to: this.fb.control(''),

        monday_break_from: this.fb.control(''),
        tuesday_break_from: this.fb.control(''),
        wednesday_break_from: this.fb.control(''),
        thursday_break_from: this.fb.control(''),
        friday_break_from: this.fb.control(''),
        saturday_break_from: this.fb.control(''),
        sunday_break_from: this.fb.control(''),

        monday_break_to: this.fb.control(''),
        tuesday_break_to: this.fb.control(''),
        wednesday_break_to: this.fb.control(''),
        thursday_break_to: this.fb.control(''),
        friday_break_to: this.fb.control(''),
        saturday_break_to: this.fb.control(''),
        sunday_break_to: this.fb.control(''),
      }),
      dates: this.fb.array([
        this.fb.control('')
      ]),
      table: this.fb.array([this.createItem()]),
    }, { validator: this.checkDates });

    //this.addServiceForm.patchValue({recurringrepeat:'DAILY'});
    if (this.route.routeConfig.path == 'admin/restaurant-reservations/services/edit/:id') {
      //this.fillBookingValues();
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
    this.dates.removeAt(0);
  }
  fromDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.toDate = new Date(fromDate);
    console.log("toDate",this.toDate);
    //this.addServiceForm.get('service_end_date').setValue(this.toDate)
  }
  getFilteredServices() {
    return this.tableReservationservice.getServiceList({ 'direction': 'asc', 'column': 'order' }).then(Response => {
      this.serviceList = Response.data;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      console.log("serviceList", this.serviceList);
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.userId) {
              console.log("true");
              this.fillBookingValues();
            }
            if (item.editrestriction.user.id != this.userId) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {
            console.log("else");
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
        data: { type: 'UpdateTableServie', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.savingEntry = true;
          this.router.navigate(['/admin/restaurant-reservations/services/list']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictService();
        }
      });
    }
  }
  editRestrictService() {
    this.tableReservationservice.updateForm(this.url_id, 'tableservice').subscribe(response => {
      console.log("updateForm", response);
      this.fillBookingValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.table_serv_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      console.log("response", res);
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
      data: { type: 'UpdateTableServie', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/restaurant-reservations/services/list']);
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
      this.confirmDialogRef.componentInstance.type = 'tableservice';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillBookingValues() {
    let edit: boolean = true;
    this.tableReservationservice.getServiceContents(this.url_id, edit).subscribe(response => {
      this.booking = response.serviceinfo.workingtimes;
      if (response.serviceinfo.bookings.length != undefined) {
        this.checkLength = response.serviceinfo.bookings.length;
      }
      let formData = response.serviceinfo;

      if (formData.allow_admin_override == 'Y') {
        this.admin_override = true;

      }

      this.addServiceForm.patchValue(formData);
      this.addServiceForm.get('max_admin_reservation').setValue(formData.max_admin_reservation);
      let current_day;

      if (formData.current_day_reg_cutoff == null || formData.current_day_reg_cutoff == '') {

        this.addServiceForm.get('current_day_reg_cutoff').setValue(null);
      } else {
        current_day = new Date(moment(formData.current_day_reg_cutoff, 'HH:mm:ss').toString());
        this.addServiceForm.get('current_day_reg_cutoff').setValue(current_day);
      }

      if (formData.image != null) {
        this.filetype = true;
        this.logourl = formData.image;

      }
      this.isTimeCheck['monday'] = true;
      this.isTimeCheck['tuesday'] = true;
      this.isTimeCheck['wednesday'] = true;
      this.isTimeCheck['thursday'] = true;
      this.isTimeCheck['friday'] = true;
      this.isTimeCheck['saturday'] = true;
      this.isTimeCheck['sunday'] = true;
      let WorkingTimes = this.addServiceForm.get('working_times') as FormGroup;
      if (formData.workingtimes.monday_from != null) {
        this.days_status['monday'] = true;
        this.isTimeCheck['monday'] = false;
        let mondayFrom = new Date(moment(formData.workingtimes.monday_from, 'HH:mm:ss').toString());
        WorkingTimes.get('monday_from').setValue(mondayFrom);
        let mondayTo = new Date(moment(formData.workingtimes.monday_to, 'HH:mm:ss').toString());
        WorkingTimes.get('monday_to').setValue(mondayTo);
      } else {
        WorkingTimes.get('monday_from').setValue('');
        WorkingTimes.get('monday_to').setValue('');
      }
      if (formData.workingtimes.monday_break_from != null) {
        this.days_status['monday'] = true;
        this.isTimeCheck['monday'] = false;
        let mondayBreakFrom = new Date(moment(formData.workingtimes.monday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('monday_break_from').setValue(mondayBreakFrom);
        let mondayBreakTo = new Date(moment(formData.workingtimes.monday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('monday_break_to').setValue(mondayBreakTo);
      } else {

        WorkingTimes.get('monday_break_from').setValue('');
        WorkingTimes.get('monday_break_to').setValue('');
      }
      if (formData.workingtimes.tuesday_from != null) {
        this.days_status['tuesday'] = true;
        this.isTimeCheck['tuesday'] = false;
        let tuesdayFrom = new Date(moment(formData.workingtimes.tuesday_from, 'HH:mm:ss').toString());
        WorkingTimes.get('tuesday_from').setValue(tuesdayFrom);
        let tuesdayTo = new Date(moment(formData.workingtimes.tuesday_to, 'HH:mm:ss').toString());
        WorkingTimes.get('tuesday_to').setValue(tuesdayTo);
        let tuesdayBreakFrom = new Date(moment(formData.workingtimes.tuesday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('tuesday_break_from').setValue(tuesdayBreakFrom);
        let tuesdayBreakTo = new Date(moment(formData.workingtimes.tuesday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('tuesday_break_to').setValue(tuesdayBreakTo);
      } else {

        WorkingTimes.get('tuesday_from').setValue('');
        WorkingTimes.get('tuesday_to').setValue('');
      }
      if (formData.workingtimes.tuesday_break_from != null) {
        this.days_status['tuesday'] = true;
        this.isTimeCheck['tuesday'] = false;
        let tuesdayBreakFrom = new Date(moment(formData.workingtimes.tuesday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('tuesday_break_from').setValue(tuesdayBreakFrom);
        let tuesdayBreakTo = new Date(moment(formData.workingtimes.tuesday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('tuesday_break_to').setValue(tuesdayBreakTo);
      } else {

        WorkingTimes.get('tuesday_break_from').setValue('');
        WorkingTimes.get('tuesday_break_to').setValue('');
      }

      if (formData.workingtimes.wednesday_from != null) {
        this.days_status['wednesday'] = true;
        this.isTimeCheck['wednesday'] = false;
        let wednesdayFrom = new Date(moment(formData.workingtimes.wednesday_from, 'HH:mm:ss').toString());
        WorkingTimes.get('wednesday_from').setValue(wednesdayFrom);
        let wednesdayTo = new Date(moment(formData.workingtimes.wednesday_to, 'HH:mm:ss').toString());
        WorkingTimes.get('wednesday_to').setValue(wednesdayTo);
        let wednesdayBreakFrom = new Date(moment(formData.workingtimes.wednesday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('wednesday_break_from').setValue(wednesdayBreakFrom);
        let wednesdayBreakTo = new Date(moment(formData.workingtimes.wednesday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('wednesday_break_to').setValue(wednesdayBreakTo);
      } else {

        WorkingTimes.get('wednesday_from').setValue('');
        WorkingTimes.get('wednesday_to').setValue('');
      }

      if (formData.workingtimes.wednesday_break_from != null) {
        this.days_status['wednesday'] = true;
        this.isTimeCheck['wednesday'] = false;
        let wednesdayBreakFrom = new Date(moment(formData.workingtimes.wednesday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('wednesday_break_from').setValue(wednesdayBreakFrom);
        let wednesdayBreakTo = new Date(moment(formData.workingtimes.wednesday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('wednesday_break_to').setValue(wednesdayBreakTo);
      } else {

        WorkingTimes.get('wednesday_break_from').setValue('');
        WorkingTimes.get('wednesday_break_to').setValue('');
      }

      if (formData.workingtimes.thursday_from != null) {
        this.days_status['thursday'] = true;
        this.isTimeCheck['thursday'] = false;
        let thursdayFrom = new Date(moment(formData.workingtimes.thursday_from, 'HH:mm:ss').toString());
        WorkingTimes.get('thursday_from').setValue(thursdayFrom);
        let thursdayTo = new Date(moment(formData.workingtimes.thursday_to, 'HH:mm:ss').toString());
        WorkingTimes.get('thursday_to').setValue(thursdayTo);
        let thursdayBreakFrom = new Date(moment(formData.workingtimes.thursday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('thursday_break_from').setValue(thursdayBreakFrom);
        let thursdayBreakTo = new Date(moment(formData.workingtimes.thursday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('thursday_break_to').setValue(thursdayBreakTo);
      } else {

        WorkingTimes.get('thursday_from').setValue('');
        WorkingTimes.get('thursday_to').setValue('');
      }


      if (formData.workingtimes.thursday_break_from != null) {

        let thursdayBreakFrom = new Date(moment(formData.workingtimes.thursday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('thursday_break_from').setValue(thursdayBreakFrom);
        let thursdayBreakTo = new Date(moment(formData.workingtimes.thursday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('thursday_break_to').setValue(thursdayBreakTo);
      } else {

        WorkingTimes.get('thursday_break_from').setValue('');
        WorkingTimes.get('thursday_break_to').setValue('');
      }
      if (formData.workingtimes.friday_from != null) {
        this.days_status['friday'] = true;
        this.isTimeCheck['friday'] = false;
        let fridayFrom = new Date(moment(formData.workingtimes.friday_from, 'HH:mm:ss').toString());
        WorkingTimes.get('friday_from').setValue(fridayFrom);
        let fridayTo = new Date(moment(formData.workingtimes.friday_to, 'HH:mm:ss').toString());
        WorkingTimes.get('friday_to').setValue(fridayTo);

      } else {

        WorkingTimes.get('friday_from').setValue('');
        WorkingTimes.get('friday_to').setValue('');
      }

      if (formData.workingtimes.friday_break_from != null) {
        this.days_status['friday'] = true;
        this.isTimeCheck['friday'] = false;
        let fridayBreakFrom = new Date(moment(formData.workingtimes.friday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('friday_break_from').setValue(fridayBreakFrom);
        let fridayBreakTo = new Date(moment(formData.workingtimes.friday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('friday_break_to').setValue(fridayBreakTo);
      } else {

        WorkingTimes.get('friday_break_from').setValue('');
        WorkingTimes.get('friday_break_to').setValue('');
      }
      if (formData.workingtimes.saturday_from != null) {
        this.days_status['saturday'] = true;
        this.isTimeCheck['saturday'] = false;
        let saturdayFrom = new Date(moment(formData.workingtimes.saturday_from, 'HH:mm:ss').toString());
        WorkingTimes.get('saturday_from').setValue(saturdayFrom);
        let saturdayTo = new Date(moment(formData.workingtimes.saturday_to, 'HH:mm:ss').toString());
        WorkingTimes.get('saturday_to').setValue(saturdayTo);

      } else {

        WorkingTimes.get('saturday_from').setValue('');
        WorkingTimes.get('saturday_to').setValue('');
      }

      if (formData.workingtimes.saturday_break_from != null) {
        this.days_status['saturday'] = true;
        this.isTimeCheck['saturday'] = false;
        let saturdayBreakFrom = new Date(moment(formData.workingtimes.saturday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('saturday_break_from').setValue(saturdayBreakFrom);
        let saturdayBreakTo = new Date(moment(formData.workingtimes.saturday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('saturday_break_to').setValue(saturdayBreakTo);
      } else {

        WorkingTimes.get('saturday_break_from').setValue('');
        WorkingTimes.get('saturday_break_to').setValue('');
      }
      if (formData.workingtimes.sunday_from != null) {
        this.days_status['sunday'] = true;
        this.isTimeCheck['sunday'] = false;
        let sundayFrom = new Date(moment(formData.workingtimes.sunday_from, 'HH:mm:ss').toString());
        WorkingTimes.get('sunday_from').setValue(sundayFrom);
        let sundayTo = new Date(moment(formData.workingtimes.sunday_to, 'HH:mm:ss').toString());
        WorkingTimes.get('sunday_to').setValue(sundayTo);

      } else {

        WorkingTimes.get('sunday_from').setValue('');
        WorkingTimes.get('sunday_to').setValue('');
      }

      if (formData.workingtimes.sunday_break_from != null) {
        this.days_status['sunday'] = true;
        this.isTimeCheck['sunday'] = false;
        let sundayBreakFrom = new Date(moment(formData.workingtimes.sunday_break_from, 'HH:mm:ss').toString());
        WorkingTimes.get('sunday_break_from').setValue(sundayBreakFrom);
        let sundayBreakTo = new Date(moment(formData.workingtimes.sunday_break_to, 'HH:mm:ss').toString());
        WorkingTimes.get('sunday_break_to').setValue(sundayBreakTo);
      } else {

        WorkingTimes.get('sunday_break_from').setValue('');
        WorkingTimes.get('sunday_break_to').setValue('');
      }

      //this.addServiceForm.patchValue({ dates: formData.dates });
      this.dates.removeAt(0);
      formData.dates.forEach(item => {
        this.dates.push(this.fb.control(new Date(item.date)));
      });

      this.table = this.addServiceForm.get('table') as FormArray;
      this.table.removeAt(0);
      if (formData.table) {
        this.filetype = true;
        formData.table.map((item, index) => {
          const tempObj = {};
          tempObj['min_table_size'] = new FormControl(item.min_table_size);
          tempObj['max_table_size'] = new FormControl(item.max_table_size);
          tempObj['max_table_count'] = new FormControl(item.max_table_count);
          tempObj['max_slot_booking'] = new FormControl(item.max_slot_booking);
          this.table.push(this.fb.group(tempObj));

        });
      }

    });
  }



  createItem() {
    return this.fb.group({
      min_table_size: ['1', Validators.required],
      max_table_size: ['1', Validators.required],
      max_table_count: ['1', Validators.required],
      max_slot_booking: ['1', Validators.required],
    })
  }


  onAddSelectRow() {
    this.table = this.addServiceForm.get('table') as FormArray;
    this.table.push(this.createItem());
  }

  onRemoveRow(index) {
    this.table.removeAt(index)
  }


  getControls() {
    return (this.addServiceForm.get('table') as FormArray).controls;
  }

  checkDates(group: FormGroup) {
    if (group.controls.service_end_date.value != '' && group.controls.service_start_date.value > group.controls.service_end_date.value) {
      return { notValid: true }
    }
    return null;
  }

  onSubmit() {
    this.savingEntry = true;
    let flag = 0;
    console.log("this.addServiceForm.value",this.addServiceForm.value);
    if (this.addServiceForm.valid) {
      let diningData: ITabelReservationServiceData = this.addServiceForm.value;

      let flag2 = 0;
      const composedData = this.getComposeDiningData(diningData);
      let workingData = JSON.parse(composedData.working_times);
      if (this.booking != {} && this.booking != undefined && this.checkLength > 0) {
        if (diningData.length != this.checkLength) {
          flag2 = 1;
        }
        if (this.booking.monday_from != workingData.monday_from) {
          flag2 = 1;
        }
        if (this.booking.monday_to != workingData.monday_to) {
          flag2 = 1;
        }
        if (this.booking.monday_break_from != workingData.monday_break_from) {
          flag2 = 1;
        }
        if (this.booking.monday_break_to != workingData.monday_break_to) {
          flag2 = 1;
        }

        if (this.booking.tuesday_from != workingData.tuesday_from) {
          flag2 = 1;
        }
        if (this.booking.tuesday_to != workingData.tuesday_to) {
          flag2 = 1;
        }
        if (this.booking.tuesday_break_from != workingData.tuesday_break_from) {
          flag2 = 1;
        }
        if (this.booking.tuesday_break_to != workingData.tuesday_break_to) {
          flag2 = 1;
        }

        if (this.booking.wednesday_from != workingData.wednesday_from) {
          flag2 = 1;
        }
        if (this.booking.wednesday_to != workingData.wednesday_to) {
          flag2 = 1;
        }
        if (this.booking.wednesday_break_from != workingData.wednesday_break_from) {
          flag2 = 1;
        }
        if (this.booking.wednesday_break_to != workingData.wednesday_break_to) {
          flag2 = 1;
        }

        if (this.booking.thursday_from != workingData.thursday_from) {
          flag2 = 1;
        }
        if (this.booking.thursday_to != workingData.thursday_to) {
          flag2 = 1;
        }
        if (this.booking.thursday_break_from != workingData.thursday_break_from) {
          flag2 = 1;
        }
        if (this.booking.thursday_break_to != workingData.thursday_break_to) {
          flag2 = 1;
        }

        if (this.booking.friday_from != workingData.friday_from) {
          flag2 = 1;
        }
        if (this.booking.friday_to != workingData.friday_to) {
          flag2 = 1;
        }
        if (this.booking.friday_break_from != workingData.friday_break_from) {
          flag2 = 1;
        }
        if (this.booking.friday_break_to != workingData.friday_break_to) {
          flag2 = 1;
        }

        if (this.booking.saturday_from != workingData.saturday_from) {
          flag2 = 1;
        }
        if (this.booking.saturday_to != workingData.saturday_to) {
          flag2 = 1;
        }
        if (this.booking.saturday_break_from != workingData.saturday_break_from) {
          flag2 = 1;
        }
        if (this.booking.saturday_break_to != workingData.saturday_break_to) {
          flag2 = 1;
        }

        if (this.booking.sunday_from != workingData.sunday_from) {
          flag2 = 1;
        }
        if (this.booking.sunday_to != workingData.sunday_to) {
          flag2 = 1;
        }
        if (this.booking.sunday_break_from != workingData.sunday_break_from) {
          flag2 = 1;
        }
        if (this.booking.sunday_break_to != workingData.sunday_break_to) {
          flag2 = 1;
        }
      }

      if (flag2 == 1) {
        const dialogRef = this._dialog.open(DialogComponent, {
          disableClose: true,
          width: '50%',
          data: { type: 'recurringUpdateBooking', body: '<h2>Recurring Confirmation</h2>', composedData: diningData }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != 'N') {
            if (result.sendmail == true) {
              composedData.sendemail = '1';
            }
            if (composedData.service_title != '' && composedData.status != '') {
              this.start_date = { isError: false, errorMessage: '' };
              if (composedData.service_start_date != null || composedData.service_end_date >= composedData.service_start_date) {
                this.error = { isError: false, errorMessage: '' };
                this.tableReservationservice.addAppointmentBooking(composedData, this.editServiceData).subscribe(response => {
                  this._matSnackBar.open(response.message, 'CLOSE', {
                    verticalPosition: 'top',
                    duration: 2000
                  });
                  this.router.navigate(['/admin/restaurant-reservations/services/list']);
                },
                  error => {
                    // Show the error message
                    this._matSnackBar.open(error.message, 'Retry', {
                      verticalPosition: 'top',
                      duration: 2000
                    });
                  });

              } else {
                this.error = { isError: true, errorMessage: 'End Date cant before start date' };
              }
            } else {
              //this.start_date = { isError: true, errorMessage: 'Please select service start date' };
            }
          }
        });
      } else {
        if (composedData.service_title != '' && composedData.status != '') {
          this.start_date = { isError: false, errorMessage: '' };
          if (composedData.service_start_date != null || composedData.service_end_date >= composedData.service_start_date) {
            this.error = { isError: false, errorMessage: '' };
            this.tableReservationservice.addAppointmentBooking(composedData, this.editServiceData).subscribe(response => {
              this._matSnackBar.open(response.message, 'CLOSE', {
                verticalPosition: 'top',
                duration: 2000
              });
              this.router.navigate(['/admin/restaurant-reservations/services/list']);
            },
              error => {
                // Show the error message
                this._matSnackBar.open(error.message, 'Retry', {
                  verticalPosition: 'top',
                  duration: 2000
                });
              });

          } else {
            this.error = { isError: true, errorMessage: 'End Date cant before start date' };
          }
        } else {
          //this.start_date = { isError: true, errorMessage: 'Please select service start date' };
        }
      }
    }
  }
  getComposeDiningData(data: any) {
    let composedData = data;
    if (data.service_start_date == null) {
      composedData.service_start_date = null;
    } else {
      composedData.service_start_date = moment(data.service_start_date).format('YYYY-MMM-DD');
    }
    if (data.service_end_date == null || data.service_end_date == '') {
      composedData.service_end_date = null;

    } else {

      composedData.service_end_date = moment(data.service_end_date).format('YYYY-MMM-DD');
    }
    composedData.max_admin_reservation = data.max_admin_reservation;
    let i = 0;
    composedData.dates = typeof composedData.dates === 'string' ? JSON.parse(composedData.dates) : composedData.dates;
    //  composedData.table = typeof data.table === 'string' ? JSON.parse(data.dates) : JSON.stringify(data.table);
    composedData.dates.forEach(item => {
      composedData.dates[i] = moment(item).format('YYYY-MM-DD');
      i++;
    });
    composedData.dates = typeof data.dates === 'string' ? JSON.parse(data.dates) : JSON.stringify(data.dates);
    composedData.table = typeof data.table === 'string' ? data.table : JSON.stringify(data.table);

    data.working_times = typeof data.working_times === 'string' ? JSON.parse(data.working_times) : data.working_times;
    if (data.current_day_reg_cutoff == null || data.current_day_reg_cutoff == '') {
      composedData.current_day_reg_cutoff = null;
    } else {
      composedData.current_day_reg_cutoff = moment(data.current_day_reg_cutoff).format('HH:mm');
    }
    if (data.working_times.monday_from == '') {
      composedData.working_times.monday_from = null;
    } else {
      composedData.working_times.monday_from = moment(data.working_times.monday_from).format('HH:mm');
    }
    if (data.working_times.monday_to == '') {
      composedData.working_times.monday_to = null;
    } else {
      composedData.working_times.monday_to = moment(data.working_times.monday_to).format('HH:mm');
    }
    if (data.working_times.monday_break_from == '') {
      composedData.working_times.monday_break_from = null;
    } else {
      composedData.working_times.monday_break_from = moment(data.working_times.monday_break_from).format('HH:mm');
    }
    if (data.working_times.monday_break_to == '') {
      composedData.working_times.monday_break_to = null;
    } else {
      composedData.working_times.monday_break_to = moment(data.working_times.monday_break_to).format('HH:mm');
    }

    if (data.working_times.tuesday_from == '') {
      composedData.working_times.tuesday_from = null;
    } else {
      composedData.working_times.tuesday_from = moment(data.working_times.tuesday_from).format('HH:mm');
    }
    if (data.working_times.tuesday_to == '') {
      composedData.working_times.tuesday_to = null;
    } else {
      composedData.working_times.tuesday_to = moment(data.working_times.tuesday_to).format('HH:mm');
    }
    if (data.working_times.tuesday_break_from == '') {
      composedData.working_times.tuesday_break_from = null;
    } else {
      composedData.working_times.tuesday_break_from = moment(data.working_times.tuesday_break_from).format('HH:mm');
    }
    if (data.working_times.tuesday_break_to == '') {
      composedData.working_times.tuesday_break_to = null;
    } else {
      composedData.working_times.tuesday_break_to = moment(data.working_times.tuesday_break_to).format('HH:mm');
    }

    if (data.working_times.wednesday_from == '') {
      composedData.working_times.wednesday_from = null;
    } else {
      composedData.working_times.wednesday_from = moment(data.working_times.wednesday_from).format('HH:mm');
    }
    if (data.working_times.wednesday_to == '') {
      composedData.working_times.wednesday_to = null;
    } else {
      composedData.working_times.wednesday_to = moment(data.working_times.wednesday_to).format('HH:mm');
    }
    if (data.working_times.wednesday_break_from == '') {
      composedData.working_times.wednesday_break_from = null;
    } else {
      composedData.working_times.wednesday_break_from = moment(data.working_times.wednesday_break_from).format('HH:mm');
    }
    if (data.working_times.wednesday_break_to == '') {
      composedData.working_times.wednesday_break_to = null;
    } else {
      composedData.working_times.wednesday_break_to = moment(data.working_times.wednesday_break_to).format('HH:mm');
    }

    if (data.working_times.thursday_from == '') {
      composedData.working_times.thursday_from = null;
    } else {
      composedData.working_times.thursday_from = moment(data.working_times.thursday_from).format('HH:mm');
    }
    if (data.working_times.thursday_to == '') {
      composedData.working_times.thursday_to = null;
    } else {
      composedData.working_times.thursday_to = moment(data.working_times.thursday_to).format('HH:mm');
    }
    if (data.working_times.thursday_break_from == '') {
      composedData.working_times.thursday_break_from = null;
    } else {
      composedData.working_times.thursday_break_from = moment(data.working_times.thursday_break_from).format('HH:mm');
    }
    if (data.working_times.thursday_break_to == '') {
      composedData.working_times.thursday_break_to = null;
    } else {
      composedData.working_times.thursday_break_to = moment(data.working_times.thursday_break_to).format('HH:mm');
    }

    if (data.working_times.friday_from == '') {
      composedData.working_times.friday_from = null;
    } else {
      composedData.working_times.friday_from = moment(data.working_times.friday_from).format('HH:mm');
    }
    if (data.working_times.friday_to == '') {
      composedData.working_times.friday_to = null;
    } else {
      composedData.working_times.friday_to = moment(data.working_times.friday_to).format('HH:mm');
    }
    if (data.working_times.friday_break_from == '') {
      composedData.working_times.friday_break_from = null;
    } else {
      composedData.working_times.friday_break_from = moment(data.working_times.friday_break_from).format('HH:mm');
    }
    if (data.working_times.friday_break_to == '') {
      composedData.working_times.friday_break_to = null;
    } else {
      composedData.working_times.friday_break_to = moment(data.working_times.friday_break_to).format('HH:mm');
    }

    if (data.working_times.saturday_from == '') {
      composedData.working_times.saturday_from = null;
    } else {
      composedData.working_times.saturday_from = moment(data.working_times.saturday_from).format('HH:mm');
    }
    if (data.working_times.saturday_to == '') {
      composedData.working_times.saturday_to = null;
    } else {
      composedData.working_times.saturday_to = moment(data.working_times.saturday_to).format('HH:mm');
    }
    if (data.working_times.saturday_break_from == '') {
      composedData.working_times.saturday_break_from = null;
    } else {
      composedData.working_times.saturday_break_from = moment(data.working_times.saturday_break_from).format('HH:mm');
    }
    if (data.working_times.saturday_break_to == '') {
      composedData.working_times.saturday_break_to = null;
    } else {
      composedData.working_times.saturday_break_to = moment(data.working_times.saturday_break_to).format('HH:mm');
    }

    if (data.working_times.sunday_from == '') {
      composedData.working_times.sunday_from = null;
    } else {
      composedData.working_times.sunday_from = moment(data.working_times.sunday_from).format('HH:mm');
    }
    if (data.working_times.sunday_to == '') {
      composedData.working_times.sunday_to = null;
    } else {
      composedData.working_times.sunday_to = moment(data.working_times.sunday_to).format('HH:mm');
    }
    if (data.working_times.sunday_break_from == '') {
      composedData.working_times.sunday_break_from = null;
    } else {
      composedData.working_times.sunday_break_from = moment(data.working_times.sunday_break_from).format('HH:mm');
    }
    if (data.working_times.sunday_break_to == '') {
      composedData.working_times.sunday_break_to = null;
    } else {
      composedData.working_times.sunday_break_to = moment(data.working_times.sunday_break_to).format('HH:mm');
    }

    composedData.working_times = JSON.stringify(data.working_times);
    return composedData;
  }

  onFileSelect(event) {
    const file = event.target.files[0];

  }

  get dates() {
    return this.addServiceForm.get('dates') as FormArray;
  }
  addNewDate() {
    this.dates.push(this.fb.control(''));
  }
  removeDate(index) {
    this.dates.removeAt(index);
  }
  onCheckboxChange(event, day) {
    let day_from = day + "_from";
    let day_to = day + "_to";
    let day_break_from = day + "_break_from";
    let day_break_to = day + "_break_to";

    let WorkingTimes = this.addServiceForm.get('working_times') as FormGroup;

    if (event.checked) {
      this.days_status[day] = false;
      WorkingTimes.get(day_from).setValue('');
      WorkingTimes.get(day_to).setValue('');
      WorkingTimes.get(day_break_from).setValue('');
      WorkingTimes.get(day_break_to).setValue('');
    } else {
      this.days_status[day] = true;

    }

  }

  onRestrictedBy(event) {

    if (event.value == 'resident') {
      this.party_status[event.value] = true;
      this.party_status['parties'] = false;
      this.party_status['service'] = false;
      this.res_on_day_status['Day'] = false;
      this.res_on_day_status['Service'] = false;
    } else if (event.value == 'parties') {
      this.party_status[event.value] = true;
      this.party_status['resident'] = false;
      this.party_status['service'] = false;
      this.res_on_day_status['Day'] = false;
      this.res_on_day_status['Service'] = false;
    } else {
      this.party_status[event.value] = true;
      this.party_status['resident'] = false;
      this.party_status['parties'] = false;
      this.res_on_day_status['Day'] = true;
    }
  }

  restrictedOnDay(event) {

    if (event.value == 'Y') {

      this.res_on_day_status['Day'] = true;
      this.res_on_day_status['Service'] = false;
    } else {

      this.res_on_day_status['Service'] = true;
      this.res_on_day_status['Day'] = false;
    }
  }

  // for all admin override
  allAdminOverride(event) {
    if (event.value == 'Y') {
      this.admin_override = true;
    } else {
      this.admin_override = false;
      this.addServiceForm.get('max_admin_reservation').reset();
    }
  }
  Cancel() {
    this.router.navigate(['/admin/restaurant-reservations/services/list']);
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
        this.mediaInfo.append('type', 'appointment');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "");

            if (uploadResponse.media.image) {
              this.logourl = event.target.result;
              this.addServiceForm.controls.image.setValue(this.uploadInfo.avatar.url);
              this.designpartData.emit(this.addServiceForm.value);
            }
          });

      }
    }

  }

  setValueResidentPerDayAndMaxResident(event) {
    if (event.target.value == 0 && event.target.value != '') {
      this.addServiceForm.get('per_day_booking').setValue('1');
    }
  }

}
