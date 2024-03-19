import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { OptionsList, FormsService, FormentriesService, CommonService, AppConfig, SettingsService } from 'app/_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ExportComponent } from 'app/layout/components/export/export.component';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { FormEntry } from 'app/_models';
import { DialogComponent } from './dialog/dialog.component';
import { ExportEntriesComponent } from './export-entries/export-entries.component';
// import { ExportEntriesComponent } from './export-entries/export-entries.component';


@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class EntriesComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
  public green_bg_header: any;
  public button: any;
  public accent: any;
  // exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
  public title: string = '';
  filterForm: FormGroup;
  filterParams: any = {};
  PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
  Columns: [];
  appConfig: any;
  StatusList: any;
  displayedColumns: string[];
  dataSource: FilesDataSource | null;
  selection = new SelectionModel<any>(true, []);
  public removeButton: boolean = true;
  public trash: boolean = false;
  public url_id: any;
  public FormTypeList: any = [];
  public statusName: any = [];
  public formId: any;
  public filterPrint: any = {};

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };

  // Private
  private _unsubscribeAll: Subject<any>;


  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar
   */
  constructor(
    private _dialog: MatDialog,
    private _formsEntryService: FormentriesService,
    private _commonService: CommonService,
    private settingsservices: SettingsService,
    private _formService: FormsService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.appConfig = AppConfig.Settings;
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    if (this.route.routeConfig.path == 'admin/forms/entries/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;

      //  this.editUserForm = true;
    }

    if (this.route.routeConfig.path == 'admin/entries/trash') {
      this.title = " Form Entry Trash List";
      this.trash = true;
      this.removeButton = false;
    }
    else {

      this.title = " Form Entries";

    }


  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    //Declare Filter Form
    this.filterForm = this._formBuilder.group({
      searchKey: [''],
      roles: [''],
      trash: [''],
      status: [''],
      form_id: [''],
      entry_id: [''],
      bulk_action: ['']
    });

    // DISPLAY THE LIST OF THE FORMS IN FILTER
    this._formService.getForms({ 'direction': 'desc', 'status': '', 'trash': '' }).then(res => {
      this.FormTypeList = res.data;
      // PATCH THE VALUE ACCORING THE FROM ID
      if (this.route.routeConfig.path == 'admin/forms/entries') {
        this.formId = this.FormTypeList[0].form_id;
        this.filterForm.get('form_id').setValue(this.FormTypeList[0].form_id);
      }
    })
    // PATCH THE VALUE ACCORING THE FROM ID
    if (this.route.routeConfig.path == 'admin/forms/entries/:form_id') {
      this.formId = this.route.params['value'].form_id;
      this.filterForm.get('form_id').setValue(Number(this.formId));
    }




    //Pagination Options
    this.PaginationOpt = OptionsList.Options.tables.pagination.options;
    // call the setting serviecs  
    this.settingsservices.getSetting({
      'meta_type': 'F',
      'meta_key': 'form-settings'
    }).then(response => {
      this.statusName = JSON.parse(response.settingsinfo.meta_value);
    })

    this.Columns = OptionsList.Options.tables.list.formEntries;
    this.displayedColumns = OptionsList.Options.tables.list.formEntries.map(col => col.columnDef);
    this.dataSource = new FilesDataSource(this._formsEntryService, this.paginator, this.sort);




    this.resetPageIndex(); //#Reset PageIndex of form if search changes

    merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.selection.clear();
        if (this.filterForm.get('form_id').value !== '') {
          this.formId = this.filterForm.get('form_id').value;
        }else{
          this.formId='';
        }
        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
        this.filterParams['form_id'] = this.formId ? this.formId : '';
        if (this.trash == true) {
          this.filterParams['trash'] = 1;
        }
        else {
          this.filterParams['trash'] = '';
        }
        this.dataSource.getFilteredEntryForms(this.filterParams);
      });

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    let checkelement = Array.from(document.getElementsByClassName('mat-paginator-icon') as HTMLCollectionOf<HTMLElement>);
    checkelement.forEach((element) => {
      element.style.backgroundColor = themeData.table_header_background_color;
      element.style.color = themeData.table_font_color;
      element.style.width = '24px';
    });
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
  deselectAll() {
    this.selection.clear();
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.data.forEach(row => this.selection.select(row.entry_id));
  }

  deleteAll() {
    this.deleteEntry(this.selection.selected);
  }
  deleteEntry(id) {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    if (this.route.routeConfig.path == 'admin/entries/trash') {
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected form entry?';
    } else {
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to trash selected form entry?';
    }

    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          let deleteUrl;
          let deleteData = {
            'entry_id': id.toString().split(',')
          };

          // let deleteUrl =  this.trash==true ? 'delete/formentriespermanentdelete' : 'delete/formentry';
          if (this.route.routeConfig.path == 'admin/entries/trash') {
            deleteUrl = 'delete/formentriespermanentdelete';
          }
          else {
            deleteUrl = 'delete/formentry';
          }
          this._formsEntryService.deleteFormEntry(deleteUrl, deleteData)
            .subscribe(deleteResponse => {
              // Show the success message
              this.selection.clear();
              this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
              if (this.route.routeConfig.path == 'admin/entries/trash') {
                this.filterParams['trash'] = 1;
              }
              else {
                this.filterParams['trash'] = '';

              }
              this.dataSource.getFilteredEntryForms(this.filterParams);
              this.showSnackBar(deleteResponse.message, 'CLOSE');
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

  create_duplicate(entry_id){
     
    let data={
      'entry_id':entry_id
    }
    this._formsEntryService.CopyEntry(data).subscribe(res=>{
      this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
      this.filterParams['trash'] = '';
      this.dataSource.getFilteredEntryForms(this.filterParams);
      this._matSnackBar.open(res.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
     } ,
      error => {
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }
  
  restoreAll() {
    this.restoreItem(this.selection.selected);
  }
  restoreItem(id) {
    let restoreData = {
      'entry_id': id.toString().split(',')
    };
    this._commonService.restore('delete/formentriesrestore', restoreData)
      .subscribe(deleteResponse => {
        // Show the success message
        this.selection.clear();
        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
        this.filterParams['trash'] = 1;
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

  selectionChanged(event) {
    if (event.value == 'print') {
      this.entriesPrint();
    }
    else if (event.value == 'export') {
      this.exprotEntries();
    }

  }

  entriesPrint() {
    const dialogRef = this._dialog.open(DialogComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'recurringUpdateBooking', body: '<h2>Recurring Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.filterForm.get('bulk_action').reset();
      if (result.pagebreak == true) {
        this.filterPrint['pagebreak'] = 1;
      } else {
        this.filterPrint['pagebreak'] = '';
      }
      if (result.adminnotes == true) {
        this.filterPrint['adminnotes'] = 1;
      } else {
        this.filterPrint['adminnotes'] = '';
      }
      let id = this.selection.selected;
      let entry_id = '';
      id.forEach(item => {
        if (entry_id == '') {
          entry_id = item;
        } else {
          entry_id = entry_id + "," + item;
        }
      });
      if (result != 'N') {
        let form_id = this.filterForm.get('form_id').value;
        this.filterPrint['adminprint'] = 1;
        this.filterPrint['form_id'] = form_id;
        this.filterPrint['entry_id'] = entry_id;
        this.getEntriesPrint(this.filterPrint);
      }
    });
  }

  getEntriesPrint(params: any) {
    return this._formsEntryService.getformentryprint(params).then(Response => {
      this.uploadInfo.avatar.url = (Response.pdfinfo ? AppConfig.Settings.url.mediaUrl + Response.pdfinfo : "");
      window.open(this.uploadInfo.avatar.url);

    });
  }

  exprotEntries() {
    this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value)
    let form_id = this.filterForm.get('form_id').value;
    const dialogRef = this._dialog.open(ExportEntriesComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'exportentries',
      data: { form_id: form_id, filterData: this.filterParams }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.filterForm.get('bulk_action').reset();
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
  * @param {FormentriesService} _formsEntryService
  * @param {MatPaginator} _matPaginator
  * @param {MatSort} _matSort
  */
  constructor(
    private _formsEntryService: FormentriesService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort,
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
    return formentrydata.data.map(c => new FormEntry().deserialize(c,'entries')); //*MAS Changes

  }
  /**
  * Get Filtered Form
  * 
  */
  getFilteredEntryForms(params: any) {
    return this._formsEntryService.getformentry(params).then(Response => {
      return Response;

    });
  }
  /**
  * Disconnect
  */
  disconnect(): void {

  }



}

