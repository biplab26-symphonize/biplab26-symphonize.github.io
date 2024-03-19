import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService, ChatService, OptionsList, SettingsService } from 'app/_services';
import { GuestRoomService } from 'app/_services/guest-room.service';
import { UsersService } from 'app/_services/users.service';
import moment from 'moment';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';
import { CommonUtils } from 'app/_helpers';
 
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public pusherCounter = 0;
  public showArrival: boolean=false;
  public userId: any;
  public ann_list: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any; 
  loginUserInfo: any;
  public roomEditRestriction: any;

  public addBookingForm: FormGroup;
  filteredUsers: any[] = [];
  public startdate: any;
  public enddate: any;
  public allrooms: any[] = [];
  public Price: any = [];
  roomcount = [];
  public extra_prices: any = [];
  Adults_count: any = [];
  Childerns_count: any = [];
  All_Extres: any = [];
  priceinfo: any = [];
  room_id: any;
  Total_price = 0;
  roomprice: any;
  selectedHours: any = [];
  selectedextrainfo: any = [];
  allSelectedPricedata: any;
  Currentdisplayprice: any;
  public guestcount: FormArray;
  public Extras: FormArray;
  editBookingData: boolean = false;
  extrapriceinfo: any;
  savebutton: boolean = false;
  bookbutton: boolean = false;
  showcontinue: boolean = false;
  currentAdultcount: number;
  currentChildcount: number;
  Final_price = 0;
  finalroomprice = 0;
  finalextraprice = 0;
  dipositeprice = 0
  promocodeprice = 0
  currentdate = new Date();
  title: any;
  url_id: any;
  PromocodeData: any;
  ChildAdultArray: any = [];
  showmsg: any = false;
  message: any;
  public buildingList: any = [];
  public StatusList: any = { "confirmed": "Confirmed", "not_confirmed": "Not Confirmed", "pending": "Pending" }
  public user_id: any;
  public isExtras: boolean = false;
  public isPromoCode: boolean = false;
  public promo_code: any;
  public reservation_time_price_on: any;
  public isSave: boolean = false;
  public reserveDate: any;
  public startDateValidation: any;
  constructor(
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _guest_service: GuestRoomService,
    private _settingService: SettingsService
  ) {

    if (this.route.routeConfig.path == 'admin/guest-room/booking/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editBookingData = true;
      this.isSave = true;
    }
    this.url_id ? this.title = "Update Guest Room Booking" : this.title = "New Guest Room Booking";
  }

  ngOnInit(): void {

    // set the controls
    this.setControls();
    this.extra_prices = OptionsList.Options.guest_room_extra_price;
    this.patchValue();
    // find the user info according the name 
    this.addBookingForm
      .get('first_name').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getUsers({ 'searchKey': value, autopopulate:1 }))
      )
      .subscribe(users => this.filteredUsers = users.data);
    this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
    this._settingService.getGuestRoomSetting({ meta_type: "guest" }).then(res => {
      let data = res.data;
        data.forEach(item => {
        if (item.meta_key == 'reservation_time_price_on') {
          this.reservation_time_price_on = item.meta_value;
          localStorage.setItem("reservation_time_price_on",this.reservation_time_price_on);
        }
      });
    });      
    let reservationLimit = new Date();
    let numberOfDaysToAdd = 45;
    reservationLimit.setDate(reservationLimit.getDate() + numberOfDaysToAdd);
    this.reserveDate = moment(reservationLimit).format('YYYY-MM-DD');
    console.log("reserveDate",this.reserveDate);
    let reservationLimit2 = new Date();
    let numberOfDaysToAddStart = 44;
    reservationLimit2.setDate(reservationLimit2.getDate() + numberOfDaysToAddStart);
    this.startDateValidation = moment(reservationLimit2).format('YYYY-MM-DD');
    console.log("startDateValidation",this.startDateValidation);
  }

  // set the default cotntrol to the user 
  setControls() {
    this.addBookingForm = this.fb.group({
      first_name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
      address: this.fb.control(''),
      arrival_time: this.fb.control(''),
      notes: this.fb.control(''),
      start_date: this.fb.control('', [Validators.required]),
      end_date: this.fb.control('', [Validators.required]),
      building_id: this.fb.control('', [Validators.required]),
      guest_count: this.fb.control(1),
      guestcount: this.fb.array([]),
      Extras: this.fb.array([]),
      id: this.fb.control(''),
      status: this.fb.control('', [Validators.required]),
      all_rooms: this.fb.control(''),
      promocode: this.fb.control(''),
      number_of_rooms: this.fb.control('',)
    });

    this._guest_service.getBuildingList({ 'status': 'A', 'direction': 'asc','column':'name' }).then(Response => {
      this.buildingList = Response.data;
    });

  }


  patchValue() {
    if (this.route.routeConfig.path == 'admin/guest-room/booking/edit/:id') {
      this.getFilteredBooking();
    }

  }
  getFilteredBooking() {
    this._guest_service.getBookingRoomsContents(this.url_id).subscribe(response => {
      this.roomEditRestriction = response.bookinginfo;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      if (this.url_id == this.roomEditRestriction.id) {
        if (this.roomEditRestriction.editrestriction != null) {
          if (this.roomEditRestriction.editrestriction.user.id == this.userId) {
            let edit: boolean = true;
            this.fillBookingValues(edit);
          }
          if (this.roomEditRestriction.editrestriction.user.id != this.userId) {
            this.editRestrict = true;
            this.userName = this.roomEditRestriction.editrestriction.user.username;
            localStorage.setItem("first_user", this.userName);
            this.firstUserId = this.roomEditRestriction.editrestriction.user.id;
          }
        } else {
          let edit: boolean = true;
          this.fillBookingValues(edit);
        }
      }
      this.showDialog();
    });
  }


  showPopup() {
    const dialogRef = this._dialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'guestbooking',
      data: { type: 'guestbooking', body: '<h2>Recurring Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/events/all']);
      }
    });
  }


  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._dialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'guestbooking',
        data: { type: 'guestbooking', body: '<h2>Recurring Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/events/all']);
        }
        if (result == 'takeover') {
          this.editRestrictForm();
        }
      });
    }
  }

  editRestrictForm() {
    this._guest_service.updateForm(this.url_id, 'guestbooking').subscribe(response => {
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
    this._chatService.listen(environment.pusher.ann_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter == 1) {
        this.showPopup();
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
      this.confirmDialogRef.componentInstance.type = 'guestbooking';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  canDeactivate() {

    alert('I am navigating away');
    let user = "x";
    if (user == "x") {
      return window.confirm('Discard changes?');
    }
    return true;
  }
  fillBookingValues(edit: any) {
    this._guest_service.getBookingRoomsContent(this.url_id, edit).subscribe(data => {
      this.addBookingForm.patchValue(data.bookinginfo);
      this.promo_code = data.bookinginfo.voucher;
      this.addBookingForm.get('promocode').setValue(data.bookinginfo.voucher);
      this.startdate = CommonUtils.getStringToDate(data.bookinginfo.date_from);
      this.addBookingForm.get('start_date').setValue(CommonUtils.getStringToDate(data.bookinginfo.date_from));
      this.addBookingForm.get('end_date').setValue(CommonUtils.getStringToDate(data.bookinginfo.date_to));
      this.addBookingForm.get('building_id').setValue(data.bookinginfo.building_id);
      this.addBookingForm.get('first_name').setValue(data.bookinginfo.name);
      this.addBookingForm.get('guest_count').setValue(data.bookinginfo.person);
      let arrivaltime = new Date(moment(data.bookinginfo.arrival_time, 'HH:mm:ss').toString());
      this.addBookingForm.get('arrival_time').setValue(arrivaltime);
      // this.addBookingForm.get('id').setValue(data.user_id);
      this.user_id = data.bookinginfo.user_id;
     
      this._guest_service.getRoomList({ 'status': 'A', 'date_from': data.bookinginfo.date_from, 'date_to': data.bookinginfo.date_to, 'guests': data.bookinginfo.person, 'building_id': data.bookinginfo.building_id,'direction':'asc','column':'type' }).then(roomsList => {
        this.allrooms = roomsList.data;
        this.Total_price = data.bookinginfo.room_price;
      });
      setTimeout(() => {
        data.bookinginfo.bookingrooms.map((item, index) => {
          let count = Number(item.adults) + Number(item.children);
          let total = Number(item.price) * count;
          item['total'] = total;
          this.priceinfo.push(item);
          console.log("priceinfo",this.priceinfo);
          this.addBookingForm.get('all_rooms').setValue(item.rooms.type);
          setTimeout(() => {
            this.allrooms.forEach(data => {
              if (data.type == this.addBookingForm.get('all_rooms').value) {
                this.roomcount = [];
                this.Childerns_count = [];
                this.Adults_count = [];
                this.room_id = item.room_id;
                this.Currentdisplayprice = data.price;
                let count = data.available.available > item.rooms.room_count ? data.available.available : item.rooms.room_count
                for (let i = 0; i <= count; i++) {
                  this.roomcount.push(i);
                }
                if (data.max_people) {
                  for (let i = 0; i <= data.max_people; i++) {
                    this.Adults_count.push(i);
                  }
                }
                if (data.max_people) {
                  for (let i = 0; i <= data.max_people; i++) {
                    this.Childerns_count.push(i);
                  }
                }
              }
            })
          }, 300);

          const tempObj = {};
          tempObj['adults'] = new FormControl(item.adults);
          tempObj['children'] = new FormControl(item.children);
          this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
          this.guestcount.push(this.fb.group(tempObj));
          //AutoComplete List
          this.All_Extres = [];
          this._guest_service.getExtrasList({ 'status': 'A', 'diection': 'desc', 'trash': '' }).then(res => {
            this.All_Extres = res.data;
            let flag = 0
            this.All_Extres.map((item, index) => {
              flag = 0;
              data.bookinginfo.bookingextras.map((extra, index) => {
                if (item.id == extra.extra_id) {
                  flag = 1;
                }
              })
              if (flag == 1) {
                const tempObjExtras = {};
                tempObjExtras['extras'] = new FormControl(item.id);
                this.Extras = this.addBookingForm.get('Extras') as FormArray;
                this.Extras.push(this.fb.group(tempObjExtras));
              } else {
                const tempObjExtras = {};
                tempObjExtras['extras'] = new FormControl('');
                this.Extras = this.addBookingForm.get('Extras') as FormArray;
                this.Extras.push(this.fb.group(tempObjExtras));
              }

            })

          })

          this.allSelectedPricedata = {
            'guestcount': JSON.stringify(this.addBookingForm.get('guestcount').value),
            'date_from': this.addBookingForm.get('start_date').value,
            "date_to": this.addBookingForm.get('end_date').value,
            "room_id": this.room_id
          }
          //  clear the all selected  value of the room
          this.addBookingForm.get('all_rooms').setValue('');
          this.addBookingForm.get('number_of_rooms').setValue('');
          this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
          this.guestcount.clear();

        });
        this.patchThevalueofExtras(data.bookinginfo.bookingextras);
      }, 500);



    })
  }
  //  set the value according the  user  
  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.addBookingForm.patchValue(userInfo.option.value);
      this.addBookingForm.get('first_name').setValue(userInfo.option.value.first_name + ' ' + userInfo.option.value.last_name);
      this.addBookingForm.get('id').setValue(userInfo.option.value.id);
      this.user_id = userInfo.option.value.id;

    }
  }

  // roomdata guest count 
  Guest_count() {
    let start_date = moment(this.addBookingForm.get('start_date').value).format('YYYY-MM-DD');
    let end_date = moment(this.addBookingForm.get('end_date').value).format('YYYY-MM-DD');
    let guestcount = this.addBookingForm.get('guest_count').value;
    let building_id = this.addBookingForm.get('building_id').value;
    this.getallrooms(start_date, end_date, guestcount, building_id)
  }

  // add the masking accoding the phone number 
  PhoneNumberValidations(event) {
    if (event.target.value.length == 7) {
      let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
      event.target.value = values[1] + '-' + values[2]
      this.addBookingForm.get('phone').setValue(event.target.value);
    }
    else {

      if (event.target.value.length == 10) {
        let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
        event.target.value = values[1] + '-' + values[2] + '-' + values[3];
        this.addBookingForm.get('phone').setValue(event.target.value);
      } else {
        if ((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7] == '-' && event.target.value.length == 12)) {
          this.addBookingForm.get('phone').setValue(event.target.value);
        } else {
          this.addBookingForm.get('phone').setValue('');
        }
      }
    }
  }
  //   get the data of the room count 
  selecteddata() {
    this.showmsg = false;
    this.addBookingForm.get('number_of_rooms').setValue('');
    this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
    this.guestcount.clear();
    let start_date = moment(this.addBookingForm.get('start_date').value).format('YYYY-MM-DD');
    let end_date = moment(this.addBookingForm.get('end_date').value).format('YYYY-MM-DD');
    let guestcount = this.addBookingForm.get('guest_count').value;
    let building_id = this.addBookingForm.get('building_id').value;
    this._guest_service.getRoomList({ 'status': 'A', 'date_from': start_date, 'date_to': end_date, 'guests': guestcount, 'building_id': building_id,'direction':'asc','column':'type' }).then(roomsList => {
      this.allrooms = roomsList.data;
      let value = this.addBookingForm.get('all_rooms').value
      this.allrooms.forEach(data => {
        if (data.type == value && data.available.status == "available") {
          setTimeout(() => {
            this.roomcount = [];
            this.Childerns_count = [];
            this.Adults_count = [];
            this.room_id = data.id;
            this.Currentdisplayprice = data.price;
            this.currentAdultcount = data.max_people;
            this.currentChildcount = data.max_people;
            //  this.Price.push({id: data.id,price:data.price});
            for (let i = 0; i <= data.available.available; i++) {
              this.roomcount.push(i);
            }
            if (data.max_people) {
              for (let i = 0; i <= data.max_people; i++) {
                this.Adults_count.push(i);
              }
            }
            if (data.max_people) {
              for (let i = 0; i <= data.max_people; i++) {
                this.Childerns_count.push(i);
              }
            }
          }, 100);

        }
        if (data.type == value && data.available.status == "notavailable") {
          this.showmsg = true;
          this.message = data.available.message;
        }
      })
    })

  }
  // compare the min max date  
  fromDate(event) {
    //let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.startdate = new Date(event.value);
    let reservation_price_on = localStorage.getItem("reservation_time_price_on");
    if(reservation_price_on == 'night'){
      this.startdate.setDate(this.startdate.getDate() + 1);
      this.addBookingForm.get('end_date').setValue(this.startdate);
    }
    if(reservation_price_on == 'day'){
      this.addBookingForm.get('end_date').setValue(this.startdate)
    }
    // get all the rooms list 
    this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
    this.guestcount.clear();
    let start_date = moment(this.addBookingForm.get('start_date').value).format('YYYY-MM-DD');
    let end_date = moment(this.addBookingForm.get('end_date').value).format('YYYY-MM-DD');
    let guestcount = this.addBookingForm.get('guest_count').value;
    let building_id = this.addBookingForm.get('building_id').value;
    this.addBookingForm.get('all_rooms').setValue('');
    this.showmsg = false;
    this.getallrooms(start_date, end_date, guestcount, building_id)
  }

  toDate(event) {    
    this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
    this.guestcount.clear();
   // let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.enddate = new Date(event.value);    
    let start_date = moment(this.addBookingForm.get('start_date').value).format('YYYY-MM-DD');
    let end_date = moment(this.addBookingForm.get('end_date').value).format('YYYY-MM-DD');
    let guestcount = this.addBookingForm.get('guest_count').value;
    let building_id = this.addBookingForm.get('building_id').value;
    this.addBookingForm.get('all_rooms').setValue('');
    this.showmsg = false;
    this.getallrooms(start_date, end_date, guestcount, building_id)
  }

  getallrooms(start_date, end_date, guestcount, building_id) {
    if (start_date != '' && end_date != '' && guestcount != '') {
      this._guest_service.getRoomList({ 'status': 'A', 'date_from': start_date, 'date_to': end_date, 'guests': guestcount, 'building_id': building_id,'direction':'asc','column':'type' }).then(roomsList => {
        this.allrooms = roomsList.data;
        this.addBookingForm.get('all_rooms').setValue('');
        this.showmsg = false;
      })
    }
  }

  Bookroom() {
    this.bookbutton = true;
    let value = this.addBookingForm.value;
    let start_date = moment(this.addBookingForm.get('start_date').value).format('YYYY-MM-DD');
    let end_date = moment(this.addBookingForm.get('end_date').value).format('YYYY-MM-DD');
    this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
    if (this.guestcount.valid) {
      this.allSelectedPricedata = {
        'guestcount': JSON.stringify(value.guestcount),
        'date_from': start_date,
        "date_to": end_date,
        "room_id": this.room_id
      }

      setTimeout(() => {

        this._guest_service.getAllRoomprice(this.allSelectedPricedata).subscribe(res => {
          res.priceinfo.forEach(element => {
            this.priceinfo.push(element);
            //  clear the all selected  value of the room
            this.addBookingForm.get('all_rooms').setValue('');
            this.addBookingForm.get('number_of_rooms').setValue('');
            this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
            this.guestcount.clear();
            this.guestcount.clearValidators();
            this.guestcount.updateValueAndValidity();
            this.guestcount.markAsPristine();
            this.guestcount.markAsUntouched();
            this.bookbutton = false;
            console.log("priceinfo",this.priceinfo);
          });

        })
      }, 100);

    } else {
      this.bookbutton = false;
    }

  }


  editUploadedFileInfo(i) {

  }
  removeImage(i) {
    this.priceinfo.splice(i, 1);
  }

  ContinueData() {
    // get the all extras list  
    this.showcontinue = true;
    this.Extras = this.addBookingForm.get('Extras') as FormArray;
    this.Extras.clear();
    setTimeout(() => {

      this.priceinfo.forEach(element => {
        this.Total_price = element.price + this.Total_price;
        this.finalroomprice = element.price + this.finalroomprice;
      });
    }, 200);
    this._guest_service.getExtrasList({ 'status': 'A', 'diection': 'desc', 'trash': '' }).then(res => {
      this.All_Extres = res.data;
      this.SetExtrescontrol(this.All_Extres);
    })
    this.isSave = true;
  }

  SetExtrescontrol(All_Extres) {
    for (let i = 0; i < All_Extres.length; i++) {
      this.Extras = this.addBookingForm.get('Extras') as FormArray;
      this.Extras.push(this.createExtra());
    }
  }


  patchThevalueofExtras(bookingextras) {
    this.priceinfo.map((element, index) => {
      element['id'] = element.room_id;
    });    
    bookingextras.forEach(element => {
      this.selectedHours.push(element.extra_id);
      this.selectedextrainfo.push({ extra_id: element.extra_id, price: element.price })
    });
    setTimeout(() => {
      let currentextras = this.selectedHours.join();

      let currentvalue = this.allSelectedPricedata;
      let formdata = {
        'guestcount': currentvalue.guestcount,
        'date_from': moment(currentvalue.date_from).format('YYYY-MM-DD'),
        "date_to": moment(currentvalue.date_to).format('YYYY-MM-DD'),
        'extra_id': JSON.stringify(currentextras),
        'person': this.addBookingForm.get('guest_count').value,
        'rooms': typeof this.priceinfo == 'string' ? this.priceinfo : JSON.stringify(this.priceinfo),
        'roomprice': this.Total_price,
        'promocode': this.promo_code ? this.promo_code : '',
      }

      this._guest_service.AddtheExtrasinRoom(formdata).subscribe(item => {
        this.extrapriceinfo = item.extrapriceinfo;
        if (this.extrapriceinfo) {
          this.Final_price = this.extrapriceinfo.totalprice;
          this.finalroomprice = this.extrapriceinfo.roomprice;
          this.finalextraprice = this.extrapriceinfo.totalextraprice;
          this.dipositeprice = this.extrapriceinfo.dipositeprice;
          this.promocodeprice = this.extrapriceinfo.promocodeprice;
        }

      })
    }, 200);
  }

  updateCheckboxValues(event, id, value) {
    this.isExtras = true;
    let formdata;
    let data = this.addBookingForm.value;
    let start_date = moment(this.addBookingForm.get('start_date').value).format('YYYY-MM-DD');
    let end_date = moment(this.addBookingForm.get('end_date').value).format('YYYY-MM-DD');
    this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
    if (this.guestcount.valid) {
      this.allSelectedPricedata = {
        'guestcount': JSON.stringify(data.guestcount),
        'date_from': start_date,
        "date_to": end_date,
        "room_id": this.room_id
      }
    }
    let currentvalue = this.allSelectedPricedata;
    if (event) {
      this.selectedHours.push(id);
      this.selectedextrainfo.push({ extra_id: id, price: value.price })
    } else {
      let index = this.selectedHours.findIndex(item => item == id);
      let idx = this.selectedextrainfo.findIndex(item => item.id = id);
      this.selectedextrainfo.splice(idx, 1),
        this.selectedHours.splice(index, 1); // Then remove    

    }
    let currentextras = this.selectedHours.join();
    formdata = {
      'guestcount': currentvalue.guestcount,
      'date_from': currentvalue.date_from,
      "date_to": currentvalue.date_to,
      'extra_id': currentextras,
      'person': this.addBookingForm.get('guest_count').value,
      'roomprice': this.Total_price,
      'promocode': this.addBookingForm.get('promocode').value,
      'rooms': typeof this.priceinfo == 'string' ? this.priceinfo : JSON.stringify(this.priceinfo),
    }
    this.PromocodeData = formdata;
    this._guest_service.AddtheExtrasinRoom(formdata).subscribe(item => {
      this.extrapriceinfo = item.extrapriceinfo;
      this.Final_price = this.extrapriceinfo.totalprice;
      this.finalroomprice = this.extrapriceinfo.roomprice;
      this.finalextraprice = this.extrapriceinfo.totalextraprice;
      this.dipositeprice = this.extrapriceinfo.dipositeprice;
      this.promocodeprice = this.extrapriceinfo.promocodeprice;
    })

  }

  applypromocode() {
    this.PromocodeData
    let formdata = {
      'guestcount': this.PromocodeData.guestcount,
      'date_from': this.PromocodeData.date_from,
      "date_to": this.PromocodeData.date_to,
      'extra_id': this.PromocodeData.extra_id,
      'person': this.addBookingForm.get('guest_count').value,
      'roomprice': this.Total_price,
      'promocode': this.addBookingForm.get('promocode').value,
      'rooms': typeof this.priceinfo == 'string' ? this.priceinfo : JSON.stringify(this.priceinfo),
    }
    this._guest_service.AddtheExtrasinRoom(formdata).subscribe(item => {
      this.extrapriceinfo = item.extrapriceinfo;
      this.Final_price = this.extrapriceinfo.totalprice;
      this.finalroomprice = this.extrapriceinfo.roomprice;
      this.finalextraprice = this.extrapriceinfo.totalextraprice;
      this.dipositeprice = this.extrapriceinfo.dipositeprice;
      this.promocodeprice = this.extrapriceinfo.promocodeprice;
      if (this.promocodeprice > 0) {
        this.isPromoCode = false;
      } else {
        this.isPromoCode = true;
      }
    })
  }


  createItem() {
    return this.fb.group({
      adults: ['', [Validators.required]],
      children: [0],

    })
  }

  createExtra() {
    return this.fb.group({
      extras: ['']
    })
  }




  onAddSelectRow() {
    this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
    this.guestcount.clear();
    let count = this.addBookingForm.get('number_of_rooms').value ? this.addBookingForm.get('number_of_rooms').value : '';
    for (let i = 0; i < count; i++) {
      this.ChildAdultArray.push({ 'adult': this.Adults_count, 'child': this.Childerns_count });
      this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
      this.guestcount.push(this.createItem());
    }

  }
  onAdultSelect(event, index) {

    let count = this.currentChildcount;
    let adultarray = this.ChildAdultArray[index].adult;
    // this.ChildAdultArray.splice(index,1);
    let setNewvalue = count > event.value ? Number(count) - Number(event.value) : Number(event.value) - Number(count);
    let currentarray = [];
    for (let i = 0; i <= setNewvalue; i++) {
      currentarray.push(i);
    }
    this.ChildAdultArray[index].child = currentarray;       
  }

  onChildSelect(event, index) {
    let count = this.currentAdultcount;
    let childarray = this.ChildAdultArray[index].child;
    // this.ChildAdultArray.splice(index,1);
    let currentarray = [];
    let setNewvalue = count > event.value ? Number(count) - Number(event.value) : Number(event.value) - Number(count);
    for (let i = 0; i <= setNewvalue; i++) {
      currentarray.push(i);
    }
    this.ChildAdultArray[index].adult = currentarray;
  }



  getControls() {
    return (this.addBookingForm.get('guestcount') as FormArray).controls;
  }
  getExtrasControls() {
    return (this.addBookingForm.get('Extras') as FormArray).controls;
  }

  onSaveFieldClick() {
    this.savingEntry = true;
    let value = this.addBookingForm.value;    
    if (this.addBookingForm.valid) {
      this.savebutton = true;
      let currentpriceinfo = this.priceinfo;
      let priceinfos = [];
      this.priceinfo.forEach(element => {
        // priceinfos.push({ 'room_id': element.id ? element.id : element.room_id, 'adults': element.adults, 'children': element.children, room_number_id: '', 'price': element.price })
        priceinfos.push({ 'id': element.id ? element.id : element.room_id, 'adults': element.adults, 'children': element.children, room_number_id: '', 'price': element.price })
      });

      let finalData = {
        name: value.first_name,
        email: value.email,
        phone: value.phone,
        notes: value.notes,
        address: value.address,
        user_id: this.user_id,
        voucher: value.promocode,
        building_id: value.building_id,
        date_from: moment(value.start_date).format('YYYY-MM-DD'),
        date_to: moment(value.end_date).format('YYYY-MM-DD'),
        arrival_time: moment(value.arrival_time).format('HH:mm:ss'),
        room_price: this.Total_price,
        extra_price: this.extrapriceinfo ? this.extrapriceinfo.totalextraprice : 0,
        total: Number(this.Total_price) + Number(this.extrapriceinfo ? this.extrapriceinfo.totalextraprice : 0),
        status: value.status,
        payment_method: 'cash',
        roominfo: JSON.stringify(priceinfos),
        person: this.addBookingForm.get('guest_count').value,
        extrainfo: JSON.stringify(this.selectedextrainfo),
        id: this.url_id ? this.url_id : ''
      }
      this._guest_service.BookRoom(finalData, this.editBookingData).subscribe(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });

        this.router.navigate(['/admin/guest-room/booking/list']);
      },
        error => {
          // Show the error message
          this.savebutton = false
          this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration: 2000
          });
        });
    }
  }

  updateTotalPrice() {
    if (this.isExtras) {
      let formdata;
      let data = this.addBookingForm.value;
      let start_date = moment(this.addBookingForm.get('start_date').value).format('YYYY-MM-DD');
      let end_date = moment(this.addBookingForm.get('end_date').value).format('YYYY-MM-DD');
      this.guestcount = this.addBookingForm.get('guestcount') as FormArray;
      if (this.guestcount.valid) {
        this.allSelectedPricedata = {
          'guestcount': JSON.stringify(data.guestcount),
          'date_from': start_date,
          "date_to": end_date,
          "room_id": this.room_id
        }
      }
      let currentvalue = this.allSelectedPricedata;
      let currentextras = this.selectedHours.join();
      formdata = {
        'guestcount': currentvalue.guestcount,
        'date_from': currentvalue.date_from,
        "date_to": currentvalue.date_to,
        'extra_id': currentextras,
        'person': this.addBookingForm.get('guest_count').value,
        'roomprice': this.Total_price,
        'promocode': this.addBookingForm.get('promocode').value,
        'rooms': typeof this.priceinfo == 'string' ? this.priceinfo : JSON.stringify(this.priceinfo),
      }
      this.PromocodeData = formdata;
      this._guest_service.AddtheExtrasinRoom(formdata).subscribe(item => {
        this.extrapriceinfo = item.extrapriceinfo;
        this.Final_price = this.extrapriceinfo.totalprice;
        this.finalroomprice = this.extrapriceinfo.roomprice;
        this.finalextraprice = this.extrapriceinfo.totalextraprice;
        this.dipositeprice = this.extrapriceinfo.dipositeprice;
        this.promocodeprice = this.extrapriceinfo.promocodeprice;
      })
    }
  }
}
