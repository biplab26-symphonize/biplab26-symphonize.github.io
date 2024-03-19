import {  Component, OnInit, ViewChild, ElementRef,ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CommonService, TabelReservationService, SettingsService } from 'app/_services';
//import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel, DataSource, } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {  DiningReservationmodel } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';
import moment from 'moment-timezone';

@Component({
  selector: 'app-myreservations',
  templateUrl: './myreservations.component.html',
  styleUrls: ['./myreservations.component.scss'],
  animations : fuseAnimations
})
export class MyreservationsComponent implements OnInit {
  
  PaginationOpt           : any = {};
  Columns                 : []; 
  StatusList              : any;
  confirmDialogRef        : MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  reservationForm         : FormGroup;
  displayedColumns        : string[];
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  dataSource              : FilesDataSource | null;
  public generalSettings  : any = {};
  public homeSettings     : any = {};
  selection               = new SelectionModel<any>(true,[]);
  public filterParams     : any = {};
  public removeButton     : boolean = true;
  public cancelflag       : boolean = false;
  public parent           : any;
  selectedentry_id        : any;
  changeDetection         : ChangeDetectionStrategy.Default;
  public statusName       :  any =[];
  public currentTime    : string = '';

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  @ViewChild('filter', {static: true})
  filter: ElementRef;

  private _unsubscribeAll: Subject<any>;
  changeDetector: any;

   /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar
   */

  constructor(private _fuseConfigService    : FuseConfigService,
    private _formBuilder          : FormBuilder,
    private _tableService         : TabelReservationService,
    private _settingservice       : SettingsService,
    private _commonService        : CommonService,
    public _matDialog             : MatDialog,
    private _matSnackBar          : MatSnackBar) {
      this._unsubscribeAll = new Subject();
      // Configure the layout 
      this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
      //Deault DateTime Formats
      this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    }

  ngOnInit() {

      this.currentTime      =  moment().tz(this.generalSettings.APP_TIMEZONE || "America/New_York").format('HH:mm:ssa dddd, MMMM DD,YYYY');
      this.PaginationOpt    = OptionsList.Options.tables.pagination.options; 
      this.Columns          = OptionsList.Options.tables.list.myappointments;
      this.homeSettings     = this._commonService.getLocalSettingsJson('home_settings');
      this.generalSettings  = this._commonService.getLocalSettingsJson('general_settings');
      this.displayedColumns = OptionsList.Options.tables.list.myappointments.map(col => col.columnDef);
      this.dataSource       = new FilesDataSource(this._tableService, this.paginator, this.sort);
      this._settingservice.getTableReservaitionSetting({meta_type : "table"}).then(response =>{
        for(let data of response.data)
        {
          if(data.meta_key == 'status_label'){
            this.statusName  = JSON.parse(data.meta_value);
          }   
        }
      })
      

      this.reservationForm = this._formBuilder.group({
          searchKey   : [''],
          status      : [''],
          service_id  : [''],
          from_date   : [''],
          to_date     : ['']   
        
      });
      this.resetPageIndex(); //#Reset PageIndex of form if search changes
      
      merge(this.sort.sortChange, this.paginator.page,this.reservationForm.valueChanges)
      .pipe(
          takeUntil(this._unsubscribeAll),
          debounceTime(500),
          distinctUntilChanged()
      )
      .subscribe(res=>{
        this.selection.clear();
        this.filterParams               = CommonUtils.getFilterJson(this.sort,this.paginator,this.reservationForm.value);
        this.filterParams['user_id']    = JSON.parse(localStorage.getItem('token')).user_id;
        this.filterParams['column']     = 'booking_start_date';
        this.filterParams['front']      = 1;
        this.dataSource.getFilteredBookings(this.filterParams);
            
    });
    setTimeout(() => {
      this.parent  = this.reservationForm;
    });
  }


  resetPageIndex(){
    this.reservationForm.valueChanges.subscribe(data=>{
        this.paginator.pageIndex = 0;
    });
  }

  isAllSelected() {
    const numSelected   = this.selection.selected.length;
    const numRows       = this.dataSource.filteredData.data.length; 
    return numSelected === numRows; 
  }

  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.filteredData.data.forEach(row => 
    {
      this.selection.select(row.id);
    });
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }

  // for print the data
  getPrint(){
    let params = [];

    let id =this.selection.selected.toString();
    
    this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.reservationForm.value);
    params.push('filter params',this.filterParams);
    this.filterParams['column']     = 'booking_start_date';
    //params.push('filter params',this.filterParams);
    params.push(
      {
        'print':'1'
      },
      {
        'user_id' : JSON.parse(localStorage.getItem('token')).user_id
      },
      {
        'column':this.filterParams['column']
      },
      {
        'direction':this.filterParams['direction']
      }

    );
    this._tableService.getPrintDiningBookingEntries('tablereservation/list/tablebooking',params)
 }

 



  // cancal button method 

  cancelAll(id) {
    let statusData=
    {
      'id': id,
      'status'  : 'cancelled'
    } 
        
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to cancel selected entry?';
    this.confirmDialogRef.afterClosed()
    .subscribe(result => {
      if ( result )
      {   
          
        this._tableService.updateBookingStatus(statusData).subscribe(response =>{

            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.reservationForm.value);
            this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
            this.filterParams['column'] = 'booking_start_date';
            this.dataSource.getFilteredBookings(this.filterParams);
            this._matSnackBar.open(response.message, 'CLOSE', {
                verticalPosition: 'top',
                duration        : 2000
            });
        })
      
      }
    })      
  }


  deleteAll()
  {

    let deleteData:any=[];
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
            if ( result )
            {
             //actions/clearallentries
             let deleteUrl = 'tablereservation/update/tablebookingclearstatus';
             this._tableService.clearBooking(deleteUrl,deleteData)
             .subscribe(deleteResponse=>{
                 // Show the success message
                 this.selection.clear();
                  this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.reservationForm.value);
                  this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
                  this.filterParams['column'] = 'booking_start_date';
                  this.filterParams['front'] = 1;
                  this.dataSource.getFilteredBookings(this.filterParams);
                  this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
                      verticalPosition: 'top',
                      duration        : 2000
                  });
             },
             error => {
                 // Show the error message
                 this._matSnackBar.open(error.message, 'Retry', {
                         verticalPosition: 'top',
                         duration        : 2000
                 });
             });
            }
        })
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}

export class FilesDataSource extends DataSource<any>
{
  
  private _filterChange       = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  /**
  * Constructor
  *
  * @param {TabelReservationService} _tableService
  * @param {MatPaginator} _matPaginator
  * @param {MatSort} _matSort
  */
  constructor(
    private _tableService: TabelReservationService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  )
  {
    super();
    
    this.filteredData = this._tableService.bookingList;
  
  }

  /**
  * Connect function called by the table to retrieve one stream containing the data to render.
  *
  * @returns {Observable<DiningReservationmodel[]>}
  */
  connect(): Observable<DiningReservationmodel[]>
  {
    
    const displayDataChanges = [
        this._tableService.onBookingsChanged 
       
    ];
    
    return merge(...displayDataChanges)
    
        .pipe(
       
        map(() => {
          
                let data          = this._tableService.bookingList;
                this.filteredData = data;
                data              =  this.filterData(data);
                return data;
            }
        ));
  }

  

  // Filtered data
  get filteredData(): any
  {
      return this._filteredDataChange.value;
  }

  set filteredData(value: any)
  {
      this._filteredDataChange.next(value);
  }

  // Filter
  get filter(): string
  {
      return this._filterChange.value;
  }

  set filter(filter: string)
  {
      this._filterChange.next(filter);
  }
  
  

  /**
  * Filter data
  *
  * @param data
  * @returns {any}
  */
  filterData(formdata): any
  {
  
    return formdata.data.map(c => new DiningReservationmodel().deserialize(c));

  }
  /**
  * Get Filtered Form
  * 
  */
  getFilteredBookings(params:any){

    
    return this._tableService.getBookingList(params).then(Response=>{
      return Response;       
        
    });
  }
  /**
  * Disconnect
  */
  disconnect(): void
  {

  }

}

