import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MeetingRoomService, OptionsList, UsersService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingRoommodel } from 'app/_models';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import moment from 'moment';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {

  public addBooking: FormGroup;
  public title: string = '';
  public url_id: any;
  public editBookingData: boolean = false;
  public roomslist: any;
  public layoutList: any;
  public dureation: any;
  public roomId: any;
  public timeSlot: any = [];
  public afterOccurrence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
  public interval = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  public onDate: boolean = false;
  public occurrence: boolean = false;
  public weekly: boolean = false;
  public monthly: boolean = false;
  public recurring: boolean = false;
  public equipment: any;
  public foodDrinks: any;
  public tempEquipments: any = [];
  public equipments: any = [];
  public temFoodDrink: any = [];
  public foodDrinkArr: any = [];
  public availableDates: any = [];
  public recucrrencedate: any;
  public recurring_meta: any;
  public disableSubmit: boolean = false;
  public bookingErrorMessage: any;
  public recurringEditMeta: any = [];
  public recurrenceEditDate: any;
  public recurring_everyList: any = [];
  public week_days: any = [];
  public Time_status = [];
  public selectedHours = [];
  public formData: any;
  public editRecurrence: boolean = false;
  public addRecurrence: boolean = false;
  public isCapacity: any;
  public roomData: any;
  filteredUsers: any[] = [];
  public isSubmit: boolean = false;
  public isCheckEquipment: any = {};
  food_drinks: FormArray;
  public foodDrinksArr: any;
  public isUpdateVal: any;
  public isRecurring: any;
  public parent_booking_id: any;
  public isSubmitEdit: boolean = true;
  public currentTimeSlot: any;
  public bookByKey: any;
  public bookByValue: any;
  public isTimeSlot: boolean = false;
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;
  constructor(
    private _userService: UsersService,
    private fb: FormBuilder,
    private _meetingRoomService: MeetingRoomService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
  ) {
    if (this.route.routeConfig.path == 'admin/meeting-room/booking/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editBookingData = true;
      this.isSubmitEdit = false;
      this.isSubmit = true;
    }
    this.url_id ? this.title = "Update Booking" : this.title = "New Booking";
    this.equipments = [];
  }
  ngOnInit() {    
    this.recurring_everyList = OptionsList.Options.recurring_everyList;
    //this.week_days           = OptionsList.Options.dining_week_days;
    this.week_days = OptionsList.Options.week_days;
    this.setControls();
    this._meetingRoomService.getBookingRoomsList({ 'status': 'A' }).then(response => {
      this.roomslist = response.data;
    });
    this._meetingRoomService.getEquipmentList({ 'status': 'A' }).then(response => {
      this.equipment = response.data;
      this.equipment.forEach(item => {
        item.status = false;
      });
    });
    this._meetingRoomService.getDrinkList({ 'status': 'A' }).then(response => {
      this.foodDrinks = response.data;
      this.foodDrinks.forEach(item => {
        this.food_drinks = this.addBooking.get('food_drinks') as FormArray;
        this.food_drinks.push(this.createItem());
      });
    });
    this.addBooking
      .get('client_name').valueChanges
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
  createItem() {
    return this.fb.group({
      quantity: [''],
      food_drink_id: [''],
    });
  }
  setControls() {
    this.addBooking = this.fb.group({
      client_name: this.fb.control('', [Validators.required]),
      client_email: this.fb.control('', [Validators.required]),
      client_phone: this.fb.control('', [Validators.required]),
      start_date: this.fb.control('', [Validators.required]),
      status: this.fb.control('', [Validators.required]),
      attendees: this.fb.control(''),
      room_id: this.fb.control('', [Validators.required]),
      layout_id: this.fb.control('', [Validators.required]),
      book_by: this.fb.control('', [Validators.required]),
      is_recurring: this.fb.control(''),
      on_date: this.fb.control(''),
      byday: this.fb.control(''),
      repeat_by: this.fb.control(''),
      repeat: this.fb.control(''),
      recurringrepeat: this.fb.control(''),
      bymonthday: this.fb.control(''),
      interval: this.fb.control(''),
      occurence: this.fb.control(''),
      notes: this.fb.control(''),
      food_drinks: this.fb.array([]),
      id: this.editBookingData == true ? this.url_id : '',
    });
    /**set the default value booking recurring */
    this.addBooking.patchValue({ recurringrepeat: 'DAILY' });

    /**set the default value for the every dropdown */
    this.addBooking.patchValue({ interval: this.recurring_everyList[0] });
    if (this.route.routeConfig.path == 'admin/meeting-room/booking/edit/:id') {
      this.fillBookingValues();
    }
  }
  recBookingUpdate(type) {
    if (this.editBookingData == true && type == 'Y') {
      const dialogRef = this._dialog.open(FormFieldsComponent, {
        disableClose: true,
        width: '50%',
        data: { type: 'recurringUpdateBooking', body: '<h2>Recurring Confirmation</h2>' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != 'N') {
          this.isUpdateVal = result;
          this.onSaveFieldClick();
        }

      });
    } else {
      this.onSaveFieldClick();
      this.isUpdateVal = '';
    }
  }
  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.addBooking.patchValue(userInfo.option.value);
      this.addBooking.get('client_phone').setValue(userInfo.option.value.phone);
      this.addBooking.get('client_email').setValue(userInfo.option.value.email);
      this.addBooking.get('client_name').setValue(userInfo.option.value.first_name + ' ' + userInfo.option.value.last_name);
    }
  }
  fillBookingValues() {
    this._meetingRoomService.getBookingContent(this.url_id).subscribe(response => {
      this.formData = response.bookinginfo;
      this.bookByKey = this.formData.book_by;
      if (this.bookByKey == '9to2') {
        this.bookByValue = '09:00 am to 02:00 pm';
      }
      if (this.bookByKey == 'afternoon') {
        this.bookByValue = 'Half-day - Afternoon';
      }
      if (this.bookByKey == 'hour') {
        this.bookByValue = 'Hourly';
      }
      if (this.bookByKey == 'morning') {
        this.bookByValue = 'Half-day - Morning';
      }
      //       9to2: "09:00 am to 02:00 pm"
      // afternoon: "Half-day - Afternoon"
      // hour: "Hourly"
      // morning: "Half-day - Morning"
      this.roomId = this.formData.room_id;
      this._meetingRoomService.getBookingRoomsList({ 'status': 'A' }).then(response => {
        this.roomslist = response.data;
        this.roomslist.forEach(item => {
          if (item.id == this.roomId) {
            this.layoutList = item.roomslayout;
          }
        });
      });
      this.parent_booking_id = this.formData.parent_booking_id;
      this.addBooking.patchValue({ layout_id: this.formData.roomslayouts.id });
      this._meetingRoomService.getDuration({ 'room_id': this.roomId, 'start_date': this.formData.start_date }).subscribe(response => {
        this.dureation = response.Durationinfo;
        console.log("dureation", this.dureation);
      });
      if (this.formData.book_by == 'hour') {
        this._meetingRoomService.getTimeSlot({ 'room_id': this.roomId, 'start_date': this.formData.start_date }).then(response => {
          this.timeSlot = response.slotinfo;         
          this.timeSlot = Object.entries(response.slotinfo).map(([type, value]) => ({ type, value }));
          this.timeSlot.forEach(element => {
            this.Time_status.push({ 'status': false });
          });
        });
      }
      this._meetingRoomService.getEquipmentList({ 'status': 'A' }).then(response => {
        this.equipment = response.data;
        let equipmentsArr = this.formData.equipments;
        let n = 0;
        this.equipment.forEach(item => {
          let flag = 0;
          equipmentsArr.forEach(equip => {
            if (equip.equipment_id == item.id) {
              flag = 1;
            }
          });
          if (flag == 1) {
            item.status = true;
            this.equipments[n] = { 'equipment_id': item.id, 'unit': 1 };
            n = n + 1;
          } else {
            item.status = false;
          }
        });
        // let n = 0;
        // equipmentsArr.forEach(item => {
        //   this.equipments[n] = { 'equipment_id': item.equipment_id, 'unit': item.unit };
        // });
        // let flag = 0;
        // this.equipment.forEach(item => {
        //   equipmentsArr.forEach(iteme => {
        //     if (item.id == iteme.equipment_id) {
        //       flag = 1;
        //     }
        //   });
        //   if (flag == 1) {
        //     item.status = true;
        //   } else {
        //     item.status = false;
        //   }
        // });
      });

      // put selected hours in array for patching checkbox
      let bookingslots = this.formData.bookingslots;
      // {duration: undefined, id: "09:00:00-10:00:00", value: "09 am - 10 am", index: 0}
      let k = 0;
      bookingslots.forEach(item => {
        let key = item.start_hour + '-' + item.end_hour;
        this.selectedHours.push({ duration: '', id: key, value: key, index: k });
        k = k + 1;
      });
      this.addBooking.patchValue(this.formData);
      this.isRecurring = this.formData.is_recurring;
      if (this.formData.is_recurring == 'Y') {
        this.addBooking.patchValue({ is_recurring: true });
        this.recurring = true;
      } else {
        this.recurring = false;
        this.addBooking.patchValue({ is_recurring: false });
      }
      if (this.formData.is_recurring != 'N') {
        let recurringMeta = JSON.parse(this.formData.recurring_meta);
        if (recurringMeta.FREQ == 'WEEKLY') {
          this.weekly = true;
        }
        if (recurringMeta.FREQ == 'MONTHLY') {
          this.monthly = true;
        }
        const Byday = typeof recurringMeta.BYDAY == 'string' ? recurringMeta.BYDAY.split('') : (recurringMeta.BYDAY.toString()).split('');
        this.addBooking.patchValue({ recurringrepeat: recurringMeta.FREQ });
        this.addBooking.patchValue({ byday: Byday });
        this.addBooking.patchValue({ occurence: recurringMeta.COUNT });
        this.addBooking.patchValue({ interval: recurringMeta.INTERVAL });
        this.addBooking.patchValue({ repeat_by: recurringMeta.REPEAT_BY });
        this.addBooking.patchValue({ on_date: moment(recurringMeta.UNTIL).format('YYYY-MM-DD') });

        if (recurringMeta.COUNT != '') {
          this.occurrence = true;
          this.addBooking.patchValue({ repeat: 'occurance' });

          this.addBooking.get('on_date').disable();
        } if (recurringMeta.UNTIL != '') {
          this.addBooking.patchValue({ repeat: 'date' });
          this.addBooking.get('occurence').disable();
          this.addBooking.get('occurence').reset();
        }
        this.recurrenceEditDate = this.formData.recurrences;
        if (this.recurrenceEditDate.length != 0) {
          for (var i = 0; i < this.recurrenceEditDate.length; i++) {
            this.availableDates.push(moment(this.recurrenceEditDate[i].booking_start_date).format('YYYY-MM-DD'));
          }
        }
        this.food_drinks = this.addBooking.get('food_drinks') as FormArray;
        if (this.formData.fooddrinks) {
          let k = 0;
          this.formData.fooddrinks.map((item, index) => {
            this.foodDrinkArr[k] = { 'food_drink_id': item.food_drink_id, 'quantity': item.quantity };
            k = k + 1;
            const tempObj = {};
            tempObj['quantity'] = new FormControl(item.quantity);
            tempObj['food_drink_id'] = new FormControl(true);
            this.food_drinks.push(this.fb.group(tempObj));
          });
        }
        //this.recucrrencedate = response.recucrrencedate;  
        this.recurringEditMeta = JSON.parse(this.formData.recurring_meta);

        this.editRecurrence = true;
        this.addRecurrence = false;

      }
    });
  }

  onSaveFieldClick() {
    if (this.addBooking.valid) {
      this.isSubmit = true;
      let value = this.addBooking.value;
      let timeSlotArr: any = [];
      // timeSlotArr[0] = { 'time': '10:00:00-11:00:00' };
      // timeSlotArr[1] = { 'time': '11:00:00-12:00:00' };
      this.selectedHours.forEach(item => {
        timeSlotArr.push({ 'time': item.id });
      });
      let isRecurring;
      if (value.is_recurring == true) {
        isRecurring = 'Y';
      } else {
        isRecurring = 'N';
      }
      let formData = {
        'client_name': value.client_name,
        'client_email': value.client_email,
        'client_phone': value.client_phone,
        'start_date': value.start_date,
        'attendees': value.attendees,
        'room_id': value.room_id,
        'layout_id': value.layout_id,
        'book_by': value.book_by,
        'status': value.status,
        'notes': value.notes,
        'is_recurring': isRecurring,
        'recurring_meta': (this.recurring_meta != '' && this.recurring_meta != undefined) ? this.recurring_meta : this.recurringEditMeta,
        'recurrences': this.availableDates.length != 0 ? JSON.stringify(this.availableDates) : '',
        'equipments': this.equipments,
        'food_drinks': this.foodDrinkArr,
        'from_to': timeSlotArr,
        'update': this.isUpdateVal,
        'id': this.editBookingData == true ? this.url_id : '',
        'parent_booking_id': this.parent_booking_id
      }
      this.disableSubmit = true;
      this._meetingRoomService.addBooking(formData, this.editBookingData)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/meeting-room/booking/list']);

        },
          error => {
            this.disableSubmit = false;
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });

    }
  }
  getLayout(event) {
    this.roomId = event.value;
    this.roomslist.forEach(item => {
      if (item.id == this.roomId) {
        this.layoutList = item.roomslayout;
      }
    });
    let date = moment(this.addBooking.get('start_date').value).format('YYYY-MM-DD');
    this._meetingRoomService.getDuration({ 'room_id': this.roomId, 'start_date': date }).subscribe(response => {
      this.dureation = response.Durationinfo;
    });
    this._meetingRoomService.getRoomsCapacity(event.value).subscribe(response => {
      this.roomData = response.RoomsInfo;
      this.isCapacity = this.roomData.capacity;
    });

  }
  getTimeSlotList(event) {
    this.timeSlot = [];
    if (event.value == 'hour') {
      let date = moment(this.addBooking.get('start_date').value).format('YYYY-MM-DD');
      this._meetingRoomService.getTimeSlot({ 'room_id': this.roomId, 'start_date': date }).then(response => {
        this.timeSlot = response.slotinfo;
        console.log("this.timeSlot.length",this.timeSlot.length)
        this.isTimeSlot = this.timeSlot.length > 0 ? false : true ;
        this.timeSlot = Object.entries(response.slotinfo).map(([type, value]) => ({ type, value }));
        this.timeSlot.forEach(element => {
          this.Time_status.push({ 'status': false });
          this.isTimeSlot = false;
        });
      });
    }else{
      this.isTimeSlot = false;
    }
  }
  getOccurrence(event) {
    if (event.value == 'occurance') {
      this.occurrence = true;
      this.onDate = false;
    }
    if (event.value == 'date') {
      this.onDate = true;
      this.occurrence = false;
    }
  }
  getRecurring(event) {
    if (event.value == 'MONTHLY') {
      this.monthly = true;
      this.weekly = false;
    }
    if (event.value == 'WEEKLY') {
      this.monthly = false;
      this.weekly = true;
    }
    if (event.value == 'DAILY') {
      this.monthly = false;
      this.weekly = false;
    }
  }

  getRecurringOption(event) {
    let recurring = event.checked;
    if (recurring == true) {
      this.recurring = true;
    } else {
      this.recurring = false;
    }
  }
  getEquipmentValue(event, id) {
    let len = this.tempEquipments.length;
    let flag = 0;
    if (len > 0) {
      this.tempEquipments.forEach(item => {
        if (item.equipment_id == id) {
          item.equipment_id = id;
          item.unit = event.target.value;
          item.status = true;
          flag = 1;
        }
      });
      if (flag == 0) {
        this.tempEquipments[len] = { 'equipment_id': id, 'unit': event.target.value };
      }
    } else {
      this.tempEquipments[0] = { 'equipment_id': id, 'unit': event.target.value };
    }

  }
  maxLength(event) {
    let capacity: any;
    capacity = Number(event.target.value);
    if (capacity > this.isCapacity) {
      this.addBooking.get('attendees').setValue(this.isCapacity);
    }

  }
  getEquipment(event, i, id) {
    let len = this.equipments.length;
    let unit;
    let flag = 0;
    this.tempEquipments.forEach(item => {
      if (item.equipment_id == id) {
        unit = item.unit;
        flag = 1;
      }
    });
    if (flag == 0) {
      unit = 1;
    }
    if (event.checked == true) {
      if (len > 0) {
        this.equipments[len] = { 'equipment_id': id, 'unit': unit }
      } else {
        this.equipments[0] = { 'equipment_id': id, 'unit': unit }
      }
    } else {
      let foodArr: any = [];
      let i = 0;
      this.equipments.forEach(item => {
        if (id != item.equipment_id) {
          foodArr[i] = item;
          i = i + 1;
        }
      });
      this.equipments = [];
      this.equipments = foodArr;
    }
  }
  getFoodAndDrinks(event, id) {
    let len = this.temFoodDrink.length;
    let flag = 0;
    if (len > 0) {
      this.temFoodDrink.forEach(item => {
        if (item.food_drink_id == id) {
          item.food_drink_id = id;
          item.quantity = event.target.value;
          flag = 1;
        }
      });
      if (flag == 0) {
        this.temFoodDrink[len] = { 'food_drink_id': id, 'quantity': event.target.value };
      }
    } else {
      this.temFoodDrink[0] = { 'food_drink_id': id, 'quantity': event.target.value };
    }
  }
  getFoodDrinks(event, id) {
    let len = this.foodDrinkArr.length;
    let quantity;
    let flag = 0;
    this.temFoodDrink.forEach(item => {
      if (item.food_drink_id == id) {
        quantity = item.quantity;
        flag = 1;
      }
    });
    if (flag == 0) {
      quantity = 1;
    }
    if (event.checked == true) {
      if (len > 0) {
        this.foodDrinkArr[len] = { 'food_drink_id': id, 'quantity': quantity }
      } else {
        this.foodDrinkArr[0] = { 'food_drink_id': id, 'quantity': quantity }
      }
    } else {
      let foodArr: any = [];
      let i = 0;
      this.foodDrinkArr.forEach(item => {
        if (id != item.food_drink_id) {
          foodArr[i] = item;
          i = i + 1;
        }
      });
      this.foodDrinkArr = [];
      this.foodDrinkArr = foodArr;
    }
  }
  disableTimeSlot(event, key) {
    let splitControlName = key.split("-");
    let time1 = splitControlName[0].split(":");
    this.addBooking.get(key).disable();

  }
  getPreviewBookings(event) {
    this.availableDates = [];
    let value = this.addBooking.value;
    let repeatBy;
    let timeSlots: any = [];
    let i = 0;
    let time: any;
    time = '';
    this.selectedHours.forEach(item => {
      if (time == '') {
        time = item.id;
      } else {
        time = time + ',' + item.id;
      }
      timeSlots[i] = item.id;
      i = i + 1;
    });

    let times: any = [];
    times = JSON.stringify(timeSlots);
    if (this.addBooking.get('repeat_by').value == '') {
      repeatBy = 'day_of_daily';
    } else {
      repeatBy = this.addBooking.get('repeat_by').value;
    }
    if (this.addBooking.get('repeat').value != '') {
      //let recurring_week_day  = this.addBooking.get('byday').value;
      this._meetingRoomService.getPreviewBooking({
        'recurringrepeat': value.recurringrepeat,
        'repeat_by': repeatBy,
        'interval': value.interval,
        'start_date': moment(this.addBooking.get('start_date').value).format('YYYY-MMM-DD'),
        'byday': value.byday.toString(),
        'bymonthday': value.bymonthday,
        'occurence': this.addBooking.get('repeat').value == 'occurance' ? this.addBooking.get('occurence').value : '',
        'end_date': this.addBooking.get('repeat').value == 'date' ? moment(value.on_date).format('YYYY-MMM-DD') : '',
        'room_id': this.roomId,
        'book_by': value.book_by,
        'slots': time

      }).subscribe(response => {
        this.recucrrencedate = response.recucrrencedate;
        this.recurring_meta = response.recurringmeta;
        if (this.recucrrencedate.length != 0) {
          for (var i = 0; i < this.recucrrencedate.length; i++) {
            if (this.recucrrencedate[i].class == 'available') {
              this.availableDates.push(moment(this.recucrrencedate[i].date).format('YYYY-MM-DD'));
            }
          }
          this.editRecurrence = false;
          this.addRecurrence = true;
        }
        if (this.availableDates.length == 0 || this.recucrrencedate.length == 0) {
          this.disableSubmit = true;
          this.bookingErrorMessage = 'Bookings not available';
        } else {
          this.disableSubmit = false;
        }
      });
    }
  }
  onSelctedTimeSlot(event, Id, value, indexs, duration) {
    const checked = event; // stored checked value true or false
    if (checked) {
      this.selectedHours.push({ 'duration': duration, 'id': Id, 'value': value, 'index': indexs }); // push the Id in array if checked
      if (indexs > 0) {
        this.Time_status.splice(indexs - 1, 1);
        this.Time_status.splice(indexs, 1);
        this.Time_status.splice(indexs + 1, 1);
        this.Time_status.splice(indexs - 1, 0, { 'status': false });
        this.Time_status.splice(indexs, 0, { 'status': false });
        this.Time_status.splice(indexs + 1, 0, { 'status': false });
      } else {
        this.Time_status.splice(indexs, 1);
        this.Time_status.splice(indexs + 1, 1);
        this.Time_status.splice(indexs, 0, { 'status': false });
        this.Time_status.splice(indexs + 1, 0, { 'status': false });
      }

    } else {
      const index = this.selectedHours.findIndex(list => list.id == Id);//Find the index of stored id
      this.selectedHours.splice(index, 1); // Then remove
      if (indexs > 0) {
        this.Time_status.splice(indexs - 1, 1);
        this.Time_status.splice(indexs, 1);
        this.Time_status.splice(indexs + 1, 1);
        for (let i = 0; i < this.selectedHours.length; i++) {
          if (this.selectedHours[i].indexs == indexs) {
            this.Time_status.splice(indexs - 1, 0, { 'status': true });
            this.Time_status.splice(indexs, 0, { 'status': false });
            this.Time_status.splice(indexs + 1, 0, { 'status': true });
          }
        }
        this.Time_status.splice(indexs - 1, 0, { 'status': true });
        this.Time_status.splice(indexs, 0, { 'status': false });
        this.Time_status.splice(indexs + 1, 0, { 'status': true });
      } else {
        this.Time_status.splice(indexs, 1);
        this.Time_status.splice(indexs + 1, 1);
        this.Time_status.splice(indexs, 0, { 'status': false });
        this.Time_status.splice(indexs + 1, 0, { 'status': true });
      }
    }
    for (let i = 0; i < this.Time_status.length; i++) {
      if (i != indexs && i != indexs + 1 && i != indexs - 1) {
        this.Time_status.splice(i, 1);
        this.Time_status.splice(i, 0, { 'status': true });
      }
    }
    if (this.selectedHours.length == 0) {
      for (let i = 0; i < this.Time_status.length; i++) {
        this.Time_status.splice(i, 1);
        this.Time_status.splice(i, 0, { 'status': false });
      }
    }

    // if (checked) {
    //   this.selectedHours.forEach(item => {
    //     this.Time_status[item.index - 1].status = false;
    //     this.Time_status[item.index + 1].status = false;
    //   });
    // }
  }
  isChecked(key) {
    //  Stored  the selected data in array
    return this.selectedHours.some(item => item.id == key);

  }
}
