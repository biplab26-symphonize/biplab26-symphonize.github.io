import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService, SettingsService, FoodOrderService, FoodReservationService } from 'app/_services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Form } from 'app/_models';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
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
  public sidedishindex: any;
  public extrasindex: any;
  public sideDishTemp: any = [];
  public sideDishFrontArr: any = [];
  public extrasTemp: any = [];
  public extrasFrontArr: any = [];
  public sideDishIdArr: any = [];
  public extrasIdArr: any = [];
  public sideDishNewArr: any = [];
  public extrasNewArr: any = [];
  public orderDataArr: any = [];
  public productArr: any = [];
  public productIndex: any;
  public categoryFilter: object = {};
  public extrasRespone: any;
  public sideDishRespone: any;
  public default_img;
  public frontProductId: any;
  public disableButton: boolean = true;
  public sideDishEntree: any = [];
  public extraEntree: any = [];
  public pId: any;
  public categoryId: any;
  constructor(private _matSnackBar: MatSnackBar, private _foodReservation: FoodReservationService, private fb: FormBuilder,
    private _fuseConfigService: FuseConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private _commonService: CommonService,
    private _foodOrderService: FoodOrderService,
    private _foodReservationService: FoodReservationService,
    private _settingService: SettingsService,) {
    this.frontProductId = 0;
    this.categoryId = 0;
    this.numberOfSideAndExtras[0] = 1;
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.product_name2 = localStorage.getItem('product_name');
    this.quantity = '';
    this.sideDish = [];
    this.extras = [];
    this.notesData = [];
    this.sidedishindex = 0;
    this.extrasindex = 0;
    this.productIndex = 0;
    localStorage.removeItem("pickupTime");
    localStorage.removeItem("type");
    localStorage.removeItem("location");
    localStorage.removeItem("lunch");
    localStorage.removeItem("dinner");
    localStorage.removeItem("delivery_date");
    localStorage.removeItem("building");
    localStorage.removeItem("locationName");

    if (localStorage.getItem("orderDataArr") === null) {

    } else {
      this.orderDataArr = JSON.parse(localStorage.getItem("orderDataArr"));
      this.disableButton = false;
    }
    localStorage.removeItem("pickupDeliveryArr");
  }

  ngOnInit() {
    localStorage.removeItem("confirmBackButton");
    this.setControls();
    this.getProducts();
    this._settingService.getFoodSetting({ meta_type: "food" }).then(res => {
      for (let item of res.data) {
        if (item.meta_key == 'Default_image') {
          this.default_img = item.meta_value;
        }
      }
    });
    this.pId = 0;
  }
  setControls() {
    this.addOrder = this.fb.group({
      quantity: this.fb.control('1'),
      side_dish: this.fb.control(''),
      extras: this.fb.control(''),
      notes: this.fb.control(''),
      product_id: this.fb.control(''),
      category_id: this.fb.control(''),
    });
    this.categoryFilter['status'] = 'A';
    this.getFilteredExtras(this.categoryFilter);
    this.getFilteredSideDish(this.categoryFilter);
  }
  getFilteredExtras(params: any) {
    return this._foodReservation.getProductExtrasList(params).then(Response => {
      this.extrasRespone = Response.data;
    });
  }
  getFilteredSideDish(params: any) {
    return this._foodReservation.getProductSideDishList(params).then(Response => {
      this.sideDishRespone = Response.data;
    });
  }
  getProducts() {
    this._foodOrderService.getProducts({ 'status': 'A', 'column': 'id', 'direction': 'desc', 'limit': 10 }).subscribe(response => {
      this.category = response.data;
      this.numberOfSideAndExtras[0] = 1;
      this.category.forEach(item => {
        item.products.forEach(itemp => {
          itemp.numberOfSideAndExtras = '';
          itemp.numberOfSideAndExtras = this.numberOfSideAndExtras;
        });
      });
    });
  }


  getArray(number) {
    this.numberOfSideAndExtras[0] = 1;
    this.side_number = [];
    let k = 0;
    for (let i = 1; i <= number; i++) {
      this.side_number[k] = i;
      k = k + 1;
    }
  }

  getSideDishAndExtras(event, productId, categoryId) {
    this.frontProductId = 0;
    this.categoryId = 0;
    let numberOfDropdown = event.target.value;
    if (numberOfDropdown > 0) {
      this.numberOfSideAndExtras = [];
      let k = 0;
      for (let i = 1; i <= numberOfDropdown; i++) {
        this.numberOfSideAndExtras[k] = i;
        k = k + 1;
      }
      this.category.forEach(item => {
        item.products.forEach(itemp => {
          if (item.id == categoryId && itemp.id == productId) {
            itemp.numberOfSideAndExtras = '';
            itemp.numberOfSideAndExtras = this.numberOfSideAndExtras;
          }
        });
      });
      this.addOrder.get('side_dish').reset();
      this.addOrder.get('extras').reset();
    }
    this.frontProductId = productId;
    this.categoryId = categoryId;
  }
  getSideDishValue(event, k, i, product, side_number) {
    this.side_number = [];
    let m = 0;
    for (let i = 1; i <= side_number; i++) {
      this.side_number[m] = i;
      m = m + 1;
    }
    let j = 0;
    this.numberOfSideAndExtras.forEach(item => {
      this.side_number.forEach(items => {
        if (k == item && i == items) {
          this.sideDishArr[j] = event.value;
          this.sideDishEntree[j] = { "entree": k, "side_name": event.value };
        }
        j = j + 1;
      });
    });
    this.product_name = product;
  }
  getExtrasValue(event, k, i, product, side_number) {
    this.side_number = [];
    let m = 0;
    for (let i = 1; i <= side_number; i++) {
      this.side_number[m] = i;
      m = m + 1;
    }
    let j = 0;
    this.numberOfSideAndExtras.forEach(item => {
      this.side_number.forEach(items => {
        if (k == item && i == items) {
          this.extrasArr[j] = event.value;
          this.extraEntree[j] = { "entree": k, "extra_name": event.value };
        }
        j = j + 1;
      });
    });
    this.product_name = product;
  }
  getNotesValue(event, i) {
    this.notesArr[i - 1] = event.target.value;
  }

  // getIndexValue(){
  //   this.sidedishindex = this.sidedishindex + 1;  //  
  // }
  onSubmit(categoryId, productId, productName, side_number) {
    this.side_number = [];
    let k = 0;
    for (let i = 1; i <= side_number; i++) {
      this.side_number[k] = i;
      k = k + 1;
    }
    if (this.sideDishArr.length > 0 || this.extrasArr.length > 0) {      
      // store product name in array
      this.productArr[this.productIndex] = productName;
      this.productIndex = this.productIndex + 1;
      // get sidedishes id                  
      this.sideDishIdArr = [];
      let l = 0;
      this.sideDishEntree.forEach(items => {
        this.sideDishRespone.forEach(itemss => {
          if (items.side_name == itemss.side_dish_name) {
            this.sideDishIdArr[l] = { "entree": items.entree, "side_id": itemss.id };
            l = l + 1;
          }
        });
      });
      // get extras id
      this.extrasIdArr = [];
      let m = 0;
      this.extraEntree.forEach(items => {
        this.extrasRespone.forEach(itemss => {
          if (items.extra_name == itemss.extra_name) {
            this.extrasIdArr[m] = { "entree": items.entree, "extra_id": itemss.id };
            m = m + 1;
          }
        });
      });
      this.sideDishIdArr = JSON.stringify(this.sideDishIdArr);
      this.extrasIdArr = JSON.stringify(this.extrasIdArr);
      let data = this.addOrder.value;
      localStorage.setItem("quantity", data.quantity);
      localStorage.setItem("product_name", this.product_name);
      localStorage.setItem("sideDish", this.sideDishArr);
      localStorage.setItem("extras", this.extrasArr);
      localStorage.setItem("notes", this.notesArr);

      localStorage.setItem("numberOfSideAndExtras", this.numberOfSideAndExtras);
      localStorage.setItem("side_number", this.side_number);

      localStorage.setItem("sideDishId", this.sideDishIdArr);
      localStorage.setItem("extrasId", this.extrasIdArr);
      localStorage.setItem("categoryId", categoryId);
      localStorage.setItem("productId", productId);

      this.quantity = localStorage.getItem("quantity");
      this.product_name2 = localStorage.getItem("product_name");

      this.sideDish = JSON.parse(JSON.stringify(localStorage.getItem("sideDish")));
      this.sideDish = this.sideDish.split(',');
      this.sideDishFrontArr = [];
      if (this.sideDishArr.length > 0) {
        let i = 0;
        let j = 0;
        this.numberOfSideAndExtras.forEach(item => {
          let k = 0;
          this.sideDishTemp = [];
          this.side_number.forEach(item => {
            if ((this.sideDish[i] == '' || this.sideDish[i]) && this.sideDish[i] != undefined) {
              this.sideDishTemp[k] = this.sideDish[i];
              k = k + 1;
            }
            i = i + 1;
          });
          if (k > 0) {
            this.sideDishFrontArr[j] = this.sideDishTemp;
            j = j + 1;
          }
        });
      }

      this.extras = JSON.parse(JSON.stringify(localStorage.getItem("extras")));
      this.extras = this.extras.split(',');

      this.extrasFrontArr = [];
      if (this.extrasArr.length > 0) {
        let i = 0;
        let j = 0;
        this.numberOfSideAndExtras.forEach(item => {
          let k = 0;
          this.extrasTemp = [];
          this.side_number.forEach(item => {
            if ((this.extras[i] == '' || this.extras[i]) && this.extras[i] != undefined) {
              this.extrasTemp[k] = this.extras[i];
              k = k + 1;
            }
            i = i + 1;
          });
          if (k > 0) {
            this.extrasFrontArr[j] = this.extrasTemp;
            j = j + 1;
          }
        });

      }
      this.notesData = JSON.parse(JSON.stringify(localStorage.getItem("notes")));
      this.notesData = this.notesData.split(',');
      let len = this.orderDataArr.length;
      if (len <= 0) {
        this.orderDataArr[0] = { "categoryId": categoryId, "productId": productId, "quantity": this.quantity, "product_name": this.product_name2, "numberOfSideAndExtras": this.numberOfSideAndExtras, "sideDishFrontArr": this.sideDishFrontArr, "extrasFrontArr": this.extrasFrontArr, "notes": this.notesData, "sideDishId": this.sideDishIdArr, "extrasId": this.extrasIdArr };
      } else {
        let d = 0;
        let flag = 0;
        this.orderDataArr.forEach(item => {
          if (item.productId == productId) {
            flag = 1;
            this.orderDataArr[d] = { "categoryId": categoryId, "productId": productId, "quantity": this.quantity, "product_name": this.product_name2, "numberOfSideAndExtras": this.numberOfSideAndExtras, "sideDishFrontArr": this.sideDishFrontArr, "extrasFrontArr": this.extrasFrontArr, "notes": this.notesData, "sideDishId": this.sideDishIdArr, "extrasId": this.extrasIdArr };
          }
          d = d + 1;
        });
        if (flag == 0) {
          this.orderDataArr[d] = { "categoryId": categoryId, "productId": productId, "quantity": this.quantity, "product_name": this.product_name2, "numberOfSideAndExtras": this.numberOfSideAndExtras, "sideDishFrontArr": this.sideDishFrontArr, "extrasFrontArr": this.extrasFrontArr, "notes": this.notesData, "sideDishId": this.sideDishIdArr, "extrasId": this.extrasIdArr };
        }
      }
      localStorage.setItem("orderDataArr", JSON.stringify(this.orderDataArr));
      this.addOrder.get('quantity').setValue(1);
      let seArr: any = [];
      seArr[0] = 1;
      this.category.forEach(item => {
        item.products.forEach(itemp => {
          itemp.numberOfSideAndExtras = '';
          itemp.numberOfSideAndExtras = seArr;
        });
      });
      this.sideDishFrontArr = [];
      this.extrasFrontArr = [];
      this.notesData = [];
      this.extrasNewArr = [];
      this.notesArr = [];
      this.sideDishArr = [];
      this.extrasArr = [];
      this.sideDishEntree = [];
      this.extraEntree = [];
      this.addOrder.get('side_dish').reset();
      this.addOrder.get('extras').reset();
      this.addOrder.get('notes').reset();
      this.disableButton = false;
      this._matSnackBar.open("Order added in cart!", 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
    } else {      
      // store product name in array
      this.productArr[this.productIndex] = productName;
      this.productIndex = this.productIndex + 1;
      // get sidedishes id                  
      this.sideDishIdArr = [];
      let l = 0;
      this.sideDishEntree.forEach(items => {
        this.sideDishRespone.forEach(itemss => {
          if (items.side_name == itemss.side_dish_name) {
            this.sideDishIdArr[l] = { "entree": items.entree, "side_id": itemss.id };
            l = l + 1;
          }
        });
      });
      // get extras id
      this.extrasIdArr = [];
      let m = 0;
      this.extraEntree.forEach(items => {
        this.extrasRespone.forEach(itemss => {
          if (items.extra_name == itemss.extra_name) {
            this.extrasIdArr[m] = { "entree": items.entree, "extra_id": itemss.id };
            m = m + 1;
          }
        });
      });
      this.sideDishIdArr = JSON.stringify(this.sideDishIdArr);
      this.extrasIdArr = JSON.stringify(this.extrasIdArr);
      let data = this.addOrder.value;
      this.category.forEach(item => {
        item.products.forEach(itemp => {
          if (itemp.id == productId) {
            this.product_name = itemp.product_name;
          }
        });
      });
      localStorage.setItem("quantity", data.quantity);
      localStorage.setItem("product_name", this.product_name);
      localStorage.setItem("sideDish", this.sideDishArr);
      localStorage.setItem("extras", this.extrasArr);
      localStorage.setItem("notes", this.notesArr);

      localStorage.setItem("numberOfSideAndExtras", this.numberOfSideAndExtras);
      localStorage.setItem("side_number", this.side_number);

      localStorage.setItem("sideDishId", this.sideDishIdArr);
      localStorage.setItem("extrasId", this.extrasIdArr);
      localStorage.setItem("categoryId", categoryId);
      localStorage.setItem("productId", productId);

      this.quantity = localStorage.getItem("quantity");
      this.product_name2 = localStorage.getItem("product_name");

      this.sideDish = JSON.parse(JSON.stringify(localStorage.getItem("sideDish")));
      this.sideDish = this.sideDish.split(',');
      this.sideDishFrontArr = [];


      this.extras = JSON.parse(JSON.stringify(localStorage.getItem("extras")));
      this.extras = this.extras.split(',');

      this.notesData = JSON.parse(JSON.stringify(localStorage.getItem("notes")));
      this.notesData = this.notesData.split(',');
      let len = this.orderDataArr.length;
      if (len <= 0) {
        this.orderDataArr[0] = { "categoryId": categoryId, "productId": productId, "quantity": this.quantity, "product_name": this.product_name2, "numberOfSideAndExtras": this.numberOfSideAndExtras, "sideDishFrontArr": this.sideDishFrontArr, "extrasFrontArr": this.extrasFrontArr, "notes": this.notesData, "sideDishId": this.sideDishIdArr, "extrasId": this.extrasIdArr };
      } else {
        let d = 0;
        let flag = 0;
        this.orderDataArr.forEach(item => {
          if (item.productId == productId) {
            flag = 1;
            this.orderDataArr[d] = { "categoryId": categoryId, "productId": productId, "quantity": this.quantity, "product_name": this.product_name2, "numberOfSideAndExtras": this.numberOfSideAndExtras, "sideDishFrontArr": this.sideDishFrontArr, "extrasFrontArr": this.extrasFrontArr, "notes": this.notesData, "sideDishId": this.sideDishIdArr, "extrasId": this.extrasIdArr };
          }
          d = d + 1;
        });
        if (flag == 0) {
          this.orderDataArr[d] = { "categoryId": categoryId, "productId": productId, "quantity": this.quantity, "product_name": this.product_name2, "numberOfSideAndExtras": this.numberOfSideAndExtras, "sideDishFrontArr": this.sideDishFrontArr, "extrasFrontArr": this.extrasFrontArr, "notes": this.notesData, "sideDishId": this.sideDishIdArr, "extrasId": this.extrasIdArr };
        }
      }
      localStorage.setItem("orderDataArr", JSON.stringify(this.orderDataArr));
      this.addOrder.get('quantity').setValue(1);
      let seArr: any = [];
      seArr[0] = 1;
      this.category.forEach(item => {
        item.products.forEach(itemp => {
          itemp.numberOfSideAndExtras = '';
          itemp.numberOfSideAndExtras = seArr;
        });
      });
      this.sideDishFrontArr = [];
      this.extrasFrontArr = [];
      this.notesData = [];
      this.extrasNewArr = [];
      this.notesArr = [];
      this.sideDishArr = [];
      this.extrasArr = [];
      this.sideDishEntree = [];
      this.extraEntree = [];
      this.addOrder.get('side_dish').reset();
      this.addOrder.get('extras').reset();
      this.addOrder.get('notes').reset();
      this.disableButton = false;
      this._matSnackBar.open("Order added in cart!", 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
    }
  }

  removeOrder(index) {
    this.orderDataArr.splice(index, 1);
    localStorage.setItem("orderDataArr", JSON.stringify(this.orderDataArr));
    let arrData = localStorage.getItem("orderDataArr");
    if (arrData.length == 2) {
      this.disableButton = true;
      localStorage.removeItem("orderDataArr");
    }
    this._matSnackBar.open("Booking entry cancelled successfully!", 'CLOSE', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  resetQuantity() {
    this.addOrder.get('quantity').setValue(1);
    this.numberOfSideAndExtras = [];
    this.numberOfSideAndExtras[0] = 1;
  }

}
