import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, first } from 'rxjs/operators';
import { environment } from 'environments/environment';

import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, AppConfig, PagebuilderService, ChatService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'app/_models/page.model';

import { PreviewComponent } from './preview/preview.component';



@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PagesComponent implements OnInit {

    public green_bg_header: any;
    public button: any;
    public accent: any;
    isTrashView: boolean = false;
    public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    previewDialogRef: MatDialogRef<PreviewComponent>; //EXTRA Changes  

    filterForm: FormGroup;
    filterParams: any = {};
    PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
    Columns: [];
    RoleList: any = {};
    StatusList: any;
    userId: any;
    monthyearList: any;
    displayedColumns: string[];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    _defaultAvatar = "";
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    @ViewChild('table', { static: true }) table: MatTable<any>;
    // Private
    private _unsubscribeAll: Subject<any>;


    constructor(
        private route: ActivatedRoute,
        private _appConfig: AppConfig,
        private _commonService: CommonService,
        private _pageService: PagebuilderService,
        private _chatService: ChatService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

        this.userId = JSON.parse(localStorage.getItem('token')).user_id;
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.StatusList = OptionsList.Options.tables.status.users;
        this.monthyearList = this._pageService.monthyears;
        this.Columns = OptionsList.Options.tables.list.pages;
        this.displayedColumns = OptionsList.Options.tables.list.pages.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._pageService, this.paginator, this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            roles: [''],
            status: [''],
            trash: [''],
            monthyear: ['']
        });

        //Show Buttons Of permenat Delete and restore on trash view
        this.isTrashView = this.route.routeConfig.path == 'admin/pages/trash' ? true : this.isTrashView;
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
                this.dataSource.getFilteredPages(this.filterParams);
            });
        //LISTEN FOR PAGE EDIT EVENT PUSHER
        this.restrictPageAccess();

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
            this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
    }
    /** SOFT OR PERMENENT DELETE PAGE */
    deletePage(pageId: number = 0) {
        if (pageId > 0) {
            this.selection.selected.push(pageId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected page?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._pageService.deletePages({ 'id': this.selection.selected })
                        .subscribe(deleteResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            //send filters params again to maintain page limit search .....
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.dataSource.getFilteredPages(this.filterParams);
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
    /**RESTORE PAGE */
    restoreOrDeletePage(pageId: number = 0, permenent: boolean = false) {
        if (pageId > 0) {
            this.selection.selected.push(pageId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        let confirmMessage = 'Are you sure you want to restore selected page?';
        let apiEndPoint = 'restorepages';
        //set ApiEndPoint as per flag
        if (permenent == true) {
            confirmMessage = 'Are you sure you want to delete selected pages? pages cannot be restored';
            apiEndPoint = 'pagepermanentdelete';
        }

        this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._commonService.restoreItems({ 'id': this.selection.selected, 'endPoint': apiEndPoint })
                        .subscribe(restoreResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.dataSource.getFilteredPages(this.filterParams);
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
    //CHANGE STATUS A/I
    changeStatus(type: string = "A", id: number) {
        this._pageService.changeStatus({ 'id': this.selection.selected.length ? this.selection.selected : [id], 'status': type })
            .subscribe(statusResponse => {
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.dataSource.getFilteredPages(this.filterParams);
                // Show the success message
                this.showSnackBar(statusResponse.message, 'CLOSE');
            },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'RETRY');
                });
    }

    /** Drag and drop table rows */
    dropTable(event: CdkDragDrop<any[]>) {
        const prevIndex = this.dataSource.filteredData.data.findIndex((d) => d.id === event.item.data.id);
        moveItemInArray(this.dataSource.filteredData.data, prevIndex, event.currentIndex);
        this.table.renderRows();
        let sortedRows = this.dataSource.filteredData.data.map((item, index) => { return { id: item.id, order: ++index } })
        this.saveSortRows(sortedRows);
    }
    /**
      * SAVE SORT ROWS OF TABLE
      */
    saveSortRows(rowsSource: any[] = []) {
        this._pageService.saveSorting(rowsSource)
            .pipe(first(), takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    if (data.status == 200) {
                        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                        this.dataSource.getFilteredPages(this.filterParams);
                        this.showSnackBar(data.message, 'CLOSE');
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
    /**PREVIEW PAGE */
    previewPage(pageInfo: any) {
        this.previewDialogRef = this._matDialog.open(PreviewComponent, {
            data: pageInfo,
            disableClose: false
        });
    }
    restrictPageAccess() {
        this._chatService
            .listen(environment.pusher.restrict_event, environment.pusher.accesschannel, (res) => {
                if (res && res.record_id) {
                    //send filters params again to maintain page limit search .....
                    this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                    this.dataSource.getFilteredPages(this.filterParams);
                }

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
     * @param {PagebuilderService} _pageService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _pageService: PagebuilderService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._pageService.pages;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Page[]>}
     */
    connect(): Observable<Page[]> {
        const displayDataChanges = [
            this._pageService.onPagesChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._pageService.pages;
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
    filterData(pagedata): any {
        return pagedata.data.map(c => new Page().deserialize(c, 'list'));
    }
    /**
     * Get Filtered Users
     * 
     */
    getFilteredPages(params: any) {
        return this._pageService.getPages(params).then(Response => {
            return Response;
        });
    }
    getOrderedPages(params: any) {
        this._pageService.getPages(params).then(Response => {
            this.filteredData = Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
