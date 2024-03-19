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
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  animations: fuseAnimations
})
export class RoomsComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public addRooms: FormGroup;
  public Adults: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public children: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public isRooms: any = [];
  public default_img: any;
  public CurrentSelectdData: any;
  public fromDayName: any;
  public toDayName: any;
  public fromDay: any;
  public toDay: any;
  public roomsData: any = [];
  public roomBookingArr: any = [];
  public building_name: any;
  public adultValidation = 1;
  public childValidation = 0;
  public maxPeople = 0;
  guestRoom: FormArray;
  adultsChildren: FormArray;
  public adultChildrenArr: any = [];
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
  }

  ngOnInit(): void {
    this.setControls();
    this._settingService.getGuestRoomSetting({ meta_type: "guest" }).then(res => {
      let data = res.data;
      data.forEach(item => {
        if (item.meta_key == 'Default_img') {
          this.default_img = item.meta_value;
        }
      });
    });
    this.CurrentSelectdData = this._guestroomService.GetGuestRoomsListData();
    if (this.CurrentSelectdData == undefined || this.CurrentSelectdData.length == 0) {
      this.router.navigate(['/guest-room']);
    } else {
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let d1 = new Date(this.CurrentSelectdData[0].date_from);
      this.fromDayName = days[d1.getDay()];

      let d2 = new Date(this.CurrentSelectdData[0].date_to);
      this.toDayName = days[d2.getDay()];

      // const monthNames = ["January", "February", "March", "April", "May", "June",
      //   "July", "August", "September", "October", "November", "December"
      // ];
      // const fromM = new Date(this.CurrentSelectdData[0].date_from);
      // let fromMonth = monthNames[fromM.getMonth()];      
      this.fromDay = moment(this.CurrentSelectdData[0].date_from).format('MMMM DD, YYYY');
      this.toDay = moment(this.CurrentSelectdData[0].date_to).format('MMMM DD, YYYY');
      this._guestroomService.getRoomList({ 'building_id': this.CurrentSelectdData[0].building_id, 'date_from': this.CurrentSelectdData[0].date_from, 'date_to': this.CurrentSelectdData[0].date_to, 'guests': this.CurrentSelectdData[0].guest, 'status': 'A' }).then(Response => {
        this.roomsData = Response.data;
        this.roomsData.map((element, index)=>{
          this.adultChildrenArr.push('');
        });
        this.maxPeople = this.roomsData.max_people;
        this.roomsData.map((element, index) => {
          this.isRooms[index] = { 'status': false, 'no_of_rooms': 0 };
          this.roomBookingArr[index] = '';
          this.onAddFormArray();
        });
        if (localStorage.getItem("roomBookingArr") !== null) {
          this.roomBookingArr = JSON.parse(localStorage.getItem("roomBookingArr"));
          this.roomBookingArr.map((item, index) => {
            if (item != '') {
              this.isRooms[index] = { 'status': false, 'no_of_rooms': 1 };
            } else {
              this.isRooms[index] = { 'status': false, 'no_of_rooms': 0 };
            }
          });
        }
      });
      this._guestroomService.getBuildingContents(this.CurrentSelectdData[0].building_id).subscribe(response => {
        let formData = response.buildingsinfo;
        this.building_name = formData.name;
      });
    }

  }
  setControls() {
    this.addRooms = this.fb.group({
      step: this.fb.control('step2'),
      guestRoom: this.fb.array([]),
    });
  }
  goBack() {
    this.router.navigate(['/guest-room']);
  }
  gotoNextStep() {
    if (this.addRooms.valid) {
      let value = this.addRooms.value;
      let bookingArr: any = [];
      this.roomBookingArr.map((element, index) => {
        if (this.roomBookingArr[index] != '') {
          bookingArr.push(element);
        }
      });
      let formdata = {
        'guest': this.CurrentSelectdData[0].guest,
        'date_from': this.CurrentSelectdData[0].date_from,
        'date_to': this.CurrentSelectdData[0].date_to,
        'building_id': this.CurrentSelectdData[0].building_id,
        'building_name': this.building_name,
        'roomBookingArr': JSON.stringify(bookingArr),
        'total': '',
        'discount': '',
        'deposit': '',
        'extraName': '',
        'total_rooms': '',
        'nights': '',
        'totalprice': '',
        'roomPrice': '',
        'totalextraprice': '',
        'promocodeprice': '',
        'dipositeprice': '',
      };
      localStorage.setItem("guest_room_booking", JSON.stringify(formdata));
      this._guestroomService.setGuestRoomlistdata(formdata);
      this.router.navigate(['/guest-room/extras']);
    }
  }
  fromDate(event) {

  }
  getRooms(event, i) {
    let no_of_rooms = event.value;
    if (no_of_rooms > 0) {
      this.isRooms[i].status = true;
    } else {
      this.isRooms[i].status = false;
      if (localStorage.getItem("roomBookingArr") !== null) {
        this.roomBookingArr = [];
        this.roomBookingArr = JSON.parse(localStorage.getItem("roomBookingArr"));
        this.roomBookingArr[i] = '';
        localStorage.setItem("roomBookingArr", JSON.stringify(this.roomBookingArr));
      }


    }
    this.isRooms[i].no_of_rooms = no_of_rooms;
  }
  setAdultValidation(event, index,index2) {        
    let max_people = this.roomsData[index].max_people;
    this.adultValidation = Number(event.value);
    let ChildrenValue = Number(max_people) - Number(this.adultValidation);    
    this.adultChildrenArr[index][index2].child = ChildrenValue;
    this.adultChildrenArr[index][index2].adult = this.adultValidation;    
    console.log("adultChildrenArr",this.adultChildrenArr);
  }
  setChildValidation(event, index,index2) {
    let max_people = this.roomsData[index].max_people;
    this.childValidation = Number(event.value);
    let adultValue = Number(max_people) - Number(this.childValidation);    
    this.adultChildrenArr[index][index2].child = this.childValidation;
    this.adultChildrenArr[index][index2].adult = adultValue;   
    console.log("adultChildrenArr2",this.adultChildrenArr);
  }
  counter(i: number) {
    return new Array(i);
  }
  createRoomsItem() {
    return this.fb.group({
      guest: this.fb.control(0),
      book_room: this.fb.control(0),
      room_id: this.fb.control(''),
      adultsChildren: this.fb.array([]),
    })
  }
  onAddFormArray() {
    this.guestRoom = this.addRooms.get('guestRoom') as FormArray;
    this.guestRoom.push(this.createRoomsItem());
  }
  bookRoom(indexs, room_id) {
    let data = this.addRooms.value;
    data.guestRoom[indexs].book_room = 1;
    data.guestRoom[indexs].room_id = room_id;
    let guestcount = [];
    let i = 0;
    data.guestRoom[indexs].adultsChildren.forEach(item => {
      guestcount[i] = item;
      i = i + 1;
    });
    this._guestroomService.getRoomsPrice(room_id, JSON.stringify(guestcount), this.CurrentSelectdData[0].date_from, this.CurrentSelectdData[0].date_to).subscribe(response => {
      this.roomBookingArr[indexs] = response.priceinfo;
      localStorage.setItem("roomBookingArr", JSON.stringify(this.roomBookingArr));
    });
    this.isRooms[indexs].status = false;
  }
  getChildren($event) {
    let childrens = $event.value;
  }
  getAdults($event) {
    let adults = $event.value;
  }
  
  onAddSelectRowAdultsChildren(event, fieldIndex: number = 0) {
    let optionArray = this.addRooms.get('guestRoom') as FormArray;
    this.adultsChildren = optionArray.controls[fieldIndex].get('adultsChildren') as FormArray;
    this.adultsChildren.clear();
    if (event.value > 0) {
      for (let i = 1; i <= event.value; i++) {
        let optionArray = this.addRooms.get('guestRoom') as FormArray;
        this.adultsChildren = optionArray.controls[fieldIndex].get('adultsChildren') as FormArray;
        this.adultsChildren.push(this.createAdultsChildrenPriceItem());
      }
    }
    let arr: any = [];
    for(let i = 0; i< event.value; i++){
      arr[i] = {'adult':this.roomsData[fieldIndex].max_people,'child':this.roomsData[fieldIndex].max_people};
    }
    this.adultChildrenArr[fieldIndex] = arr; 
    console.log("adultChildrenArr",this.adultChildrenArr[fieldIndex]);
  }
  createAdultsChildrenPriceItem() {
    return this.fb.group({
      adults: [1],
      children: [0],
    })
  }
  gotoBack() {
    this.router.navigate(['/guest-room']);
  }
  gotoHome() {
    this.router.navigate(['/guest-room']);
  }
}
