import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, CategoryService, AnnouncementService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { Home } from 'app/_models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AllComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  filterForm: FormGroup;
  isTrashView: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
  filterParams: any = {};
  PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
  Columns: [];
  StatusList: any;
  displayedColumns: string[];
  dataSource: FilesDataSource | null;
  // Private
  private _unsubscribeAll: Subject<any>;

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private _commonService: CommonService,
    private _topicService: AnnouncementService,
    private _categoryService: CategoryService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

    //Pagination Options
    this.PaginationOpt = OptionsList.Options.tables.pagination.options;
    this.StatusList = OptionsList.Options.tables.status.users;
    this.Columns = OptionsList.Options.tables.list.topics;
    this.displayedColumns = OptionsList.Options.tables.list.topics.map(col => col.columnDef);
    this.dataSource = new FilesDataSource(this._topicService, this.paginator, this.sort);

    //Declare Filter Form
    this.filterForm = this._formBuilder.group({
      searchKey: [''],
      dates: [''],
      trash: [''],
      status: ['']
    });

    //Show Buttons Of permenat Delete and restore on trash view
    this.isTrashView = this.route.data['value'].trash == 1 ? true : this.isTrashView;
    this.route.data['value'].trash ? this.filterForm.get('trash').setValue(this.route.data['value'].trash) : "";

    this.resetPageIndex(); //#Reset PageIndex of form if search changes

    merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.selection.clear();

        this.getFilterParams();
        this.dataSource.getFilteredTopics(this.filterParams);
      });
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };

    let checkelement = Array.from(document.getElementsByClassName('mat-paginator-icon') as HTMLCollectionOf<HTMLElement>);
    checkelement.forEach((element) => {
      element.style.backgroundColor = themeData.table_header_background_color;
      element.style.color = themeData.table_font_color;
      element.style.width = '24px';
    });
  }

  // GET PARAMS FOR FILTERING
  getFilterParams() {
    this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
    this.filterParams['content_type'] = 'forum';
    this.filterParams['column'] = 'content_id';
  }

  //Reset PageIndex On Form Changes
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
      this.dataSource.filteredData.data.forEach(row => this.selection.select(row.content_id));
  }
  /**ACTION FUNCTIONS */
  /** SOFT OR PERMENENT DELETE FORUMS */
  deleteTopic(id: number = 0) {

    if (id > 0) {
      this.selection.selected.push(id);
    }
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected Topics?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          let deleteData = {
            'content_id': this.selection.selected
          };
          let deleteUrl = this.isTrashView == true ? 'delete/contentforcedelete' : 'delete/content';
          this._topicService.deleteField(deleteUrl, deleteData)
            .subscribe(deleteResponse => {
              this.selection.clear();
              //Set Page Index to 0
              this.paginator.pageIndex = 0;
              //send filters params again to maintain page limit search .....
              this.getFilterParams();
              this.dataSource.getFilteredTopics(this.filterParams);
              // Show the success message
              this.showSnackBar("Topics deleted Successfully", 'CLOSE');
            },
              error => {
                // Show the error message
                this.showSnackBar(error.message, 'RETRY');
              });
        }
        else {
          this.selection.clear();
        }
        this.confirmDialogRef = null;
      });
  }
  changeStatus(type: string = "A", id: number) {

    this._commonService.changeStatus({ 'id': this.selection.selected.length ? this.selection.selected : [id], 'status': type, 'type': 'Content' })
      .subscribe(statusResponse => {
        this.selection.clear();
        this.getFilterParams();
        this.dataSource.getFilteredTopics(this.filterParams);
        // Show the success message
        this.showSnackBar("status changed successfully", 'CLOSE');
      },
        error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY');
        });
  }
  /**RESTORE TOPICS */
  restoreOrDeleteTopic(id: number = 0, permenent: boolean = false) {
    if (id > 0) {
      this.selection.selected.push(id);
    }
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    let confirmMessage = 'Are you sure you want to restore selected Topic(s)?';
    let apiEndPoint = 'contentrestore';
    let message = "Topic(s) restored successfully";
    //set ApiEndPoint as per flag
    if (permenent == true) {
      confirmMessage = 'Are you sure you want to delete selected Topic(s)? Topics(s) cannot be restored';
      apiEndPoint = 'contentpermanentdelete';
      message = "Topic deleted successfully";
    }

    this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this._commonService.restoreItems({ 'content_id': this.selection.selected, 'endPoint': apiEndPoint })
            .subscribe(restoreResponse => {
              this.selection.clear();
              //Set Page Index to 0
              this.paginator.pageIndex = 0;
              this.getFilterParams();
              this.dataSource.getFilteredTopics(this.filterParams);
              // Show the success message
              this.showSnackBar(message, 'CLOSE');
            },
              error => {
                // Show the error message
                this.showSnackBar(error.message, 'RETRY');
              });
        }
        else {
          this.selection.clear();
        }
        this.confirmDialogRef = null;
      });
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
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
  * @param {CategoryService} _categoryService
  * @param {MatPaginator} _matPaginator
  * @param {MatSort} _matSort
  */
  constructor(
    private _topicService: AnnouncementService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  ) {
    super();
    this.filteredData = this._topicService.topics;
  }

  /**
  * Connect function called by the table to retrieve one stream containing the data to render.
  *
  * @returns {Observable<Home[]>}
  */
  connect(): Observable<Home[]> {
    const displayDataChanges = [
      this._topicService.onTopicsChanged
    ];
    return merge(...displayDataChanges)
      .pipe(
        map(() => {
          let data = this._topicService.topics;
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
  filterData(topicdata): any {
    return topicdata.data.map(c => new Home().deserialize(c, 'topiclist'));
  }
  /**
  * Get Filtered Forums
  * 
  */
  getFilteredTopics(params: any) {
    return this._topicService.getLists(params).then(Response => {
      return Response;
    });
  }
  /**
  * Disconnect
  */
  disconnect(): void {
  }
}