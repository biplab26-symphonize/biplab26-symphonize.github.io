import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
//import { MatDialogRef, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OptionsList, CommonService, FoodOrderService, AppConfig } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { ExportComponent } from 'app/layout/components/export/export.component';
import { FoodOrdermodel } from 'app/_models';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class OrdersListComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
  //  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    public title : string = '';
    orderForm: FormGroup;
    filterParams: any={};
    PaginationOpt: any = {}; //pagination size,page options
    Columns: [];  
    displayedColumns: string[];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
    public removeButton : boolean = true;
    public show : boolean = false;
    public services : any;
    public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
    public selectStatus= ['pending','confirmed','cancelled'];
    public types = ['pickup','delivery'];
  
    appConfig : any;
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
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
      private _foodService:FoodOrderService,
      private _formBuilder: FormBuilder,
      public _matDialog: MatDialog,
      private _matSnackBar: MatSnackBar,
      private route : ActivatedRoute,
      private _commonService : CommonService,
      private http: HttpClient,
        private _fileSaverService:FileSaverService,   
         )
    {
        this.appConfig      = AppConfig.Settings;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.title = "All Orders"
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        //Pagination Options
        this.PaginationOpt    = OptionsList.Options.tables.pagination.options;  
        this.Columns          = OptionsList.Options.tables.list.foodorders;
        this.displayedColumns = OptionsList.Options.tables.list.foodorders.map(col => col.columnDef);
        this.dataSource       = new FilesDataSource(this._foodService, this.paginator, this.sort);
     

        //Declare Filter Form
        this.orderForm = this._formBuilder.group({
            searchKey   : [''],
            type        : [''],
            status      : ['']

        });

        
        this.resetPageIndex(); //#Reset PageIndex of form if search changes
       
       
        merge(this.sort.sortChange, this.paginator.page, this.orderForm.valueChanges)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{
            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.orderForm.value);
            this.filterParams['column'] = 'booking_start_date';
            this.dataSource.getFilteredOrder(this.filterParams);
            
        });

      
        
        //Deault DateTime Formats
       this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat; 

    }

  
    
    //Reset PageIndex On Form Changes
    resetPageIndex(){
        this.orderForm.valueChanges.subscribe(data=>{
            this.paginator.pageIndex = 0;
        });
    }
    isAllSelected() {
        const numSelected   = this.selection.selected.length;
        const numRows       = this.dataSource.filteredData.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.filterParams['column'] = 'booking_start_date';
        this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
    }

    deselectAll(){
        this.selection.clear();
    }

    deleteAll()
    {
        this.deleteOrders(this.selection.selected)
    }
    /**ACTION FUNCTIONS */
    deleteOrders(id){
    
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
  
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected order?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
              if ( result )
              {
                let deleteData = {
                    'id': id.toString().split(','),
                };
                let deleteUrl =  'foodreservation/delete/foodorder';
                console.log('deletedata',deleteData);
                this._foodService.deleteOrders(deleteUrl,deleteData)
                .subscribe(deleteResponse=>{
                    // Show the success message
                    this.selection.clear();
                    this.filterParams['column'] = 'booking_start_date';
                    this.dataSource.getFilteredOrder(this.filterParams);
                    
                    this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
                        verticalPosition: 'top',
                        duration        : 2000
                    });
                },
                error => {
                    // Show the error message
                    this._matSnackBar.open(error.message, 'Retry', {
                            verticalPosition: 'top',
                            duration        : 2000
                    });
                });
              }
              this.confirmDialogRef = null;
        });
    }

       /**Update the booking status */
    statusChange(element,event)
    {
        let value={
            'id':[element.id],
            'status':event.value,
        }
      
        this._foodService.updateBookingStatus(value)
        .subscribe(response =>
        {
            this.showSnackBar(response.message, 'CLOSE');

        },	
        error => {
            // Show the error message
            this.showSnackBar(error.message, 'RETRY');
        });
      
    }
    
    /** SHOW SNACK BAR */
    showSnackBar(message:string,buttonText:string){
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration        : 2000
        });
    }
    
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange       = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {FoodOrderService} _foodService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _foodService: FoodOrderService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._foodService.orderList;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<FoodOrdermodel[]>}
     */
    connect(): Observable<FoodOrdermodel[]>
    {
        const displayDataChanges = [
            this._foodService.onOrderChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
            map(() => {
                    let data          = this._foodService.orderList;
                    this.filteredData = data;
                    data              = this.filterData(data);
                    return data;
                }
            ));
    }

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }
    
    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(formdata): any
    {
        return formdata.data.map(c => new FoodOrdermodel().deserialize(c));
    }
    /**
     * Get Filtered Form
     * 
     */
    getFilteredOrder(params:any){
        return this._foodService.getOrderList(params).then(Response=>{
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}