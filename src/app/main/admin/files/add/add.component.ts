import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import { AppConfig, OptionsList, FilesService, CategoryService, CommonService, SettingsService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { SelectionModel } from '@angular/cdk/collections';
//Show Apply Category ModalBox
import { ApplyCategoryComponent } from 'app/main/admin/files/edit/applycategory/applycategory.component';
//Show Edit Document Form
import { EditComponent } from 'app/main/admin/files/edit/edit.component';


@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AddComponent {

    public green_bg_header: any;
    public button: any;
    public accent: any;
    _localUserSettings: any;
    isSubmit: boolean = false;
    isTrashView: boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    editDialogRef: MatDialogRef<EditComponent>; //EXTRA Changes  
    categoryDialogRef: MatDialogRef<ApplyCategoryComponent>; //EXTRA Changes  
    sortingForm: FormGroup;
    filterForm: FormGroup;
    filterParams: any = {};
    PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
    public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
    Columns: [];
    orderOptions: any = {};
    sortingOptions: any = {};
    sortedCategories: any[] = [];
    Categories: any = {};
    StatusList: any;
    menuInfo: any = {};
    displayedColumns: string[];
    _appConfig: any = AppConfig.Settings;
    dataSource: any;
    documentSort: Object = {}; //sorting options auto selected
    _defaultAvatar = "";
    fileUploaderSettings: any = {};
    @ViewChild('table', { static: true }) table: MatTable<any>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    selection = new SelectionModel<any>(true, []);
    singleselection = new SelectionModel<any>(true, []);

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FilesService} _filesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private route: ActivatedRoute,
        private _categoryService: CategoryService,
        private _fileSettings: SettingsService,
        private _commonService: CommonService,
        private _filesService: FilesService,
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
    ngOnInit(): void {      //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.orderOptions = OptionsList.Options.tables.list.orderoptions;
        this.sortingOptions = OptionsList.Options.tables.list.sortingoptions;
        this.Columns = OptionsList.Options.tables.list.docuploads;
        this.displayedColumns = OptionsList.Options.tables.list.docuploads.map(col => col.columnDef);
        //Settings
        this._fileSettings.getSetting({ 'meta_key': 'documentsettings' }).then(filesettings => {
            if (filesettings.status == 200) {
                const UploaderSettings = JSON.parse(filesettings.settingsinfo.meta_value) || [];
                this.fileUploaderSettings = UploaderSettings.length > 0 ? UploaderSettings[0] : {};
                console.log(this.fileUploaderSettings);
            }

        })
        //FormData
        this.Categories = this._categoryService.Categorys.data || [];
        this.menuInfo = this.route.snapshot.data.menu.menuinfo;
        this.dataSource = this.route.snapshot.data.documents.data || {};
        this.documentSort = this.route.snapshot.data.documents.documentsort || {};

        //If documentSort is not empty for category sorting
        if (this.documentSort['categories'] && this.documentSort['order_type'] == 'autosort') {
            let categoriesArr = this.documentSort['categories'].split(',');
            this.Categories = CommonUtils.sortJsonbyArray(this.Categories, categoriesArr || []);
        }

        //Declare Sorting Form
        this.sortingForm = this._formBuilder.group({
            menu_id: [this.menuInfo.menu_type == 'S' && this.menuInfo.menu_parent_id > 0 ? this.menuInfo.menu_parent_id : ''],
            submenu_id: [this.menuInfo.menu_id],
            order_type: [this.documentSort['order_type'] || 'dragdrop', Validators.required],
            categories: [''],
            order_dir: [this.documentSort['order_dir'] || '', Validators.required],
            status: ['1', Validators.required],
            type: ['criteria'],
            preview: ['1']
        });

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            menu_id: [this.menuInfo.menu_id],
            menu_type: ['page'],
            status: [''],
            trash: [this.isTrashView ? '1' : ''],
            position: ['page']
        });

        //Sort Categories and save it in sortedCategories to pass api
        this.sortCategories();

        //Show Buttons Of permenat Delete and restore on trash view
        this.isTrashView = this.route.routeConfig.path == 'admin/files/trash/:id' ? true : this.isTrashView;
        this.route.data['value'].trash ? this.filterForm.get('trash').setValue(this.route.data['value'].trash) : "";
        this.resetPageIndex(); //#Reset PageIndex of form if search changes

        merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(res => {
                this.refreshDocumentsList();
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
    }
    /** get updated documents list */
    refreshDocumentsList() {
        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
        this._filesService.getDocuments(this.filterParams).subscribe(docResponse => {
            if (docResponse.status == 200) {
                this.dataSource = docResponse.data;
            }
        });
    }
    previewDocumentsList() {
        this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
        if (this.sortingForm.get('order_type').value == 'autosort') {
            this.filterParams = Object.assign(this.sortingForm.value, this.filterParams);
        }
        this._filesService.getDocuments(this.filterParams).subscribe(docResponse => {
            if (docResponse.status == 200) {
                this.dataSource = docResponse.data;
            }
        });
    }
    /**SAVE FORM DATA */
    saveSortCriteria() {
        event.preventDefault();
        event.stopPropagation();
        if (this.sortingForm.valid) {
            this.isSubmit = true;
            this._filesService.saveSorting(this.sortingForm.value)
                .pipe(first(), takeUntil(this._unsubscribeAll))
                .subscribe(
                    data => {
                        if (data.status == 200) {
                            this.showSnackBar(data.message, 'CLOSE');
                            this.previewDocumentsList();
                        }
                        else {
                            this.showSnackBar(data.message, 'CLOSE');
                        }
                        this.isSubmit = false;
                    },
                    error => {
                        // Show the error message
                        this._matSnackBar.open(error.message, 'Retry', {
                            verticalPosition: 'top',
                            duration: 2000
                        });
                    });
        }
    }
    /**
    * SAVE SORT ROWS OF TABLE
    */
    saveSortRows(rowsSource: any[] = []) {
        let rowsRequest = { datasource: rowsSource, type: 'rows' };
        console.log(rowsRequest);
        this._filesService.saveSorting(rowsRequest)
            .pipe(first(), takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    if (data.status == 200) {
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
    //Reset PageIndex On Form Changes
    resetPageIndex() {
        this.filterForm.valueChanges.subscribe(data => {
            this.paginator.pageIndex = 0;
        });
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row.doc_id));
    }

    /** SHOW SNACK BAR */
    showSnackBar(message: string, buttonText: string) {
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration: 2000
        });
    }
    /**Categories dragdrop sorting */
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.Categories, event.previousIndex, event.currentIndex);
        console.log(this.sortingForm.value);
        this.sortCategories();
    }
    /** Drag and drop table rows */
    dropTable(event: CdkDragDrop<any[]>) {
        const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
        this.table.renderRows();
        let sortedRows = this.dataSource.data.map((item, index) => { return { doc_id: item.doc_id, order: ++index } })
        this.saveSortRows(sortedRows);

    }
    sortCategories() {
        this.sortedCategories = this.Categories.map(item => { return item.id });
        if (this.sortedCategories.length > 0) {
            this.sortingForm.get('categories').setValue(this.sortedCategories.join());
        }
    }
    /**
     * 
     * Prepare Document URL
    */
    getDocumentUrl(document: any = null) {
        if (document && document.doc_url) {
            return document.doc_url.split("storage/app/").pop();
        }
        return document.doc_name;
    }
    /**
    * EDIT DOCUMENT INFO FROM LIST 
    */
    editDocument(fileInfo: any) {
        this.editDialogRef = this._matDialog.open(EditComponent, {
            disableClose: false,
            data: {
                fileInfo: fileInfo
            }
        });
        this.editDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.showSnackBar(result.message, 'OK');
                    this.refreshDocumentsList();
                }
                this.editDialogRef = null;
            });
    }
    /** APPLY CATEGORY MODAL BOX */
    applyCategory() {
        this.categoryDialogRef = this._matDialog.open(ApplyCategoryComponent, {
            disableClose: false,
            data: {
                docIds: this.selection.selected
            }
        });
        this.categoryDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.selection.clear();
                    //Set Page Index to 0
                    this.paginator.pageIndex = 0;
                    this.showSnackBar(result.message, 'OK');
                    this.refreshDocumentsList();
                }
                this.editDialogRef = null;
            });
    }
    /**DELETE DOCUMENTS */
    deleteDocument(docId: number = 0) {
        let deleteDocs = [];
        if (docId > 0) {
            deleteDocs.push(docId);
        }
        else {
            deleteDocs = this.selection.selected;
        }

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected document?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._filesService.deleteDocument({ 'doc_id': deleteDocs })
                        .subscribe(deleteResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            // Show the success message
                            this.showSnackBar(deleteResponse.message, 'CLOSE');
                            this.refreshDocumentsList();
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
    /**RESTORE Role */
    restoreOrDeleteDocument(docId: number = 0, permenent: boolean = false) {
        let restoredeleteDocs = [];
        if (docId > 0) {
            restoredeleteDocs.push(docId);
        }
        else {
            restoredeleteDocs = this.selection.selected;
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        let confirmMessage = 'Are you sure you want to restore selected document?';
        let apiEndPoint = 'documentsrestore';
        //set ApiEndPoint as per flag
        if (permenent == true) {
            confirmMessage = 'Are you sure you want to delete selected document? document cannot be restored';
            apiEndPoint = 'documentsforcedelete';
        }

        this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._commonService.restoreItems({ 'doc_id': restoredeleteDocs, 'endPoint': apiEndPoint })
                        .subscribe(restoreResponse => {
                            this.selection.clear();
                            //Set Page Index to 0
                            this.paginator.pageIndex = 0;
                            this.refreshDocumentsList();;
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
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
