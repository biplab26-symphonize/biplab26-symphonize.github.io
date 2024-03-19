import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService, SettingsService, FoodOrderService, FoodReservationService, ProfileService, UsersService, EventbehavioursubService } from 'app/_services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Form } from 'app/_models';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  animations: fuseAnimations
})
export class PersonalDetailsComponent implements OnInit {
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
  public extrasTemp: any = []; s
  public extrasFrontArr: any = [];
  public address: boolean = false;
  public orderDataArr: any = [];
  public filteredUsers: any[] = [];
  public flag: any;
  restrictFormInfo: boolean = false;
  private _unsubscribeAll: Subject<any>;
  constructor(private _eventbehavioursubService: EventbehavioursubService, private _userService: UsersService, private _matSnackBar: MatSnackBar, private fb: FormBuilder,
    private _fuseConfigService: FuseConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private _commonService: CommonService,
    private _foodOrderService: FoodOrderService,
    private _foodReservationService: FoodReservationService,
    private _settingService: SettingsService, private _profileservices: ProfileService,) {
    this._unsubscribeAll = new Subject();
    this.numberOfSideAndExtras[0] = 1;
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.product_name2 = '';
    this.quantity = '';
    this.sideDish = [];
    this.extras = [];
    this.notesData = [];
    this.displayOrder();
  }
  displayOrder() {
    this.orderDataArr = JSON.parse(localStorage.getItem("orderDataArr"));
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
  }
  ngOnInit() {
    this.setControls();
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
        let userName = data.first_name + " " + data.last_name;
        this.addOrder.patchValue({ name: userName });
        this.addOrder.patchValue({ email: data.email });
        this.addOrder.patchValue({ phone: data.phone });
      }
    });
    this.addOrder
      .get('name').valueChanges
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
  setControls() {
    this.addOrder = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
    });
  }
  removeAddress() {
    this.address = false;
  }
  getAddress() {
    this.address = true;
  }
  onSubmit() {
    if (this.addOrder.invalid) {
      return;
    }
    let data = this.addOrder.value;
    if (data.name != '' && data.email != '' && data.phone != '') {
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("phone", data.phone);
      this.router.navigate(['to-go-order-load-preview/']);
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
  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      //this.addOrder.patchValue(userInfo.option.value);                     
      this.addOrder.patchValue({ name: userInfo.option.value.username });
      this.addOrder.patchValue({ email: userInfo.option.value.email });
      this.addOrder.patchValue({ phone: userInfo.option.value.phone });
    }
  }
}
