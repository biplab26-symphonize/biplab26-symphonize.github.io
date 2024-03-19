import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { EventsService, CommonService, OptionsList, AppConfig } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';  
import { Event } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.scss'],
  animations : fuseAnimations
})
export class MyeventsComponent implements OnInit {
  public title      : string = '';
  public displaySlug: string = '';
  confirmDialogRef  : MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  filterForm        : FormGroup;
  PaginationOpt     : any = {}; //pagination size,page options
  date              = new Date();
  Columns           : []; 
  StatusList        : any;
  displayedColumns  : string[];
  dataSource        : FilesDataSource | null;
  selection         = new SelectionModel<any>(true,[]);
  public filterParams   : any = {};
  public removeButton   : boolean = true;
  public cancelflag :boolean = false;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public attendeeArr    : any[]=[];
  public favEventArr    : any[]=[];
  public hasSelected    : boolean ;
  public categories     : any = {};
  public months         : any = {};
  public rowdata        : any;
  public generalSettings: any = {};
  public calendarSlug          : string = '';  
  public menuInfo: any;
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  @ViewChild('filter', {static: true})
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;
  

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar
   */
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService : FuseConfigService,
    private _eventService         : EventsService,
    private _formBuilder          : FormBuilder,
    public _matDialog             : MatDialog,
    private _matSnackBar          : MatSnackBar,
    private _commonService        : CommonService,
    private _appConfig            : AppConfig
  ) { 
    this._unsubscribeAll = new Subject();
     // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    if(this.route.routeConfig.path=='my-event/:slug'){
      this.calendarSlug    = this.route.params['value'].slug;
    }
    if(this.route.routeConfig.path=='my-events'){
      this.calendarSlug    = 'my-events';
      this.displaySlug    = this.calendarSlug.replace('-',' ');
    }
   
  }

  ngOnInit() {

    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
        this.calendarSlug  = params && params['slug'] ? params['slug'] : 'my-events';
        this.displaySlug    = this.calendarSlug.replace('-',' ');
    });

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    
    this.PaginationOpt    = OptionsList.Options.tables.pagination.options; 
    this.Columns          = OptionsList.Options.tables.list.managemyevents;
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.displayedColumns = OptionsList.Options.tables.list.managemyevents.map(col => col.columnDef);
    this.dataSource       = new FilesDataSource(this._eventService,this.paginator,this.sort);
    
    
    this.filterForm = this._formBuilder.group({
        searchKey   : [''],
        status      : [''],
        categories  : [''],
    });
    this.resetPageIndex(); //#Reset PageIndex of form if search changes
    
    merge(this.sort.sortChange, this.paginator.page,this.filterForm.valueChanges)
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
    )
    .subscribe(res=>{
        this.selection.clear();
        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
        this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
        this.filterParams['column'] = 'event_id';
        this.filterParams['slug'] = this.calendarSlug;
        delete this.filterParams.trash;
        this.dataSource.getFilteredEvents(this.filterParams);
    });
  }

  //Reset PageIndex On Form Changes
  resetPageIndex(){
    this.filterForm.valueChanges.subscribe(data=>{
        this.paginator.pageIndex = 0;
    });
  }

  isAllSelected() {
    //pass attendee_id to fav compoenent
    this.sendAttendeeSelection(this.selection.selected);
    const numSelected   = this.selection.selected.length;
    const numRows       = this.dataSource.filteredData.data.length; 
    return numSelected === numRows; 
  }
  
  masterToggle() {
      this.isAllSelected() ?
      this.selection.clear() :
     //rowdata =  this.dataSource.filteredData.data.filter(r=>r.registrationstatus!='Closed');
     this.dataSource.filteredData.data.forEach(row => 
        {
          this.selection.select(row.attendee_id);
        });
  }
  sendAttendeeSelection(attendeeArray:any[]=[]){
    this.attendeeArr = attendeeArray || [];
  }
  setPrintFaValue($event){
    this.favEventArr = $event || [];
  }
 
  
  //DELETE SELECTED EVENTS
  deleteAll()
  {

    let deleteData:any=[];
    deleteData = 
    {
       'attendee_id': this.selection.selected,
    }  
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected event?';
    this.confirmDialogRef.afterClosed()
        .subscribe(result => {
            if ( result )
            {
             //actions/myeventclear
             let deleteUrl = 'actions/myeventclear';
             this._eventService.deleteEvent(deleteUrl,deleteData)
             .subscribe(deleteResponse=>{
                 // Show the success message
                 this.selection.clear();
                  this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                  this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
                  this.filterParams['column'] = 'event_id';
                  this.filterParams['slug'] = this.calendarSlug;
                  this.dataSource.getFilteredEvents(this.filterParams);
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

  //CANCEL SELECTED EVENTS
  
  cancelAll() {
    let statusData:any=[];
    statusData = 
    {
       'attendee_id': this.selection.selected,
    } 
        
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
  
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to cancel selected event?';
      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
            if ( result )
            {   
                // for(let i=0 ;i<statusData.length ;i++)
                // {
                //   if(statusData[i].registrationstatus == "Closed")
                //   {
                //     this.cancelflag= true;
                //     this._matSnackBar.open('Closed events can not be cancelled!', 'Success', {verticalPosition: 'top', duration: 2000 });
                //     break;
                //   }
                // }
                //if(this.cancelflag==false){
                this._eventService.cancelEvent(statusData).subscribe(response =>{

                    this.selection.clear();
                    this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                    this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
                    this.filterParams['column'] = 'event_id';
                    this.filterParams['slug'] = this.calendarSlug;
                    this.dataSource.getFilteredEvents(this.filterParams);
                    this._matSnackBar.open(response.message, 'CLOSE', {
                        verticalPosition: 'top',
                        duration        : 2000
                    });
                })
            //}
            }
        })        
  }

  getPrint(){
   let params = [];
    params.push(
      {
        'user_id': JSON.parse(localStorage.getItem('token')).user_id
      },
      {
        'print':'1'
      },
      {
        'slug':this.calendarSlug
      },
      {
        'column':this.filterParams['column']
      },
      {
        'direction':this.filterParams['direction']
      }
     
      );
    this._eventService.getPrint('list/myevents', params)
  }

  pastEvents()
  {
    this.selection.clear();
    this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
    this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
    this.filterParams['column'] = 'event_id';
    this.filterParams['recent_entries'] = 1;
    this.filterParams['slug'] = this.calendarSlug;
    delete this.filterParams.trash;
    this.dataSource.getFilteredEvents(this.filterParams);
  }
  futureEvents()
  {
    this.selection.clear();
    this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
    this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
    this.filterParams['column'] = 'event_id';
    this.filterParams['future_entries'] = 1;
    this.filterParams['slug'] = this.calendarSlug;
    delete this.filterParams.trash;
    this.dataSource.getFilteredEvents(this.filterParams);
  }
  viewAllEvent()
  {
    this.selection.clear();
    this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
    this.filterParams['user_id'] = JSON.parse(localStorage.getItem('token')).user_id;
    this.filterParams['column'] = 'event_id';
    this.filterParams['slug'] = this.calendarSlug;
    delete this.filterParams.trash;
    this.dataSource.getFilteredEvents(this.filterParams); 
  }
  getRegistrationStatus(elementInfo){
    return CommonUtils.getRegistrationStatus(elementInfo);
  }
  /**
   * On destroy
   */
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
         * @param {EventsService} _eventService
         * @param {MatPaginator} _matPaginator
         * @param {MatSort} _matSort
         */
        constructor(
            private _eventService: EventsService,
            private _matPaginator: MatPaginator,
            private _matSort: MatSort)
        {
            super();

            this.filteredData = this._eventService.myevent;
            this.filteredData.data = this.filterData(this.filteredData);
        }

        /**
         * Connect function called by the table to retrieve one stream containing the data to render.
         *
         * @returns {Observable<Event[]>}
         */
        connect(): Observable<Event[]>
        {
            const displayDataChanges = [
                this._eventService.onMyEventChanged
            ];
            return merge(...displayDataChanges)
                .pipe(
                map(() => {
                        let data          = this._eventService.myevent;
                        this.filteredData = data;
                        data              = this.filterData(data);
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
        filterData(myeventData): any
        {    
            return myeventData.data.map(c =>new Event().deserialize(c,'myeventlist'));
        }
        /**
         * Get Filtered Users
         * 
         */
        getFilteredEvents(params:any){
          return this._eventService.getMyEvents(params).then(Response=>{
            if(Response && Response.length>0){
              let eventResponse = Response.map(evitem=>{
                evitem.event_start_date = CommonUtils.getStringToDate(evitem.event.event_start_date+' '+evitem.event.event_start_time);
                evitem.reg_status       = CommonUtils.getRegistrationStatus({is_waiting:evitem.is_waiting,status:evitem.status});
              });
              return eventResponse;
            }
            return [];
          });
        }
        /**
         * Disconnect
         */
        disconnect(): void
        {
        }
    }
