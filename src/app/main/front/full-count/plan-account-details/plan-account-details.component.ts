import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CommonService, UsersService } from 'app/_services';
//import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel, DataSource, } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DiningReservationmodel } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-plan-account-details',
  templateUrl: './plan-account-details.component.html',
  styleUrls: ['./plan-account-details.component.scss'],
  animations: fuseAnimations
})
export class PlanAccountDetailsComponent implements OnInit {

  PaginationOpt: any = {};
  public displaySlug: string = 'PLAN ACCOUNT DETAILS';
  Columns: [];
  StatusList: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  fullcountform: FormGroup;
  displayedColumns: string[];
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  dataSource: FilesDataSource | null;
  public generalSettings: any = {};
  public homeSettings: any = {};
  selection = new SelectionModel<any>(true, []);
  public filterParams: any = {};
  public removeButton: boolean = true;
  public cancelflag: boolean = false;
  public parent: any;
  selectedentry_id: any;
  changeDetection: ChangeDetectionStrategy.Default;
  public statusLabel: any = [];

  public userSetting: any;
  public community_id: any;
  public accountlist: any = [];
  public dates = { '2021-01-01': 'January 01 - January 31', '2021-02-01': 'February 01 - February 28', '2021-03-01': 'March 01 - March 31', '2021-04-01': 'April 01 - April 30', '2021-05-01': 'May 01 - May 31', '2021-12-01': 'December 01 - December 31' };

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  private _unsubscribeAll: Subject<any>;
  changeDetector: any;

  /**
  * Constructor
  *
  * @param {FormBuilder} _formBuilder
  * @param {MatSnackBar} _matSnackBar
  */

  constructor(private route: ActivatedRoute, private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _commonService: CommonService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar) {
    this._unsubscribeAll = new Subject();
    // Configure the layout 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.userSetting = this._commonService.getLocalSettingsJson('users_settings');
    this.community_id = this.userSetting.fullcount_settings.community_id    
  }

  ngOnInit() {
    this.PaginationOpt = OptionsList.Options.tables.pagination.options;
    this.Columns = OptionsList.Options.tables.list.myplanaccount;
    this.displayedColumns = OptionsList.Options.tables.list.myplanaccount.map(col => col.columnDef);
    this.dataSource = new FilesDataSource(this._usersService, this.paginator, this.sort);

    // this._usersService.getLabels({'meta_key':'status_label'}).subscribe(response =>{
    //   this.statusLabel  = JSON.parse(response.settingsinfo.meta_value); 
    // });  

    this.fullcountform = this._formBuilder.group({
      searchKey: [''],
      date: ['']

    });
    this.resetPageIndex(); //#Reset PageIndex of form if search changes

    merge(this.sort.sortChange, this.fullcountform.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.selection.clear();
        let value = this.fullcountform.value;
        let acid = this.route.params['value'].acid;
        let cstid = this.route.params['value'].cstid;
        //this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.fullcountform.value);
        this.filterParams['cid'] = this.community_id;
        this.filterParams['cstid'] = cstid;
        this.filterParams['acid'] = acid;
        this.filterParams['date'] = value.date != '' ? value.date : '';
        this.filterParams['print'] = '0';
        this.dataSource.getFilteredBookings(this.filterParams);
      });
    setTimeout(() => {
      this.parent = this.fullcountform;
    });

    let cstid = this.route.params['value'].cstid;
    let acid = this.route.params['value'].acid;
    this._usersService.planAccountPeriods({ 'cid': this.community_id,'cstid': cstid,'acid':acid}).then(Response => {
      this.accountlist = Response;
      if(this.accountlist && this.accountlist.length>0){
        let selectedDate = this.accountlist[0]['startDate'] || '';
        this.fullcountform.get('date').setValue(selectedDate);
      }
    });
  }

  resetPageIndex() {
    this.fullcountform.valueChanges.subscribe(data => {
      //this.paginator.pageIndex = 0;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.data.forEach(row => {
        this.selection.select(row.id);
      });
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  getPrint() {
    let params = [];
    let value = this.fullcountform.value;
    let id = this.selection.selected.toString();
    //this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.fullcountform.value);
    //this.filterParams['column']     = 'booking_start_date';
    //params.push('filter params',this.filterParams);
    let acid = this.route.params['value'].acid;
    let cstid = this.route.params['value'].cstid;
    let todayDate: any;
    todayDate = new Date();
    let firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    todayDate = moment(firstDay).format('YYYY-MM-DD');
    params.push(
      {
        'print': '1'
      },
      {
        'cid': this.community_id
      },
      {
        'cstid': cstid
      },
      {
        'acid': acid
      },
      {
        'date': value.date != '' ? value.date : todayDate
      }

    );    
    this._usersService.getPrintChargeAccountEntries('fullcount/getplantransaction', params)
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}

export class FilesDataSource extends DataSource<any>
{
  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  /**
  * Constructor
  *
  * @param {UsersService} _usersService
  * @param {MatPaginator} _matPaginator
  * @param {MatSort} _matSort
  */
  constructor(
    private _usersService: UsersService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  ) {
    super();

    this.filteredData = this._usersService.bookingList;

  }

  /**
  * Connect function called by the table to retrieve one stream containing the data to render.
  *
  * @returns {Observable<DiningReservationmodel[]>}
  */
  connect(): Observable<DiningReservationmodel[]> {
    const displayDataChanges = [
      this._usersService.onBookingChanged

    ];
    
    return merge(...displayDataChanges)

      .pipe(

        map(() => {
          let data = this._usersService.bookingList;
          this.filteredData = data;
          data = this.filterData(data);
          return data;
        }
        ));
  }



  // Filtered data
  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  // Filter
  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }



  /**
  * Filter data
  *
  * @param data
  * @returns {any}
  */
  filterData(formdata): any {

    return formdata.data.map(c => new DiningReservationmodel().deserialize(c));

  }
  /**
  * Get Filtered Form
  * 
  */
  getFilteredBookings(params: any) {
    return this._usersService.getPalnAccountDetailsList(params).then(Response => {      
      return Response;
    });
  }
  /**
  * Disconnect
  */
  disconnect(): void {

  }

}
