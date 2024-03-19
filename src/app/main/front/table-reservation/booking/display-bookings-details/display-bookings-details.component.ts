import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TabelReservationService, ProfileService, UsersService, CommonService, EventbehavioursubService } from 'app/_services';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms'
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { DiningGuestsComponent } from 'app/main/admin/table-reservation/bookings/dining-guests/dining-guests.component';
import { Router } from '@angular/router';
import { CommonUtils } from 'app/_helpers';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import moment from 'moment-timezone';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-display-bookings-details',
  templateUrl: './display-bookings-details.component.html',
  styleUrls: ['./display-bookings-details.component.scss'],
  animations: fuseAnimations
})
export class DisplayBookingsDetailsComponent implements OnInit {

  public addBookingForm: FormGroup;
  public defaultImage: any;
  public partySize: any = [];
  public groupLimit: any[] = [];
  public selectedDate: any;
  public serviceTitle: any;
  public serviceDescription: any;
  public serviceImage: any;
  public sendUserId: any;
  public userMeta: any = [];
  public serviceId: any;
  public disableSubmit: boolean = false;
  public generalSettings: any = {};
  public minTableSize: any;
  public maxTableSize: any;
  public currentTimeslot: any;
  public currentTime: any;
  public guestRequired: any;
  public guestInfoLength: string = '';
  public filteredUsers: any = [];
  public flag: any;
  restrictFormInfo: boolean = false;
  private _unsubscribeAll: Subject<any>;

  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  @ViewChild(DiningGuestsComponent, { static: true }) private guestInfo: DiningGuestsComponent;


  constructor(private _eventbehavioursubService: EventbehavioursubService, private _tableService: TabelReservationService,
    private fb: FormBuilder,
    private _profileservices: ProfileService,
    private _fuseConfigService: FuseConfigService,
    private _userService: UsersService,
    public router: Router,
    public _commonService: CommonService) {
    this._unsubscribeAll = new Subject();
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }


  ngOnInit() {
    this.defaultImage = '/assets/images/backgrounds/diningReservation.jpg';
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.currentTime = moment().tz(this.generalSettings.APP_TIMEZONE || "America/New_York").format('HH:mm:ssa dddd, MMMM DD,YYYY');

    setTimeout(() => {
      this.getFormValues();
    }, 200); //5s
    this.setControls();

    this._tableService.getGuestRestrictions({ 'meta_key': 'guest_field_required' }).subscribe(response => {
      this.guestRequired = response.settingsinfo.meta_value;
    });
    this.addBookingForm
      .get('first_name').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getKisokUsers({ 'searchKey': value }, this.flag))
      )
      .subscribe(users => this.filteredUsers = users);

    //RESTRICT RESIDENT USER FORM EDIT
    this._eventbehavioursubService.restrictFormEdit
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        if (response == true) {
          this.restrictFormInfo = true;
        }
      });
  }

  getFormValues() {
    let getData = this._tableService.getViewBookingData();
    this.partySize = [];
    if (getData != '' && getData != undefined) {

      for (var i = getData.min_table_size; i <= getData.max_table_size; i++) {
        this.partySize.push(i);
      }
      let groupLimit = getData.max_table_size || 0;
      this.groupLimit = Array.from(new Array(groupLimit), (val, index) => index + 1);

      this.addBookingForm.patchValue({ guestcount: getData.min_table_size });     // 
      this.selectedDate = getData.selected_date;
      this.serviceTitle = getData.service_title;
      this.serviceDescription = getData.service_description;
      this.serviceImage = getData.service_image;
      this.serviceId = getData.service_id;
      this.minTableSize = getData.min_table_size;
      this.maxTableSize = getData.max_table_size;
      this.currentTimeslot = getData.current_time_slot;

    }

    if (this.currentTimeslot < this.currentTime) {
      this.disableSubmit = true;
    } else {
      this.disableSubmit = false;
    }

    let detailData = this._tableService.getViewBookingDetailData();
    if (detailData != '' && detailData != undefined) {

      this.addBookingForm.patchValue({ first_name: detailData.name });
      this.addBookingForm.patchValue({ email: detailData.email });
      this.addBookingForm.patchValue({ address: detailData.address });
      this.addBookingForm.patchValue({ notes: detailData.notes });
      this.addBookingForm.patchValue({ guestinfo: JSON.parse(detailData.guestinfo) });
      this.addBookingForm.patchValue({ guestcount: detailData.guestcount });
      this.addBookingForm.patchValue({ phone: detailData.phone });
      this.addBookingForm.patchValue({ id: detailData.user_id });
      this.guestInfoLength = JSON.parse(detailData.guestinfo);
    }
  }

  setControls() {
    this.addBookingForm = this.fb.group({
      first_name: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      address: this.fb.control(''),
      notes: this.fb.control(''),
      id: this.fb.control(''),
      guestcount: this.fb.control(1),
      phone: this.fb.control(''),
      guestinfo: [[]],
    });
    this._profileservices.getProfileInfo().subscribe(res => {
      let data = res.userinfo;
      let userRole = data.userrolesmany;
      this.flag = 0;
      userRole.forEach(item => {
        if (item.role_id == 8) {
          this.flag = 1;
        }
      });
      if (this.flag == 0) {
        if (res.userinfo != '' && res.userinfo != undefined) {
          this.addBookingForm.patchValue({ first_name: res.userinfo.first_name + ' ' + res.userinfo.last_name });
          this.addBookingForm.patchValue({ email: res.userinfo.email });
          this.addBookingForm.patchValue({ phone: res.userinfo.phone });
          this.addBookingForm.patchValue({ id: res.userinfo.id });

          this.sendUserId = res.userinfo.id
          //Get UserMeta Fields To Print
          if (res.userinfo && res.userinfo.usermeta) {
            this.userMeta = CommonUtils.getMetaValues(res.userinfo.usermeta);
            for (let i = 0; i < this.userMeta.length; i++) {
              if (this.userMeta[i].field_name == 'Apartment' || this.userMeta[i].field_name == 'Home') {
                this.addBookingForm.patchValue({ address: this.userMeta[i].field_value });
              }
            }
          }
        }
      }
    });
  }

  resetGroupLimit(resetCount: number = 1) {
    this.addBookingForm.get('guestcount').setValue(resetCount);

  }
  /** Update Guest Info From Array */
  setguestInfoFieldValue($event: any) {
    this.addBookingForm.get('guestinfo').setValue($event);

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



  getNextPreview() {
    let formValue = this.addBookingForm.value;
    let formData = {
      'name': formValue.first_name,
      'email': formValue.email,
      'phone': formValue.phone,
      'service_id': this.serviceId,
      'notes': formValue.notes,
      'booking_start_date': this.selectedDate,
      'booking_start_time': this.currentTimeslot,
      'address': formValue.address,
      'status': 'pending',
      'is_recurring': 'N',
      'recurring_meta': '',
      'recurrences': '',
      'min_table_size': this.minTableSize,
      'max_table_size': this.maxTableSize,
      'guestcount': formValue.guestcount,
      'guestinfo': JSON.stringify(formValue.guestinfo),
      'user_id': this.sendUserId,
      'id': '',
      'update': '',
      'parent_booking_id': '',
      'front': 1,
      'service_title': this.serviceTitle,
      'service_image': this.serviceImage
    }
    if (this.addBookingForm.valid) {
      this._tableService.setViewBookingDetailData(formData);
      this.router.navigate(['view-restaurant-reservations']);
    }

  }

  displayMainBooking() {
    this.disableSubmit = true;
    this.router.navigate(['restaurant-reservations']);
  }
  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      //this.addOrder.patchValue(userInfo.option.value);                  


      this.addBookingForm.patchValue({ first_name: userInfo.option.value.first_name + ' ' + userInfo.option.value.last_name });
      this.addBookingForm.patchValue({ email: userInfo.option.value.email });
      this.addBookingForm.patchValue({ phone: userInfo.option.value.phone });
      this.addBookingForm.patchValue({ id: userInfo.option.value.id });

      if (userInfo.option.value.usermeta) {
        this.userMeta = CommonUtils.getMetaValues(userInfo.option.value.usermeta);
        for (let i = 0; i < this.userMeta.length; i++) {
          if (this.userMeta[i].field_name == 'Apartment' || this.userMeta[i].field_name == 'Home') {
            this.addBookingForm.patchValue({ address: this.userMeta[i].field_value });
          }
        }
      }
    }
  }
}
