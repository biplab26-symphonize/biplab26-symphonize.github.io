import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonUtils } from 'app/_helpers';
import { CommonService, FieldsService, OptionsList } from 'app/_services';
import { Fields } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-field-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ListComponent implements OnInit, OnDestroy {
    public green_bg_header: any;
    public button: any;
    public accent: any;
    dialogRef: any;
    isTrashView: boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    filterForm: FormGroup;
    selection = new SelectionModel<any>(true, []);
    trash: boolean = false;
    selectedFields: string[];
    displayedColumns: string[];
    title: string = '';
    Columns: [];
    fields: [];
    dataSource: FilesDataSource | null;
    filterParams: any = {};
    FormTypeList: any;
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
     * @param {FieldsService} _fieldsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _commonService: CommonService,
        private _fieldsService: FieldsService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _routes: ActivatedRoute
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
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.FormTypeList = OptionsList.Options.tables.formtype.fields;
        this.Columns = OptionsList.Options.tables.list.fields;
        this.displayedColumns = OptionsList.Options.tables.list.fields.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._fieldsService, this.paginator, this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            field_form_type: [''],
            roles: [''],
            status: [''],
            trash: ['']
        });

        //Show Buttons Of permenat Delete and restore on trash view

        this.isTrashView = this._routes.routeConfig.path == 'admin/fields/trash' ? true : false;
        this.isTrashView == true ? this.filterForm.get('trash').setValue(this._routes.data['value'].trash) : '';

        this.resetPageIndex(); //#Reset PageIndex of form if search changes

        merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(res => {
                this.selection.clear();
                this.getFilterParam();
                this.dataSource.getFilteredFields(this.filterParams);
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

    // GET FILTERED PARAMS 
    getFilterParam() {
        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
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
    }

    restoreSelectedFields() {

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to restore all selected fields ?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.restoreAllSelectedFields(this.selection.selected);
                }
                else {
                    this.selection.clear();
                }
                this.confirmDialogRef = null;
            });
    }

    restoreField(fieldId) {
        if (fieldId.id > 0) {
            this.selection.selected.push(fieldId.id);
        }

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to restore field?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.restoreAllSelectedFields(this.selection.selected);
            }
            else {
                this.selection.clear();
            }
            this.confirmDialogRef = null;
        });
    }

    restoreAllSelectedFields(id) {

        this.getFilterParam();
        this._fieldsService.restoreFields({ 'id': id })
            .subscribe(Response => {
                if (Response.status == 200) {
                    this.selection.clear();
                    this.dataSource.getFilteredFields(this.filterParams);
                    // Show the success message
                    this.showSnackBar('Field Restored Successfully', 'CLOSE');
                }
            },
                error => {
                    // Show the error message
                    this.selection.clear();
                    this.showSnackBar(error.message, 'RETRY');
                });

    }
    /**
     * Delete selected fields
     */
    deleteSelectedFields(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = this.isTrashView == true ?
            'Are you sure you want to delete all selected fields permanent?' : 'Are you sure you want to delete all selected fields?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.deleteAllSelectedFields(this.selection.selected);
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
    deleteField(fieldId): void {
        if (fieldId.id > 0) {
            this.selection.selected.push(fieldId.id);
        }

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = this.isTrashView == true ? 'Are you sure you want to delete permanent?' : 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteAllSelectedFields(this.selection.selected);
            }
            else {
                this.selection.clear();
            }
            this.confirmDialogRef = null;
        });
    }

    deleteAllSelectedFields(id) {
        this.getFilterParam();
        if (this.isTrashView) {
            this._fieldsService.forceDeleteFields({ 'id': id })
                .subscribe(Response => {
                    if (Response.status == 200) {
                        this.selection.clear();
                        this.dataSource.getFilteredFields(this.filterParams);
                        // Show the success message
                        this.showSnackBar('Field Deleted Successfully', 'CLOSE');
                    }
                },
                    error => {
                        // Show the error message
                        this.selection.clear();
                        this.showSnackBar(error.message, 'RETRY');
                    });
        }
        else {
            this._fieldsService.deleteFields({ 'id': id })
                .subscribe(Response => {
                    if (Response.status == 200) {
                        this.selection.clear();
                        this.dataSource.getFilteredFields(this.filterParams);
                        // Show the success message
                        this.showSnackBar('Field Deleted Successfully', 'CLOSE');
                    }
                },
                    error => {
                        // Show the error message
                        this.selection.clear();
                        this.showSnackBar(error.message, 'RETRY');
                    });
        }
    }

    /** EXPORT USER DATA */
    exportField() {
        this.showSnackBar('Exporting Data', 'CLOSE');
        this.filterParams.type = 'fields';
        this._fieldsService.exportFields(this.filterParams)
            .then(response => {
                this.downloadFile(response);
            },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'RETRY');
                });
    }

    downloadFile(downloadInfo) {
        this._fieldsService.downloadFile(downloadInfo)
            .then(downloadResponse => {
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
     * @param {FieldsService} _fieldsService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _fieldsService: FieldsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._fieldsService.fields;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Fields[]>}
     */
    connect(): Observable<Fields[]> {
        const displayDataChanges = [
            this._fieldsService.onFieldsChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._fieldsService.fields;
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
    filterData(fielddata): any {
        return fielddata.data.map(c => new Fields().deserialize(c, 'list'));
    }
    /**
     * Get Filtered fields
     * 
     */
    getFilteredFields(params: any) {
        return this._fieldsService.getFields(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
