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
import moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: fuseAnimations
})
export class ReportComponent implements OnInit {

  public generateReport: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public isSubmit: boolean = false;
  public todayDate: any;
  public start_date: any;
  public toDate: any;
  public reportData: any;
  public isReport: boolean = false;
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
    this.title = "Booking Report";
    this.buttonTitle = "Generate";   
  }

  ngOnInit(): void {
    this.setControls();
    this.todayDate = new Date();
    this.start_date = new Date();
    this.toDate = new Date();
    this.generateReport.get('date_from').setValue(this.todayDate);
    this.generateReport.get('date_to').setValue(this.todayDate);   
  }
  setControls() {
    this.generateReport = this.fb.group({
      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
    });
  }
  fromDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.toDate = new Date(fromDate);
    this.generateReport.get('date_to').setValue(this.toDate)
  }
  getReport() {
    let data = this.generateReport.value;
    let date_from = moment(data.date_from).format('YYYY-MM-DD');
    let date_to = moment(data.date_to).format('YYYY-MM-DD');
    this._guestroomService.getBookingReport(date_from,date_to).subscribe(response => {      
      this.reportData = response;
      this.isReport = true;
    });
  }
  print(){
    let params = [];
    let data = this.generateReport.value;
    let date_from = moment(data.date_from).format('YYYY-MM-DD');
    let date_to = moment(data.date_to).format('YYYY-MM-DD');
    let print = 1;
    params.push(
      {
        'print':'1'
      },
      {
        'date_from' : date_from
      },
      {
        'date_to' : date_to
      }
    );    
    this._guestroomService.getBookingReportPrint('guestroom/actions/reports',params)
  }

}
