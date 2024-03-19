import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FoodReservationService, AppConfig, CommonService, ChatService, AuthService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOption } from '@angular/material/core';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  animations: fuseAnimations
})
export class AddProductComponent implements OnInit {
  title: string;
  public addProduct: FormGroup;
  public editProduct: boolean = false;
  public url_id: any;
  public categoryFilter: object = {};
  public extaFilter: any = [];
  public sideDishFilter: any = [];
  public sizeFilter: any = [];
  public categoryData: any = [];
  public extrasData: any = [];
  public sideDishData: any;
  public indexi: any;
  public sizePrice: boolean = false;
  public setPrice: boolean = false;
  public sideNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  size: FormArray;
  categoryItems: FormArray;
  sideDishItems: FormArray;
  categoryEditData: any = [];
  extraEditData: any = [];
  extraSeprateData: any = [];
  sideDishEditData: any = [];
  sideDishSeprateData: any = [];
  newArr: any = [];
  public number: any;
  public selectall: boolean;
  public selectallExtra: boolean;
  public isSubmit: boolean = false;
  public eventValue: any;

  public user_id: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  @Output() designpartData = new EventEmitter();
  @ViewChild(MatOption) allSelected: MatOption;
  constructor(
    public _matDialog: MatDialog,
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _foodReservation: FoodReservationService,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private _commonService: CommonService) {
    this.title = 'Food Reservation Product';
    if (this.route.routeConfig.path == 'admin/food-reservation/product/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editProduct = true;
    }
    this.url_id ? this.title = "Update Product" : this.title = "New Product";
    this.eventValue = 0;
  }
  private file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  mediaInfo: any = [];
  ngOnInit() {
    this.addProduct = this.fb.group({
      product_name: this.fb.control('', [Validators.required]),
      product_description: this.fb.control(''),
      categories: this.fb.control('', [Validators.required]),
      side_number: this.fb.control('', [Validators.required]),
      set_diff_size: this.fb.control('N'),
      featured_product: this.fb.control(''),
      price: this.fb.control(''),
      extras: this.fb.array([
        this.fb.control('')
      ]),
      side_dish: this.fb.array([
        this.fb.control('')
      ]),
      status: this.fb.control(''),
      id: this.editProduct == true ? this.url_id : '',
      size: this.fb.array([this.createItems()]),
      image: this.fb.control(''),
    });
    this.setControls();

    if (this.route.routeConfig.path == 'admin/food-reservation/product/edit/:id') {
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  setControls() {

    this.categoryFilter['status'] = 'A';
    this.getFilteredCategories(this.categoryFilter);
    this.getFilteredExtras(this.categoryFilter);
    this.getFilteredSideDish(this.categoryFilter);

  }
  getFilteredServices() {
    return this._foodReservation.getProductList({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {
              let edit: boolean = true;
              this.fillValues(edit);
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {
            let edit: boolean = true;
            this.fillValues(edit);
          }
        }
      });
      this.showDialog();
    });

  }
  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._matDialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'printentries',
        data: { type: 'updateProduct', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/food-reservation/menu/product/list']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictStaff();
        }
      });
    }
  }
  editRestrictStaff() {
    this._foodReservation.updateForm(this.url_id, 'foodproduct').subscribe(response => {
      let edit: boolean = true;
      this.fillValues(edit);
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
    const dialogRef = this._matDialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'updateProduct', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/food-reservation/menu/product/list']);
      }
    });
  }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.user_id;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'foodproduct';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillValues(edit: any) {
    this._foodReservation.getProductContent(this.url_id, edit).subscribe(response => {
      this.fillProductValues(response);
      this.number = response.productinfo.side_number;
      this.addProduct.patchValue({ side_number: response.productinfo.side_number });
      this.eventValue = 1;
      this.indexi = response.productinfo.side_number;
    })
  }
  createItems(): FormGroup {
    return this.fb.group({
      name: '',
      price: ''
    });
  }
  addItem(): void {
    this.size = this.addProduct.get('size') as FormArray;
    this.size.push(this.createItems());
  }
  getFilteredCategories(params: any) {
    return this._foodReservation.getProductCategoryList(params).then(Response => {
      this.categoryData = Response.data;
    });
  }
  getFilteredExtras(params: any) {
    return this._foodReservation.getProductExtrasList(params).then(Response => {
      this.extrasData = Response.data;
    });
  }
  getFilteredSideDish(params: any) {
    return this._foodReservation.getProductSideDishList(params).then(Response => {
      this.sideDishData = Response.data;
    });
  }
  getCategory(event) {

    if (event.value == 0 || this.eventValue == 0) {
      this.categoryItems = this.addProduct.get('extras') as FormArray;
      this.sideDishItems = this.addProduct.get('side_dish') as FormArray;
      this.categoryItems.removeAt(0);
      this.sideDishItems.removeAt(0);
      this.eventValue = 1;
    }
    for (let i = 1; i <= this.indexi; i++) {
      this.categoryItems.removeAt(0);
      this.categoryItems.removeAt(1);
      this.categoryItems.removeAt(2);

      this.sideDishItems.removeAt(0);
      this.sideDishItems.removeAt(1);
      this.sideDishItems.removeAt(2);
    }
    this.indexi = event.value;

    //this.categoryItems.removeAt(event.value);   
    this.categoryItems = this.addProduct.get('extras') as FormArray;
    let len = this.categoryItems.length;
    for (let i = 0; i < event.value; i++) {
      this.categoryItems.push(this.fb.control(''));
    }
    this.sideDishItems = this.addProduct.get('side_dish') as FormArray;
    for (let i = 0; i < event.value; i++) {
      this.sideDishItems.push(this.fb.control(''));
    }
  }


  selectalllCategory() {
    let data
    if (this.selectall === false) {
      this.addProduct.controls.categories.patchValue([]);
      return;
    } else if (this.selectall === true) {

      this.addProduct.controls.categories.patchValue([...this.categoryData.map(item => item.id)]);

    }
  }

  selectedCategoryData() {
    let data = this.addProduct.get('categories').value;
    if (data.length == this.categoryData.length) {
      this.selectall = true;
    } else {
      this.selectall = false;
    }
  }


  // for multi select Extras

  // selectalllExtra(index){

  //   this.categoryItems = this.addProduct.get('extras') as FormArray;
  //   if  (this.selectallExtra === false) {
  //     this.categoryItems[index].setValue(['']);
  //     return;
  //   }else if (this.selectallExtra === true) {
  //     this.categoryItems[index].setValue([[...this.extrasData.map(item => item.id)]]);
  //   }
  // }

  // selectedExtraData(){  
  //   let data = this.addProduct.get('extras').value;
  //   if(data.length == this.extrasData.length ){
  //     this.selectallExtra =true;
  //       }else{
  //       this.selectallExtra =false;
  //     }
  //  }

  removeSize(index) {
    this.size = this.addProduct.get('size') as FormArray;
    this.size.removeAt(index);
  }
  getSize(event) {
    if (event.value == 'Y') {
      this.sizePrice = true;
      this.setPrice = false;
    } else {
      this.sizePrice = false;
      this.setPrice = true;
    }
  }

  onSubmit() {
    this.savingEntry = true;
    if (this.addProduct.valid) {
      this.isSubmit = true;
      let productData = this.addProduct.value;
      let i = 1;
      if (productData.extras.length > 0) {
        productData.extras.forEach(item => {
          if (item.length > 0) {
            item.forEach(itemi => {        //
              this.extaFilter.push({ "side_number": i, "extra_id": itemi });
            });
          }
          i = i + 1;
        });
      }
      let k = 1;
      console.log("productData.side_dish", productData.side_dish);
      if (productData.side_dish.length > 0) {
        productData.side_dish.forEach(item => {
          if (item.length > 0) {
            item.forEach(itemi => {        //
              this.sideDishFilter.push({ "side_number": k, "side_dish_id": itemi });
            });
          }
          k = k + 1;
        });
      }
      productData.size.forEach(item => {      //
        this.sizeFilter.push({ "size": item.name, "price": item.price });
      });
      let categoryId = '';
      productData.categories.forEach(item => {      //
        if (categoryId == '') {
          categoryId = item;
        } else {
          categoryId = categoryId + "," + item;
        }
      });
      if (productData.featured_product == true) {
        productData.featured_product = 'Y';
      } else {
        productData.featured_product = 'N';
      }
      productData.categories = categoryId;
      productData.size = JSON.stringify(this.sizeFilter);
      productData.extras = JSON.stringify(this.extaFilter);
      productData.side_dish = JSON.stringify(this.sideDishFilter);
      this._foodReservation.addProduct(productData, this.editProduct).subscribe(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.router.navigate(['/admin/food-reservation/menu/product/list']);
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
  }

  // on click cancel button
  Cancel() {
    this.router.navigate(['/admin/food-reservation/menu/product/list']);
  }
  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed

        this.mediaInfo = new FormData();
        this.mediaInfo.append('image', this.file);
        this.mediaInfo.append('type', 'foodreservation');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "");
            if (uploadResponse.media.image) {
              this.logourl = event.target.result;
              this.addProduct.controls.image.setValue(this.uploadInfo.avatar.url);
              this.designpartData.emit(this.addProduct.value);
            }
          });

      }
    }

  }
  fillProductValues(response) {

    let formData = response.productinfo;
    let i = 0;
    this.addProduct.patchValue(formData);
    formData.productcategories.forEach(item => {
      this.categoryEditData[i] = item.category_id;
      i = i + 1;
    });
    this.addProduct.patchValue({ categories: this.categoryEditData });
    // for extras multiple dropdown
    i = 0;
    formData.productextras.forEach(item => {
      this.extraSeprateData[i] = item.side_number;
      i = i + 1;
    });

    let unique = [...new Set(this.extraSeprateData)];
    this.categoryItems = this.addProduct.get('extras') as FormArray;
    unique.forEach(item => {
      let k = 0;
      this.extraEditData = [];
      formData.productextras.forEach(items => {
        if (item == items.side_number) {
          this.extraEditData[k] = items.extra_id;
          k = k + 1;
        }
      });
      this.categoryItems.push(this.fb.control(this.extraEditData));
    });
    this.categoryItems.removeAt(0);
    // for sideDish multiple dropdown
    i = 0;
    formData.productsidedish.forEach(item => {
      this.sideDishSeprateData[i] = item.side_number;
      i = i + 1;
    });

    let uniqueSideDish = [...new Set(this.sideDishSeprateData)];
    this.sideDishItems = this.addProduct.get('side_dish') as FormArray;
    uniqueSideDish.forEach(item => {
      let k = 0;
      this.sideDishEditData = [];
      formData.productsidedish.forEach(items => {
        if (item == items.side_number) {
          this.sideDishEditData[k] = items.side_dish_id;
          k = k + 1;
        }
      });
      this.sideDishItems.push(this.fb.control(this.sideDishEditData));
    });
    this.sideDishItems.removeAt(0);
    if (formData.image != null) {
      this.filetype = true;
      this.logourl = formData.image;

    }
    // setTimeout(()=>{    //<<<---    using ()=> syntax
    //   this.sideNumber = formData.side_number;
    //   
    // }, 1000);

    // this.sideNumber = formData.side_number;
  }
}
