import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, SettingsService, OptionsList, GuestRoomService } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import moment from 'moment';
import { element } from 'protractor';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss'],
  animations: fuseAnimations
})
export class ExtrasComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public addExtras: FormGroup;
  public bookingArr: any = [];
  public CurrentSelectdData: any;
  public nights: any;
  public roomBookArr: any = [];
  public count: any;
  public extras: any = [];
  extrasArray: FormArray;
  public roomPrice = 0;
  public extraTotalPrice: any;
  public extraId: any = [];
  public extraName: any = [];
  public totalprice = 0;
  public totalextraprice = 0;
  public roomId: any = [];
  public dipositeprice = 0;
  public promocodeprice = 0;
  public promoCodeValue: any;
  public isPromocode: boolean = false;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public reservation_time_price_on: any;
  constructor(
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
          this.roomPrice = this.roomPrice + Number(item.price);
          this.roomId.push(item);
        });
      });

      this._guestroomService.getExtrasList({ 'status': 'A', 'direction': 'desc' }).then(Response => {
        this.extras = Response.data;
        let data = JSON.parse(localStorage.getItem('guest_room_booking'));
        if (data.extraName != '') {
          this.extraName = data.extraName;
          let f = 0;
          this.extrasArray = this.addExtras.get('extrasArray') as FormArray;
          this.extras.map((element, index) => {
            f = 0;
            this.extraName.forEach(item => {
              if (item.extra_id == element.id) {
                f = 1;
                const tempObj = {};
                tempObj['extras_check'] = new FormControl(true);
                this.extrasArray.push(this.fb.group(tempObj));
              }
            });
            if (f == 0) {
              const tempObj = {};
              tempObj['extras_check'] = new FormControl(false);
              this.extrasArray.push(this.fb.group(tempObj));
            }
          });
          this.extraId = this.CurrentSelectdData[0].extraId;
          this.totalprice = this.CurrentSelectdData[0].totalprice;
          this.roomPrice = this.CurrentSelectdData[0].roomPrice;
          this.totalextraprice = this.CurrentSelectdData[0].totalextraprice;
          this.promocodeprice = this.CurrentSelectdData[0].promocodeprice;
          this.dipositeprice = this.CurrentSelectdData[0].dipositeprice;
          this.addExtras.patchValue({ promo_code: this.CurrentSelectdData[0].promoCodeValue });
        } else {
          this.totalprice = this.roomPrice;
          this.dipositeprice = Number(this.totalprice) * 10 / 100;
          this.extras.map((element, index) => {
            this.onAddExtras();
          });
        }
      });
    }
  }
  setControls() {
    this.addExtras = this.fb.group({
      step: this.fb.control('step3'),
      promo_code: this.fb.control(''),
      extrasArray: this.fb.array([]),
    });
  }
  createExtrasItem() {
    return this.fb.group({
      extras_check: this.fb.control(''),
    })
  }
  onAddExtras() {
    this.extrasArray = this.addExtras.get('extrasArray') as FormArray;
    this.extrasArray.push(this.createExtrasItem());
  }
  getExtras(event, extra_id, extra_price, name, per_price) {
    if (event.checked == true) {
      this.extraId.push(extra_id);
      this.extraName.push({ 'extra_id': extra_id, 'name': name, 'per_price': per_price, 'price': extra_price });
    } else {
      this.extraId.map((element, index) => {
        if (extra_id == element) {
          this.extraId.splice(index, 1);
          this.extraName.splice(index, 1);
        }
      });
    }
    let persons = 0;
    //this.roomPrice = 0;
    this.roomBookArr.map((element, index) => {
      element.forEach(item => {
        persons = persons + Number(item.adults) + Number(item.children);
      });
    });
    this.promoCodeValue = this.addExtras.get('promo_code').value;
    this._guestroomService.getExtrasPrice(this.CurrentSelectdData[0].date_from, this.CurrentSelectdData[0].date_to, this.extraId.join(","), this.roomPrice, persons, JSON.stringify(this.roomId), this.promoCodeValue).subscribe(response => {
      this.extraTotalPrice = response.extrapriceinfo;
      this.totalprice = this.extraTotalPrice.totalprice;
      this.roomPrice = this.extraTotalPrice.roomprice;
      this.totalextraprice = this.extraTotalPrice.totalextraprice;
      this.promocodeprice = this.extraTotalPrice.promocodeprice;
      this.dipositeprice = this.extraTotalPrice.dipositeprice;
    });
  }
  applyPromocode() {
    let persons = 0;
    //this.roomPrice = 0;
    this.roomBookArr.map((element, index) => {
      element.forEach(item => {
        persons = persons + Number(item.adults) + Number(item.children)
      });
    });
    this.promoCodeValue = this.addExtras.get('promo_code').value;
    this._guestroomService.getExtrasPrice(this.CurrentSelectdData[0].date_from, this.CurrentSelectdData[0].date_to, this.extraId.join(","), this.roomPrice, persons, JSON.stringify(this.roomId), this.promoCodeValue).subscribe(response => {
      this.extraTotalPrice = response.extrapriceinfo;
      this.totalprice = this.extraTotalPrice.totalprice;
      this.roomPrice = this.extraTotalPrice.roomprice;
      this.totalextraprice = this.extraTotalPrice.totalextraprice;
      this.promocodeprice = this.extraTotalPrice.promocodeprice;
      this.dipositeprice = this.extraTotalPrice.dipositeprice;
      if (this.promocodeprice == 0) {
        this.isPromocode = true;
      } else {
        this.isPromocode = false;
      }
    });
  }
  removeValidation() {
    this.isPromocode = false;
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
    this.router.navigate(['/guest-room/rooms']);
  }
  gotoNextStep() {
    if (this.addExtras.valid) {
      let value = this.addExtras.value;
      let formdata = {
        'user_id': '',
        'name': '',
        'phone': '',
        'email': '',
        'arrival_time': '',
        'description': '',
        'address': '',
        'guest': this.CurrentSelectdData[0].guest,
        'date_from': this.CurrentSelectdData[0].date_from,
        'date_to': this.CurrentSelectdData[0].date_to,
        'building_name':  this.CurrentSelectdData[0].building_name,
        'building_id': this.CurrentSelectdData[0].building_id,
        'roomBookingArr': JSON.stringify(this.roomBookArr),
        'discount': this.promocodeprice,
        'deposit': this.dipositeprice,
        'extraName': this.extraName,
        'extraId': this.extraId,
        'total_rooms': this.count,
        'nights': this.nights,
        'totalprice': this.totalprice,
        'roomPrice': this.roomPrice,
        'totalextraprice': this.totalextraprice,
        'promocodeprice': this.promocodeprice,
        'dipositeprice': this.dipositeprice,
        'promoCodeValue': this.promoCodeValue,
      };
      localStorage.setItem("guest_room_booking", JSON.stringify(formdata));
      this._guestroomService.setGuestRoomlistdata(formdata);
      this.router.navigate(['/guest-room/checkout']);
    }
  }
  gotoHome(){
    this.router.navigate(['/guest-room']);
  }
}
