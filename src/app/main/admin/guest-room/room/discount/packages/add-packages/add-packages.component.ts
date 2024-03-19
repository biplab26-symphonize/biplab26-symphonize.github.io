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
  selector: 'app-add-packages',
  templateUrl: './add-packages.component.html',
  styleUrls: ['./add-packages.component.scss'],
  animations: fuseAnimations
})
export class AddPackagesComponent implements OnInit {

  public addPackage: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public editPackage: boolean = false;
  public url_id: any;
  public isSubmit: boolean = false;
  public rooms: any = [];
  public days: any = [];
  public selectall: boolean;
  public todayDate: any;
  public start_date: any;
  public toDate: any;
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
    this.title = "Add Package";
    this.buttonTitle = "Save";
    if (this.route.routeConfig.path == 'admin/guest-room/package/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editPackage = true;
    }
  }

  ngOnInit(): void {
    this.days[0] = { 'key': 'sunday', 'value': 'Sunday' };
    this.days[1] = { 'key': 'monday', 'value': 'Monday' };
    this.days[2] = { 'key': 'tuesday', 'value': 'Tuesday' };
    this.days[3] = { 'key': 'wednesday', 'value': 'Wednesday' };
    this.days[4] = { 'key': 'thursday', 'value': 'Thursday' };
    this.days[5] = { 'key': 'friday', 'value': 'Friday' };
    this.days[6] = { 'key': 'saturday', 'value': 'Saturday' };
    
    this.setControls();
    this.todayDate = new Date();
    this.start_date = new Date();
    this.toDate = new Date();
    this.addPackage.get('date_from').setValue(this.todayDate);
    this.addPackage.get('date_to').setValue(this.todayDate);
    this._guestroomService.getRoomList({ 'status':'A', 'direction': 'asc', 'column': 'type' }).then(response => {
      this.rooms = response.data;           
    });
  }
  setControls() {
    this.addPackage = this.fb.group({
      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
      room_id: this.fb.control('', [Validators.required]),
      start_day: this.fb.control('', [Validators.required]),
      end_day: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required])
    });
    if (this.route.routeConfig.path == 'admin/guest-room/package/edit/:id') {
      this.fillRoomsValues();
    }
  }
  fromDate(event) {
    // let fromDate = moment(event.value).format('YYYY-MM-DD');
    // this.toDate = new Date(fromDate);
    this.toDate = event.value;
    this.addPackage.get('date_to').setValue(event.value)
  }
  fillRoomsValues() {
    this._guestroomService.getpackageContents(this.url_id).subscribe(response => {      
      let formData = response.packagesinfo;
       this.addPackage.patchValue(formData);
       this.addPackage.get('date_from').setValue(CommonUtils.getStringToDate(formData.date_from));
       this.addPackage.get('date_to').setValue(CommonUtils.getStringToDate(formData.date_to));
      //this.addPackage.patchValue({ rooms: editUnavaliableRooms });
    });
  }
  onSaveFieldClick() {
    if (this.addPackage.valid) {
      this.isSubmit = true;
      let data = this.addPackage.value;
      data.date_from = moment(data.date_from).format('YYYY-MM-DD');
      data.date_to = moment(data.date_to).format('YYYY-MM-DD');
      data['id'] = this.editPackage == true ? this.url_id : '',        
      this._guestroomService.addPackage(data, this.editPackage)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/guest-room/package/list']);

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
