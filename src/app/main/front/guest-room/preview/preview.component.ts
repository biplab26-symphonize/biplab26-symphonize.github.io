import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, SettingsService, OptionsList, GuestRoomService, UsersService } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntil, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import moment from 'moment';
import { element } from 'protractor';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  animations: fuseAnimations
})
export class PreviewComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public addBooking: FormGroup;
  public bookingArr: any = [];
  public CurrentSelectdData: any;
  public nights: any;
  public roomBookArr: any = [];
  public count: any;
  public extras: any = [];
  public roomPrice = 0;
  public extraTotalPrice: any;
  public extraId: any = [];
  public extraName: any = [];
  public totalprice = 0;
  public totalextraprice = 0;
  public roomId: any = [];
  public dipositeprice = 0;
  public promocodeprice = 0;
  public promoCode: any;
  public CustomFormats: any;
  public user_id: any;
  public reservation_time_price_on: any;
  filteredUsers: any[] = [];
  public disableSubmit: boolean = false;
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  autoComplete: MatAutocompleteTrigger;
  constructor(
    private _userService: UsersService,
    private fb: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private _commonService: CommonService,
    private _fuseConfigService: FuseConfigService,
    private _guestroomService: GuestRoomService,
    private _settingService: SettingsService
  ) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this._unsubscribeAll = new Subject();
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  ngOnInit(): void {
    this.setControls();
    this.CurrentSelectdData = this._guestroomService.GetGuestRoomsListData();
    this.CustomFormats = OptionsList.Options.customformats;
    if (this.CurrentSelectdData == undefined || this.CurrentSelectdData.length == 0) {
      this.router.navigate(['/guest-room']);
    } else {
      this.bookingArr = this.CurrentSelectdData;
      this.roomBookArr = JSON.parse(this.CurrentSelectdData[0].roomBookingArr);
      let currentDate = new Date(this.CurrentSelectdData[0].date_to);
      let dateSent = new Date(this.CurrentSelectdData[0].date_from);
      this.nights = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
      this._settingService.getGuestRoomSetting({ meta_type: "guest" }).then(res => {
        let data = res.data;
        data.forEach(item => {
          if (item.meta_key == 'reservation_time_price_on') {
            this.reservation_time_price_on = item.meta_value;
          }
        });
        if(this.reservation_time_price_on == 'night'){
          this.nights = Number(this.nights);
        }
        if(this.reservation_time_price_on == 'day'){
          this.nights = Number(this.nights) + 1;
        }
      });   
      this.count = 0;
      this.roomBookArr.map((element, index) => {
        element.forEach(item => {
          this.count = this.count + 1;
          this.roomPrice = this.roomPrice + Number(item.total);
          this.roomId.push(item);
        });
      });
      this.totalprice = this.roomPrice;
    }
  }
  setControls() {
    this.addBooking = this.fb.group({
      step: this.fb.control('step5'),
    });
  }
  goBack(event) {
    if (event.value == 'step1') {
      this.router.navigate(['/guest-room']);
    } else if (event.value == 'step2') {
      this.router.navigate(['/guest-room/rooms']);
    } else if (event.value == 'step3') {
      this.router.navigate(['/guest-room/extras']);
    } else if (event.value == 'step4') {
      this.router.navigate(['/guest-room/checkout']);
    } else if (event.value == 'step5') {
      this.router.navigate(['/guest-room/preview']);
    } else if (event.value == 'step6') {
      this.router.navigate(['/guest-room/confirm']);
    }
  }
  gotoBack() {
    this.router.navigate(['/guest-room/checkout']);
  }
  confirmBooking() {
    if (this.addBooking.valid) {
      let data = this.addBooking.value;
      this.disableSubmit = true;
      let roomData = JSON.parse(this.CurrentSelectdData[0].roomBookingArr);
      let roominfo: any = [];
      roomData.map((element, index) => {
        element.forEach(item => {
          item['room_number_id'] = '';
          item['room_id'] = item.id;
          roominfo.push(item);
        });
      });
      let formdata = {
        'user_id': this.CurrentSelectdData[0].user_id,
        'name': this.CurrentSelectdData[0].name,
        'phone': this.CurrentSelectdData[0].phone,
        'email': this.CurrentSelectdData[0].email,
        'arrival_time': moment(this.CurrentSelectdData[0].arrival_time).format('HH:mm:ss'),
        'notes': this.CurrentSelectdData[0].description,
        'address': this.CurrentSelectdData[0].address,
        'person': this.CurrentSelectdData[0].guest,
        'date_from': this.CurrentSelectdData[0].date_from,
        'date_to': this.CurrentSelectdData[0].date_to,
        'building_name':  this.CurrentSelectdData[0].building_name,
        'building_id': this.CurrentSelectdData[0].building_id,
        'room_price': this.CurrentSelectdData[0].roomPrice,
        'extra_price': this.CurrentSelectdData[0].totalextraprice,
        'total': this.CurrentSelectdData[0].totalprice,
        'deposit': this.CurrentSelectdData[0].dipositeprice,
        'tax': '',
        'security': '',
        'discount': this.CurrentSelectdData[0].promocodeprice,
        'voucher': this.CurrentSelectdData[0].promoCodeValue,
        'status': 'pending',
        'payment_method': 'cash',
        'roominfo': JSON.stringify(roominfo),
        'extrainfo': JSON.stringify(this.CurrentSelectdData[0].extraName)
      };
      this._guestroomService.addFrontBooking(formdata)
        .subscribe(response => {
          //localStorage.setItem("reservation_id", response.bookinginfo.id);
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          if (response.status == 200 && response.bookinginfo != false) {
            this.router.navigate(['/guest-room/confirm/',response.bookinginfo.id]);
          }
          if (response.bookinginfo == false) {
            this.router.navigate(['/guest-room/']);
          }

        },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
            
          });
     // this.router.navigate(['/guest-room/confirm']);
    }
  }
  gotoHome() {
    this.router.navigate(['/guest-room']);
  }
}
