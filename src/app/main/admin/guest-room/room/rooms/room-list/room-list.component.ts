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
import { OptionsList, CommonService, AppConfig, GuestRoomService, SettingsService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { ExportComponent } from 'app/layout/components/export/export.component';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { GuestRoommodel } from 'app/_models/guest-room.model';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RoomListComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    //  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    public title: string = '';
    filterForm: FormGroup;
    filterParams: any = {};
    PaginationOpt: any = {}; //pagination size,page options
    Columns: [];
    displayedColumns: string[];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    public removeButton: boolean = true;
    public trash: boolean = false;
    public show: boolean = false;
    public services: any;
    public default_img;
    public selectStatus = { 'A': 'Active', 'I': 'Inactive' };
    public buildingList: any = [];
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

    constructor(private _guestRoomService: GuestRoomService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private route: ActivatedRoute,
        private _commonService: CommonService,
        private http: HttpClient,
        private _fileSaverService: FileSaverService,
        private _settingService: SettingsService,
    ) {
        this.appConfig = AppConfig.Settings;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (this.route.routeConfig.path == "admin/guest-room/list/trash") {
            this.title = "Rooms Trash List"
            this.trash = true;
            this.removeButton = false;
        }
        else {
            this.trash = false;
            this.title = "Rooms List"
        }
    }

    ngOnInit(): void {
        //Pagination Options
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;
        this.Columns = OptionsList.Options.tables.list.myguestrooms;
        this.displayedColumns = OptionsList.Options.tables.list.myguestrooms.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._guestRoomService, this.paginator, this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            building_id: [''],
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
                this.filterParams['column'] = '';
                this.filterParams['building_id'] = this.filterForm.get('building_id').value;
                this.trash == true ? this.filterParams['trash'] = 1 : '';
                this.dataSource.getFilteredRooms(this.filterParams);

            });


        this._settingService.getGuestRoomSetting({ meta_type: "guest" }).then(res => {            
            let data = res.data;
            data.forEach(item => {
                if (item.meta_key == 'Default_img') {
                    this.default_img = item.meta_value;                    
                }
            });
        });
        this._guestRoomService.getBuildingList({'status':'A','direction':'desc'}).then(Response => {            
            this.buildingList = Response.data;
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

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected record?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'id': id.toString().split(','),
                    };
                    let deleteUrl = 'guestroom/delete/roomtrash';
                    this._guestRoomService.deleteRooms(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.dataSource.getFilteredRooms(this.filterParams);
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

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected record?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'id': id.toString().split(','),
                    };
                    let deleteUrl = 'guestroom/delete/roomdelete';
                    this._guestRoomService.permenentDeleteRooms(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.dataSource.getFilteredRooms(this.filterParams);
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
    restoreAll() {
        this.restoreItem(this.selection.selected);
    }
    restoreItem(id) {

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to restore selected record?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'id': id.toString().split(','),
                    };
                    let deleteUrl = 'guestroom/delete/roomrestore';
                    this._guestRoomService.restoreRooms(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.trash == true ? this.filterParams['trash'] = 1 : '';
                            this.dataSource.getFilteredRooms(this.filterParams);
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
    statusChange(element, event) {
        let value = {
            'id': [element.id],
            'status': event.value == 'A' ? 'A' : 'I',
        }
        this._guestRoomService.updateRoomStatus(value)
            .subscribe(response => {
                this.showSnackBar(response.message, 'CLOSE');

            },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'RETRY');
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
     * @param {GuestRoomService} _guestRoomService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _guestRoomService: GuestRoomService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._guestRoomService.roomList;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<GuestRoommodel[]>}
     */
    connect(): Observable<GuestRoommodel[]> {
        const displayDataChanges = [
            this._guestRoomService.onRoomChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._guestRoomService.roomList;
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
        return formdata.data.map(c => new GuestRoommodel().deserialize(c));
    }
    /**
     * Get Filtered Form
     * 
     */
    getFilteredRooms(params: any) {
        return this._guestRoomService.getRoomList(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
