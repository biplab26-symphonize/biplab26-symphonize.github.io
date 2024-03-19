import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UsersService, OptionsList, GuestRoomService, CommonService, AuthService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from 'app/_helpers';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import moment from 'moment';

@Component({
  selector: 'app-add-free-night',
  templateUrl: './add-free-night.component.html',
  styleUrls: ['./add-free-night.component.scss'],
  animations: fuseAnimations
})
export class AddFreeNightComponent implements OnInit {

  public addFreeNight: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public editFreeNight: boolean = false;
  public url_id: any;
  public isSubmit: boolean = false;
  public rooms: any = [];
  public days: any = {'sunday':'Sunday','monday':'Monday','tuesday':'Tuesday','wednesday':'Wednesday','thursday':'Thursday','friday':'Friday','saturday':'Saturday'};
  public selectall: boolean;
  public todayDate: any;
  public start_date: any;
  public toDate: any;
  public maxNights = 100;
  public minNights: any
  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _guestroomService: GuestRoomService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _commonService: CommonService
  ) {
    this.title = "Add Free Night";
    this.buttonTitle = "Save";
    if (this.route.routeConfig.path == 'admin/guest-room/free-night/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editFreeNight = true;
    }
    this.url_id ? this.title = "Update Free Night" : this.title = "Add Free Night";
  }

  ngOnInit(): void {
    this.setControls();
    this.todayDate = new Date();
    this.start_date = new Date();
    this.toDate = new Date();
    this.addFreeNight.get('date_from').setValue(this.todayDate);
    this.addFreeNight.get('date_to').setValue(this.todayDate);
    this._guestroomService.getRoomList({ 'status':'A','direction': 'asc', 'column': 'type' }).then(response => {
      this.rooms = response.data;           
    });
  }
  setControls() {
    this.addFreeNight = this.fb.group({
      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
      room_id: this.fb.control('', [Validators.required]),
      min_length: this.fb.control('', [Validators.required]),
      max_length: this.fb.control('', [Validators.required]),
      free_nights: this.fb.control('', [Validators.required]),
    });
    if (this.route.routeConfig.path == 'admin/guest-room/free-night/edit/:id') {
      this.fillRoomsValues();
    }
  }
  fromDate(event) {
    // let fromDate = moment(event.value).format('YYYY-MM-DD');
    // this.toDate = new Date(fromDate);
    this.toDate = event.value;
    this.addFreeNight.get('date_to').setValue(event.value)
  }
  fillRoomsValues() {
    this._guestroomService.getFreeNightContents(this.url_id).subscribe(response => {      
      let formData = response.freenightsinfo;
       this.addFreeNight.patchValue(formData);
       this.addFreeNight.get('date_from').setValue(CommonUtils.getStringToDate(formData.date_from));
       this.addFreeNight.get('date_to').setValue(CommonUtils.getStringToDate(formData.date_to));
      //this.addFreeNight.patchValue({ rooms: editUnavaliableRooms });
    });
  }
  onSaveFieldClick() {
    if (this.addFreeNight.valid) {
      this.isSubmit = true;
      let data = this.addFreeNight.value;
      data.date_from = moment(data.date_from).format('YYYY-MM-DD');
      data.date_to = moment(data.date_to).format('YYYY-MM-DD');
      data['id'] = this.editFreeNight == true ? this.url_id : '',        
      this._guestroomService.addFreeNight(data, this.editFreeNight)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/guest-room/free-night/list']);
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

  
  checkMaxNights(event) {
    this.minNights = Number(event.target.value);
    let max = Number(this.addFreeNight.get('max_length').value);
    if(this.minNights > max){
      this.addFreeNight.get('min_length').setValue(max);
    }   
  }
  setReadonly(){
    return false;
  }
  checkMinNights(event) {
    this.maxNights = Number(event.target.value);
    let min = Number(this.addFreeNight.get('min_length').value);
    if(min > this.maxNights){
      this.addFreeNight.get('min_length').setValue(this.maxNights);
    }   
  }

}

