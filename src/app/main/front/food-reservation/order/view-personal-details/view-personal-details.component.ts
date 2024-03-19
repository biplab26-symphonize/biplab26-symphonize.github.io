import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService, SettingsService, FoodOrderService, FoodReservationService, ProfileService, AuthService } from 'app/_services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Form } from 'app/_models';

@Component({
  selector: 'app-view-personal-details',
  templateUrl: './view-personal-details.component.html',
  styleUrls: ['./view-personal-details.component.scss'],
  animations: fuseAnimations
})
export class ViewPersonalDetailsComponent implements OnInit {
  public addOrder: FormGroup;
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

  public name: any;
  public email: any;
  public phone: any;
  public location: any;
  public deliveryDate: any;
  public building: any;
  public orderDataArr: any = [];
  public data: any = [];
  public extrasFilter: any = [];
  public sideDishFilter: any = [];
  public sideDishIdFront: any = [];
  public extrasIdFront: any = [];
  public locationName: any;
  public type: any;
  public pickupTime: any;
  public startOver: any;
  public dateDeliver: any;
  public orderProcessing: boolean = false;
  public confirmBackButton: boolean = true;
  public type2: any;
  constructor(private _matSnackBar: MatSnackBar, private fb: FormBuilder,
    private _fuseConfigService: FuseConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private _commonService: CommonService,
    private _foodOrderService: FoodOrderService,
    private _foodReservationService: FoodReservationService,
    private _settingService: SettingsService, private _profileservices: ProfileService, private _authService: AuthService) {
    this.numberOfSideAndExtras[0] = 1;
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.product_name2 = '';
    this.quantity = '';
    this.sideDish = [];
    this.extras = [];
    this.notesData = [];
    this.type2 = "true";
    if (localStorage.getItem("confirmBackButton") === null) {      
    } else {      
      this.confirmBackButton = JSON.parse(localStorage.getItem("confirmBackButton"));
      this.orderProcessing = false;
      this.type2 = '';      
    }
    this.displayOrder();
  }
  displayOrder() {
    this.quantity = localStorage.getItem("quantity");
    this.product_name2 = localStorage.getItem("product_name");
    this.numberOfSideAndExtras = JSON.parse(JSON.stringify(localStorage.getItem("numberOfSideAndExtras")));
    this.numberOfSideAndExtras = this.numberOfSideAndExtras.split(',');
    this.side_number = JSON.parse(JSON.stringify(localStorage.getItem("side_number")));
    this.side_number = this.side_number.split(',');

    this.sideDish = JSON.parse(JSON.stringify(localStorage.getItem("sideDish")));
    this.sideDish = this.sideDish.split(',');
    this.sideDishFrontArr = [];
    let i = 0;
    let j = 0;
    this.numberOfSideAndExtras.forEach(item => {
      let k = 0;
      this.sideDishTemp = [];
      this.side_number.forEach(item => {
        this.sideDishTemp[k] = this.sideDish[i];
        k = k + 1;
        i = i + 1;
      });
      this.sideDishFrontArr[j] = this.sideDishTemp;
      j = j + 1;
    });

    this.extras = JSON.parse(JSON.stringify(localStorage.getItem("extras")));
    this.extras = this.extras.split(',');

    this.extrasFrontArr = [];
    i = 0;
    j = 0;
    this.numberOfSideAndExtras.forEach(item => {
      let k = 0;
      this.extrasTemp = [];
      this.side_number.forEach(item => {
        this.extrasTemp[k] = this.extras[i];
        k = k + 1;
        i = i + 1;
      });
      this.extrasFrontArr[j] = this.extrasTemp;
      j = j + 1;
    });


    this.notesData = JSON.parse(JSON.stringify(localStorage.getItem("notes")));
    this.notesData = this.notesData.split(',');
    this.orderDataArr = JSON.parse(localStorage.getItem("orderDataArr"));
    // get user personal details
    this.pickupTime = localStorage.getItem("pickupTime");
    this.type = localStorage.getItem("type");
    this.name = localStorage.getItem("name");
    this.email = localStorage.getItem("email");
    this.phone = localStorage.getItem("phone");
    this.location = localStorage.getItem("location");
    this.locationName = localStorage.getItem('locationName');
    this.dateDeliver = moment(localStorage.getItem("delivery_date")).format('MM-DD-YYYY');
    this.deliveryDate = moment(localStorage.getItem("delivery_date")).format('YYYY-MM-DD');
    this.building = localStorage.getItem("building");

    this.sideDishIdFront = JSON.parse(JSON.stringify(localStorage.getItem("sideDishId")));
    this.sideDishIdFront = this.sideDishIdFront.split(',');
    this.extrasIdFront = JSON.parse(JSON.stringify(localStorage.getItem("extrasId")));
    this.extrasIdFront = this.extrasIdFront.split(',');
  }
  ngOnInit() {
    this.setControls();
  }
  setControls() {
    this.addOrder = this.fb.group({
      user_id: this.fb.control('1'),
      location_id: this.fb.control(''),
      name: this.fb.control(''),
      email: this.fb.control(''),
      phone: this.fb.control(''),
      notes: this.fb.control(''),
      address: this.fb.control(''),
      booking_start_date: this.fb.control(''),
      booking_start_time: this.fb.control(''),
      price: this.fb.control(''),
      type: this.fb.control(''),
      status: this.fb.control(''),
      lunch: this.fb.control(''),
      dinner: this.fb.control(''),
      order_item: this.fb.control(''),
    });
  }
  removeAddress() {
    this.address = false;
  }
  getAddress() {
    this.address = true;
  }
  onSubmit() {
    this.confirmBackButton = false;
    this.orderProcessing = true;
    let orderData = this.addOrder.value;
    orderData.user_id = this._authService.currentUserValue.token.user.id;
    orderData.location_id = this.location;
    if(localStorage.getItem("type") == 'pickup' ){
      orderData.location_id = this.location;
    }else{
      orderData.location_id = '';
    }
    orderData.name = this.name;
    orderData.email = this.email;
    orderData.phone = this.phone;
    orderData.notes = 'test';
    orderData.address = this.building;
    orderData.booking_start_date = moment(this.deliveryDate).format('YYYY-MM-DD');
    if (this.pickupTime == 'null') {
      orderData.booking_start_time = 'ASAP';
    } else {
      orderData.booking_start_time = this.pickupTime;
    }
    orderData.price = '';
    orderData.type = localStorage.getItem("type");
    orderData.status = 'pending';
    orderData.lunch = localStorage.getItem("lunch");
    orderData.dinner = localStorage.getItem("dinner");
    let k = 0;
    this.orderDataArr.forEach(item => {
      let n = 0;
      this.extrasFilter = [];
      this.sideDishFilter = [];      
      JSON.parse(item.extrasId).forEach(iteme => {
        this.extrasFilter.push({ "side_number": iteme.entree, "extra_id": iteme.extra_id, "price": '', "notes": item.notes[iteme.entree - 1] });
        n = n + 1;
      });
      let m = 0;
      JSON.parse(item.sideDishId).forEach(items => {
        this.sideDishFilter.push({ "side_number": items.entree, "side_dish_id": items.side_id, "notes": item.notes[items.entree - 1] });
        m = m + 1;
      });
      this.data[k] = { "order_id": '', "category_id": item.categoryId, "product_id": item.productId, "quantity": item.quantity, "size": '', "extra": this.extrasFilter, "side_dish": this.sideDishFilter };
      k = k + 1;
    });

    orderData.order_item = JSON.stringify(this.data);    
    this._foodOrderService.confirmOrder(orderData).subscribe(response => {
      localStorage.setItem("confirmBackButton", 'false');
      this.orderProcessing = false;
      this.type2 = '';
      this._matSnackBar.open(response.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
      localStorage.removeItem("orderDataArr");
      //this.router.navigate(['/admin/food-reservation/menu/extras/list']);
    },
      error => {
        this.confirmBackButton = true;
        localStorage.setItem("confirmBackButton", 'true');
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });

  }

  removeOrder(index) {
    this.orderDataArr.splice(index, 1);
    localStorage.setItem("orderDataArr", JSON.stringify(this.orderDataArr));
    this._matSnackBar.open("Booking entry cancelled successfully!", 'CLOSE', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  redirectStartOver() {
    localStorage.removeItem("confirmBackButton")
    localStorage.removeItem("pickupTime");
    localStorage.removeItem("locationName");
    localStorage.removeItem("categoryId");
    localStorage.removeItem("lunch");
    localStorage.removeItem("side_number");
    localStorage.removeItem("phone");
    localStorage.removeItem("notes");
    localStorage.removeItem("product_name");
    localStorage.removeItem("building");
    localStorage.removeItem("extrasId ");
    localStorage.removeItem("dinner");
    localStorage.removeItem("delivery_date");
    localStorage.removeItem("quantity");
    localStorage.removeItem("location");
    localStorage.removeItem("sideDish");
    localStorage.removeItem("type");
    localStorage.removeItem("orderDataArr");
    localStorage.removeItem("numberOfSideAndExtras");
    localStorage.removeItem("sideDishId");
    localStorage.removeItem("extras");
    localStorage.removeItem("forntNotesArr");
    this.router.navigate(['to-go-order/']);
  }

}
