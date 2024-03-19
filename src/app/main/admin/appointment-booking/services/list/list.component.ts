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
import { OptionsList, CommonService, AppConfig, AppointmentBookingService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { ExportComponent } from 'app/layout/components/export/export.component';
import { DiningReservationmodel } from 'app/_models';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations
})
export class ListComponent implements OnInit {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    //  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    public green_bg_header: any;
    public button: any;
    public accent: any;
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
    public selectStatus = { 'A': 'Active', 'I': 'Inactive' };
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
        private _commonService: CommonService,
        private _formBuilder: FormBuilder,
        private appointmentService: AppointmentBookingService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private route: ActivatedRoute,) {
        this.appConfig = AppConfig.Settings;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (this.route.routeConfig.path == "admin/fitness-reservation/services/list/trash") {
            this.title = "Service Trash List"
            this.trash = true;
            this.removeButton = false;
        }
        else {
            this.title = "All Services"
        }
    }
    ngOnInit(): void {
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.Columns = OptionsList.Options.tables.list.myservice;
        this.StatusList = OptionsList.Options.tables.status.users;
        this.displayedColumns = OptionsList.Options.tables.list.myservice.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this.appointmentService, this.paginator, this.sort);


        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
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
                this.dataSource.getFilteredServices(this.filterParams);
            });

        // apply theme settings
        let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
        if (typeof themeData == 'string') {
            let currentData = JSON.parse(themeData);
            themeData = currentData[0];
        }
        this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
        this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
        this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }

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

    deselectAll() {
        this.selection.clear();
    }

    deleteAll() {
        this.deleteService(this.selection.selected)
    }
    /**ACTION FUNCTIONS */
    deleteService(id) {

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected Service?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'service_id': id.toString().split(','),
                    };
                    let deleteUrl = 'appoinmentbooking/delete/appoinmentservices';

                    this.appointmentService.deleteService(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.dataSource.getFilteredServices(this.filterParams);
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
    permanentDeleteAll() {
        this.permenentDelete(this.selection.selected);
    }
    permenentDelete(id) {

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected Service?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'service_id': id.toString().split(','),
                    };
                    let deleteUrl = 'appoinmentbooking/delete/appoinmentservicesdelete';

                    this.appointmentService.permenentDeleteService(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.dataSource.getFilteredServices(this.filterParams);
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

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to restore selected Service?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'service_id': id.toString().split(','),
                    };
                    let deleteUrl = 'appoinmentbooking/delete/appoinmentservicesrestore';

                    this.appointmentService.restoreService(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.dataSource.getFilteredServices(this.filterParams);
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


    /**Update the booking status */
    statusChange(element, event) {
        let value = {
            'service_id': [element.id],
            'status': event.value == 'A' ? 'A' : 'I',
        }
        this.appointmentService.updateServiceStatus(value)
            .subscribe(response => {
                this.showSnackBar(response.message, 'CLOSE');

            },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'RETRY');
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
     * @param {AppointmentBookingService} appointmentService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private appointmentService: AppointmentBookingService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this.appointmentService.serviceList;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<DiningReservationmodel[]>}
     */
    connect(): Observable<DiningReservationmodel[]> {
        const displayDataChanges = [
            this.appointmentService.onServiceChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this.appointmentService.serviceList;
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
     * @returns {any}s
     */
    filterData(formdata): any {
        return formdata.data.map(c => new DiningReservationmodel().deserialize(c));
    }
    /**
     * Get Filtered Form
     * 
     */
    getFilteredServices(params: any) {
        return this.appointmentService.getServiceList(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
