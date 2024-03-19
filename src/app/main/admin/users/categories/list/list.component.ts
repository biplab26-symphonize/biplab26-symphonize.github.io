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
import { OptionsList, CommonService, CategoryService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { Category } from 'app/_models';
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
    filterForm: FormGroup;
    filterParams: any = {};
    PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
    Columns: [];
    StatusList: any;
    displayedColumns: string[];
    isUsersView: boolean = false;
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    categoryType: string = 'INTEREST';
    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;
    addPageLink: string = '/admin/users/interest/add';
    editpageLink: string = '/admin/files/categories/edit/';
    trashPageLink: string = '/admin/users/interests/trash';
    listPageLink: string = '/admin/users/interests/list';
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private route: ActivatedRoute,
        private _categoryService: CategoryService,
        private _commonService: CommonService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {

        //USER INTEREST AND COMMITEE 
        this.categoryType = this.route.data['value'].type;
        console.log("this.categoryType", this.categoryType);
        if (this.route.routeConfig.path == 'admin/users/interests/trash' || this.route.routeConfig.path == 'admin/users/commitees/trash') {
            //Show Buttons Of permenat Delete and restore on trash view
            this.categoryType = this.route.data['value'].type;
            this.isTrashView = true;
        }
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        //Categories List
        this.StatusList = OptionsList.Options.tables.status.users;
        this.Columns = this.setRowColumns();
        this.displayedColumns = this.setdisplayColumns();
        this.dataSource = new FilesDataSource(this._categoryService, this.paginator, this.sort);

        if (this.route.routeConfig.path == 'admin/users/interests/list' || this.route.routeConfig.path == 'admin/users/interests/trash') {
            this.addPageLink = '/admin/users/interest/add';
            this.editpageLink = '/admin/users/interest/edit/';
            this.trashPageLink = '/admin/users/interests/trash';
            this.listPageLink = '/admin/users/interests/list';
        }
        else {
            this.addPageLink = '/admin/users/commitee/add';
            this.editpageLink = '/admin/users/commitee/edit/';
            this.trashPageLink = '/admin/users/commitees/trash';
            this.listPageLink = '/admin/users/commitees/list';
        }


        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            status: [''],
            trash: [''],
            category_type: [this.categoryType]

        });
        this.resetPageIndex(); //#Reset PageIndex of form if search changes
        this.route.data['value'].trash ? this.filterForm.get('trash').setValue(this.route.data['value'].trash) : "";

        merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(res => {
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.filterParams['direction'] = 'desc';
                this.dataSource.getFilteredCategories(this.filterParams);
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
        const numRows = this.dataSource.filteredData.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
    }

    /**ACTION FUNCTIONS */
    /** SOFT OR PERMENENT DELETE Category */
    deleteCategory(catId: number = 0) {
        if (catId > 0) {
            this.selection.selected.push(catId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected ' + this.categoryType.toLowerCase() + '?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._categoryService.deleteCategorys({ 'id': this.selection.selected })
                        .subscribe(deleteResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            //send filters params again to maintain page limit search .....
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.dataSource.getFilteredCategories(this.filterParams);
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

    changeStatus(type: string = "A", id: number) {
        this._commonService.changeStatus({ 'id': this.selection.selected.length ? this.selection.selected : [id], 'status': type, 'type': 'Categories' })
            .subscribe(statusResponse => {
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.dataSource.getFilteredCategories(this.filterParams);
                // Show the success message
                this.showSnackBar(statusResponse.message, 'CLOSE');
            },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'RETRY');
                });
    }
    /**RESTORE Role */
    restoreOrDeleteCategory(catId: number = 0, permenent: boolean = false) {
        if (catId > 0) {
            this.selection.selected.push(catId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        let confirmMessage = 'Are you sure you want to restore selected ' + this.categoryType.toLowerCase() + '?';
        let apiEndPoint = 'categoriesrestore';
        //set ApiEndPoint as per flag
        if (permenent == true) {
            confirmMessage = 'Are you sure you want to delete selected ' + this.categoryType.toLowerCase() + '? ' + this.categoryType.toLowerCase() + ' cannot be restored';
            apiEndPoint = 'categoriespermanentdelete';
        }

        this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._commonService.restoreItems({ 'id': this.selection.selected, 'endPoint': apiEndPoint, 'category_type': this.categoryType })
                        .subscribe(restoreResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.dataSource.getFilteredCategories(this.filterParams);
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
    /** SHOW SNACK BAR */
    showSnackBar(message: string, buttonText: string) {
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration: 2000
        });
    }
    setRowColumns() {
        let columns = OptionsList.Options.tables.list.interests;
        if ((this.route.routeConfig.path == 'admin/users/interests/trash' || this.route.routeConfig.path == 'admin/users/interests/list')) {
            columns = OptionsList.Options.tables.list.interests;
        }
        if ((this.route.routeConfig.path == 'admin/users/commitees/trash' || this.route.routeConfig.path == 'admin/users/commitees/list')) {
            columns = OptionsList.Options.tables.list.commitees;
        }
        return columns;
    }
    setdisplayColumns() {
        let columns = OptionsList.Options.tables.list.interests;
        if ((this.route.routeConfig.path == 'admin/users/interests/trash' || this.route.routeConfig.path == 'admin/users/interests/list')) {
            columns = OptionsList.Options.tables.list.interests;
        }
        if ((this.route.routeConfig.path == 'admin/users/commitees/trash' || this.route.routeConfig.path == 'admin/users/commitees/list')) {
            columns = OptionsList.Options.tables.list.commitees;
        }
        const displayColumns = columns.map(col => col.columnDef);
        return displayColumns;
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
        private _categoryService: CategoryService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._categoryService.Categorys;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Category[]>}
     */
    connect(): Observable<Category[]> {
        const displayDataChanges = [
            this._categoryService.onCategorysChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._categoryService.Categorys;
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
    filterData(categorydata): any {
        return categorydata.data.map(c => new Category().deserialize(c, 'list'));
    }
    /**
     * Get Filtered Category
     * 
     */
    getFilteredCategories(params: any) {
        return this._categoryService.getCategorys(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
