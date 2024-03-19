import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OptionsList, CommonService, AppConfig, ActivitylogService, SettingsService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { Activitylog } from 'app/_models';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { ExportComponent } from 'app/layout/components/export/export.component';

@Component({
    selector: 'app-log-list',
    templateUrl: './log-list.component.html',
    styleUrls: ['./log-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class LogListComponent implements OnInit {

    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes
    public green_bg_header: any;
    public button: any;
    public accent: any;
    //  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    public title: string = '';
    filterForm: FormGroup;
    filterParams: any = {};
    PaginationOpt: any = {}; //pagination size,page options
    Columns: [];
    RoleList: any = {};
    StatusList: any;
    displayedColumns: string[];
    AllFilterData;
    _defaultAvatar = '';
    staffSettings: any;
    Alltype: any = [];
    Allaction: any = [];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    public removeButton: boolean = true;
    public trash: boolean = false;
    appConfig: any;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
    @ViewChild('filter', { static: true })
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
        private _activitylog: ActivitylogService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _settingService: SettingsService,
        private _commonService: CommonService,
        private settingsservices: SettingsService,
        private http: HttpClient,
        private _fileSaverService: FileSaverService,
    ) {
        this.appConfig = AppConfig.Settings;
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.title = "All Logs";

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.settingsservices.getSetting({ 'meta_type': 'U', 'meta_key': 'users_settings' }).then(response => {
            let defaultdata = JSON.parse(response.settingsinfo.meta_value);
            this._defaultAvatar = defaultdata.users_settings.defaultprofile ? AppConfig.Settings.url.mediaUrl + defaultdata.users_settings.defaultprofile : AppConfig.Settings.url.defaultAvatar;
            console.log(this._defaultAvatar)
        })
        this._activitylog.getFilterData().subscribe(res => {
            if (res.status == 200) {
                this.AllFilterData = res;
                this.Alltype = Object.keys(res.type).map(key => ({ type: key, value: res.type[key] }));
                this.Allaction = Object.keys(res.action).map(key => ({ type: key, value: res.action[key] }));
            }
        })
        //Pagination Options
        //   this.staffSettings = this._settingService.setting ? CommonUtils.getStringToJson(this._settingService.setting.settingsinfo.meta_value) : this.staffSettings;
        //   this._defaultAvatar     = this.staffSettings ? AppConfig.Settings.url.mediaUrl + this.staffSettings.defaultprofile : AppConfig.Settings.url.defaultAvatar; 

        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.Columns = OptionsList.Options.tables.list.activitylog;
        this.displayedColumns = OptionsList.Options.tables.list.activitylog.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._activitylog, this.paginator, this.sort);

        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;


        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            type: [''],
            user_id: [''],
            role_id: [''],
            datefilter: [''],
            action: ['']


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
                this.filterParams['role_id'] = this.filterForm.get('role_id').value ? this.filterForm.get('role_id').value : '';
                this.filterParams['type'] = this.filterForm.get('type').value ? this.filterForm.get('type').value : '';
                this.filterParams['action'] = this.filterForm.get('action').value ? this.filterForm.get('action').value : '';
                this.filterParams['datefilter'] = this.filterForm.get('datefilter').value ? this.filterForm.get('datefilter').value : '';
                this.filterParams['user_id'] = this.filterForm.get('user_id').value ? this.filterForm.get('user_id').value : '';
                this.dataSource.getFilteredForms(this.filterParams);
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
            console.log("element", element);
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
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.filteredData.data.forEach(row => this.selection.select(row.form_id));
    }

    restedata() {
        this.filterForm.get('role_id').setValue('');
        this.filterForm.get('type').setValue('');
        this.filterForm.get('action').setValue('');
        this.filterForm.get('datefilter').setValue('');
        this.filterForm.get('user_id').setValue('');
    }

    /** SHOW SNACK BAR */
    showSnackBar(message: string, buttonText: string) {
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration: 2000
        });
    }

    exportActivityLog() {
        this.exportDialogref = this._matDialog.open(ExportComponent, {
            disableClose: false
        });
        this.exportDialogref.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.showSnackBar('Exporting Data', 'CLOSE');
                    this.filterParams.type = result;
                    this.filterParams['moduletype'] = this.filterForm.get('type').value ? this.filterForm.get('type').value : '';
                    this._commonService.exportActivityLog(this.filterParams);
                }
                this.exportDialogref = null;
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
     * @param {FormsService} _formService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _activitylog: ActivitylogService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._activitylog.logs;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Activitylog[]>}
     */
    connect(): Observable<Activitylog[]> {
        const displayDataChanges = [
            this._activitylog.onlogChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._activitylog.logs;
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
    filterData(formdata): any {
        return formdata.data.map(c => new Activitylog().deserialize(c));
    }
    /**
     * Get Filtered Form
     * 
     */
    getFilteredForms(params: any) {
        return this._activitylog.getLogs(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
