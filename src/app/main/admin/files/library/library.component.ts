import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import { MenusService, AppConfig, OptionsList, CommonService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class LibraryComponent {

    public green_bg_header: any;
    public button: any;
    public accent: any;
    _localUserSettings: any;
    isTrashView: boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    filterForm: FormGroup;
    filterParams: any = {};
    PaginationOpt: { 'pageSize': '', pageSizeOptions: [] }; //pagination size,page options
    Columns: [];
    RoleList: any = {};
    StatusList: any;
    displayedColumns: string[];
    dataSource: any;
    _defaultAvatar = "";
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
     * @param {FilesService} _filesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _commonService: CommonService,
        private route: ActivatedRoute,
        private _appConfig: AppConfig,
        private _menusService: MenusService,
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
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.Columns = OptionsList.Options.tables.list.documents;
        this.displayedColumns = OptionsList.Options.tables.list.documents.map(col => col.columnDef);
        this.dataSource = this.route.snapshot.data.menusList || {};

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            type: ['list'],
            menu_source: ['D'],
            menu_source_type: ['url,page'],
            status: [''],
            trash: ['']

        });
        //Show Buttons Of permenat Delete and restore on trash view
        this.isTrashView = this.route.routeConfig.path == 'admin/files/library/trash' ? true : this.isTrashView;
        this.route.data['value'].trash ? this.filterForm.get('trash').setValue(this.route.data['value'].trash) : "";
        this.resetPageIndex(); //#Reset PageIndex of form if search changes

        merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(res => {
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this._menusService.getMenusList(this.filterParams).subscribe(menuResponse => {
                    if (menuResponse.status == 200) {
                        this.dataSource = menuResponse;
                    }
                });
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
