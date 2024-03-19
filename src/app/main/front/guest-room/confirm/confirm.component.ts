import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, SettingsService, OptionsList, GuestRoomService, UsersService } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntil, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import moment from 'moment';
import { element } from 'protractor';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  animations: fuseAnimations
})
export class ConfirmComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public reservation_id = '';
  constructor(
    private _userService: UsersService,
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
    this.reservation_id =  this.route.params['value'].id;
    //this.reservation_id = localStorage.getItem("reservation_id");
  }

  ngOnInit(): void {
    localStorage.removeItem("roomBookingArr");
    localStorage.removeItem("guest_room_booking");
    this._guestroomService.setEmptyListData();
    this.reservation_id =  this.route.params['value'].id;
  }
  gotoBack() {
    //localStorage.removeItem("reservation_id");
    this.router.navigate(['/guest-room']);
  }
  gotoHome() {
    this.router.navigate(['/guest-room']);
  }

}
