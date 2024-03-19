import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { UsersService, OptionsList, FoodReservationService, CommonService, ProfileService, FoodOrderService, ChatService, AuthService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
//import { MatSnackBar, MatDialog, MatDialogRef  } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { join } from 'lodash';
import { Observable, of } from 'rxjs';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';
import { environment } from 'environments/environment';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
  public products: any;
  public loadEditEntry: boolean = false;
  public addOrderForm: FormGroup;
  public orderitems: FormArray;
  public side_dish: FormArray;
  public sideNumber: any = [];
  public sideDish: any = [];
  public extras: any = [];
  //public sideArr : any=[];
  public rowsideArr: Object = {};
  public rowextraArr: Object = {};
  public isSubmit: boolean = false;

  public sideArr: any = [];
  public sideArr1: any[][] = [];
  public extraArr: any = [];
  public sidedishid: FormArray;
  public title: string = '';
  public selectStatus = ['pending', 'confirmed'];
  public types = ['pickup', 'delivery'];
  public locations: any;
  public user_id: any;
  public name: any;
  public email: any;
  public phone: any;
  public url_id: any;
  public counter: number = 1;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public editOrderData: boolean = false;
  public patchValueData: any;
  public numberOfSideAndExtras: any = [];
  filteredUsers: any[] = [];
  public todayDate: any;
  public userId: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 

  constructor(
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _foodService: FoodReservationService,
    private _foodOrder: FoodOrderService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _commonService: CommonService,
    private _profileservices: ProfileService) {

    if (this.route.routeConfig.path == 'admin/food-reservation/orders/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editOrderData = true;
    }
    this.url_id ? this.title = "Update Order" : this.title = "Add New Order";
    //this.url_id ? this.buttonTitle = "Update":this.buttonTitle = "Save";
  }

  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.setControls();
    this.todayDate = new Date();
    this.addOrderForm
      .get('first_name').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getUsers({ 'searchKey': value, autopopulate:1 }))
      )
      .subscribe(users => this.filteredUsers = users.data);

  }

  setControls() {
    this.addOrderForm = this.fb.group({
      orderitems: new FormArray([]),
      first_name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      phone: this.fb.control('', [Validators.required]),
      type: this.fb.control(''),
      orderstatus: this.fb.control('', [Validators.required]),
      address: this.fb.control(''),
      lunch: this.fb.control(''),
      dinner: this.fb.control(''),
      location_id: this.fb.control(''),
      booking_start_date: this.fb.control(''),
      id: this.fb.control('')
    });

    //COMBINE HTTP CALLS
    let productList = this._foodService.getProduct({ 'status': 'A' });
    let locationList = this._foodService.getLocation({ 'direction': 'desc' });

    forkJoin([productList, locationList]).subscribe(results => {
      if (results && results.length > 0) {
        this.products = results[0] ? results[0].data : [];
        this.locations = results[1] ? results[1].data : [];

        if (this.route.routeConfig.path == 'admin/food-reservation/orders/edit/:id') {
          //ON EDIT 
          this.loadEditEntry = true;
          this.userId = JSON.parse(localStorage.getItem('token')).user_id;
          //this.fillBookingValues();
          this.getFilteredServices();
        }
        else {
          //ON ADD
          this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
          this.orderitems.push(this.createItem());
        }
        this.setUserInfo();
        this.EditRestrictionUpdateEvent();
      }
    });
  }

  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.addOrderForm.patchValue(userInfo.option.value);
      this.addOrderForm.get('first_name').setValue(userInfo.option.value.first_name + ' ' + userInfo.option.value.last_name);
    }
  }
  getFilteredServices() {
    return this._foodOrder.getOrderList({ 'direction': 'desc', 'column': 'id' }).then(Response => {
      this.serviceList = Response.data;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.userId) {
              let edit: boolean = true;
              this.fillBookingValues(edit);
            }
            if (item.editrestriction.user.id != this.userId) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {
            let edit: boolean = true;
            this.fillBookingValues(edit);
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
        data: { type: 'updateOrder', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/food-reservation/orders/orders-list']);
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
    this._foodOrder.updateForm(this.url_id, 'foodorder').subscribe(response => {
      let edit: boolean = true;
      this.fillBookingValues(edit);
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.form_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
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
      data: { type: 'updateOrder', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/food-reservation/orders/orders-list']);
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
      this.confirmDialogRef.componentInstance.type = 'foodorder';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillBookingValues(edit: any) {
    this._foodOrder.getOrderContent(this.url_id, edit).subscribe(response => {
      this.patchValueData = response.orderinfo;
      let bookStartTime = this.patchValueData.booking_start_date.replace(/-/g, '\/') + ' ' + this.patchValueData.booking_start_time;
      this.patchValueData.booking_start_date = new Date(bookStartTime);
      //MIN DATE FOR OWL DATETIMEPICKER
      this.todayDate = this.patchValueData.booking_start_date;

      if (this.patchValueData.lunch == 'N' && this.patchValueData.lunch != '') {
        this.patchValueData.lunch = "";
      }
      if (this.patchValueData.dinner == 'N' && this.patchValueData.dinner != '') {
        this.patchValueData.dinner = "";
      }
      this.addOrderForm.patchValue(this.patchValueData);

      this.addOrderForm.get('first_name').patchValue(this.patchValueData.name);
      this.addOrderForm.get('orderstatus').patchValue(this.patchValueData.status);
      //PATCH ORDERITEMS DATA
      this.patchOrderItems();
    });
  }
  //PREPARE EXTRA AND SIDE DISH ARRAY USING EDIT DATA
  prepareExtraSideArray(orderitem, rowindex) {
    if (this.products && this.products.length > 0 && this.patchValueData && this.patchValueData.orderitems && this.patchValueData.orderitems.length > 0) {
      let orderproduct = this.products.find(productitem => { return productitem.id == orderitem.product_id })
      this.sideArr = [];
      this.extraArr = [];
      this.sideDish = orderproduct.productsidedish;
      this.extras = orderproduct.productextras;

      let sidesNoArr = Array.from(new Array(orderproduct.side_number || 0), (val, index) => index);

      sidesNoArr.map((indexitem, qtyIndex) => {
        let quantityIndex = qtyIndex + 1;
        let sideData = this.sideDish.filter((item) => {
          return item.side_number == quantityIndex;
        });
        let extraData = this.extras.filter((item) => {
          return item.side_number == quantityIndex;
        });
        this.sideArr[quantityIndex] = sideData.map((sideitem) => {
          return sideitem;
        });
        this.extraArr[quantityIndex] = extraData.map((extraitem) => {
          return extraitem;
        });
      });

      this.sideArr = this.sideArr.filter(i => i);
      this.extraArr = this.extraArr.filter(i => i);

      if (rowindex >= 0) {
        this.rowsideArr[rowindex] = [...this.sideArr];
        this.rowextraArr[rowindex] = [...this.extraArr];
      }
      //Create SIDE DISH FIELDS
      this.createRowSideArray(rowindex);
      this.createRowExtraArray(rowindex);
      this.loadEditEntry = false; //Remove loading message
    }
  }
  //AutoPopulate Form Fields
  patchOrderItems(): void {
    if (this.patchValueData && this.patchValueData.orderitems && this.patchValueData.orderitems.length > 0) {
      let orderitems = this.patchValueData.orderitems
      orderitems.map((item, index) => {
        const tempObj = {};
        tempObj['product_id'] = new FormControl(item.product_id);
        tempObj['quantity'] = new FormControl(item.quantity);
        tempObj['side_dish'] = new FormArray([]);
        tempObj['extra'] = new FormArray([]);

        this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
        this.orderitems.push(this.fb.group(tempObj));
        //PREPARE SIDEDISH AND EXTRAS ARRAY
        if (this.products && this.products.length > 0) {
          this.prepareExtraSideArray(item, index);
        }
      });
    }
  }


  getSideDishAndExtras(event, rowindex = 0) {
    let numberOfDropdown = event.target.value;
    this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
    let productdata = this.orderitems.controls[rowindex] as FormGroup;
    let sideDish = productdata.controls.side_dish as FormArray;
    let extras = productdata.controls.extra as FormArray;

    //SideDish FormControls
    if (numberOfDropdown < sideDish.length) {
      sideDish.removeAt(numberOfDropdown);
    } else {
      sideDish.push(this.createSideItem(rowindex, numberOfDropdown));
    }
    //Extras FormControls
    if (numberOfDropdown < extras.length) {
      extras.removeAt(numberOfDropdown);
    } else {
      extras.push(this.createExtraItem(rowindex, numberOfDropdown));
    }
  }


  getOrderItems(form) {
    return form.controls.orderitems.controls;
  }

  getSideItmes(form) {
    return form.controls.side_dish.controls;
  }

  getExtraItmes(form) {
    return form.controls.extra.controls;
  }

  onAddProduct() {
    this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
    this.orderitems.push(this.createItem());
  }

  onRemoveProducts(item, index): void {
    // this.counter = null;
    this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
    if (this.orderitems.length > 1) {
      this.orderitems.removeAt(index);
    }
  }



  //order items
  createItem(): FormGroup {
    //setTimeout(() => {
    return this.fb.group({
      product_id: ['', [Validators.required]],
      quantity: ['1', [Validators.required]],
      category_id: [''],
      side_dish: new FormArray([], [Validators.required]),//this.createSideItem()
      extra: new FormArray([], [Validators.required])//this.createExtraItem()
    });
    // },100); 

  }

  //side items
  createSideItem(itemIndex: any = 0, qtyIndex: number = 1): FormGroup {
    let Index = itemIndex == 0 ? itemIndex + 1 : itemIndex;
    let StrIndex = qtyIndex.toString();
    //BIND EDIT DATA TO FIELDS
    let qtySideArray = [];
    let assignedSideDish = [];
    let editNotes = '';
    let editSideNumber = StrIndex;
    if (this.patchValueData && this.patchValueData.orderitems) {
      if (this.patchValueData.orderitems[itemIndex] && this.patchValueData.orderitems[itemIndex].ordersidedish) {
        qtySideArray[qtyIndex] = this.patchValueData.orderitems[itemIndex].ordersidedish.filter(sideitem => {
          return parseInt(sideitem.side_number) == qtyIndex;
        });
        if (qtySideArray[qtyIndex] && qtySideArray[qtyIndex].length > 0) {
          assignedSideDish[qtyIndex] = qtySideArray[qtyIndex].map(sideitem => { return sideitem.side_dish_id });
          editNotes = qtySideArray[qtyIndex][0].notes || '';
          editSideNumber = qtySideArray[qtyIndex][0].side_number.toString();
        }
      }
    }

    let sideItemsFields = this.fb.group({
      notes: [editNotes],
      side_number: [editSideNumber]
    });
    if (this.rowsideArr && this.rowsideArr[itemIndex].length > 0) {
      this.rowsideArr[itemIndex].map((item, index) => {
        let selecteditem;
        if (assignedSideDish[qtyIndex] && assignedSideDish[qtyIndex].length > 0) {
          selecteditem = item.find(select => {
            return assignedSideDish[qtyIndex].includes(select.side_dish_id);
          })
        }
        let bindValue = selecteditem && selecteditem.side_dish_id ? selecteditem.side_dish_id : '';
        sideItemsFields.addControl('side_dish_id_' + index, new FormControl(bindValue));
      })
    }
    return sideItemsFields;
  }

  //side items
  createExtraItem(itemIndex: any = 0, qtyIndex: number = 1): FormGroup {
    let Index = itemIndex == 0 ? itemIndex + 1 : itemIndex;
    let StrIndex = qtyIndex.toString();
    //BIND EDIT DATA TO FIELDS
    let qtyExtraArray = [];
    let assignedExtra = [];
    let editExtraNumber = StrIndex;
    if (this.patchValueData && this.patchValueData && this.patchValueData.orderitems) {
      if (this.patchValueData.orderitems[itemIndex] && this.patchValueData.orderitems[itemIndex].orderextra) {
        qtyExtraArray[qtyIndex] = this.patchValueData.orderitems[itemIndex].orderextra.filter(extraitem => {
          return parseInt(extraitem.side_number) == qtyIndex;
        });
        if (qtyExtraArray[qtyIndex] && qtyExtraArray[qtyIndex].length > 0) {
          assignedExtra[qtyIndex] = qtyExtraArray[qtyIndex].map(extraitem => { return extraitem.extra_id });
          editExtraNumber = qtyExtraArray[qtyIndex][0].side_number.toString();
        }
      }
    }

    let extraItemsFields = this.fb.group({
      side_number: [editExtraNumber]
    });
    if (this.rowextraArr && this.rowextraArr[itemIndex].length > 0) {
      this.rowextraArr[itemIndex].map((item, index) => {
        let selecteditem;
        if (assignedExtra[qtyIndex] && assignedExtra[qtyIndex].length > 0) {
          selecteditem = item.find(select => {
            return assignedExtra[qtyIndex].includes(select.extra_id);
          })
        }
        let bindValue = selecteditem && selecteditem.extra_id ? selecteditem.extra_id : '';
        extraItemsFields.addControl('extra_id_' + index, new FormControl(bindValue));
      })
    }
    return extraItemsFields;
  }



  getExtraSide(event, rowindex = null) {

    let prod_id = (event.value != undefined) ? event.value : event;
    //DISABLE QUANTITY UNTIL FIELDS LOADED
    this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
    let productdata = this.orderitems.controls[rowindex] as FormGroup;
    productdata.get('quantity').disable();
    this._foodService.getSidedishExtra({ 'id': prod_id }).subscribe(response => {
      this.sideArr = [];
      this.extraArr = [];
      this.sideDish = response.productinfo.productsidedish;
      this.extras = response.productinfo.productextras;
      let sides = response.productinfo.side_number;
      for (let i = 1; i <= sides; i++) {
        let sideData = this.sideDish.filter((item) => {
          return item.side_number == i;
        });

        let extraData = this.extras.filter((item) => {
          return item.side_number == i;
        });

        this.sideArr[i] = sideData.map((sideitem) => {
          return sideitem;
        });

        this.extraArr[i] = extraData.map((extraitem) => {
          return extraitem;
        });
      }
      this.sideArr = this.sideArr.filter(i => i);
      this.extraArr = this.extraArr.filter(i => i);

      if (rowindex >= 0) {
        this.rowsideArr[rowindex] = [...this.sideArr];
        this.rowextraArr[rowindex] = [...this.extraArr];

        //Create SIDE DISH FIELDS
        this.createRowSideArray(rowindex);
        this.createRowExtraArray(rowindex);
      }
      //ENABLE QTY AFTER FIELDS CREATION
      productdata.get('quantity').enable();

    });

  }
  //Create SIDE DISH FIELDS
  createRowSideArray(rowIndex) {
    this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
    let productdata = this.orderitems.controls[rowIndex] as FormGroup;
    let quantityArr = Array.from(new Array(productdata.get('quantity').value || 0), (val, index) => index);
    let sideDish = productdata.controls.side_dish as FormArray;
    sideDish.clear();
    quantityArr.map((item, index) => {
      sideDish.push(this.createSideItem(rowIndex, index + 1));
    });
  }
  //Create EXTRA FIELDS
  createRowExtraArray(rowIndex) {
    this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
    let productdata = this.orderitems.controls[rowIndex] as FormGroup;
    let quantityArr = Array.from(new Array(productdata.get('quantity').value || 0), (val, index) => index);
    let extras = productdata.controls.extra as FormArray;
    extras.clear();
    quantityArr.map((item, index) => {
      extras.push(this.createExtraItem(rowIndex, index + 1));
    })
  }

  onSaveOrder() {
    this.savingEntry = true;
    let value = this.addOrderForm.value;
    if (this.addOrderForm.valid) {
      this.isSubmit = true;
      let orderArr = Array.isArray(this.addOrderForm.value.orderitems) && this.addOrderForm.value.orderitems.length > 0 ? [...this.addOrderForm.value.orderitems] : [];
      //Customize OrderArr Elements as per request
      if (orderArr.length > 0) {
        this.prepareOrderArray(orderArr);
      }

      let formData = {
        'user_id': this.user_id,
        'id': this.url_id != '' ? this.url_id : '',
        'location_id': value.location_id,
        'name': value.first_name,
        'email': value.email,
        'phone': value.phone,
        'notes': '',
        'address': value.address,
        'booking_start_date': moment(value.booking_start_date).format('YYYY-MM-DD'),
        'booking_start_time': moment(value.booking_start_date).format('HH:mm:ss'),
        'price': '',
        'type': value.type,
        'status': value.orderstatus,
        'lunch': value.lunch == true ? 'Y' : 'N',
        'dinner': value.dinner == true ? 'Y' : 'N',
        'order_item': JSON.stringify(orderArr)
      }

      this._foodOrder.addOrder(formData, this.editOrderData)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/food-reservation/orders/orders-list']);
        },
          error => {
            // Show the error message
            this.isSubmit = false;
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });
    }
    else {
      this.orderitems = this.addOrderForm.get('orderitems') as FormArray;
      this.orderitems.controls.map((ordercontrol, index) => {
        let productdata = ordercontrol as FormGroup;
        productdata.markAllAsTouched();
      })

    }


  }

  //ORDER ARRAY CUSTOMIZE
  prepareOrderArray(orderArray: any[] = []) {
    let ordersItems = [...orderArray];

    if (ordersItems.length > 0) {

      ordersItems.map((order, index) => {
        let finalExtraArray = [];
        let finalSideArray = [];
        //SideDish
        let sideDishArray = order.side_dish && Array.isArray(order.side_dish) ? [...order.side_dish] : [];
        if (sideDishArray.length > 0) {
          sideDishArray.map(item => {
            this.rowsideArr[index].map((sideitem, rowindex) => {
              let sideObj = { side_dish_id: item['side_dish_id_' + rowindex], side_number: item.side_number, notes: item.notes };
              finalSideArray.push(sideObj);
            });
          });
        }
        //Extras
        let extraArray = order.extra && Array.isArray(order.extra) ? [...order.extra] : [];
        if (extraArray.length > 0) {
          extraArray.map(item => {
            this.rowextraArr[index].map((extraitem, rowindex) => {
              let extraObj = { extra_id: item['extra_id_' + rowindex], side_number: item.side_number };
              finalExtraArray.push(extraObj);
            });
          });
        }
        order.extra = finalExtraArray;
        order.side_dish = finalSideArray;
      });
    }

    return ordersItems;
  }
  Cancel() {
    this.router.navigate(['/admin/food-reservation/orders/orders-list']);
  }

}
