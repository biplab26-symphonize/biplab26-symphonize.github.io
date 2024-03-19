import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { MatSort, MatPaginator, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes

//Export Option Compo
import { ExportComponent } from 'app/layout/components/export/export.component';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, StaffService, AppConfig, UsersService, SettingsService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { User } from 'app/_models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
    public green_bg_header: any;
    public button: any;
    public accent: any;
    isTrashView: boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes 
    filterForm: FormGroup;
    filterParams: any = {};
    PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
    Columns: [];
    StatusList: any;
    displayedColumns: string[];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    _defaultAvatar = "";
    staffSettings: any;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

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
        private route: ActivatedRoute,
        private _commonService: CommonService,
        private _userService: UsersService,
        private _staffService: StaffService,
        private _settingService: SettingsService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.staffSettings = this._settingService.setting ? CommonUtils.getStringToJson(this._settingService.setting.settingsinfo.meta_value) : this.staffSettings;

        this._defaultAvatar = this.staffSettings ? AppConfig.Settings.url.mediaUrl + this.staffSettings.defaultprofile : AppConfig.Settings.url.defaultAvatar;
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.StatusList = OptionsList.Options.tables.status.users;
        this.Columns = OptionsList.Options.tables.list.staffss;
        this.displayedColumns = OptionsList.Options.tables.list.staffss.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._staffService, this.paginator, this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            status: [''],
            roles: [''],
            trash: [''],
            display: ['list']

        });
        //Show Buttons Of permenat Delete and restore on trash view
        this.isTrashView = this.route.routeConfig.path == 'admin/staff/trash' ? true : this.isTrashView;
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
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.dataSource.getFilteredUsers(this.filterParams);
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
    //Reset PageIndex On Form Changes
    resetPageIndex() {
        this.filterForm.valueChanges.subscribe(data => {
            this.paginator.pageIndex = 0;
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.filteredData.stafflist.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.filteredData.stafflist.data.forEach(row => this.selection.select(row.id));
    }
    /**ACTION FUNCTIONS */
    /** SOFT OR PERMENENT DELETE USER */
    deleteUser(userId: number = 0) {
        if (userId > 0) {
            this.selection.selected.push(userId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected Staff?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._userService.deleteUsers({ 'user_id': this.selection.selected })
                        .subscribe(deleteResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            //send filters params again to maintain page limit search .....
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.dataSource.getFilteredUsers(this.filterParams);
                            // Show the success message
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
    //Change status  
    changeStatus(type: string = "A", id: number) {
        this._commonService.changeStatus({ 'id': this.selection.selected.length ? this.selection.selected : [id], 'status': type, 'type': 'Resident' })
            .subscribe(statusResponse => {
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.filterParams['direction'] = 'desc';
                this.dataSource.getFilteredUsers(this.filterParams);
                // Show the success message
                this.showSnackBar(statusResponse.message, 'CLOSE');
            },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'RETRY');
                });
    }
    /**RESTORE USER */
    restoreOrDeleteUser(userId: number = 0, permenent: boolean = false) {
        if (userId > 0) {
            this.selection.selected.push(userId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        let confirmMessage = 'Are you sure you want to restore selected Staff?';
        let apiEndPoint = 'userrestore';
        //set ApiEndPoint as per flag
        if (permenent == true) {
            confirmMessage = 'Are you sure you want to delete selected Staff? Staff cannot be restored';
            apiEndPoint = 'userpermanentdelete';
        }

        this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._commonService.restoreItems({ 'user_id': this.selection.selected, 'endPoint': apiEndPoint })
                        .subscribe(restoreResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.dataSource.getFilteredUsers(this.filterParams);
                            // Show the success message
                            this.showSnackBar(restoreResponse.message, 'CLOSE');
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

    exportStaff() {
        this.exportDialogref = this._matDialog.open(ExportComponent, {
            disableClose: false
        });
        this.exportDialogref.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.showSnackBar('Exporting Data', 'CLOSE');
                    this.filterParams.type = result;
                    this._commonService.exportStaff(this.filterParams);
                }
                this.exportDialogref = null;
            });
    }

    /** SHOW SNACK BAR */
    showSnackBar(message: string, buttonText: string) {
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration: 2000
        });
    }




}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');
    /**
     * Constructor
     *
     * @param {StaffService} _staffService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _staffService: StaffService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._staffService.users;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<User[]>}
     */
    connect(): Observable<User[]> {
        const displayDataChanges = [
            this._staffService.onUsersChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._staffService.users;
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
    filterData(staffdata): any {
        return staffdata.stafflist.data.map(c => new User().deserialize(c, 'stafflist'));
    }
    /**
     * Get Filtered Users
     * 
     */
    getFilteredUsers(params: any) {
        return this._staffService.getStaffs(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
