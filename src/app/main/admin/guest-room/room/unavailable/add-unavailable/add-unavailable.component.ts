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
  selector: 'app-add-unavailable',
  templateUrl: './add-unavailable.component.html',
  styleUrls: ['./add-unavailable.component.scss'],
  animations: fuseAnimations
})
export class AddUnavailableComponent implements OnInit {
  public addUnavaliable: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public editUnavaliableData: boolean = false;
  public url_id: any;
  public isSubmit: boolean = false;
  public rooms: any = [];
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
    this.title = "Add Unavaliable";
    this.buttonTitle = "Save";
    if (this.route.routeConfig.path == 'admin/guest-room/unavailable/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editUnavaliableData = true;
    }
  }

  ngOnInit(): void {
    this.setControls();
    this.todayDate = new Date();
    this.start_date = new Date();
    this.toDate = new Date();
    this.addUnavaliable.get('date_from').setValue(this.todayDate);
    this.addUnavaliable.get('date_to').setValue(this.todayDate);
    this._guestroomService.getRoomList({ 'status':'A','direction': 'asc','column':'type' }).then(response => {
      console.log("response", response);
      let data = response.data;
      let i = 0;
      data.map((element, index) => {
        if (element.roomnumber.length > 0) {
          element.roomnumber.forEach(item => {
            item['room_type'] = element.type + ' - ' + item.number;
            item['room_type_id'] = element.id + '-' + item.number;
            this.rooms[i] = item;
            i = i + 1;
          });
        }
      });
      console.log("this.rooms", this.rooms);
    });
  }
  setControls() {
    this.addUnavaliable = this.fb.group({
      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
      rooms: this.fb.control('', [Validators.required])
    });
    if (this.route.routeConfig.path == 'admin/guest-room/unavailable/edit/:id') {
      this.fillRoomsValues();
    }
  }
  fromDate(event) {
    // let fromDate = moment(event.value).format('YYYY-MM-DD');
    // this.toDate = new Date(fromDate);
    this.toDate = event.value;
    this.addUnavaliable.get('date_to').setValue(event.value)
  }
  fillRoomsValues() {
    this._guestroomService.getUnavaliableContents(this.url_id).subscribe(response => {
      console.log("response", response);
      let formData = response.restrictioninfo;
      this.addUnavaliable.patchValue(formData);
      let i = 0;
      let editUnavaliableRooms: any = [];
      formData.roomsrestrictions.map((element, index) => {
        editUnavaliableRooms[i] = element.room_id + '-' + element.room_number;;
        i = i + 1;
      });
      console.log("editUnavaliableRooms", editUnavaliableRooms);
      this.addUnavaliable.patchValue({ rooms: editUnavaliableRooms });
      this.addUnavaliable.get('date_from').setValue(CommonUtils.getStringToDate(formData.date_from));
      this.addUnavaliable.get('date_to').setValue(CommonUtils.getStringToDate(formData.date_to));
    });
  }
  selectalllLayout() {
    let data
    if (this.selectall === false) {
      this.addUnavaliable.controls.rooms.patchValue([]);
      return;
    } else if (this.selectall === true) {
      this.addUnavaliable.controls.rooms.patchValue([...this.rooms.map(item => item.room_type_id)]);
    }
  }
  onSaveFieldClick() {
    if (this.addUnavaliable.valid) {
      this.isSubmit = true;
      let data = this.addUnavaliable.value;
      data.date_from = moment(data.date_from).format('YYYY-MM-DD');
      data.date_to = moment(data.date_to).format('YYYY-MM-DD');
      data['id'] = this.editUnavaliableData == true ? this.url_id : '',
        console.log("data", data);
      this._guestroomService.addUnavaliable(data, this.editUnavaliableData)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/guest-room/unavailable/list']);

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
