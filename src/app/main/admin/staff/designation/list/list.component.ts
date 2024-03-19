import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
//import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CategoryService, CommonService } from 'app/_services';
import { Category } from 'app/_models';

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
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    filterForm: FormGroup;
    selection = new SelectionModel<any>(true, []);
    trash: boolean = false;
    selectedCategory: string[];
    displayedColumns: string[];
    title: string = '';
    Columns: [];
    Category: [];
    dataSource: FilesDataSource | null;
    filterParams: any = {};
    StatusList: any;
    PaginationOpt: any; //pagination size,page options

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Categoryservice} _categoryservice
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _categoryservice: CategoryService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _commonService: CommonService,
        private _router: Router,
        private _routes: ActivatedRoute
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (this._routes.routeConfig.path == "admin/title/trash") {
            this.trash = true;
        }
        this.title = this.trash == true ? 'trash list' : 'Title';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.StatusList = OptionsList.Options.tables.status.users;
        this.Columns = OptionsList.Options.tables.list.designation;
        this.displayedColumns = OptionsList.Options.tables.list.designation.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._categoryservice, this.paginator, this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            roles: [''],
            status: [''],
            trash: [''],
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
                this.getFilterParams();
                this.dataSource.getFilteredCategory(this.filterParams);
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
        this.filterParams['trash'] = this.trash == true ? 1 : '';
        this.filterParams['category_type'] = 'DESIGNATION';        
        console.log("filterParams",this.filterParams); 
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

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.trash = false;
    }

    //Change status  
    changeStatus(type: string = "A", id: number) {
        this.getFilterParams();
        this._commonService.changeStatus({ 'id': this.selection.selected.length ? this.selection.selected : [id], 'status': type, 'type': 'Categories' })
            .subscribe(statusResponse => {
                this.selection.clear();
                this.dataSource.getFilteredCategory(this.filterParams);
                // Show the success message
                this.showSnackBar(statusResponse.message, 'CLOSE');
            },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'RETRY');
                });
    }

    restoreSelectedCategory() {

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to restore all selected title ?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.restoreAllSelectedCategory(this.selection.selected);
                }
                else {
                    this.selection.clear();
                }
                this.confirmDialogRef = null;

            });
    }

    restoreCategory(Id) {
        if (Id.id > 0) {
            this.selection.selected.push(Id.id);
        }

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to restore title?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.restoreAllSelectedCategory(this.selection.selected);
            }
            else {
                this.selection.clear();
            }
            this.confirmDialogRef = null;
        });
    }

    restoreAllSelectedCategory(id) {

        this.getFilterParams();
        this._categoryservice.restoreCategorys({ 'id': id, 'category_type': 'DESIGNATION' })
            .subscribe(Response => {
                this.selection.clear();
                this.paginator.pageIndex = 0;
                this.dataSource.getFilteredCategory(this.filterParams);
                // Show the success message
                this.showSnackBar(Response.message, 'CLOSE');
            },
                error => {
                    // Show the error message
                    this.selection.clear();
                    this.showSnackBar(error.message, 'RETRY');
                });

    }

    /**
     * Delete selected Category
     */
    deleteSelectedCategory(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
 
        this.confirmDialogRef.componentInstance.confirmMessage = this.trash == true ?
            'Are you sure you want to delete all selected title permanent?' : 'Are you sure you want to delete all selected title?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    console.log("delete multi");
                    this.deleteAllSelectedCategory(this.selection.selected);
                }
                else {
                    this.selection.clear();
                }
                this.confirmDialogRef = null;
            });
    }

    /**
     * Delete field
     */
    deleteCategory(Id): void {
        if (Id.id > 0) {
            this.selection.selected.push(Id.id);
        }

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = this.trash == true ? 'Are you sure you want to delete permanent?' : 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log("delete");
                this.deleteAllSelectedCategory(this.selection.selected);
            }
            else {
                this.selection.clear();
            }
            this.confirmDialogRef = null;
        });
    }

    deleteAllSelectedCategory(id) {
        this.getFilterParams();
        if (this.trash) {
            this._categoryservice.forceDeleteCategorys({ 'id': id, 'category_type': 'DESIGNATION' })
                .subscribe(Response => {
                    this.selection.clear();
                    this.paginator.pageIndex = 0;
                    this.dataSource.getFilteredCategory(this.filterParams);
                    // Show the success message
                    this.showSnackBar(Response.message, 'CLOSE');
                },
                    error => {
                        // Show the error message
                        this.selection.clear();
                        this.showSnackBar(error.message, 'RETRY');
                    });
        }
        else {
            this._categoryservice.deleteCategorys({ 'id': id, 'category_type': 'DESIGNATION' })
                .subscribe(Response => {
                    this.selection.clear();
                    this.dataSource.getFilteredCategory(this.filterParams);
                    // Show the success message
                    this.showSnackBar(Response.message, 'CLOSE');
                },
                    error => {
                        // Show the error message
                        this.selection.clear();
                        this.showSnackBar(error.message, 'RETRY');
                    });
        }
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
     * @param {CategoryService} _categoryService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _categoryservice: CategoryService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._categoryservice.Categorys;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Category[]>}
     */
    connect(): Observable<Category[]> {
        const displayDataChanges = [
            this._categoryservice.onCategorysChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._categoryservice.Categorys;
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
    filterData(designationdata): any {
        return designationdata.data.map(c => new Category().deserialize(c, 'list'));
    }
    /**
     * Get Filtered Designation
     * 
     */
    getFilteredCategory(params: any) {
        return this._categoryservice.getCategorys(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
