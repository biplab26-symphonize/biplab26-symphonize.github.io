import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, SettingsService, GuestRoomService } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public addReservation: FormGroup;
  public numbers: any = [1, 2, 3, 4, 5, 6, 7, 8];
  public todayDate: any;
  public start_date: any;
  public toDate: any;
  public CurrentSelectdData: any;
  public buildingList: any = [];
  public reservation_time_price_on: any;
  public reserveDate: any;
  public afterFourtyFiveDate: any;
  public startDateValidation: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _fuseConfigService: FuseConfigService,
    private _guestroomService: GuestRoomService,
    private _settingService: SettingsService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.setControls();
    this.todayDate = new Date();
    this.addReservation.get('date_from').setValue(this.todayDate);
    localStorage.removeItem("roomBookingArr");
    localStorage.removeItem("reservation_id");
    localStorage.removeItem("guest_room_booking");
    this.CurrentSelectdData = this._guestroomService.GetGuestRoomsListData();
    if (this.CurrentSelectdData != undefined && this.CurrentSelectdData.length > 0) {
      this.addReservation.patchValue({ guest: this.CurrentSelectdData[0].guest });


      this.addReservation.patchValue({ date_from: CommonUtils.getStringToDate(this.CurrentSelectdData[0].date_from) });
      this.addReservation.patchValue({ date_to: CommonUtils.getStringToDate(this.CurrentSelectdData[0].date_to) });
    } else {
      this._settingService.getGuestRoomSetting({ meta_type: "guest" }).then(res => {
        let data = res.data;
        data.forEach(item => {
          if (item.meta_key == 'reservation_time_price_on') {
            this.reservation_time_price_on = item.meta_value;
            localStorage.setItem("reservation_time_price_on", this.reservation_time_price_on);
          }
        });
        if (this.reservation_time_price_on == 'night') {
          this.toDate = new Date();
          this.toDate.setDate(this.toDate.getDate() + 1);
          this.addReservation.get('date_to').setValue(this.toDate);
        }
        if (this.reservation_time_price_on == 'day') {
          this.toDate = new Date();
          this.addReservation.get('date_to').setValue(this.toDate);
        }

      });
    }
    var offset = new Date().getTimezoneOffset();
    let reservationLimit = new Date();
    let numberOfDaysToAdd  = offset == 300 ? 45 : 44;
    reservationLimit.setDate(reservationLimit.getDate() + numberOfDaysToAdd);
    this.reserveDate = moment(reservationLimit).format('YYYY-MM-DD');

    let reservationLimit2 = new Date();
    
    let numberOfDaysToAddStart = offset == 300 ? 45 : 44;
    reservationLimit2.setDate(reservationLimit2.getDate() + numberOfDaysToAddStart);
    this.startDateValidation = moment(reservationLimit2).format('YYYY-MM-DD');

  }
  setControls() {
    this.addReservation = this.fb.group({
      step: this.fb.control('step1'),
      guest: this.fb.control(1, [Validators.required]),
      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
      building_id: this.fb.control('', [Validators.required]),
    });
    this._guestroomService.getBuildingList({ 'status': 'A', 'direction': 'asc', 'column': 'name' }).then(Response => {
      this.buildingList = Response.data;
    });
  }
  fromDate(event) {

    let selectedFromDate = moment(event.value).format('YYYY-MM-DD');
    console.log(moment(selectedFromDate), this.startDateValidation);

    var start = moment(this.startDateValidation, "YYYY-MM-DD");
    var end = moment(selectedFromDate, "YYYY-MM-DD");

    //Difference in number of days
    let daysDiff = moment.duration(start.diff(end)).asDays();
    console.log("daysDiff>>>",daysDiff);
    if (moment(selectedFromDate).isSame(this.startDateValidation) || daysDiff==1) {
      var offset = new Date().getTimezoneOffset();
      console.log("offset", offset);
      let numberOfDays = offset == 300 ? 8 : 7;
      let reservationLimit = moment(selectedFromDate).add(numberOfDays, 'days');
      this.reserveDate = moment(reservationLimit).format('YYYY-MM-DD');

    }
    else {
      let reservationLimit = new Date();
      var offset = new Date().getTimezoneOffset();
      let numberOfDaysToAddStart = offset == 300 ? 45 : 44;
      reservationLimit.setDate(reservationLimit.getDate() + numberOfDaysToAddStart);
      this.reserveDate = moment(reservationLimit).format('YYYY-MM-DD');
    }

    let reservation_price_on = localStorage.getItem("reservation_time_price_on");
    // let fromDate = moment(event.value).format('YYYY-MM-DD');
    // this.toDate = new Date(fromDate);  
    this.toDate = new Date(event.value);
    if (reservation_price_on == 'night') {
      this.toDate.setDate(this.toDate.getDate() + 1);
      this.addReservation.get('date_to').setValue(this.toDate);
    }
    if (reservation_price_on == 'day') {
      this.addReservation.get('date_to').setValue(this.toDate)
    }

  }
  gotoNextStep() {
    // let value2 = this.addReservation.value;
    //   


    if (this.addReservation.valid) {
      let value = this.addReservation.value;

      let formdata = {
        'guest': value.guest,
        'date_from': moment(value.date_from).format('YYYY-MM-DD'),
        'date_to': moment(value.date_to).format('YYYY-MM-DD'),
        'building_id': value.building_id,
        'total': '',
        'discount': '',
        'deposit': '',
        'extraName': '',
        'total_rooms': '',
        'nights': '',
        'totalprice': '',
        'roomPrice': '',
        'totalextraprice': '',
        'promocodeprice': '',
        'dipositeprice': '',
        'roomBookArr': '',
      };
      localStorage.setItem("guest_room_booking", JSON.stringify(formdata));
      this._guestroomService.setGuestRoomlistdata(formdata);
      this.router.navigate(['/guest-room/rooms']);
    }
  }
  gotoHome() {

  }
}
