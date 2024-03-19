import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged, map, first } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { CommonService, AnnouncementService, OptionsList } from 'app/_services';
import { Home } from 'app/_models';
import { DatePipe } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-scroll',
    templateUrl: './scroll.component.html',
    styleUrls: ['./scroll.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ScrollComponent implements OnInit {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    public green_bg_header: any;
    public button: any;
    public accent: any;
    public title: string = '';
    public removeButton: boolean = true;
    public trash: boolean = false;
    public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
    filterForm: FormGroup;
    PaginationOpt: any = {}; //pagination size,page options
    Columns: [];
    RoleList: any = {};
    StatusList: any;
    displayedColumns: string[];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<Home>(true, []);
    filterParams: any = {};
    generalSettings: any;
    timeFormat: any;
    dateFormat: any;
    @ViewChild('table', { static: true }) table: MatTable<any>;
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
        private _announceService: AnnouncementService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _commonService: CommonService,
        private route: ActivatedRoute,
        private datePipe: DatePipe
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (this.route.routeConfig.path == "admin/announcement/scrolling/trash") {
            this.title = " Scrolling Announcement Trash List"
            this.trash = true;
            this.removeButton = false;
        }
        else {
            this.title = " Scrolling Announcement"
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // set defoult time
        this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.StatusList = OptionsList.Options.tables.status.users;
        this.Columns = OptionsList.Options.tables.list.announcement;
        this.displayedColumns = OptionsList.Options.tables.list.announcement.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._announceService, this.paginator, this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            roles: [''],
            status: [''],
            trash: [''],
            datefilter: ['']
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
                this.trash == true ? this.filterParams['content_type'] = "scroll-announcement" : this.filterParams['content_type'] = "scroll-announcement";
                this.trash == true ? this.filterParams['trash'] = 1 : '';
                this.filterParams['column'] = 'order';                
                this.dataSource.getFilteredAnnouncement(this.filterParams);
            });

        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
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
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.filteredData.data.forEach(row => this.selection.select(row.content_id));
    }

    deselectAll() {
        this.selection.clear();
    }
    deleteAll() {
        this.deleteItem(this.selection.selected);
    }

    /** Drag and drop table rows */
    dropTable(event: CdkDragDrop<any[]>) {
        const prevIndex = this.dataSource.filteredData.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.dataSource.filteredData.data, prevIndex, event.currentIndex);
        this.table.renderRows();
        let sortedRows = this.dataSource.filteredData.data.map((item, index) => { return { content_id: item.content_id, order: ++index } })
        this.saveSortRows(sortedRows);

    }


    /**
  * SAVE SORT ROWS OF TABLE
  */
    saveSortRows(rowsSource: any[] = []) {
        let rowsRequest = { datasource: rowsSource };        
        this._announceService.saveSorting(rowsRequest)
            .pipe(first(), takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    if (data.status == 200) {
                        this.showSnackBar(data.message, 'CLOSE');
                        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                        this.trash == true ? this.filterParams['content_type'] = "scroll-announcement" : this.filterParams['content_type'] = "scroll-announcement";
                        this.trash == true ? this.filterParams['trash'] = 1 : '';
                        this.filterParams['column'] = 'order';                        
                        this.dataSource.getFilteredAnnouncement(this.filterParams);
                    }
                    else {
                        this.showSnackBar(data.message, 'CLOSE');
                    }

                },
                error => {
                    // Show the error message
                    this._matSnackBar.open(error.message, 'Retry', {
                        verticalPosition: 'top',
                        duration: 2000
                    });
                });
    }

    /** SHOW SNACK BAR */
    showSnackBar(message: string, buttonText: string) {
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration: 2000
        });
    }
    /**ACTION FUNCTIONS */
    deleteItem(id) {

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        if (this.route.routeConfig.path == "admin/announcement/scrolling/trash") {
            this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected announcement?';
        } else {
            this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to trash selected announcement?';

        }
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'content_id': id.toString().split(',')
                    };
                    let deleteUrl = this.trash == true ? 'delete/contentpermanentdelete' : 'delete/content';

                    this._announceService.deleteField(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.trash == true ? this.filterParams['content_type'] = "scroll-announcement" : this.filterParams['content_type'] = "scroll-announcement";
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.filterParams['column'] = 'order';                            
                            this.dataSource.getFilteredAnnouncement(this.filterParams);
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
                this.confirmDialogRef = null;
            });
    }


    changeSingleStatus(type, id) {
        this.changeStatus(type, id)
    }
    //CHANGE STATUS
    changeStatus(type: string = "A", selectid) {

        let contentid;
        if (this.selection.selected) {
            contentid = this.selection.selected
        }
        if (selectid) {
            contentid = selectid.toString().split(",");
        }

        this._commonService.changeStatus({ 'id': contentid, 'status': type, 'type': 'Content' })
            .subscribe(statusResponse => {
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.trash == true ? this.filterParams['content_type'] = "scroll-announcement" : this.filterParams['content_type'] = "scroll-announcement";
                this.filterParams['column'] = 'order';                
                this.trash == true ? this.filterParams['trash'] = 1 : '';
                this.dataSource.getFilteredAnnouncement(this.filterParams);
                // Show the success message
                this._matSnackBar.open(statusResponse.message, 'CLOSE', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            },
                error => {
                    // Show the error message
                    this._matSnackBar.open(error.message, 'RETRY', {
                        verticalPosition: 'top',
                        duration: 2000
                    });
                });
    }

    //RESTORE
    restoreAll() {
        this.restoreItem(this.selection.selected);
    }
    restoreItem(id) {
        let restoreData = {
            'content_id': id.toString().split(',')
        };
        this._commonService.restore('delete/contentrestore', restoreData)
            .subscribe(deleteResponse => {
                // Show the success message
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.trash == true ? this.filterParams['content_type'] = "scroll-announcement" : this.filterParams['content_type'] = "scroll-announcement";
                this.trash == true ? this.filterParams['trash'] = 1 : '';
                this.filterParams['column'] = 'order';                
                this.dataSource.getFilteredAnnouncement(this.filterParams);
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
     * @param {AnnouncementService} _announceService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _announceService: AnnouncementService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
    ) {
        super();

        // this.filteredData = this._announceService.home;
        let data = this._announceService.home;
        this.filteredData = data;
        this.filterData(this.filteredData);
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Home[]>}
     */
    connect(): Observable<Home[]> {
        const displayDataChanges = [
            this._announceService.onAnnounceChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._announceService.home;
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
    filterData(Announcementdata): any {
        return Announcementdata.data.map(c => new Home().deserialize(c, 'listAnn'));
    }
    /**
     * Get Filtered Users
     * 
     */
    getFilteredAnnouncement(params: any) {
        return this._announceService.getLists(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}