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
  public exceptColumnsArray : any[] = ['status','disp_on_registration','disp_on_calendar','action'];  
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
      if(this.route.routeConfig.path=="admin/events/category_Calendar/trash")
      {   
          this.title = " Categories Calendar Trash List"
          this.trash = true;
          this.removeButton = false;
      }
      else
      {
          this.title = " Category Calendar"
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
        
        // if(this.trash == 'trash')
        // {
        //     this.urltrash = this.trash;
        // }
        
        //Pagination Options
        this.PaginationOpt    = OptionsList.Options.tables.pagination.options;  
        this.StatusList       = OptionsList.Options.tables.status.users;
        this.Columns          = OptionsList.Options.tables.list.categories_calendar;
        this.displayedColumns = OptionsList.Options.tables.list.categories_calendar.map(col => col.columnDef);
        this.dataSource       = new FilesDataSource(this._eventCategoryService,this.paginator,this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey   : [''],
            roles       : [''],
            status      : [''],
            trash       : ['']
            
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
            console.log(this.trash);
            this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
            this.trash==true ? this.filterParams['trash'] = 1 : '';
            this.filterParams['category_type'] = 'ECL';
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
                  'category_type' : 'ECL'
              };
              let deleteUrl =  this.trash==true ? 'delete/categoriespermanentdelete' : 'delete/categories';
  
              this._eventCategoryService.deleteCategory(deleteUrl,deleteData)
              .subscribe(deleteResponse=>{
                  // Show the success message
                  this.selection.clear();
                  this.filterParams['category_type'] = 'ECL';
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
            this.filterParams['category_type'] = 'ECL';
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
              'category_type' : 'ECL'
        };
        this._commonService.restore('delete/categoriesrestore',restoreData)
        .subscribe(deleteResponse=>{
            // Show the success message
            this.selection.clear();
            this.filterParams['category_type'] = 'ECL';
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
