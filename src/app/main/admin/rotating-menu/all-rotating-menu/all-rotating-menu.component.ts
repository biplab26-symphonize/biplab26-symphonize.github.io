import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { OptionsList, CategoryService, RotatingMenuService, CommonService } from 'app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { CommonUtils } from 'app/_helpers';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ExportComponent } from 'app/layout/components/export/export.component';
import { Menus } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';


@Component({
    selector: 'app-all-rotating-menu',
    templateUrl: './all-rotating-menu.component.html',
    styleUrls: ['./all-rotating-menu.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AllRotatingMenuComponent implements OnInit {


    PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    public green_bg_header: any;
    public button: any;
    public accent: any;
    orderOptions: any = {};
    sortingOptions: any = {};
    displayedColumns: string[];
    viewPdfdata: any = [];
    Categories: any = {};
    filterForm: FormGroup;
    selection = new SelectionModel<any>(true, []);
    Columns: [];
    dataSource: any;
    filterParams: any = {};
    documentSort: Object = {};
    public removeButton: boolean = true;
    public trash: boolean = false;
    private _unsubscribeAll: Subject<any>;
    menuInfo: any = {};

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;


    constructor(
        private route: ActivatedRoute,
        private _rotatingmenuservices: RotatingMenuService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        public router: Router,
        private _commonService: CommonService,
        private http: HttpClient,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {

        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.Columns = OptionsList.Options.tables.list.rotatingmenus;
        this.displayedColumns = OptionsList.Options.tables.list.rotatingmenus.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._rotatingmenuservices, this.paginator, this.sort);


        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            roles: [''],
            status: [''],
            trash: ['']

        });

        this.viewPdfdata = this._rotatingmenuservices.rotatingmenu.data;

        this.resetPageIndex(); //#Reset PageIndex of form if search changes
        //  this.paginator.page,
        merge(this.sort.sortChange, this.filterForm.valueChanges)
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(res => {
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.filterParams['menu_source'] = 'RDM';
                this.filterParams['type'] = 'display';
                this.filterParams['column'] = '';
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
        const numRows = this.dataSource.filteredData.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.filteredData.forEach(row => this.selection.select(row.menu_title));
    }

    deselectAll() {
        this.selection.clear();
    }

    /** SHOW SNACK BAR */
    showSnackBar(message: string, buttonText: string) {
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration: 2000
        });
    }


    viewalldata(id) {
        for (let i = 0; i < this.viewPdfdata.length; i++) {

            if (this.viewPdfdata[i].menu_id == id && id !== null) {

                this.router.navigate(['/admin/all-rotating-menu/view/', this.viewPdfdata[i].rotatingmenu.id]);
            }
        }
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
    aprovalArray = [];

    /**
     * Constructor
     *
     * @param {FormsService} _formService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _rotatingmenuservices: RotatingMenuService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._rotatingmenuservices.rotatingmenu;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Form[]>}
     */
    connect(): Observable<Menus[]> {
        const displayDataChanges = [
            this._rotatingmenuservices.menuChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {

                    this._rotatingmenuservices.rotatingmenu.data.map(item => {
                        this.aprovalArray.push(item)
                        if (item.children.length != 0) {
                            for (let i = 0; i < item.children.length; i++) {
                                this.aprovalArray.push(item.children[i])
                            }

                        }
                    })

                    let data = this.aprovalArray;
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
        return formdata.map(c => new Menus().deserialize(c));

    }
    /**
     * Get Filtered Form
     * 
     */
    getFilteredForms(params: any) {
        return this._rotatingmenuservices.getroatingmenu(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }

}