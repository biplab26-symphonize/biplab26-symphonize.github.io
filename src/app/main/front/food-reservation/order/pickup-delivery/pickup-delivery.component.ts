import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService, SettingsService, FoodOrderService, FoodReservationService, ProfileService, UsersService } from 'app/_services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Form } from 'app/_models';

@Component({
  selector: 'app-pickup-delivery',
  templateUrl: './pickup-delivery.component.html',
  styleUrls: ['./pickup-delivery.component.scss'],
  animations: fuseAnimations
})
export class PickupDeliveryComponent implements OnInit {
  public addOrder: FormGroup;
  public category: any = [];
  public product: any = [];
  public sideArr: any = [];
  public extraArr: any = [];
  public side_number: any = [];
  public extrasData: any = [];
  public numberOfSideAndExtras: any = [];
  public sideDishArr: any = [];
  public extrasArr: any = [];
  public notesArr: any = [];
  public orderArr: any = [];
  notesItems: FormArray;
  public product_name: any;

  public product_name2: any;
  public quantity: any;
  public sideDish: any = [];
  public extras: any = [];
  public notesData: any = [];
  public sideDishTemp: any = [];
  public sideDishFrontArr: any = [];
  public extrasTemp: any = [];
  public extrasFrontArr: any = [];
  public address: boolean = false;
  public locations: any;
  public userData: any;
  public apartment: any;
  public type: any;
  public orderDataArr: any = [];
  public optionType: any;
  public locationDate: boolean = false;
  public locationTime: boolean = false;
  public locationAddress: any;
  public todayDate: any;

  public pickupLocation: any;
  public pickupaddress: any;
  public pickupDate: any;
  public pickupTime: any;
  public pickupLunch: any;
  public pickupDinner: any;

  public deliveryLocation: any;
  public deliveryaddress: any;
  public deliveryDate: any;
  public deliveryLunch: any;
  public deliveryDinner: any;
  public lunchMeal: boolean = false;
  public dinnerMeal: boolean = false;
  public dayName: any;
  public locationIdDelivery: any;
  public pickupDeliveryArr: any = [];
  public now: Date = new Date();
  public timeDate: any;
  public locationAddress2: any;
  public isChecked = { 'lunch': false, 'dinner': false };
  constructor(private _matSnackBar: MatSnackBar, private fb: FormBuilder,
    private _fuseConfigService: FuseConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private _commonService: CommonService,
    private _foodOrderService: FoodOrderService,
    private _foodReservationService: FoodReservationService,
    private _settingService: SettingsService, private _profileservices: ProfileService, private _usersService: UsersService) {
    this.numberOfSideAndExtras[0] = 1;
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.product_name2 = '';
    this.quantity = '';
    this.sideDish = [];
    this.extras = [];
    this.notesData = [];
    this.optionType = localStorage.getItem("type");
    let type2 = localStorage.getItem("type");
    if (type2 == 'delivery') {
      this.address = true;
    }
    if (type2 == 'pickup') {
      this.address = false;
    }
    this.todayDate = new Date();

    this.pickupLocation = '';
    this.pickupaddress = '';
    this.pickupDate = '';
    this.pickupTime = '';
    this.pickupLunch = '';
    this.pickupDinner = '';

    this.deliveryLocation = '';
    this.deliveryaddress = '';
    this.deliveryDate = '';
    this.deliveryLunch = '';
    this.deliveryDinner = '';
  }

  ngOnInit() {
    this.setControls();
    this.displayOrder();
    this._profileservices.getProfileInfo().subscribe(res => {
      this.userData = res.userinfo;
      for (let userdata of this.userData.usermeta) {
        if (userdata.user_fields.field_name == 'Apartment') {
          this.apartment = userdata.field_value;
          this.addOrder.patchValue({ building: this.apartment });
        }
      }
    });
    localStorage.removeItem("type");
    this.patchData();
  }
  displayOrder() {
    this.orderDataArr = JSON.parse(localStorage.getItem("orderDataArr"));
  }
  setControls() {
    this.addOrder = this.fb.group({
      lunch: this.fb.control(''),
      dinner: this.fb.control(''),
      building: this.fb.control(''),
      delivery_date: this.fb.control(''),
      time: this.fb.control(''),
      location: this.fb.control(''),
    });
    this.getFilteredLocations({ 'column': '' });
  }
  patchData() {
    if (localStorage.getItem("pickupDeliveryArr") === null) {      
    } else {
      this.pickupDeliveryArr = JSON.parse(localStorage.getItem("pickupDeliveryArr"));
      this.optionType = this.pickupDeliveryArr[0].optionType;      
      if (this.pickupDeliveryArr[0].optionType == 'pickup') {
        this.locationTime = true;
        this.locationDate = true;
        if (this.pickupDeliveryArr[3].pickupDate != '') {
          this.addOrder.get('delivery_date').setValue(moment(this.pickupDeliveryArr[3].pickupDate).format('YYYY-MM-DD'));
        }
        if (this.pickupDeliveryArr[1].pickupLocation != '') {
          this.locationTime = true;
          this.addOrder.get('location').setValue(this.pickupDeliveryArr[1].pickupLocation);
        }
        if (this.pickupDeliveryArr[4].pickupTime != '') {
          this.addOrder.get('time').setValue(this.pickupDeliveryArr[4].pickupTime);
        }
        this.pickupaddress = this.pickupDeliveryArr[2].pickupaddress;
        this.lunchMeal = this.pickupDeliveryArr[5].pickupLunch;
        this.dinnerMeal = this.pickupDeliveryArr[6].pickupDinner;        
        if (this.pickupDeliveryArr[5].pickupLunch == true) {
          this.isChecked['lunch'] = true;
          this.addOrder.get('lunch').setValue(true);
        } else {
          this.isChecked['lunch'] = false;
        }
        if (this.pickupDeliveryArr[6].pickupDinner == true) {
          this.isChecked['dinner'] = true;
          this.addOrder.get('dinner').setValue(true);
        } else {
          this.isChecked['dinner'] = false;
        }        
      }
      if (this.pickupDeliveryArr[0].optionType == 'delivery') {
        this.locationDate = true;
        if (this.pickupDeliveryArr[9].deliveryDate != '') {
          this.addOrder.get('delivery_date').setValue(moment(this.pickupDeliveryArr[9].deliveryDate).format('YYYY-MM-DD'));
        }
        if (this.pickupDeliveryArr[7].deliveryLocation != '') {
          this.addOrder.get('location').setValue(this.pickupDeliveryArr[7].deliveryLocation);
        }
        if (this.pickupDeliveryArr[8].deliveryaddress != '') {
          this.addOrder.get('building').setValue(this.pickupDeliveryArr[8].deliveryaddress);
        }
        this.lunchMeal = this.pickupDeliveryArr[10].deliveryLunch;
        this.dinnerMeal = this.pickupDeliveryArr[11].deliveryDinner;
        if (this.pickupDeliveryArr[10].deliveryLunch == true) {
          this.isChecked['lunch'] = true;
          this.addOrder.get('lunch').setValue(true);
        } else {
          this.isChecked['lunch'] = false;
        }
        if (this.pickupDeliveryArr[11].deliveryDinner == true) {
          this.isChecked['dinner'] = true;
          this.addOrder.get('dinner').setValue(true);
        } else {
          this.isChecked['dinner'] = false;
        }

        
      }
    }
  }

  removeAddress() {
    this.address = false;
    this.optionType = 'pickup';
  }
  getAddress() {
    this.address = true;
    this.optionType = 'delivery';
    this.locationTime = false;
  }
  getFilteredLocations(params: any) {
    return this._foodReservationService.getLocationList(params).then(Response => {
      this.locations = Response.data;
    });
  }
  onSubmit() {
    this.deliveryDate = moment(this.addOrder.get('delivery_date').value).format('YYYY-MM-DD');
    let data = this.addOrder.value;    
    let flag2 = 0;
    let flag = 0;
    if (data.lunch) {
      flag2 = 1;
    }
    if (data.dinner) {
      flag2 = 1;
    }
    if (this.optionType == 'pickup') {
      if (data.time != '' && data.location != '' && data.delivery_date != '' && flag2) {
        flag = 1;
      }
    }
    if (this.optionType == 'delivery') {
      if (data.delivery_date && data.building != '' && flag2) {
        flag = 1;
      }
    }
    if (flag == 1) {
      let lunchType = '';
      let dinnerType = '';
      if (data.lunch == true) {
        lunchType = 'Y';
      } else {
        lunchType = '';
      }
      if (data.dinner == true) {
        dinnerType = 'Y';
      } else {
        dinnerType = '';
      }
      this.pickupDeliveryArr[0] = { 'optionType': this.optionType };
      if (this.optionType == 'pickup') {
        this.pickupDeliveryArr[1] = { 'pickupLocation': data.location };
        this.pickupDeliveryArr[2] = { 'pickupaddress': this.pickupaddress };
        this.pickupDeliveryArr[3] = { 'pickupDate': this.deliveryDate };
        this.pickupDeliveryArr[4] = { 'pickupTime': data.time };
        this.pickupDeliveryArr[5] = { 'pickupLunch': data.lunch };
        this.pickupDeliveryArr[6] = { 'pickupDinner': data.dinner };
      } else {
        this.pickupDeliveryArr[1] = { 'pickupLocation': '' };
        this.pickupDeliveryArr[2] = { 'pickupaddress': '' };
        this.pickupDeliveryArr[3] = { 'pickupDate': '' };
        this.pickupDeliveryArr[4] = { 'pickupTime': '' };
        this.pickupDeliveryArr[5] = { 'pickupLunch': '' };
        this.pickupDeliveryArr[6] = { 'pickupDinner': '' };
      }
      if (this.optionType == 'delivery') {
        this.pickupDeliveryArr[7] = { 'deliveryLocation': '' };
        this.pickupDeliveryArr[8] = { 'deliveryaddress': this.deliveryaddress };
        this.pickupDeliveryArr[9] = { 'deliveryDate': this.deliveryDate };
        this.pickupDeliveryArr[10] = { 'deliveryLunch': data.lunch };
        this.pickupDeliveryArr[11] = { 'deliveryDinner': data.dinner };
      } else {
        this.pickupDeliveryArr[7] = { 'deliveryLocation': '' };
        this.pickupDeliveryArr[8] = { 'deliveryaddress': '' };
        this.pickupDeliveryArr[9] = { 'deliveryDate': '' };
        this.pickupDeliveryArr[10] = { 'deliveryLunch': '' };
        this.pickupDeliveryArr[11] = { 'deliveryDinner': '' };
      }


      this.pickupDeliveryArr[12] = { 'lunchMeal': this.lunchMeal };
      this.pickupDeliveryArr[13] = { 'dinnerMeal': this.dinnerMeal };

      localStorage.setItem("pickupDeliveryArr", JSON.stringify(this.pickupDeliveryArr));
      localStorage.setItem("pickupTime", data.time);
      localStorage.setItem("type", this.optionType);
      localStorage.setItem("location", data.location);
      localStorage.setItem("lunch", lunchType);
      localStorage.setItem("dinner", dinnerType);
      localStorage.setItem("delivery_date", data.delivery_date);
      localStorage.setItem("building", data.building);
      this.router.navigate(['to-go-order-load-checkout/']);
    }
  }
  removeOrder(index) {
    this.orderDataArr.splice(index, 1);
    localStorage.setItem("orderDataArr", JSON.stringify(this.orderDataArr));
    this._matSnackBar.open("Booking entry cancelled successfully!", 'CLOSE', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  getDateTime(locationId) {
    this.locationIdDelivery = locationId.value;
    this.locationAddress = '';
    this.locations.forEach(item => {
      if (item.id == locationId.value) {
        this.locationAddress = item.location_address;
        localStorage.setItem("locationName", item.location_name);
        if (this.optionType == 'delivery') {
          this.deliveryLocation = locationId.value;
          // this.deliveryaddress = this.locationAddress;
          this.locationAddress2 = this.locationAddress;
        }
        if (this.optionType == 'pickup') {
          this.pickupLocation = locationId.value;
          this.pickupaddress = this.locationAddress;
        }
      }
    });
    if (this.optionType == 'delivery') {
      this.locationDate = true;
    }
    if (this.optionType == 'pickup') {
      this.locationDate = true;
      this.locationTime = true;
    }

  }
  getDate(event) {


  }
  getTime(event) {
    let flag = 0;
    if (this.optionType == 'pickup') {
      this.pickupTime = event.value;
    }
    // setInterval(() => {
    //   this.now = new Date();    
    // }, 1);
    // let workingtime = new Date(moment(event.value, 'HH:mm:ss').toString());
    
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (this.optionType == 'delivery') {

      this.deliveryDate = moment(this.addOrder.get('delivery_date').value).format('YYYY-MM-DD');
      // let d = new Date(this.deliveryDate);
      // this.dayName = days[d.getDay()];
    }
    if (this.optionType == 'pickup') {
      this.pickupDate = moment(this.addOrder.get('delivery_date').value).format('YYYY-MM-DD');
      let d = new Date(this.pickupDate);
      this.dayName = days[d.getDay()];
      this.locations.forEach(item => {
        if (this.locationIdDelivery == item.id) {          
          let pickupDayName = "p_" + this.dayName.toLowerCase() + "_from";          
          if (pickupDayName == 'p_monday_from') {
            let p_monday_from = (new Date("1955-11-05T" + item.pickupworkingtimes.p_monday_from + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            let p_monday_to = (new Date("1955-11-05T" + item.pickupworkingtimes.p_monday_to + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            if (p_monday_from >= event.value && p_monday_to <= event.value) {
              flag = 1;
            }
          }
          if (pickupDayName == 'p_tuesday_from') {
            let p_tuesday_from = (new Date("1955-11-05T" + item.pickupworkingtimes.p_tuesday_from + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            let p_tuesday_to = (new Date("1955-11-05T" + item.pickupworkingtimes.p_tuesday_to + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            if (p_tuesday_from >= event.value && p_tuesday_to <= event.value) {
              flag = 1;
            }
          }
          if (pickupDayName == 'p_wednesday_from') {
            let p_wednesday_from = (new Date("1955-11-05T" + item.pickupworkingtimes.p_wednesday_from + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            let p_wednesday_to = (new Date("1955-11-05T" + item.pickupworkingtimes.p_wednesday_to + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            if (p_wednesday_from >= event.value && p_wednesday_to <= event.value) {
              flag = 1;
            }
          }
          if (pickupDayName == 'p_thursday_from') {
            let p_thursday_from = (new Date("1955-11-05T" + item.pickupworkingtimes.p_thursday_from + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            let p_thursday_to = (new Date("1955-11-05T" + item.pickupworkingtimes.p_thursday_to + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });                                    
            if (Date.parse(p_thursday_from) >= Date.parse(event.value) && Date.parse(p_thursday_to) <= Date.parse(event.value)) {
              flag = 1;
            }
          }
          if (pickupDayName == 'p_friday_from') {
            let p_friday_from = (new Date("1955-11-05T" + item.pickupworkingtimes.p_friday_from + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            let p_friday_to = (new Date("1955-11-05T" + item.pickupworkingtimes.p_friday_to + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            if (p_friday_from >= event.value && p_friday_to <= event.value) {
              flag = 1;
            }
          }
          if (pickupDayName == 'p_saturday_from') {
            let p_saturday_from = (new Date("1955-11-05T" + item.pickupworkingtimes.p_saturday_from + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            let p_saturday_to = (new Date("1955-11-05T" + item.pickupworkingtimes.p_saturday_to + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            if (p_saturday_from >= event.value && p_saturday_to <= event.value) {
              flag = 1;
            }
          }
          if (pickupDayName == 'p_sunday_from') {
            let p_sunday_from = (new Date("1955-11-05T" + item.pickupworkingtimes.p_sunday_from + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            let p_sunday_to = (new Date("1955-11-05T" + item.pickupworkingtimes.p_sunday_to + "Z")).toLocaleTimeString("bestfit", {
              timeZone: "UTC",
              hour12: !0,
              hour: "numeric",
              minute: "numeric"
            });
            if (p_sunday_from >= event.value && p_sunday_to <= event.value) {
              flag = 1;
            }
          }

        }
      });      
    }
  }
  patchValue() {
    this.lunchMeal = false;
    this.dinnerMeal = false;
    if (this.optionType == 'delivery') {
      this.locationTime = false;
      if (this.deliveryDate != '') {
        this.addOrder.get('delivery_date').setValue(this.deliveryDate);
      } else {
        this.addOrder.get('delivery_date').reset();
      }
      if (this.deliveryLocation != '') {
        this.addOrder.get('location').setValue(this.deliveryLocation);
      } else {
        this.addOrder.get('location').reset();
      }
      if (this.deliveryaddress != '') {
        this.addOrder.get('building').setValue(this.deliveryaddress);
      }
      this.lunchMeal = this.deliveryLunch;
      this.dinnerMeal = this.deliveryDinner;
    }
    if (this.optionType == 'pickup') {
      if (this.pickupDate != '') {
        this.addOrder.get('delivery_date').setValue(this.pickupDate);
      } else {
        this.addOrder.get('delivery_date').reset();
      }
      if (this.pickupLocation != '') {
        this.locationTime = true;
        this.addOrder.get('location').setValue(this.pickupLocation);
      } else {
        this.addOrder.get('location').reset();
      }
      if (this.pickupTime != '') {
        this.addOrder.get('time').setValue(this.pickupTime);
      }
      this.lunchMeal = this.pickupLunch;
      this.dinnerMeal = this.pickupDinner;
    }
  }
  getMeal(event, mealType) {
    if (this.optionType == 'pickup') {
      if (event.checked && mealType == 'lunch') {
        this.pickupLunch = true;
      }
      if (event.checked == false && mealType == 'lunch') {
        this.pickupLunch = false;
      }
      if (event.checked && mealType == 'dinner') {
        this.pickupDinner = true;
      }
      if (event.checked == false && mealType == 'dinner') {
        this.pickupDinner = false;
      }
    }
    if (this.optionType == 'delivery') {
      if (event.checked && mealType == 'lunch') {
        this.deliveryLunch = true;
      }
      if (event.checked == false && mealType == 'lunch') {
        this.deliveryLunch = false;
      }
      if (event.checked && mealType == 'dinner') {
        this.deliveryDinner = true;
      }
      if (event.checked == false && mealType == 'dinner') {
        this.deliveryDinner = false;
      }
    }
  }
  getUserAddress(event) {
    this.deliveryaddress = event.target.value;
  }
  restAll() {
    if (this.optionType == 'pickup') {
      this.addOrder.get('location').reset();
      this.addOrder.get('delivery_date').reset();
      this.addOrder.get('time').reset();
      this.addOrder.get('lunch').reset();
      this.addOrder.get('dinner').reset();
      this.pickupaddress = '';
    }
    if (this.optionType == 'delivery') {
      this.addOrder.get('location').reset();
      this.addOrder.get('delivery_date').reset();
      this.addOrder.get('building').reset();
      this.addOrder.get('lunch').reset();
      this.addOrder.get('dinner').reset();
    }
  }
}
