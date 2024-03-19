import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { MeetingRoomService, CommonService, SettingsService, AppConfig } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.scss'],
  animations: fuseAnimations
})
export class BookRoomComponent implements OnInit {
  public bookRoom: FormGroup;
  public roomsData: any;
  public default_img: any;
  public url_id: any;
  public roomData: any;
  public stepNumber: any = [];
  public date: any;
  public timeSlot: any = [];
  public url: any;
  public Duration: any = [];
  public Time_status = [];
  public selectedHours = [];
  public checkbox_checked : any = {};
  public DefaultValue: any;
  constructor(private fb: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private _fuseConfigService: FuseConfigService,
    private _meetingRoomService: MeetingRoomService,
    private _settingService: SettingsService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    if (this.route.routeConfig.path == 'book-room/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
    }
    this.stepNumber[0] = 2;
  }
  ngOnInit() {
    this._meetingRoomService.setEmptyListData();
    this.url = AppConfig.Settings.url.mediaUrl;
    this.setControls();
    this.checkbox_checked[100] = 'abc';
    // this._settingService.getFoodSetting({ meta_type: "food" }).then(res => {
    //   for (let item of res.data) {
    //     if (item.meta_key == 'Default_image') {
    //       this.default_img = item.meta_value;
    //     }
    //   }
    // });
    this.default_img = '/assets/images/backgrounds/maintenance-request.jpg';
    console.log(this.default_img);

    this._meetingRoomService.getRoomsContent(this.url_id).subscribe(response => {
      this.roomData = response.RoomsInfo;
    });
    
    this.date = new FormControl(new Date(), [Validators.required]);
    let selecteddate = moment(this.date.value).format('YYYY-MM-DD');

    this.DefaultValue = this._meetingRoomService.Getroomslistdata();
    console.log("DefaultValue", this.DefaultValue);
    if (this.DefaultValue.length > 0) {
      this.SetdefaultValue(this.DefaultValue);
    }
    // get the duration list 
    this._meetingRoomService.getDuration({ 'room_id': this.url_id, 'start_date': selecteddate }).subscribe(duration => {
      let durations = duration;
      if (durations && durations.status == 200) {
        this.Duration = duration;
        // get all the time slot list  
        this.Duration = Object.entries(this.Duration.Durationinfo).map(([type, value]) => ({ type, value }));
        this._meetingRoomService.getTimeSlot({ 'room_id': this.url_id, 'start_date': selecteddate }).then(Response => {
          this.timeSlot = Object.entries(Response.slotinfo).map(([type, value]) => ({ type, value }));
          this.timeSlot.forEach(element => {
            this.Time_status.push({ 'status': false });
          });
        });
      }

    })
  }

  SetdefaultValue(DefaultValue) {
    this.bookRoom.patchValue(DefaultValue[0]);
    this.date = new FormControl(new Date(DefaultValue[0].date));
    this.bookRoom.get('duration').setValue(DefaultValue[0].duration.duration);
    if (DefaultValue[0].duration[0] != undefined) {
      this.bookRoom.get('duration').setValue(DefaultValue[0].duration[0].duration);
      for (let i = 0; i < DefaultValue[0].duration.length; i++) {
        this.selectedHours.push({
          'duration': DefaultValue[0].duration[i].duration, 'id': DefaultValue[0].duration[i].id,
          'value': DefaultValue[0].duration[i].value, 'index': DefaultValue[0].duration[i].index
        });

      }
    }



  }


  setControls() {
    this.bookRoom = this.fb.group({
      step: this.fb.control('step2'),
      duration: this.fb.control('', [Validators.required]),
      attendees: this.fb.control('1', [Validators.required]),
    });
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
    this.selectedHours.forEach(item => {
      if (item.index - 1 >= 0) {
        this.Time_status[item.index - 1].status = false;
      }
      if (item.index == 0) {
        this.Time_status[item.index].status = false;
      }
      this.Time_status[item.index + 1].status = false;
    });
    // let tempArr: any = [];
    // this.selectedHours.forEach(item => {
    //   if (item.index - 1 >= 0) {
    //     this.Time_status[item.index - 1].status = false;
    //   }
    //   if (item.index == 0) {
    //     this.Time_status[item.index].status = false;
    //   }
    //   this.Time_status[item.index + 1].status = false;
    // });
    // if (!checked) {
    //   let len = this.Time_status.length;
    //   console.log("len", len);
    //   for (let i = 0; i < len; i = i + 1) {
    //     let k = 0;
    //     this.selectedHours.forEach(item => {
    //       if (item.index > indexs) {
    //         this.selectedHours.splice(k, 1);
    //       }
    //       k = k + 1;
    //     });
    //   }
    //   this.selectedHours.forEach(item => {
    //     if (item.index - 1 >= 0) {
    //       this.Time_status[item.index - 1].status = false;
    //     }
    //     if (item.index == 0) {
    //       this.Time_status[item.index].status = false;
    //     }
    //     this.Time_status[item.index + 1].status = false;
    //   });
    // }
    // console.log("tempArr", tempArr);
    // console.log("this.selectedHours", this.selectedHours);
    // console.log("this.Time_status", this.Time_status);



  }

  isChecked(key) {
    //  Stored  the selected data in array
    return this.selectedHours.some(item => item.id == key);

  }

  onSubmit() {
    let value = this.bookRoom.value;
    let allDuration
    for (let i = 0; i < this.Duration.length; i++) {
      if (this.Duration[i].type == value.duration) {
        allDuration = { 'duration': this.Duration[i].type, 'value': this.Duration[i].value }
      }
    }
    let formdata = {
      'id': this.url_id,
      'attendees': value.attendees,
      'date': moment(this.date.value).format('YYYY-MM-DD'),
      'duration': allDuration.duration != 'hour' ? allDuration : this.selectedHours
    }
    this._meetingRoomService.setMeetinglistdata(formdata);
    this.router.navigate(['room-setup']);
  }

  // on chnage  the date 
  OnDateChange() {
    //if (this.bookRoom.get('duration').value == 'hour') {
    let selecteddate = moment(this.date.value).format('YYYY-MM-DD');
    this._meetingRoomService.getDuration({ 'room_id': this.url_id, 'start_date': selecteddate }).subscribe(duration => {
      this.Duration = duration;
      let durations = duration;
      // get all the time slot list 
      this.Duration = Object.entries(this.Duration.Durationinfo).map(([type, value]) => ({ type, value }));
      if (this.Duration && durations.status == 200) {
        this._meetingRoomService.getTimeSlot({ 'room_id': this.url_id, 'start_date': selecteddate }).then(Response => {
          this.timeSlot = Object.entries(Response.slotinfo).map(([type, value]) => ({ type, value }));
          this.timeSlot.forEach(element => {
            this.Time_status.push({ 'status': false });
          });
        });
      }
    })
    // }
  }
  getTimeSlotsData(event) {
    this.timeSlot = [];
    if (event.value == 'hour') {
      let selecteddate = moment(this.date.value).format('YYYY-MM-DD');
      this._meetingRoomService.getTimeSlot({ 'room_id': this.url_id, 'start_date': selecteddate }).then(Response => {
        this.timeSlot = Object.entries(Response.slotinfo).map(([type, value]) => ({ type, value }));
        this.timeSlot.forEach(element => {
          this.Time_status.push({ 'status': false });
        });
      });
    }
  }
}
