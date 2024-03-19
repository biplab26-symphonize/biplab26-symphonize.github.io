import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy,ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'my-favourites-events',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesComponent implements OnInit {

  @Input() attendeeArr:any[]=[];
  @Output() fav_event_id = new EventEmitter<object>();

  public title: string = '';
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  filterForm: FormGroup;
  PaginationOpt: any = {}; //pagination size,page options
  date = new Date();
  public calendarSlug          : string = '';  
  Columns: [];
  StatusList: any;
  displayedColumns: string[];
  favdataSource: FilesDataSource | null;
  selection = new SelectionModel<any>(true, []);
  public filterParams: any = {};
  public removeButton: boolean = true;
  public ShowDelete: boolean = false;
  public cancelflag: boolean = false;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };

  public hasSelected: boolean;
  public categories: any = {};
  public months: any = {};
  public rowdata: any;
  public generalSettings: any = {};
  public menuInfo: any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;
  currentUserId: any;
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
    private _fuseConfigService: FuseConfigService,
    public cdRef:ChangeDetectorRef,
    private _eventService: EventsService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _commonService: CommonService,
    private _appConfig: AppConfig
  ) {
    this._unsubscribeAll = new Subject();
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    if(this.route.routeConfig.path=='my-event/:slug'){
      this.calendarSlug    = this.route.params['value'].slug;
    }
  }

  ngOnInit(): void {
    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
        this.calendarSlug  = params && params['slug'] ? params['slug'] : '';
    });

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.currentUserId         = JSON.parse(localStorage.getItem('token')).user_id;

    this.PaginationOpt         = OptionsList.Options.tables.pagination.options;
    this.Columns               = OptionsList.Options.tables.list.favouriteevents;
    this.generalSettings       = this._commonService.getLocalSettingsJson('general_settings');
    this.displayedColumns      = OptionsList.Options.tables.list.favouriteevents.map(col => col.columnDef);
    this.favdataSource         = new FilesDataSource(this._eventService, this.paginator, this.sort);

    merge(this.sort.sortChange, this.paginator.page,[])
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
    )
    .subscribe(res=>{
        this.selection.clear();
        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,null);
        this.filterParams['user_id'] = this.currentUserId;
        this.filterParams['column']  = 'event_id';
        this.filterParams['slug']    = this.calendarSlug;
        delete this.filterParams.trash;
        this.favdataSource.getFilteredEvents(this.filterParams);
    });
  }
  ngOnChanges(){
    this.attendeeArr = this.attendeeArr;
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
  isAllSelected() {
    this.fav_event_id.emit(this.selection.selected);
    const numSelected = this.selection.selected.length;
    const numRows = this.favdataSource.filteredData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      //rowdata =  this.dataSource.filteredData.data.filter(r=>r.registrationstatus!='Closed');
      this.favdataSource.filteredData.data.forEach(row => {
        this.selection.select(row.event_id);
      });
  }

  //CANCEL SELECTED EVENTS

  removeAllFavourite(eventId=0) {
    let statusData: any={};
    if(eventId>0){
      this.selection.selected.push(eventId);
    }
    statusData =
    {
      'event_id': this.selection.selected,
      'user_id': this.currentUserId
    }

    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove selected event from wishlist?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this._eventService.removeFavouriteEvents(statusData).subscribe(response => {
            this.selection.clear();
            this.filterParams['user_id'] = this.currentUserId;
            this.filterParams['column'] = 'event_id';
            this.favdataSource.getFilteredEvents(this.filterParams);
            this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration: 2000
            });
          })
          //}
        }
        else{
          this.selection.clear();
        }
      })
  }
  getPrint(){
    let params = [];
     params.push(
       {
         'user_id': this.currentUserId
       },
       {
         'print':'1'
       },
       {
        'slug':this.calendarSlug
       },
       {
         'attendee_id':this.attendeeArr.length>0 ? this.attendeeArr.join(',') : ''
       },
       {
        'fav_event_id':this.selection.selected.length>0 ? this.selection.selected.join(',') : ''
       }
       );
     this._eventService.getPrint('list/myevents', params) //list/favoriteevents
   }
  /**
   * On destroy
   */
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
   * @param {EventsService} _eventService
   * @param {MatPaginator} _matPaginator
   * @param {MatSort} _matSort
   */
  constructor(
    private _eventService: EventsService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort) {
    super();

    this.filteredData = this._eventService.myevent;
    this.filteredData.data = this.filterData(this.filteredData);
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @returns {Observable<Event[]>}
   */
  connect(): Observable<Event[]> {
    const displayDataChanges = [
      this._eventService.onMyEventChanged
    ];
    return merge(...displayDataChanges)
      .pipe(
        map(() => {
          let data = this._eventService.favourites;
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
  filterData(faveventData): any {
    return faveventData.data.map(c => new Event().deserialize(c, 'myeventlist'));
  }
  /**
   * Get Filtered Users
   * 
   */
  getFilteredEvents(params: any) {
    return this._eventService.getFavouriteEvents(params).then(Response => {
      if (Response && Response.favouriteeventsinfo && Response.favouriteeventsinfo.data) {
        let eventResponse = Response.map(evitem => {
          evitem.event_start_date = CommonUtils.getStringToDate(evitem.event.event_start_date + ' ' + evitem.event.event_start_time);
        });
        return eventResponse;
      }
      return null;
    });
  }
  /**
   * Disconnect
   */
  disconnect(): void {
  }
}
