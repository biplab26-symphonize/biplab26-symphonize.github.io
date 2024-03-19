import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CommonService, FormentriesService, SettingsService } from 'app/_services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel, DataSource, } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormEntry } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';
import { identifierModuleUrl } from '@angular/compiler';

 
@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
  animations: fuseAnimations
})
export class EntriesComponent implements OnInit {

  PaginationOpt: any = {};
  public displaySlug: string = 'My Services';
  Columns: [];
  StatusList: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  filterForm: FormGroup;
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
  public statusName: any = [];
  public workXHubData: any = [];
  public newWorkxhubarray: any = [];
  public SelectWorkXhub = [];
  public disableDeleteButton: boolean = true;



  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  private _unsubscribeAll: Subject<any>;
  changeDetector: any;
  allComplete: boolean = false;

  /**
  * Constructor
  *
  * @param {FormBuilder} _formBuilder
  * @param {MatSnackBar} _matSnackBar
  */

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _formsEntryService: FormentriesService,
    private settingsservices: SettingsService,
    private _commonService: CommonService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
  ) {
    this._unsubscribeAll = new Subject();
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    // workXhib settings
    this._formsEntryService.getworkxhubEntry().then(Response => {
      this.workXHubData = Response.workxhubentries;
      for (let item of this.workXHubData) {
        this.newWorkxhubarray.push({ data: item, check: false })
      }
    });
  }

  ngOnInit() {
    this.PaginationOpt = OptionsList.Options.tables.pagination.options;
    this.Columns = OptionsList.Options.tables.list.myservices;
    this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.displayedColumns = OptionsList.Options.tables.list.myservices.map(col => col.columnDef);
    this.dataSource = new FilesDataSource(this._formsEntryService, this.paginator, this.sort);
    this.settingsservices.getSetting({
      'meta_type': 'F',
      'meta_key': 'form-settings'
    }).then(response => {
      this.statusName = JSON.parse(response.settingsinfo.meta_value);
    })

    this.filterForm = this._formBuilder.group({
      searchKey: [''],
      form_id: [''],
      status: [''],
      trash: ['']

    });
    this.resetPageIndex(); //#Reset PageIndex of form if search changes

    merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.selection.clear();
        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
        this.filterParams['created_by'] = JSON.parse(localStorage.getItem('token')).user_id;
        this.filterParams['column'] = 'created_at';
        this.filterParams['front'] = 1;
        this.dataSource.getFilteredEntryForms(this.filterParams);

      });
    setTimeout(() => {
      this.parent = this.filterParams;
    });

  }



  resetPageIndex() {
    this.filterForm.valueChanges.subscribe(data => {
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
        this.selection.select(row.entry_id);

      });
  }

  updateAllComplete(event, id) {
    this.allComplete = this.newWorkxhubarray != null && this.newWorkxhubarray.every(t => {
      t.check
    });
    if (event == true) {
      this.SelectWorkXhub.push(id); //if value is not  checked..

    }
    if (event == false) {
      let index
      for (let i = 0; i < this.SelectWorkXhub.length; i++) {

        if (this.SelectWorkXhub[i] == id) {
          index = i;
        }
      }
      if (index > -1) {
        this.SelectWorkXhub.splice(index, 1); //if value is checked ...
      }

    }
    if (this.SelectWorkXhub.length > 0) {
      this.disableDeleteButton = false;
    } else {
      this.disableDeleteButton = true;
    }
  }

  someComplete(): boolean {
    if (this.newWorkxhubarray == null) {
      return false;
    }
    return this.newWorkxhubarray.filter(t => t.check).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    if (completed == true) {
      this.disableDeleteButton = false;
    } else {
      this.disableDeleteButton = true;
    }
    this.allComplete = completed;
    if (this.newWorkxhubarray == null) {
      return;
    }
    this.newWorkxhubarray.forEach(t => {
      t.check = completed
    });
    for (let i = 0; i < this.newWorkxhubarray.length; i++) {
      if (this.newWorkxhubarray[i].check == true) {
        this.SelectWorkXhub.push(this.newWorkxhubarray[i].data.ID)
      } else {
        this.SelectWorkXhub = [];
      }
    }
  }
  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  // delete workxhub entry 
  DeleteData() {
    let deleteData: any = [];
    deleteData =
    {
      'worxhub_id': this.SelectWorkXhub,
    }
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want To Delete Selected Worxhub Entry ?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          //actions/clearallentries
          this.newWorkxhubarray = [];
          this.workXHubData = [];
          let deleteUrl = 'delete/worxhubentry';
          this._formsEntryService.deleteWorkxhubEntry(deleteUrl, deleteData)
            .subscribe(deleteResponse => {
              // Show the success message
              this.selection.clear();
              this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
              this.filterParams['created_by'] = JSON.parse(localStorage.getItem('token')).user_id;
              this.filterParams['column'] = 'created_at';
              this.filterParams['front'] = 1;
              this.dataSource.getFilteredEntryForms(this.filterParams);
              this._formsEntryService.getworkxhubEntry().then(Response => {
                this.workXHubData = Response.workxhubentries;
                for (let item of this.workXHubData) {
                  this.newWorkxhubarray.push({ data: item, check: false })
                }
              });
              this.SelectWorkXhub = [];
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



  // for print the data
  getPrint() {
    let params = [];

    let entry_id = this.selection.selected.toString();
    this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);

    params.push(this.filterParams);
    params.push(

      {
        'entry_id': entry_id !== "" ? entry_id : ""
      },

      {
        'print': '1'
      },
      {
        'direction': 'desc'
      },

      {
        'created_by': JSON.parse(localStorage.getItem('token')).user_id
      },
      {
        'front': 1
      }

    );
    this._formsEntryService.getPrintfromlistentries('list/entries', params)
  }

  //  past event button method 
  pastEvents() {
    this.selection.clear();
    this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
    this.filterParams['created_by'] = JSON.parse(localStorage.getItem('token')).user_id;
    this.filterParams['column'] = 'created_at';
    this.filterParams['front'] = 1;
    this.filterParams['recent_entries'] = 1;
    delete this.filterParams.trash;
    this.dataSource.getFilteredEntryForms(this.filterParams);
  }

  // view the all event data method
  viewAllEvent() {
    this.selection.clear();
    this.filterParams['column'] = 'created_at';
    this.filterParams['created_by'] = JSON.parse(localStorage.getItem('token')).user_id;
    this.filterParams['front'] = 1;
    this.filterParams['direction'] = 'desc'
    this.filterParams['limit'] = ''
    delete this.filterParams.trash;
    this.dataSource.getFilteredEntryForms(this.filterParams);
  }


  // cancal button method 

  cancelAll(entry_id) {
    let statusData =
    {
      'entry_id': entry_id,
      'status': 'cancelled'
    }

    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to cancel selected entry?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {

          this._formsEntryService.formEntryStatus(statusData).subscribe(response => {

            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
            this.filterParams['created_by'] = JSON.parse(localStorage.getItem('token')).user_id;
            this.filterParams['column'] = 'created_at';
            this.dataSource.getFilteredEntryForms(this.filterParams);
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
      'entry_id': this.selection.selected,
    }
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected entry?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          //actions/clearallentries
          let deleteUrl = 'actions/clearallentries';
          this._formsEntryService.deleteFormEntry(deleteUrl, deleteData)
            .subscribe(deleteResponse => {
              // Show the success message
              this.selection.clear();
              this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
              this.filterParams['created_by'] = JSON.parse(localStorage.getItem('token')).user_id;
              this.filterParams['column'] = 'created_at';
              this.filterParams['front'] = 1;
              this.dataSource.getFilteredEntryForms(this.filterParams);
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
  * @param {FormentriesService} _formsEntryService
  * @param {MatPaginator} _matPaginator
  * @param {MatSort} _matSort
  */
  constructor(
    private _formsEntryService: FormentriesService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  ) {
    super();

    this.filteredData = this._formsEntryService.formentry;

  }

  /**
  * Connect function called by the table to retrieve one stream containing the data to render.
  *
  * @returns {Observable<FormEntry[]>}
  */
  connect(): Observable<FormEntry[]> {
    const displayDataChanges = [
      this._formsEntryService.onFormentryChanged

    ];

    return merge(...displayDataChanges)

      .pipe(

        map(() => {
          let data = this._formsEntryService.formentry;
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
  filterData(formentrydata): any {

    return formentrydata.data.map(c => new FormEntry().deserialize(c));

  }
  /**
  * Get Filtered Form
  * 
  */
  getFilteredEntryForms(params: any) {
    return this._formsEntryService.getformentry(params).then(Response => {
      if (Response.status == 200) {
        Response.data.map(item => {

          if (item.created_at) {
            item.created_at = CommonUtils.getStringToDate(item.created_at);
          }
          return item;
        });

      }


    });
  }
  SeletcallWorkxhub(event: any) {
    return true;
  }
  /**
  * Disconnect
  */
  disconnect(): void {

  }

}
