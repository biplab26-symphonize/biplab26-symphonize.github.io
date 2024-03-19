import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CommonService, FoodReservationService, AppConfig } from 'app/_services';
//import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel, DataSource, } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { DiningReservationmodel } from 'app/_models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss'],
  animations: fuseAnimations
})
export class MyOrderComponent implements OnInit {
  PaginationOpt: any = {};
  Columns: [];
  StatusList: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  diningForm: FormGroup;
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
  appConfig : any;
  public title : string = '';
  public pastEntry : boolean  = false;

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
constructor(private _fuseConfigService: FuseConfigService,
  private _formBuilder: FormBuilder,
  private _foodReservationService: FoodReservationService,
  private _commonService: CommonService,
  public _matDialog: MatDialog,
  private _matSnackBar: MatSnackBar,private route : ActivatedRoute,) {
  this._unsubscribeAll = new Subject();
  
  // Configure the layout 
  this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  //Deault DateTime Formats
  this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  this.appConfig      = AppConfig.Settings;
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      if(this.route.routeConfig.path=="my-order-past-entry")
      {         
          this.title = "Past Entry"
          this.pastEntry = true;
          this.removeButton = false;
      }
      else
      {
          this.title = "Order List"
      }
}
ngOnInit() {
  this.PaginationOpt = OptionsList.Options.tables.pagination.options;
  this.Columns = OptionsList.Options.tables.list.myorder;
  this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
  this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
  this.displayedColumns = OptionsList.Options.tables.list.myorder.map(col => col.columnDef);
  this.dataSource = new FilesDataSource(this._foodReservationService, this.paginator, this.sort);


  this.diningForm = this._formBuilder.group({
    searchKey: [''],
    status: [''],
    service_id: [''],
    from_date: [''],
    to_date: [''],
    current: ['']

  });
  this.resetPageIndex(); //#Reset PageIndex of form if search changes

  merge(this.sort.sortChange, this.paginator.page, this.diningForm.valueChanges)
    .pipe(
      takeUntil(this._unsubscribeAll),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(res => {
      this.selection.clear();
      this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.diningForm.value);
      this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
      this.filterParams['column'] = 'booking_start_date';
      // this.filterParams['direction'] = '';
      this.pastEntry==true? this.filterParams['current'] = 1 : '';
      this.dataSource.getFilteredOrder(this.filterParams);

    });
  setTimeout(() => {
    this.parent = this.diningForm;
  });
}
resetPageIndex() {
  this.diningForm.valueChanges.subscribe(data => {
    this.paginator.pageIndex = 0;
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

// for print the data
getPrint() {
  let params = [];

  let id = this.selection.selected.toString();

  this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.diningForm.value);
  this.filterParams['column'] = 'booking_start_date';
  //params.push('filter params',this.filterParams);
  params.push(
    {
      'print': '1'
    },
    {
      'user_id': JSON.parse(localStorage.getItem('token')).user_id
    },
    {
      'direction': 'desc'
    },
    {
      'column': 'booking_start_date'
    }

  );  
  this._foodReservationService.getPrintDiningBookingEntries('foodreservation/list/foodorder', params)
}





// cancal button method 

cancelAll(id) {
  let statusData: any = [];
  statusData =
  {
    'id': [id],
    'status': 'cancelled'
  }

  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
  });

  this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to cancel selected entry?';
  this.confirmDialogRef.afterClosed()
    .subscribe(result => {
      if (result) {

        this._foodReservationService.updateBookingStatus(statusData).subscribe(response => {

          this.selection.clear();
          this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.diningForm.value);
          this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
          this.filterParams['column'] = 'booking_start_date';
          this.dataSource.getFilteredOrder(this.filterParams);
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
        })

      }
    })
}


deleteAll() {

  let deleteData: any = [];
  deleteData =
  {
    'id': this.selection.selected,
  }
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
  });

  this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected entry?';
  this.confirmDialogRef.afterClosed()
    .subscribe(result => {
      if (result) {
        //actions/clearallentries
        let deleteUrl = 'foodreservation/update/foodorderclearstatus';
        this._foodReservationService.clearBooking(deleteUrl, deleteData)
          .subscribe(deleteResponse => {
            // Show the success message
            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.diningForm.value);
            this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
            this.filterParams['column'] = 'booking_start_date';
            this.filterParams['front'] = 1;
            this.dataSource.getFilteredOrder(this.filterParams);
            this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
              verticalPosition: 'top',
              duration: 2000
            });
          },
            error => {
              // Show the error message
              this._matSnackBar.open(error.message, 'Retry', {
                verticalPosition: 'top',
                duration: 2000
              });
            });
      }
    })
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
  * @param {DiningReservationService} _foodReservationService
  * @param {MatPaginator} _matPaginator
  * @param {MatSort} _matSort
  */
  constructor(
    private _foodReservationService: FoodReservationService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  ) {
    super();

    this.filteredData = this._foodReservationService.locationList;

  }

  /**
  * Connect function called by the table to retrieve one stream containing the data to render.
  *
  * @returns {Observable<DiningReservationmodel[]>}
  */
  connect(): Observable<DiningReservationmodel[]> {
    const displayDataChanges = [
      this._foodReservationService.onLocationChanged

    ];
    
    return merge(...displayDataChanges)

      .pipe(

        map(() => {
          let data = this._foodReservationService.locationList;
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
  getFilteredOrder(params: any) {
    return this._foodReservationService.getBookingList(params).then(Response => {
      return Response;

    });
  }
  /**
  * Disconnect
  */
  disconnect(): void {

  }

}