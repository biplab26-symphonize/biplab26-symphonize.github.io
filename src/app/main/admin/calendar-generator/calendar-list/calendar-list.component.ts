import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation,EventEmitter, Output } from '@angular/core';
//import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';

import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { CommonService, OptionsList,CalendarGeneratorService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute,Router } from '@angular/router';
import { CalendarGeneratormodel } from 'app/_models';
@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CalendarListComponent implements OnInit {
  @Output() calendarData          = new EventEmitter(); 
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes   
  public filterForm: FormGroup;
  public PaginationOpt:any = {}; //pagination size,page options
  public title : string = '';
  public Columns: []; 
  public StatusList: any;
  public displayedColumns: string[];
  public dataSource: FilesDataSource | null;
  public selection = new SelectionModel<CalendarGeneratormodel>(true, []);
  public filterParams:any = {};
  
  public removeButton : boolean = true;
  public trash :boolean = false;
  public hasSelected : boolean ;
  
  public exceptColumnsArray : any[] = ['action'];
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  @ViewChild('filter', {static: true})
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
      private _calendarGeneratorService:CalendarGeneratorService,
      private _formBuilder: FormBuilder,
      public _matDialog: MatDialog,
      private _matSnackBar: MatSnackBar,
      private _commonService :CommonService,
      private route : ActivatedRoute,
      private  router     : Router
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      if(this.route.routeConfig.path=="admin/events/categories/trash")
      {   
          this.title = " Categories Trash List"
          this.trash = true;
          this.removeButton = false;
      }
      else
      {
          this.title = "CALENDAR GENERATOR LIST"
      }

      
  }

  ngOnInit() {
    
    //Pagination Options
    this.PaginationOpt    = OptionsList.Options.tables.pagination.options;  
    this.StatusList       = OptionsList.Options.tables.status.users;
    this.Columns          = OptionsList.Options.tables.list.calendarlist;
    this.displayedColumns = OptionsList.Options.tables.list.calendarlist.map(col => col.columnDef);
    this.dataSource       = new FilesDataSource(this._calendarGeneratorService,this.paginator,this.sort);


        merge(this.sort.sortChange, this.paginator.page)
        //merge(this.sort.sortChange)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{
            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
            this.trash==true ? this.filterParams['trash'] = 1 : '';
            //this.filterParams['category_type'] = 'C';
            this.dataSource.getFilteredCalendarList(this.filterParams);
        });
        
        /*if(this.route.routeConfig.path == 'admin/calendar-generator'){
            this.template_id = 436;
            this._calendarGeneratorService.getCalendarData(this.template_id)
            .subscribe(Response=>{
               console.log('response',response);
            },
            error => {
                // Show the error message
                this._matSnackBar.open(error.message, 'Retry', {
                        verticalPosition: 'top',
                        duration        : 2000
                });
            });
        }*/

        
        
  }
    getEditData(template_id){
        this._calendarGeneratorService.getCalendarData(template_id)
        .then(Response=>{
            console.log('responsedata',Response);
            this._calendarGeneratorService.setedittemplatedata(Response.data[0]); 
            this.router.navigate(['admin/calendar-generator']);
        },
        error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
                    verticalPosition: 'top',
                    duration        : 2000
            });
        });
    }


    deleteAll() 
    {
        this.deleteItem(this.selection.selected);
    }  

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
    }
    
    isAllSelected() {
        const numSelected   = this.selection.selected.length;
        const numRows       = this.dataSource.filteredData.data.length;
        
        return numSelected === numRows; 
    }

    deleteItem(id){
    
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
  
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected template?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
              if ( result )
              {
                let deleteData = {
                    'id': id.toString().split(','),
                    'calendar gnerator' :'ECG'
                };
                let deleteUrl =  'delete/calendar';
    
                this._calendarGeneratorService.deleteTemplates(deleteUrl,deleteData)
                .subscribe(deleteResponse=>{
                    // Show the success message
                    this.selection.clear();
                    this.trash == true ? this.filterParams['trash'] = 1 : '';
                    this.dataSource.getFilteredCalendarList(this.filterParams);
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

}


export class FilesDataSource extends DataSource<any>{
  private _filterChange       = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');
  dataArray = [];  
  constructor(
      private _calendarGeneratorService: CalendarGeneratorService,
      private _matPaginator: MatPaginator,
      private _matSort: MatSort,
  )
  {
      super();

      this.filteredData = this._calendarGeneratorService.calendarList;
  }

   connect(): Observable<CalendarGeneratormodel[]>
  {
      const displayDataChanges = [
          this._calendarGeneratorService.onCalendarChanged
      ];
      return merge(...displayDataChanges)
          .pipe(
          map(() => {
                   console.log('cale',this._calendarGeneratorService.calendarList);
                  let data          = this._calendarGeneratorService.calendarList;
                  //let data          = this.dataArray;
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
  filterData(calendarGeneratorData): any
  {
      //return calendarGeneratorData.map(c => new CalendarGeneratormodel().deserialize(c));  
      return calendarGeneratorData.data.map(c => new CalendarGeneratormodel().deserialize(c));
  }
  /**
   * Get Filtered Users
   * 
   */
  getFilteredCalendarList(params:any){
    return this._calendarGeneratorService.getCalendarList(params).then(Response=>{
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



