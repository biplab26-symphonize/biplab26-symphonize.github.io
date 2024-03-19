import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, SettingsService, OptionsList, GuestRoomService, UsersService, ProfileService } from 'app/_services';
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
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: fuseAnimations
})
export class CheckoutComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public addCheckout: FormGroup;
  public showArrival:boolean=false;
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
  filteredUsers: any[] = [];
  public userMeta: any = [];
  public promoCode: any;
  public user_id: any;
  public CustomFormats        : any;
  public reservation_time_price_on: any;
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
    private _profileservices: ProfileService,
    private _guestroomService: GuestRoomService,
    private _settingService: SettingsService
  ) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this._unsubscribeAll = new Subject();    
  }

  ngOnInit(): void {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    console.log("defaultDateTimeFormat",this.defaultDateTimeFormat);
    this.setControls();
    this.CustomFormats = OptionsList.Options.customformats;
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
          this.roomPrice = this.roomPrice + Number(item.total);
          this.roomId.push(item);
        });
      });
      if (this.CurrentSelectdData[0].name != '') {
        this.addCheckout.patchValue({ name: this.CurrentSelectdData[0].name });
        this.addCheckout.patchValue({ phone: this.CurrentSelectdData[0].phone });
        this.addCheckout.patchValue({ email: this.CurrentSelectdData[0].email });
        this.addCheckout.patchValue({ arrival_time: this.CurrentSelectdData[0].arrival_time });
        this.addCheckout.patchValue({ description: this.CurrentSelectdData[0].description });
        this.addCheckout.patchValue({ address: this.CurrentSelectdData[0].address });
      } else {
        this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      }
      this.totalprice = this.roomPrice;
    }
    this.addCheckout
      .get('name').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getUsers({ 'searchKey': value, autopopulate:1 }))
      )
      .subscribe(users => this.filteredUsers = users.data);
    window.addEventListener('scroll', this.scrollEvent, true);
  }
  scrollEvent = (event: any): void => {
    if (this.autoComplete) {
      if (this.autoComplete.panelOpen)
        // this.autoComplete.closePanel();
        this.autoComplete.updatePosition();
    }
  };
  setFormfields(userInfo: any) {
    console.log("userInfo",userInfo);
    if (userInfo.option.value) {
      this.user_id = userInfo.option.value.id;
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.addCheckout.patchValue(userInfo.option.value);      
      this.addCheckout.get('email').setValue(userInfo.option.value.email);
      this.addCheckout.get('name').setValue(userInfo.option.value.first_name + ' ' + userInfo.option.value.last_name);
      this.addCheckout.get('phone').setValue(userInfo.option.value.phone);
      this.addCheckout.get('phone').setValue(userInfo.option.value.phone);
      if (userInfo.option.value && userInfo.option.value.usermeta) {
        this.userMeta = CommonUtils.getMetaValues(userInfo.option.value.usermeta);
        console.log("this.userMeta",this.userMeta);
        for (let i = 0; i < this.userMeta.length; i++) {
          if (this.userMeta[i].field_name == 'building' || this.userMeta[i].field_name == 'Home' || this.userMeta[i].field_name == 'address') {
            this.addCheckout.patchValue({ address: this.userMeta[i].field_value });
          }
        }
      }
    }
  }
  setControls() {
    this.addCheckout = this.fb.group({
      step: this.fb.control('step4'),
      name: this.fb.control('', [Validators.required]),
      phone: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      arrival_time: this.fb.control(''),
      description: this.fb.control(''),
      address: this.fb.control(''),
    });
    this._profileservices.getProfileInfo().subscribe(res => {
      console.log("res.userinfo",res.userinfo);
      if (res.userinfo != '' && res.userinfo != undefined) {
        this.addCheckout.patchValue({ name: res.userinfo.first_name + ' ' + res.userinfo.last_name });
        this.addCheckout.patchValue({ email: res.userinfo.email });
        this.addCheckout.patchValue({ phone: res.userinfo.phone });
        this.addCheckout.patchValue({ phone: res.userinfo.phone });
        // this.addCheckout.patchValue({id:res.userinfo.id});
        this.user_id = res.userinfo.id
        //Get UserMeta Fields To Print
        if (res.userinfo && res.userinfo.usermeta) {
          this.userMeta = CommonUtils.getMetaValues(res.userinfo.usermeta);
          console.log("this.userMeta",this.userMeta);
          for (let i = 0; i < this.userMeta.length; i++) {
            if (this.userMeta[i].field_name == 'building' || this.userMeta[i].field_name == 'Home' || this.userMeta[i].field_name == 'address') {
              this.addCheckout.patchValue({ address: this.userMeta[i].field_value });
            }
          }
        }
      }
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
      // add the masking accoding the phone number 
      PhoneNumberValidations(event) { 
        if(event.target.value.length == 7){
        let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
          event.target.value =  values[1] + '-' + values[2]
          this.addCheckout.get('phone').setValue(event.target.value);
        }
        else{

            if(event.target.value.length == 10){
              let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
              event.target.value =  values[1] + '-' + values[2] + '-' + values[3];
              this.addCheckout.get('phone').setValue(event.target.value);
            }else{
                    if((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7]=='-' &&  event.target.value.length == 12)){
                      this.addCheckout.get('phone').setValue(event.target.value);
                    }else{
                    this.addCheckout.get('phone').setValue('');
                  }
              }
      }
  }
  gotoBack() {
    this.router.navigate(['/guest-room/extras']);
  }
  gotoNextStep() {
    if (this.addCheckout.valid) {
      let data = this.addCheckout.value;
      console.log("phone no",data.phone);
      let formdata = {
        'user_id': this.user_id,
        'name': data.name,
        'phone': data.phone,
        'email': data.email,
        'arrival_time': data.arrival_time,
        'description': data.description,
        'address': data.address,
        'guest': this.CurrentSelectdData[0].guest,
        'date_from': this.CurrentSelectdData[0].date_from,
        'date_to': this.CurrentSelectdData[0].date_to,
        'building_name': this.CurrentSelectdData[0].building_name,
        'building_id': this.CurrentSelectdData[0].building_id,
        'roomBookingArr': this.CurrentSelectdData[0].roomBookingArr,
        'discount': this.CurrentSelectdData[0].promocodeprice,
        'extraName': this.CurrentSelectdData[0].extraName,
        'extraId': this.CurrentSelectdData[0].extraId,
        'total_rooms': this.CurrentSelectdData[0].total_rooms,
        'nights': this.CurrentSelectdData[0].nights,
        'totalprice': this.CurrentSelectdData[0].totalprice,
        'roomPrice': this.CurrentSelectdData[0].roomPrice,
        'totalextraprice': this.CurrentSelectdData[0].totalextraprice,
        'promocodeprice': this.CurrentSelectdData[0].promocodeprice,
        'dipositeprice': this.CurrentSelectdData[0].dipositeprice,
        'promoCodeValue': this.CurrentSelectdData[0].promoCodeValue,
      };
      localStorage.setItem("guest_room_booking", JSON.stringify(formdata));
      this._guestroomService.setGuestRoomlistdata(formdata);
      this.router.navigate(['/guest-room/preview']);
    }
  }
  gotoHome() {
    this.router.navigate(['/guest-room']);
  }

}