import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonService, OptionsList, ApprovalService } from 'app/_services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { DataSource } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonUtils } from 'app/_helpers';
import { Form, Approval } from 'app/_models';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';




@Component({
    selector: 'app-approvalsetting',
    templateUrl: './approvalsetting.component.html',
    styleUrls: ['./approvalsetting.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ApprovalsettingComponent implements OnInit {

    public green_bg_header: any;
    public button: any;
    public accent: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
    public title: string = '';
    public trash: boolean = false;
    filterForm: FormGroup;
    public url_id: any;
    PaginationOpt: any = {};
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    Columns: [];
    displayedColumns: string[];
    public filterParams: any = {};


    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;


    constructor(
        private _commonService: CommonService,
        private route: ActivatedRoute,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _approvals: ApprovalService,
        public router: Router,
        private _formBuilder: FormBuilder,
    ) {
        this.title = "All Approvals"
        this._unsubscribeAll = new Subject();
        this.route.params.subscribe(params => {
            this.url_id = params.id;
        });
    }


    ngOnInit() {

        this._unsubscribeAll = new Subject();
        this.PaginationOpt = OptionsList.Options.tables.pagination.options;

        this.Columns = OptionsList.Options.tables.list.formapproval;
        this.displayedColumns = OptionsList.Options.tables.list.formapproval.map(col => col.columnDef);
        this.dataSource = new FilesDataSource(this._approvals, this.paginator, this.sort);


        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            roles: [''],
            status: [''],
            id: [''],
            form_id: ['']


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
                this.filterParams['form_id'] = this.url_id;
                this.dataSource.getApprovalsettings(this.filterParams);

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
            this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
    }
    deselectAll() {
        this.selection.clear();
    }
    deleteAll() {
        this.deleteForm(this.selection.selected)
    }
    // delete the one by one  element
    deleteForm(id) {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected form?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    let deleteData = {
                        'id': id.toString().split(',')
                    };
                    let deleteUrl = 'delete/approvalsetting';
                    this._approvals.deletepaarovalsetting(deleteUrl, deleteData)
                        .subscribe(deleteResponse => {
                            // Show the success message
                            this.selection.clear();
                            this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                            this.filterParams['form_id'] = this.url_id;
                            this.dataSource.getApprovalsettings(this.filterParams);
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

        this._approvals.UpdateNApprovalstatus({ 'id': this.selection.selected.length ? this.selection.selected : [id], 'status': type })
            .subscribe(statusResponse => {
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort, this.paginator, this.filterForm.value);
                this.filterParams['form_id'] = this.url_id;
                this.dataSource.getApprovalsettings(this.filterParams);
                // Show the success message
                this.showSnackBar(statusResponse.message, 'CLOSE');
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
    aprovalArray = [];
    approvalsdata: any;

    /**
     * Constructor
     *
     * @param {ApprovalService} _approval
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _approval: ApprovalService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();


        this.filteredData = this._approval.form;

    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Approval[]>}
     */
    connect(): Observable<Approval[]> {

        const displayDataChanges = [
            this._approval.onFormapprovalChanged
        ];

        return merge(...displayDataChanges)
            .pipe(

                map(() => {

                    let data = this._approval.form;

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
    filterData(approvaldata) {
        return approvaldata.data.map(c => new Approval().deserialize(c,))
    }
    /**
     * Get Filtered Form
     * 
     */
    getApprovalsettings(params: any) {
        return this._approval.getApprovalsetting(params).then(Response => {
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}