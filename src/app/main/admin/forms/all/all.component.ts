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
import { OptionsList, CommonService, FormsService, AppConfig } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { ExportComponent } from 'app/layout/components/export/export.component';
import { Form } from 'app/_models';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';

@Component({
    selector: 'app-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AllComponent implements OnInit {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
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
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    public removeButton: boolean = true;
    public trash: boolean = false;
    appConfig: any;
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
        private _formsService: FormsService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private route: ActivatedRoute,
        private _commonService: CommonService,
        private http: HttpClient,
        private _fileSaverService: FileSaverService,
    ) {
        this.appConfig = AppConfig.Settings;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (this.route.routeConfig.path == "admin/forms/trash") {
            this.title = "Form Trash List"
            this.trash = true;
            this.removeButton = false;
        }
        else {
            this.title = "All Forms"
        }
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
        this.Columns = OptionsList.Options.tables.list.form;
        this.displayedColumns = OptionsList.Options.tables.list.form.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._formsService, this.paginator, this.sort);


        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            roles: [''],
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
                this.trash == true ? this.filterParams['trash'] = 1 : '';
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

    deselectAll() {
        this.selection.clear();
    }

    deleteAll() {
        this.deleteForm(this.selection.selected)
    }
    /**ACTION FUNCTIONS */
    deleteForm(id) {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected form?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'form_id': id.toString().split(','),
                        'form category': 'F'
                    };
                    let deleteUrl = this.trash == true ? 'delete/formpermanentdelete' : 'delete/forms';
                    this._formsService.deleteForms(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.dataSource.getFilteredForms(this.filterParams);
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
    export() {
        this._formsService.getExportFile('export/forms', [])
            .subscribe(response => {
                this.showSnackBar(response.message, 'CLOSE');
                let index = response.exportinfo.filepath.lastIndexOf("/") + 1;
                let fileName = response.exportinfo.filepath.substr(index, response.exportinfo.filepath.size).toLocaleLowerCase();
                this.http.get(this.appConfig.url.mediaUrl + response.exportinfo.filepath,
                    {
                        observe: 'response', responseType: 'blob'
                    }).subscribe(res => {
                        this._fileSaverService.save(res.body, fileName)
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
    restoreAll() {
        this.restoreItem(this.selection.selected);
    }
    restoreItem(id) {
        let restoreData = {
            'form_id': id.toString().split(','),
            'form category': 'F'
        };
        this._commonService.restore('delete/formsrestore', restoreData)
            .subscribe(deleteResponse => {
                // Show the success message
                this.selection.clear();
                this.trash == true ? this.filterParams['trash'] = 1 : '';
                this.dataSource.getFilteredForms(this.filterParams);
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

    openForm(form_name) {
        console.log(form_name);
        window.open(this.appConfig.url.siteUrl + 'forms/view/' + form_name);

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
        private _formsService: FormsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._formsService.forms;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Form[]>}
     */
    connect(): Observable<Form[]> {
        const displayDataChanges = [
            this._formsService.onFormsChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._formsService.forms;
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
        return formdata.data.map(c => new Form().deserialize(c));
    }
    /**
     * Get Filtered Form
     * 
     */
    getFilteredForms(params: any) {
        return this._formsService.getForms(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}