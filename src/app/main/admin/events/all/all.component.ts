import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { CommonService, OptionsList, EventcategoryService, EventsService} from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'app/_models';
import { ExportComponent } from 'app/layout/components/export/export.component';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AllComponent implements OnInit {
  public title      : string = '';
  public EventSettings: Object = {};
  public MetaArray  : any[]=[];
  public ShowMetaFilters: string='N';
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};

  confirmDialogRef  : MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  exportDialogref   : MatDialogRef<ExportComponent>; //EXTRA Changes   
  filterForm        : FormGroup;
  PaginationOpt     : any = {}; //pagination size,page options
  date              = new Date();
  Columns           : []; 
  StatusList        : any;
  YearsList         : any[]=[];
  EventMetaFields   : any[]=[];
  pauseForm         : boolean = true;
  displayedColumns  : string[];
  dataSource        : FilesDataSource | null;
  selection         = new SelectionModel<Event>(true, []);
  public filterParams   : any = {};
  public removeButton   : boolean = true;
  public trash :boolean = false;
  public hasSelected    : boolean ;
  public categories     : any[] = [];
  public subcategories  : any[]=[];
  public months         : any = {}
  public Category_Calendar_list ;
  public calendarSlug   : string = '';
  public trashRoute     : any = '';    
  public allistRoute    : any = '';    
  public addeventRoute  : any = '';   
  public viewcalendarRoute  : any = '';   
  public displaySlug    : string = '';     
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
      private _eventService         : EventsService,
      private _eventCategoryService : EventcategoryService,
      private _formBuilder          : FormBuilder,
      public _matDialog             : MatDialog,
      private _matSnackBar          : MatSnackBar,
      private _commonService        : CommonService,
      private route                 : ActivatedRoute
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      if(this.route.routeConfig.path=="admin/events/trash" || this.route.routeConfig.path=="admin/event/trash/:slug")
      {   
          this.title = " Event Trash List"
          this.trash = true;
          this.removeButton = false;
      }
      else
      {
          this.title = " Events"
          this.removeButton = true;
      }
      this.calendarSlug =  this.route.params && this.route.params['value'].slug ? this.route.params['value'].slug : '';
      
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
    ngOnInit(): void
    {
        //Event Settings From LocalStorage
        let eventSettings  = this._commonService.getLocalSettingsJson('event-settings');
        this.EventSettings = eventSettings ? eventSettings[0] : {};
        if(this.EventSettings && this.EventSettings['event_list_display_settings']){
            this.ShowMetaFilters = this.EventSettings['event_list_display_settings'].show_meta_filters;
            this.MetaArray       = this.EventSettings['event_list_display_settings'].meta_fields;
        }
        this._eventCategoryService.getCategory({'category_type':'ECL','column':'category_name','status':'A','direction':'asc'}).then(res=>{
            this.Category_Calendar_list = res.data;
          })
        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        //Pagination Options
        this.StatusList       = OptionsList.Options.tables.status.eventstatus;
        //Filter Years Dropdown
        this.YearsList        = CommonUtils.getSelectYears(5,true);
        this.PaginationOpt    = OptionsList.Options.tables.pagination.options; 
        this.categories       = this._eventCategoryService.eventcategory.data;
        this.subcategories    = this._eventCategoryService.eventsubcategory.data;
        this.months           = OptionsList.Options.months;
        this.Columns          = OptionsList.Options.tables.list.events;
        this.displayedColumns = OptionsList.Options.tables.list.events.map(col => col.columnDef);
        this.dataSource       = new FilesDataSource(this._eventService,this.paginator,this.sort);
        
        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey       : [''],
            roles           : [''],
            status          : [''],
            special_event   : [''],
            trash           : [''],
            categories      : [''],
            subcategories   : [''],
            month           : [''],
            year            : [''],
            calendar_id     : [''],
            slug            : [this.calendarSlug],    
            metafields      : [[]]
        });

        //call get events list function
        this.route.params
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(params => {
            this.calendarSlug  = params && params['slug'] ? params['slug'] : '';
            if(this.calendarSlug!==''){
                this.displaySlug    = this.calendarSlug.replace('-',' ');
                this.allistRoute    =  ['/admin/event/',this.calendarSlug];  
                this.trashRoute     =  ['/admin/event/trash/',this.calendarSlug];
                this.addeventRoute  =  ['/admin/event/add/',this.calendarSlug];
                this.viewcalendarRoute  =  ['/admin/event/calendar/',this.calendarSlug];
            }
            else{
                this.trashRoute         =  ['/admin/events/trash'];
                this.allistRoute        =  ['/admin/events/all'];
                this.addeventRoute      =  ['/admin/events/add'];
                this.viewcalendarRoute  =  ['/admin/events/all/calendar'];
            }
            this.filterForm.reset();
        });

        //Get Event MetaFields
        this._eventService.getEventMetaFields({field_form_type:'E'}).subscribe(metaInfo=>{
            this.EventMetaFields  = metaInfo.data || [];
            //IF MetaFields Not Empty Then add it To FormGroup
            if(this.EventMetaFields.length>0){
                //Convert string content to Array
                this.EventMetaFields.map(metafield=>{
                    if(metafield.field_content){
                        metafield['field_content'] = JSON.parse(metafield.field_content);
                    }
                    return metafield;
                });
                this.createMetaFormFields();
            }
            else{
                this.pauseForm = false;
            }
        });

        this.resetPageIndex(); //#Reset PageIndex of form if search changes
        
        merge(this.sort.sortChange, this.paginator.page,this.filterForm.valueChanges)
        .pipe(
            filter(_ => !this.pauseForm),    
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{
            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
            let metaArrayFilter = Object.keys(this.filterForm.controls).filter(Number) || [];
            if(metaArrayFilter.length>0){
                this.filterParams['metafields'] = this.getMetaFilterArray(metaArrayFilter);
            }
            this.filterParams['calendar_id'] = this.filterForm.get('calendar_id').value ? this.filterForm.get('calendar_id').value:'';
            this.trash == true ? this.filterParams['trash'] = 1 : '';
            this.filterParams['slug'] = this.calendarSlug || ''; 
            this.dataSource.getFilteredEvents(this.filterParams);
        });
        this.check();
    }
    //Declare Form Group
    createMetaFormFields(){
        if(this.filterForm){
            this.EventMetaFields.forEach(metaField=>{
                this.filterForm.addControl(metaField.id,new FormControl('',[]));
            });
            this.pauseForm = false;
        }
    } 
    //Get Meta Fielters Array in request format [{field_id:...,field_value:...}]
    getMetaFilterArray(metaArrayFilter){
        let filtersArray = [];
        metaArrayFilter.map(metaitem=>{
            if(this.filterForm.get(metaitem).value!=='' && this.filterForm.get(metaitem).value!==null && this.filterForm.get(metaitem).value!==undefined){
                filtersArray.push({field_id:metaitem,field_value:this.filterForm.get(metaitem).value});
            }
        });
        return filtersArray.length>0 ? JSON.stringify(filtersArray) : '';
    }
    //Reset PageIndex On Form Changes
    resetPageIndex(){
        this.filterForm.valueChanges.subscribe(data=>{
            this.paginator.pageIndex = 0;
        });
    }

    isAllSelected() {
        const numSelected   = this.selection.selected.length;
        const numRows       = this.dataSource.filteredData.data.length; 
        return numSelected === numRows; 
    }

    deselectAll(){
        this.selection.clear();
    }
    
    check()
    {
    if(this.selection.selected)
        {
            this.hasSelected = true;
            
        }
        else{
            this.hasSelected = false; 
            
        }
    }

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.data.forEach(row => this.selection.select(row.event_id));
    }
    
    deleteAll() 
    {
        this.deleteItem(this.selection.selected);
    }

    /**ACTION FUNCTIONS */
    deleteItem(id){
  
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = this.trash==true ? 'Are you sure you want to delete selected event?' : 'Are you sure you want to trash selected event?';
    this.confirmDialogRef.afterClosed()
        .subscribe(result => {
            if ( result )
            {
                let deleteData = {
                'event_id': id.toString().split(','),
                'remove_recurrence': 'N'
                };
                let deleteUrl =  this.trash==true ? 'delete/forcedeleteevents' : 'delete/events';
                this._eventService.deleteEvent(deleteUrl,deleteData)
                .subscribe(deleteResponse=>{
                    // Show the success message
                    this.selection.clear();
                    this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                    //Meta Filters
                    let metaArrayFilter = Object.keys(this.filterForm.controls).filter(Number) || [];
                    if(metaArrayFilter.length>0){
                        this.filterParams['metafields'] = this.getMetaFilterArray(metaArrayFilter);
                    }
                    this.trash == true ? this.filterParams['trash'] = 1 : '';
                    this.filterParams['slug'] = this.calendarSlug || '';
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
            this.confirmDialogRef = null;
        });
    }
    
    //RESTORE EVENTS//
    restoreAll() 
    {
        this.restoreItem(this.selection.selected);
    }
    restoreItem(id)
    {
        let restoreData = {
            'event_id': id.toString().split(',')
        };
        this._commonService.restore('delete/eventsrestore',restoreData)
        .subscribe(deleteResponse=>{
            // Show the success message
            this.selection.clear();
            this.trash == true ? this.filterParams['trash'] = 1 : '';
            this.filterParams['slug'] = this.calendarSlug || '';
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

    //EXPORT EVENTS
    exportEvents()
    {
        this.exportDialogref = this._matDialog.open(ExportComponent, {
            disableClose: false
        });        
        this.exportDialogref.afterClosed()
            .subscribe(result => {
                if ( result )
                {   
                    this._matSnackBar.open('Exporting Data', 'CLOSE',{
                        verticalPosition: 'top',
                        duration        : 2000
                    });
                    this.filterParams.type = result; 
                    this.filterParams.event_id = this.selection.selected;
                    this.filterParams.event_id = this.filterParams.event_id.join(",")
                    this.filterParams.slug     = this.calendarSlug || '';
                    this._eventService.exportevents(this.filterParams);
                }
                this.exportDialogref = null;
            });
    }
    returnZero() { 
        return 0; 
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

            this.filteredData = this._eventService.event;
        }

        /**
         * Connect function called by the table to retrieve one stream containing the data to render.
         *
         * @returns {Observable<Event[]>}
         */
        connect(): Observable<Event[]>
        {
            const displayDataChanges = [
                this._eventService.onEventChanged
            ];
            return merge(...displayDataChanges)
                .pipe(
                map(() => {
                        let data          = this._eventService.event;
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
        filterData(eventData): any
        {
            return eventData.data.map(c =>new Event().deserialize(c,'adminlist'));
        }
        /**
         * Get Filtered Users
         * 
         */
        getFilteredEvents(params:any){
            return this._eventService.getEvents(params).then(Response=>{
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
