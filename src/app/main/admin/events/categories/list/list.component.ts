import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { CommonService, OptionsList, EventcategoryService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Eventcategorymodel } from 'app/_models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes   
  public filterForm: FormGroup;
  public PaginationOpt:any = {}; //pagination size,page options
  public title : string = '';
  public Columns: []; 
  public StatusList: any;
  public displayedColumns: string[];
  public dataSource: FilesDataSource | null;
  public selection = new SelectionModel<Eventcategorymodel>(true, []);
  public filterParams:any = {};
  public removeButton : boolean = true;
  public trash :boolean = false;
  public hasSelected : boolean ;
  public Category_Calendar_list;
  public calendarSlug:string='';
  public selectedCalendar: any='';
  public allistRoute    : any = ''; 
  public displaySlug:string='Common ';
  public addRoute:any=['/admin/events/categories/add'];
  public exceptColumnsArray : any[] = ['status','disp_on_registration','disp_on_calendar','action'];  
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  @ViewChild('filter', {static: true})
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;
    trashRoute: string[];
  

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar
   */
  constructor(
      private _eventCategoryService: EventcategoryService,
      private _formBuilder: FormBuilder,
      public _matDialog: MatDialog,
      private _matSnackBar: MatSnackBar,
      private _commonService :CommonService,
      private route : ActivatedRoute
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      //call get events list function
      this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
          this.calendarSlug  = params && params['slug'] ? params['slug'] : '';
          if(this.calendarSlug!==''){
            this.displaySlug    = this.calendarSlug.replace('-',' ');
            this.allistRoute    =  ['/admin/event/category/',this.calendarSlug];  
            this.trashRoute     =  ['/admin/event/category/trash/',this.calendarSlug];
            this.addRoute       = ['/admin/event/category/add/',this.calendarSlug];
          }
          else{
            this.trashRoute         =  ['/admin/events/categories/trash'];
            this.allistRoute        =  ['/admin/events/categories/list'];
            this.addRoute           =  ['/admin/events/categories/add'];
          }
      });
      if(this.route.routeConfig.path=="admin/events/categories/trash" || this.route.routeConfig.path=="admin/event/category/trash/:slug")
      {   
          this.title = " Categories Trash List"
          this.trash = true;
          this.removeButton = false;
      }
      else
      {
          this.title = " Categories"
      }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
    ngOnInit(): void
    {
        
        //Pagination Options
        this.PaginationOpt    = OptionsList.Options.tables.pagination.options;  
        this.StatusList       = OptionsList.Options.tables.status.users;
        this.Columns          = OptionsList.Options.tables.list.categories;
        this.displayedColumns = OptionsList.Options.tables.list.categories.map(col => col.columnDef);
        this.dataSource       = new FilesDataSource(this._eventCategoryService,this.paginator,this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey   : [''],
            roles       : [''],
            status      : [''],
            trash       : [''],
            calendar_id : [0]            
        });
        this.resetPageIndex(); //#Reset PageIndex of form if search changes
        
        if(this.calendarSlug!==''){
            this._eventCategoryService.getCategory_calendar({'category_type':'ECL','column':'category_name','status':'A','direction':'asc'}).then(res=>{
                this.Category_Calendar_list = res.data;
                if(this.calendarSlug!=='' && this.Category_Calendar_list && this.Category_Calendar_list.length>0){
                    let selCalendar = this.Category_Calendar_list.find(item=>{
                        return item.category_alias==this.calendarSlug;
                    });
                    this.selectedCalendar = selCalendar && selCalendar.id>0 ? selCalendar.id : 0 ;
                    if(this.selectedCalendar!==''){
                        this.filterForm.get('calendar_id').setValue(this.selectedCalendar);
                    }
                }
            });
        }

        merge(this.sort.sortChange, this.paginator.page,this.filterForm.valueChanges)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{
            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
            this.trash==true ? this.filterParams['trash'] = 1 : '';
            this.filterParams['calendar_id']   = this.filterForm.get('calendar_id').value ? this.filterForm.get('calendar_id').value : 0;
            this.filterParams['category_type'] = 'C';
            this.dataSource.getFilteredCategory(this.filterParams);
        });
        this.check();
      
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
        this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
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
  
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected category?';
      this.confirmDialogRef.afterClosed()
          .subscribe(result => {
              if ( result )
              {
              let deleteData = {
                  'id': id.toString().split(','),
                  'category_type' : 'C'
              };
              let deleteUrl =  this.trash==true ? 'delete/categoriespermanentdelete' : 'delete/categories';
  
              this._eventCategoryService.deleteCategory(deleteUrl,deleteData)
              .subscribe(deleteResponse=>{
                  // Show the success message
                  this.selection.clear();
                  this.filterParams['category_type'] = 'C';
                  this.trash == true ? this.filterParams['trash'] = 1 : '';
                  this.dataSource.getFilteredCategory(this.filterParams);
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

    changeSingleStatus(type,id)
    {
        this.changeStatus(type,id)
    }
    //CHANGE STATUS
    changeStatus(type:string="A",selectid){
        
        let categoryid;
        if(this.selection.selected){
            categoryid = this.selection.selected
        }
        if(selectid){
            categoryid = selectid.toString().split(",");
        }
        this._commonService.changeStatus({'id':categoryid,'status':type,'type':'Categories'})
        .subscribe(statusResponse=>{
            this.selection.clear();
            this.filterParams['category_type'] = 'C';
            this.trash == true ? this.filterParams['trash'] = 1 : '';
            this.dataSource.getFilteredCategory(this.filterParams);
            // Show the success message
            this._matSnackBar.open(statusResponse.message, 'CLOSE', {
                verticalPosition: 'top',
                duration        : 2000
            });
        },
        error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'RETRY', {
                verticalPosition: 'top',
                duration        : 2000
            });
        });
    }

    //RESTORE CATEGORY//
    restoreAll() 
    {
        this.restoreItem(this.selection.selected);
    }
    restoreItem(id)
    {
        let restoreData = {
            'id': id.toString().split(','),
              'category_type' : 'C'
        };
        this._commonService.restore('delete/categoriesrestore',restoreData)
        .subscribe(deleteResponse=>{
            // Show the success message
            this.selection.clear();
            this.filterParams['category_type'] = 'C';
            this.trash == true ? this.filterParams['trash'] = 1 : '';
            this.dataSource.getFilteredCategory(this.filterParams);
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
   * @param {EventcategoryService} _eventCategoryService
   * @param {MatPaginator} _matPaginator
   * @param {MatSort} _matSort
   */
  constructor(
      private _eventCategoryService: EventcategoryService,
      private _matPaginator: MatPaginator,
      private _matSort: MatSort,
  )
  {
      super();

      this.filteredData = this._eventCategoryService.eventcategory;
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @returns {Observable<Eventcategorymodel[]>}
   */
  connect(): Observable<Eventcategorymodel[]>
  {
      const displayDataChanges = [
          this._eventCategoryService.onCategoryChanged
      ];
      return merge(...displayDataChanges)
          .pipe(
          map(() => {
                  let data          = this._eventCategoryService.eventcategory;
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
  filterData(categoryData): any
  {
      return categoryData.data.map(c => new Eventcategorymodel().deserialize(c));
  }
  /**
   * Get Filtered Users
   * 
   */
  getFilteredCategory(params:any){
      return this._eventCategoryService.getCategory(params).then(Response=>{
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
