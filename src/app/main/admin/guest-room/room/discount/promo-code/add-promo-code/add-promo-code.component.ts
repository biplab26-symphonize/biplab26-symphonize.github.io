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
  selector: 'app-add-promo-code',
  templateUrl: './add-promo-code.component.html',
  styleUrls: ['./add-promo-code.component.scss'],
  animations: fuseAnimations
})
export class AddPromoCodeComponent implements OnInit {

  public addPromoCode: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public editPromoCode: boolean = false;
  public url_id: any;
  public isSubmit: boolean = false;
  public rooms: any = [];
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
    this.title = "Add Promo Code";
    this.buttonTitle = "Save";
    if (this.route.routeConfig.path == 'admin/guest-room/promo-code/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editPromoCode = true;
    }
    this.url_id ? this.title = "Update Promo Code" : this.title = "Add Promo Code";
  }

  ngOnInit(): void {
    this.setControls();
    this.todayDate = new Date();
    this.start_date = new Date();
    this.toDate = new Date();
    this.addPromoCode.get('date_from').setValue(this.todayDate);
    this.addPromoCode.get('date_to').setValue(this.todayDate);
    this._guestroomService.getRoomList({ 'status': 'A', 'direction': 'asc', 'column': 'type' }).then(response => {
      this.rooms = response.data;
      console.log("this.rooms", this.rooms);
    });
  }
  setControls() {
    this.addPromoCode = this.fb.group({
      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
      room_id: this.fb.control('', [Validators.required]),
      promo_code: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      discount_type: this.fb.control('', [Validators.required]),
    });
    if (this.route.routeConfig.path == 'admin/guest-room/promo-code/edit/:id') {
      this.fillRoomsValues();
    }
  }
  fromDate(event) {
    // let fromDate = moment(event.value).format('YYYY-MM-DD');
    // this.toDate = new Date(fromDate);
    this.toDate = event.value;
    this.addPromoCode.get('date_to').setValue(event.value)
  }
  fillRoomsValues() {
    this._guestroomService.getPromoCodeContents(this.url_id).subscribe(response => {
      console.log("response", response);
      let formData = response.promocodesinfo;
      this.addPromoCode.patchValue(formData);
      this.addPromoCode.get('date_from').setValue(CommonUtils.getStringToDate(formData.date_from));
       this.addPromoCode.get('date_to').setValue(CommonUtils.getStringToDate(formData.date_to));
      //this.addPromoCode.patchValue({ rooms: editUnavaliableRooms });
    });
  }
  onSaveFieldClick() {
    if (this.addPromoCode.valid) {
      this.isSubmit = true;
      let data = this.addPromoCode.value;
      data.date_from = moment(data.date_from).format('YYYY-MM-DD');
      data.date_to = moment(data.date_to).format('YYYY-MM-DD');
      data['id'] = this.editPromoCode == true ? this.url_id : '',
        console.log("data", data);
      this._guestroomService.addPromoCode(data, this.editPromoCode)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          if (response.status == 200) {
            this.router.navigate(['/admin/guest-room/promo-code/list']);
          }
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
  setReadonly() {
    return false;
  }

}
