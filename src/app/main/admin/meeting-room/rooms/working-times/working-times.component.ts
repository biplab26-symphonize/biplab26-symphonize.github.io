import { NgModule, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonService, AppConfig, MeetingRoomService } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import moment from 'moment';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';

@Component({
  selector: 'app-working-times',
  templateUrl: './working-times.component.html',
  styleUrls: ['./working-times.component.scss'],
  animations: fuseAnimations
})
export class WorkingTimesComponent implements OnInit {
  public isTimeCheck = { 'monday': true, 'tuesday': true, 'wednesday': true, 'thursday': true, 'friday': true, 'saturday': true, 'sunday': true };
  public totalSpots: any;
  public startDay: any;
  public min_lunch_end_time: any;
  public chosenDate: Date;
  private version: any;
  public url_id: any;
  public editServiceData: boolean = false;
  public addServiceForm: FormGroup;
  public title: string = '';
  public days_status = { 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'saturday': false, 'sunday': false };

  day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  time = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'];


  selectedDate: any;
  public checkLength: any;
  public partySizeLength: any;
  public todayDate: any;
  constructor(private _meetingRoomService: MeetingRoomService, private _dialog: MatDialog, private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute, private _matSnackBar: MatSnackBar, private ref: ChangeDetectorRef, private _commonService: CommonService) {
    this.title = 'Update Working Time';
    if (this.route.routeConfig.path == 'admin/meeting-room/rooms/working-time/:room_id' && this.route.params['value'].room_id > 0) {
      this.url_id = this.route.params['value'].room_id;
      this.editServiceData = true;
    }
    this.url_id ? this.title = "Update Working TIme" : this.title = "Working Time";
    console.log("url_id",this.url_id);
  }
  ngOnInit() {
    this.setControls();
  }
  setControls() {
    this.addServiceForm = this.fb.group({
      room_id: this.editServiceData == true ? this.url_id : '',
      working_times: this.fb.group({
        monday_from: this.fb.control(''),
        tuesday_from: this.fb.control(''),
        wednesday_from: this.fb.control(''),
        thursday_from: this.fb.control(''),
        friday_from: this.fb.control(''),
        saturday_from: this.fb.control(''),
        sunday_from: this.fb.control(''),

        monday_to: this.fb.control(''),
        tuesday_to: this.fb.control(''),
        wednesday_to: this.fb.control(''),
        thursday_to: this.fb.control(''),
        friday_to: this.fb.control(''),
        saturday_to: this.fb.control(''),
        sunday_to: this.fb.control(''),

        monday_morning_from: this.fb.control(''),
        tuesday_morning_from: this.fb.control(''),
        wednesday_morning_from: this.fb.control(''),
        thursday_morning_from: this.fb.control(''),
        friday_morning_from: this.fb.control(''),
        saturday_morning_from: this.fb.control(''),
        sunday_morning_from: this.fb.control(''),

        monday_morning_to: this.fb.control(''),
        tuesday_morning_to: this.fb.control(''),
        wednesday_morning_to: this.fb.control(''),
        thursday_morning_to: this.fb.control(''),
        friday_morning_to: this.fb.control(''),
        saturday_morning_to: this.fb.control(''),
        sunday_morning_to: this.fb.control(''),

        monday_afternoon_from: this.fb.control(''),
        tuesday_afternoon_from: this.fb.control(''),
        wednesday_afternoon_from: this.fb.control(''),
        thursday_afternoon_from: this.fb.control(''),
        friday_afternoon_from: this.fb.control(''),
        saturday_afternoon_from: this.fb.control(''),
        sunday_afternoon_from: this.fb.control(''),

        monday_afternoon_to: this.fb.control(''),
        tuesday_afternoon_to: this.fb.control(''),
        wednesday_afternoon_to: this.fb.control(''),
        thursday_afternoon_to: this.fb.control(''),
        friday_afternoon_to: this.fb.control(''),
        saturday_afternoon_to: this.fb.control(''),
        sunday_afternoon_to: this.fb.control(''),
      }),
    });

    //this.addServiceForm.patchValue({recurringrepeat:'DAILY'});
    if (this.route.routeConfig.path == 'admin/meeting-room/rooms/working-time/:room_id') {
      this.fillBookingValues();
    }
  }
  fillBookingValues() {
    this._meetingRoomService.getRoomsContent(this.url_id).subscribe(response => {
      console.log("respones", response.RoomsInfo.workingtimes);
      let formData = response.RoomsInfo.workingtimes;
      // this.addServiceForm.patchValue(formData);
      if (formData != null) {
        this.isTimeCheck['monday'] = true;
        this.isTimeCheck['tuesday'] = true;
        this.isTimeCheck['wednesday'] = true;
        this.isTimeCheck['thursday'] = true;
        this.isTimeCheck['friday'] = true;
        this.isTimeCheck['saturday'] = true;
        this.isTimeCheck['sunday'] = true;

        let WorkingTimes = this.addServiceForm.get('working_times') as FormGroup;
        if (formData.monday_from != null) {
          this.days_status['monday'] = true;
          this.isTimeCheck['monday'] = false;
          let mondayFrom = new Date(moment(formData.monday_from, 'HH:mm:ss').toString());
          WorkingTimes.get('monday_from').setValue(mondayFrom);
          let mondayTo = new Date(moment(formData.monday_to, 'HH:mm:ss').toString());
          WorkingTimes.get('monday_to').setValue(mondayTo);
          let mondayMorningFrom = new Date(moment(formData.monday_morning_from, 'HH:mm:ss').toString());
          WorkingTimes.get('monday_morning_from').setValue(mondayMorningFrom);
          let mondayMorningTo = new Date(moment(formData.monday_morning_to, 'HH:mm:ss').toString());
          WorkingTimes.get('monday_morning_to').setValue(mondayMorningTo);
          let mondayAfternoonFrom = new Date(moment(formData.monday_afternoon_from, 'HH:mm:ss').toString());
          WorkingTimes.get('monday_afternoon_from').setValue(mondayAfternoonFrom);
          let mondayAfternoonTo = new Date(moment(formData.monday_afternoon_to, 'HH:mm:ss').toString());
          WorkingTimes.get('monday_afternoon_to').setValue(mondayAfternoonTo);
        }

        if (formData.tuesday_from != null) {
          this.days_status['tuesday'] = true;
          this.isTimeCheck['tuesday'] = false;
          let tuesdayFrom = new Date(moment(formData.tuesday_from, 'HH:mm:ss').toString());
          WorkingTimes.get('tuesday_from').setValue(tuesdayFrom);
          let tuesdayTo = new Date(moment(formData.tuesday_to, 'HH:mm:ss').toString());
          WorkingTimes.get('tuesday_to').setValue(tuesdayTo);
          let tuesdayMorningFrom = new Date(moment(formData.tuesday_morning_from, 'HH:mm:ss').toString());
          WorkingTimes.get('tuesday_morning_from').setValue(tuesdayMorningFrom);
          let tuesdayMorningTo = new Date(moment(formData.tuesday_morning_to, 'HH:mm:ss').toString());
          WorkingTimes.get('tuesday_morning_to').setValue(tuesdayMorningTo);
          let tuesdayAfternoonFrom = new Date(moment(formData.tuesday_afternoon_from, 'HH:mm:ss').toString());
          WorkingTimes.get('tuesday_afternoon_from').setValue(tuesdayAfternoonFrom);
          let tuesdayAfternoonTo = new Date(moment(formData.tuesday_afternoon_to, 'HH:mm:ss').toString());
          WorkingTimes.get('tuesday_afternoon_to').setValue(tuesdayAfternoonTo);
        }

        if (formData.wednesday_from != null) {
          this.days_status['wednesday'] = true;
          this.isTimeCheck['wednesday'] = false;
          let wednesdayFrom = new Date(moment(formData.wednesday_from, 'HH:mm:ss').toString());
          WorkingTimes.get('wednesday_from').setValue(wednesdayFrom);
          let wednesdayTo = new Date(moment(formData.wednesday_to, 'HH:mm:ss').toString());
          WorkingTimes.get('wednesday_to').setValue(wednesdayTo);
          let wednesdayMorningFrom = new Date(moment(formData.wednesday_morning_from, 'HH:mm:ss').toString());
          WorkingTimes.get('wednesday_morning_from').setValue(wednesdayMorningFrom);
          let wednesdayMorningTo = new Date(moment(formData.wednesday_morning_to, 'HH:mm:ss').toString());
          WorkingTimes.get('wednesday_morning_to').setValue(wednesdayMorningTo);
          let wednesdayAfternoonFrom = new Date(moment(formData.wednesday_afternoon_from, 'HH:mm:ss').toString());
          WorkingTimes.get('wednesday_afternoon_from').setValue(wednesdayAfternoonFrom);
          let wednesdayAfternoonTo = new Date(moment(formData.wednesday_afternoon_to, 'HH:mm:ss').toString());
          WorkingTimes.get('wednesday_afternoon_to').setValue(wednesdayAfternoonTo);
        }

        if (formData.thursday_from != null) {
          this.days_status['thursday'] = true;
          this.isTimeCheck['thursday'] = false;
          let thursdayFrom = new Date(moment(formData.thursday_from, 'HH:mm:ss').toString());
          WorkingTimes.get('thursday_from').setValue(thursdayFrom);
          let thursdayTo = new Date(moment(formData.thursday_to, 'HH:mm:ss').toString());
          WorkingTimes.get('thursday_to').setValue(thursdayTo);
          let thursdayMorningFrom = new Date(moment(formData.thursday_morning_from, 'HH:mm:ss').toString());
          WorkingTimes.get('thursday_morning_from').setValue(thursdayMorningFrom);
          let thursdayMorningTo = new Date(moment(formData.thursday_morning_to, 'HH:mm:ss').toString());
          WorkingTimes.get('thursday_morning_to').setValue(thursdayMorningTo);
          let thursdayAfternoonFrom = new Date(moment(formData.thursday_afternoon_from, 'HH:mm:ss').toString());
          WorkingTimes.get('thursday_afternoon_from').setValue(thursdayAfternoonFrom);
          let thursdayAfternoonTo = new Date(moment(formData.thursday_afternoon_to, 'HH:mm:ss').toString());
          WorkingTimes.get('thursday_afternoon_to').setValue(thursdayAfternoonTo);
        }

        if (formData.friday_from != null) {
          this.days_status['friday'] = true;
          this.isTimeCheck['friday'] = false;
          let fridayFrom = new Date(moment(formData.friday_from, 'HH:mm:ss').toString());
          WorkingTimes.get('friday_from').setValue(fridayFrom);
          let fridayTo = new Date(moment(formData.friday_to, 'HH:mm:ss').toString());
          WorkingTimes.get('friday_to').setValue(fridayTo);
          let fridayMorningFrom = new Date(moment(formData.friday_morning_from, 'HH:mm:ss').toString());
          WorkingTimes.get('friday_morning_from').setValue(fridayMorningFrom);
          let fridayMorningTo = new Date(moment(formData.friday_morning_to, 'HH:mm:ss').toString());
          WorkingTimes.get('friday_morning_to').setValue(fridayMorningTo);
          let fridayAfternoonFrom = new Date(moment(formData.friday_afternoon_from, 'HH:mm:ss').toString());
          WorkingTimes.get('friday_afternoon_from').setValue(fridayAfternoonFrom);
          let fridayAfternoonTo = new Date(moment(formData.friday_afternoon_to, 'HH:mm:ss').toString());
          WorkingTimes.get('friday_afternoon_to').setValue(fridayAfternoonTo);
        }

        if (formData.saturday_from != null) {
          this.days_status['saturday'] = true;
          this.isTimeCheck['saturday'] = false;
          let saturdayFrom = new Date(moment(formData.saturday_from, 'HH:mm:ss').toString());
          WorkingTimes.get('saturday_from').setValue(saturdayFrom);
          let saturdayTo = new Date(moment(formData.saturday_to, 'HH:mm:ss').toString());
          WorkingTimes.get('saturday_to').setValue(saturdayTo);
          let saturdayMorningFrom = new Date(moment(formData.saturday_morning_from, 'HH:mm:ss').toString());
          WorkingTimes.get('saturday_morning_from').setValue(saturdayMorningFrom);
          let saturdayMorningTo = new Date(moment(formData.saturday_morning_to, 'HH:mm:ss').toString());
          WorkingTimes.get('saturday_morning_to').setValue(saturdayMorningTo);
          let saturdayAfternoonFrom = new Date(moment(formData.saturday_afternoon_from, 'HH:mm:ss').toString());
          WorkingTimes.get('saturday_afternoon_from').setValue(saturdayAfternoonFrom);
          let saturdayAfternoonTo = new Date(moment(formData.saturday_afternoon_to, 'HH:mm:ss').toString());
          WorkingTimes.get('saturday_afternoon_to').setValue(saturdayAfternoonTo);
        }

        if (formData.sunday_from != null) {
          this.days_status['sunday'] = true;
          this.isTimeCheck['sunday'] = false;
          let sundayFrom = new Date(moment(formData.sunday_from, 'HH:mm:ss').toString());
          WorkingTimes.get('sunday_from').setValue(sundayFrom);
          let sundayTo = new Date(moment(formData.sunday_to, 'HH:mm:ss').toString());
          WorkingTimes.get('sunday_to').setValue(sundayTo);
          let sundayMorningFrom = new Date(moment(formData.sunday_morning_from, 'HH:mm:ss').toString());
          WorkingTimes.get('sunday_morning_from').setValue(sundayMorningFrom);
          let sundayMorningTo = new Date(moment(formData.sunday_morning_to, 'HH:mm:ss').toString());
          WorkingTimes.get('sunday_morning_to').setValue(sundayMorningTo);
          let sundayAfternoonFrom = new Date(moment(formData.sunday_afternoon_from, 'HH:mm:ss').toString());
          WorkingTimes.get('sunday_afternoon_from').setValue(sundayAfternoonFrom);
          let sundayAfternoonTo = new Date(moment(formData.sunday_afternoon_to, 'HH:mm:ss').toString());
          WorkingTimes.get('sunday_afternoon_to').setValue(sundayAfternoonTo);
        }
      }

    });
  }

  onCheckboxChange(event, day) {
    let day_from = day + "_from";
    let day_to = day + "_to";
    let day_morning_from = day + "_morning_from";
    let day_morning_to = day + "_morning_to";
    let day_afternoon_from = day + "_afternoon_from";
    let day_afternoon_to = day + "_afternoon_to";
    let WorkingTimes = this.addServiceForm.get('working_times') as FormGroup;

    if (event.checked) {
      this.days_status[day] = false;
      WorkingTimes.get(day_from).setValue('');
      WorkingTimes.get(day_to).setValue('');
      WorkingTimes.get(day_morning_from).setValue('');
      WorkingTimes.get(day_morning_to).setValue('');
      WorkingTimes.get(day_afternoon_from).setValue('');
      WorkingTimes.get(day_afternoon_to).setValue('');
    } else {
      this.days_status[day] = true;
    }

  }
  onSubmit() {
    let diningData = this.addServiceForm.value;
    console.log("form working time", diningData);
    const composedData = this.getComposeDiningData(diningData);
    this._meetingRoomService.updateWorkingTime(composedData, this.editServiceData).subscribe(response => {
      this._matSnackBar.open(response.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.router.navigate(['/admin/meeting-room/rooms/list']);
    },
      error => {
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }
  getComposeDiningData(data: any) {
    let composedData = data;
    data.working_times = typeof data.working_times === 'string' ? JSON.parse(data.working_times) : data.working_times;
    if (data.working_times.monday_from == '') {
      composedData.working_times.monday_from = null;
    } else {
      composedData.working_times.monday_from = moment(data.working_times.monday_from).format('HH:mm:ss');
    }
    if (data.working_times.monday_to == '') {
      composedData.working_times.monday_to = null;
    } else {
      composedData.working_times.monday_to = moment(data.working_times.monday_to).format('HH:mm:ss');
    }
    if (data.working_times.monday_morning_from == '') {
      composedData.working_times.monday_morning_from = null;
    } else {
      composedData.working_times.monday_morning_from = moment(data.working_times.monday_morning_from).format('HH:mm:ss');
    }
    if (data.working_times.monday_morning_to == '') {
      composedData.working_times.monday_morning_to = null;
    } else {
      composedData.working_times.monday_morning_to = moment(data.working_times.monday_morning_to).format('HH:mm:ss');
    }
    if (data.working_times.monday_afternoon_from == '') {
      composedData.working_times.monday_afternoon_from = null;
    } else {
      composedData.working_times.monday_afternoon_from = moment(data.working_times.monday_afternoon_from).format('HH:mm:ss');
    }
    if (data.working_times.monday_afternoon_to == '') {
      composedData.working_times.monday_afternoon_to = null;
    } else {
      composedData.working_times.monday_afternoon_to = moment(data.working_times.monday_afternoon_to).format('HH:mm:ss');
    }

    if (data.working_times.tuesday_from == '') {
      composedData.working_times.tuesday_from = null;
    } else {
      composedData.working_times.tuesday_from = moment(data.working_times.tuesday_from).format('HH:mm:ss');
    }
    if (data.working_times.tuesday_to == '') {
      composedData.working_times.tuesday_to = null;
    } else {
      composedData.working_times.tuesday_to = moment(data.working_times.tuesday_to).format('HH:mm:ss');
    }
    if (data.working_times.tuesday_morning_from == '') {
      composedData.working_times.tuesday_morning_from = null;
    } else {
      composedData.working_times.tuesday_morning_from = moment(data.working_times.tuesday_morning_from).format('HH:mm:ss');
    }
    if (data.working_times.tuesday_morning_to == '') {
      composedData.working_times.tuesday_morning_to = null;
    } else {
      composedData.working_times.tuesday_morning_to = moment(data.working_times.tuesday_morning_to).format('HH:mm:ss');
    }
    if (data.working_times.tuesday_afternoon_from == '') {
      composedData.working_times.tuesday_afternoon_from = null;
    } else {
      composedData.working_times.tuesday_afternoon_from = moment(data.working_times.tuesday_afternoon_from).format('HH:mm:ss');
    }
    if (data.working_times.tuesday_afternoon_to == '') {
      composedData.working_times.tuesday_afternoon_to = null;
    } else {
      composedData.working_times.tuesday_afternoon_to = moment(data.working_times.tuesday_afternoon_to).format('HH:mm:ss');
    }

    if (data.working_times.wednesday_from == '') {
      composedData.working_times.wednesday_from = null;
    } else {
      composedData.working_times.wednesday_from = moment(data.working_times.wednesday_from).format('HH:mm:ss');
    }
    if (data.working_times.wednesday_to == '') {
      composedData.working_times.wednesday_to = null;
    } else {
      composedData.working_times.wednesday_to = moment(data.working_times.wednesday_to).format('HH:mm:ss');
    }
    if (data.working_times.wednesday_morning_from == '') {
      composedData.working_times.wednesday_morning_from = null;
    } else {
      composedData.working_times.wednesday_morning_from = moment(data.working_times.wednesday_morning_from).format('HH:mm:ss');
    }
    if (data.working_times.wednesday_morning_to == '') {
      composedData.working_times.wednesday_morning_to = null;
    } else {
      composedData.working_times.wednesday_morning_to = moment(data.working_times.wednesday_morning_to).format('HH:mm:ss');
    }
    if (data.working_times.wednesday_afternoon_from == '') {
      composedData.working_times.wednesday_afternoon_from = null;
    } else {
      composedData.working_times.wednesday_afternoon_from = moment(data.working_times.wednesday_afternoon_from).format('HH:mm:ss');
    }
    if (data.working_times.wednesday_afternoon_to == '') {
      composedData.working_times.wednesday_afternoon_to = null;
    } else {
      composedData.working_times.wednesday_afternoon_to = moment(data.working_times.wednesday_afternoon_to).format('HH:mm:ss');
    }

    if (data.working_times.thursday_from == '') {
      composedData.working_times.thursday_from = null;
    } else {
      composedData.working_times.thursday_from = moment(data.working_times.thursday_from).format('HH:mm:ss');
    }
    if (data.working_times.thursday_to == '') {
      composedData.working_times.thursday_to = null;
    } else {
      composedData.working_times.thursday_to = moment(data.working_times.thursday_to).format('HH:mm:ss');
    }
    if (data.working_times.thursday_morning_from == '') {
      composedData.working_times.thursday_morning_from = null;
    } else {
      composedData.working_times.thursday_morning_from = moment(data.working_times.thursday_morning_from).format('HH:mm:ss');
    }
    if (data.working_times.thursday_morning_to == '') {
      composedData.working_times.thursday_morning_to = null;
    } else {
      composedData.working_times.thursday_morning_to = moment(data.working_times.thursday_morning_to).format('HH:mm:ss');
    }
    if (data.working_times.thursday_afternoon_from == '') {
      composedData.working_times.thursday_afternoon_from = null;
    } else {
      composedData.working_times.thursday_afternoon_from = moment(data.working_times.thursday_afternoon_from).format('HH:mm:ss');
    }
    if (data.working_times.thursday_afternoon_to == '') {
      composedData.working_times.thursday_afternoon_to = null;
    } else {
      composedData.working_times.thursday_afternoon_to = moment(data.working_times.thursday_afternoon_to).format('HH:mm:ss');
    }

    if (data.working_times.friday_from == '') {
      composedData.working_times.friday_from = null;
    } else {
      composedData.working_times.friday_from = moment(data.working_times.friday_from).format('HH:mm:ss');
    }
    if (data.working_times.friday_to == '') {
      composedData.working_times.friday_to = null;
    } else {
      composedData.working_times.friday_to = moment(data.working_times.friday_to).format('HH:mm:ss');
    }
    if (data.working_times.friday_morning_from == '') {
      composedData.working_times.friday_morning_from = null;
    } else {
      composedData.working_times.friday_morning_from = moment(data.working_times.friday_morning_from).format('HH:mm:ss');
    }
    if (data.working_times.friday_morning_to == '') {
      composedData.working_times.friday_morning_to = null;
    } else {
      composedData.working_times.friday_morning_to = moment(data.working_times.friday_morning_to).format('HH:mm:ss');
    }
    if (data.working_times.friday_afternoon_from == '') {
      composedData.working_times.friday_afternoon_from = null;
    } else {
      composedData.working_times.friday_afternoon_from = moment(data.working_times.friday_afternoon_from).format('HH:mm:ss');
    }
    if (data.working_times.friday_afternoon_to == '') {
      composedData.working_times.friday_afternoon_to = null;
    } else {
      composedData.working_times.friday_afternoon_to = moment(data.working_times.friday_afternoon_to).format('HH:mm:ss');
    }

    if (data.working_times.saturday_from == '') {
      composedData.working_times.saturday_from = null;
    } else {
      composedData.working_times.saturday_from = moment(data.working_times.saturday_from).format('HH:mm:ss');
    }
    if (data.working_times.saturday_to == '') {
      composedData.working_times.saturday_to = null;
    } else {
      composedData.working_times.saturday_to = moment(data.working_times.saturday_to).format('HH:mm:ss');
    }
    if (data.working_times.saturday_morning_from == '') {
      composedData.working_times.saturday_morning_from = null;
    } else {
      composedData.working_times.saturday_morning_from = moment(data.working_times.saturday_morning_from).format('HH:mm:ss');
    }
    if (data.working_times.saturday_morning_to == '') {
      composedData.working_times.saturday_morning_to = null;
    } else {
      composedData.working_times.saturday_morning_to = moment(data.working_times.saturday_morning_to).format('HH:mm:ss');
    }
    if (data.working_times.saturday_afternoon_from == '') {
      composedData.working_times.saturday_afternoon_from = null;
    } else {
      composedData.working_times.saturday_afternoon_from = moment(data.working_times.saturday_afternoon_from).format('HH:mm:ss');
    }
    if (data.working_times.saturday_afternoon_to == '') {
      composedData.working_times.saturday_afternoon_to = null;
    } else {
      composedData.working_times.saturday_afternoon_to = moment(data.working_times.saturday_afternoon_to).format('HH:mm:ss');
    }

    if (data.working_times.sunday_from == '') {
      composedData.working_times.sunday_from = null;
    } else {
      composedData.working_times.sunday_from = moment(data.working_times.sunday_from).format('HH:mm:ss');
    }
    if (data.working_times.sunday_to == '') {
      composedData.working_times.sunday_to = null;
    } else {
      composedData.working_times.sunday_to = moment(data.working_times.sunday_to).format('HH:mm:ss');
    }
    if (data.working_times.sunday_morning_from == '') {
      composedData.working_times.sunday_morning_from = null;
    } else {
      composedData.working_times.sunday_morning_from = moment(data.working_times.sunday_morning_from).format('HH:mm:ss');
    }
    if (data.working_times.sunday_morning_to == '') {
      composedData.working_times.sunday_morning_to = null;
    } else {
      composedData.working_times.sunday_morning_to = moment(data.working_times.sunday_morning_to).format('HH:mm:ss');
    }
    if (data.working_times.sunday_afternoon_from == '') {
      composedData.working_times.sunday_afternoon_from = null;
    } else {
      composedData.working_times.sunday_afternoon_from = moment(data.working_times.sunday_afternoon_from).format('HH:mm:ss');
    }
    if (data.working_times.sunday_afternoon_to == '') {
      composedData.working_times.sunday_afternoon_to = null;
    } else {
      composedData.working_times.sunday_afternoon_to = moment(data.working_times.sunday_afternoon_to).format('HH:mm:ss');
    }
    composedData.working_times = JSON.stringify(data.working_times);
    return composedData;
  }

}
