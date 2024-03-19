import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { CommonService, OptionsList, LocationService, EventcategoryService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import {  Locationlist } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    filterForm: FormGroup;
    PaginationOpt:any = {}; //pagination size,page options
    isTrashView:boolean=false;
    Columns: []; 
    StatusList: any;
    displayedColumns: string[];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<Locationlist>(true, []);
    filterParams:any = {};
    public trash :boolean = false;
    public hasSelected : boolean ;
    public Category_Calendar_list 

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
        private route: ActivatedRoute,
        private _locationService : LocationService,
        private _eventCategoryService : EventcategoryService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _commonService :CommonService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
    */
    ngOnInit(): void
    {
        this._eventCategoryService.getCategory({'category_type':'ECL','column':'category_name','status':'A','direction':'asc'}).then(res=>{
            this.Category_Calendar_list = res.data;
          });
        //Pagination Options
        this.PaginationOpt    = OptionsList.Options.tables.pagination.options;  
        this.StatusList       = OptionsList.Options.tables.status.users;
        this.Columns          = OptionsList.Options.tables.list.locations;
        this.displayedColumns = OptionsList.Options.tables.list.locations.map(col => col.columnDef);
        this.dataSource       = new FilesDataSource(this._locationService,this.paginator,this.sort);

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey   : [''],
            roles       : [''],
            status      : [''],
            trash       : [''],
            calendar_id : ['']
            
        });
        
        this.isTrashView = this.route.routeConfig.path=='admin/events/location/trash' ? true : this.isTrashView;
        this.route.data['value'].trash ? this.filterForm.get('trash').setValue(this.route.data['value'].trash) : "";
        this.resetPageIndex(); //#Reset PageIndex of form if search changes
        
        merge(this.sort.sortChange, this.paginator.page,this.filterForm.valueChanges)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{
            this.selection.clear();
            this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
            this.filterParams['category_type'] = 'EL';
            this.filterParams['calendar_id'] = this.filterForm.get('calendar_id').value ? this.filterForm.get('calendar_id').value :'';
            this.dataSource.getFilteredLocation(this.filterParams);
        });
        this.check();
    }
     
    //Reset PageIndex On Form Changes
    resetPageIndex(){
        this.filterForm.valueChanges.subscribe(data=>{
            this.paginator.pageIndex = 0;
        });
    }

    isAllSelected() {
        const numSelected   = this.selection.selected.length;
        const numRows       = this.dataSource.filteredData.data.length;
        
        return numSelected === numRows; 
    }
    deselectAll(){
        this.selection.clear();
}

    check()
    {
    if(this.selection.selected)
        {
            this.hasSelected = true;
            
        }
        else{
            this.hasSelected = false; 
            
        }
    }

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
    }
 
    deleteAll() 
    {
        this.deleteItem(this.selection.selected);
    }
    /**ACTION FUNCTIONS */
    deleteItem(id){
    
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected location?';
        this.confirmDialogRef.afterClosed()
        .subscribe(result => {
            if ( result )
            {
            let deleteData = {
                'id': id.toString().split(','),
                'category_type' : 'EL'
            };

            this._locationService.deleteLocation(deleteData)
            .subscribe(deleteResponse=>{
                // Show the success message
                this.selection.clear();
                this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                this.filterParams['category_type'] = 'EL';
                this.dataSource.getFilteredLocation(this.filterParams);
                
                this.showSnackBar(deleteResponse.message, 'CLOSE');
            },
                error => {
                    this.showSnackBar(error.message, 'CLOSE');
                });
            }
            this.confirmDialogRef = null;
        });
    }

    changeSingleStatus(type,id)
    {
        this.changeStatus(type,id)
    }
    //CHANGE STATUS
    changeStatus(type:string="A",selectid){
        
        let locationid;
        if(this.selection.selected){
            locationid = this.selection.selected
        }
        if(selectid){
            locationid = selectid.toString().split(",");
        }
        this._commonService.changeStatus({'id':locationid,'status':type,'type':'Categories'})
        .subscribe(statusResponse=>{
            this.selection.clear();
            this.filterParams['category_type'] = 'EL';
            this.dataSource.getFilteredLocation(this.filterParams);
            // Show the success message
            this.showSnackBar(statusResponse.message, 'CLOSE');
        },
        error => {
            // Show the success message
            this.showSnackBar(error.message, 'CLOSE');
        });
    }
    restoreOrDeleteLoc(locId: any=0,permenent:boolean=false){
        if(locId>0){
            this.selection.selected.push(locId);
            
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        let confirmMessage = 'Are you sure you want to restore selected location?';
        let apiEndPoint    = 'categoriesrestore'; 
        //set ApiEndPoint as per flag
        if(permenent==true){
            confirmMessage = 'Are you sure you want to delete selected location? location cannot be restored';
            apiEndPoint    = 'categoriespermanentdelete';
        }

        this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._commonService.restoreItems({'id':this.selection.selected,'endPoint':apiEndPoint,  'category_type' : 'EL'})
                    .subscribe(restoreResponse=>{
                        this.selection.clear();
                        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                        this.filterParams['category_type'] = 'EL';
                        this.dataSource.getFilteredLocation(this.filterParams);
                        // Show the success message
                        this.showSnackBar(restoreResponse.message, 'CLOSE');
                    },
                    error => {      
                        // Show the error message
                        this.showSnackBar(error.message, 'RETRY');                  
                    });
                }
                else{
                    this.selection.clear();
                }
                this.confirmDialogRef = null;
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
     * @param {LocationService} _locationService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _locationService: LocationService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
    )
    {
        super();

        this.filteredData = this._locationService.locations;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Locationlist[]>}
     */
    connect(): Observable<Locationlist[]>
    {
        const displayDataChanges = [
            this._locationService.onLocationChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
            map(() => {
                    let data          = this._locationService.locations;
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
    filterData(locationData): any
    {
        return locationData.data.map(c => new Locationlist().deserialize(c,'list'));
    }
    /**
     * Get Filtered Users
     * 
     */
    getFilteredLocation(params:any){
        return this._locationService.getLocation(params).then(Response=>{
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