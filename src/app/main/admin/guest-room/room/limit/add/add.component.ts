import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { GuestRoomService } from 'app/_services';
import { UsersService } from 'app/_services/users.service';
import moment from 'moment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit {

  public addlimitForm: any = FormGroup
  url_id: any;
  editBookingData: boolean = false;
  title: any
  allrooms: any = []
  public startdate: any;
  public enddate: any;
  public isSubmit: boolean = false;
  editExtrasData: boolean = false;
  currentdate = new Date();


  public AllDays: any = [];
  public maxNights = 100;
  public minNights: any
  constructor(
    private fb: FormBuilder,
    private _userService: UsersService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _guest_service: GuestRoomService,
  ) {


    if (this.route.routeConfig.path == 'admin/guest-room/room/limit/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editExtrasData = true;
    }
    this.url_id ? this.title = "Update limit" : this.title = "New  limit";
  }

  ngOnInit(): void {
    this.AllDays[0] = { 'key': 'all', 'value': 'Any Day' };
    this.AllDays[1] = { 'key': 'sunday', 'value': 'Sunday' };
    this.AllDays[2] = { 'key': 'monday', 'value': 'Monday' };
    this.AllDays[3] = { 'key': 'tuesday', 'value': 'Tuesday' };
    this.AllDays[4] = { 'key': 'wednesday', 'value': 'Wednesday' };
    this.AllDays[5] = { 'key': 'thursday', 'value': 'Thursday' };
    this.AllDays[6] = { 'key': 'friday', 'value': 'Friday' };
    this.AllDays[7] = { 'key': 'saturday', 'value': 'Saturday' };
    this.setControls();

  }

  // set the default cotntrol to the user 
  setControls() {
    this.addlimitForm = this.fb.group({

      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
      room_id: this.fb.control('', [Validators.required]),
      min_nights: this.fb.control('', [Validators.required]),
      max_nights: this.fb.control('', [Validators.required]),
      start_on: this.fb.control('', [Validators.required]),

    });

    this._guest_service.getRoomList({ 'status':'A', 'diection': 'asc', 'trash': '', 'column': 'type' }).then(res => {
      console.log(res);
      this.allrooms = res.data;
    })

    if (this.route.routeConfig.path == 'admin/guest-room/room/limit/edit/:id') {
      this.filllimitrsValues();
    }
  }
  checkMinNights(event) {
    this.maxNights = Number(event.target.value);
    let min = Number(this.addlimitForm.get('min_nights').value);
    if(min > this.maxNights){
      this.addlimitForm.get('min_nights').setValue(this.maxNights);
    }   
  }
  checkMaxNights(event) {
    this.minNights = Number(event.target.value);
    let max = Number(this.addlimitForm.get('max_nights').value);
    if(this.minNights > max){
      this.addlimitForm.get('min_nights').setValue(max);
    }   
  }
  filllimitrsValues() {
    this._guest_service.getlimitsContents(this.url_id).subscribe(response => {
      console.log("response", response);
      let formData = response.limitsinfo;
      this.maxNights =Number(formData.max_nights);
      this.addlimitForm.patchValue(formData);
      this.addlimitForm.get('date_from').setValue(CommonUtils.getStringToDate(formData.date_from));
      this.addlimitForm.get('date_to').setValue(CommonUtils.getStringToDate(formData.date_to));
    });
  }

  // compare the min max date  
  fromDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.startdate = event.value;
  }

  toDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.enddate = event.value;
  }

  onSaveFieldClick() {
    if (this.addlimitForm.valid) {
      this.isSubmit = true;
      let value = this.addlimitForm.value;
      let formData = {
        date_from: moment(value.date_from).format('YYYY-MM-DD'),
        date_to: moment(value.date_to).format('YYYY-MM-DD'),
        room_id: value.room_id,
        min_nights: value.min_nights,
        max_nights: value.max_nights,
        start_on: value.start_on,
        'id': this.editExtrasData == true ? this.url_id : '',
      }
      if (this.addlimitForm.valid) {
        this._guest_service.addlimit(formData, this.editExtrasData)
          .subscribe(response => {
            this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration: 2000
            });
            this.router.navigate(['/admin/guest-room/room/limit/lists']);

          },
            error => {
              // Show the error message
              this._matSnackBar.open(error.message, 'Retry', {
                verticalPosition: 'top',
                duration: 2000
              });
            });
      }
    }
  }

}
