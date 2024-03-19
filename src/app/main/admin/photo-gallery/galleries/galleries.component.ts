import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { DataSource,SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, UsersService, GalleryService, AppConfig } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { Album } from 'app/_models';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-galleries',
  templateUrl: './galleries.component.html',
  styleUrls: ['./galleries.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GalleriesComponent implements OnInit {
  _localUserSettings: any;
  isTrashView:boolean=false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
  filterForm: FormGroup;
  filterParams: any={};
  PaginationOpt: {'pageSize':'',pageSizeOptions:[]}; //pagination size,page options
  Columns: [];  
  RoleList: any={};
  StatusList: any;
  displayedColumns: string[];
  dataSource: FilesDataSource | null;
  selection = new SelectionModel<any>(true, []);
  _defaultAvatar = "";
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  userId: number = null;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  @ViewChild('filter', {static: true})
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _appConfig: AppConfig,    
    private _commonService:CommonService,
    private _galleryService:GalleryService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._fuseConfigService.config = CommonUtils.setVerticalLayout();
        this._fuseConfigService.defaultConfig = CommonUtils.setVerticalLayout();
        
    }

  ngOnInit(): void {
    this.userId             = JSON.parse(localStorage.getItem('token')).user_id;
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    
    //Load Users Settings From Localstorage
    this._localUserSettings = this._appConfig._localStorage.value.settings;
    this._defaultAvatar     = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar; 
    //Pagination Options
    this.PaginationOpt      = OptionsList.Options.tables.pagination.options;

    this.StatusList         = OptionsList.Options.tables.status.users;
    this.Columns            = OptionsList.Options.tables.list.galleries;
    this.displayedColumns   = OptionsList.Options.tables.list.galleries.map(col => col.columnDef);
    this.dataSource         = new FilesDataSource(this._galleryService, this.paginator, this.sort);

    //Declare Filter Form
    this.filterForm = this._formBuilder.group({
      searchKey   : [''],
      status      : [''],
      trash       : [''],
      parent_id   : [0]
    });
    //Show Buttons Of permenat Delete and restore on trash view
    this.isTrashView = this.route.routeConfig.path=='admin/galleries/trash' ? true : this.isTrashView;
    this.route.data['value'].trash ? this.filterForm.get('trash').setValue(this.route.data['value'].trash) : "";
    this.resetPageIndex(); //#Reset PageIndex of form if search changes
    
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
    )
    .subscribe(res=>{
        this.selection.clear();
        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
        this.filterParams['category_type'] = 'G';
        this.filterParams['parent_id']='0'
        this.dataSource.getFilteredGalleries(this.filterParams);
    });
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
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.filteredData.data.forEach(row => this.selection.select(row.id));
  }
  /** SOFT OR PERMENENT DELETE USER */
  deleteGallery(albumId: number=0){
    if(albumId>0){
        this.selection.selected.push(albumId);
    }
    //RemoveCurrent User From Array
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected gallery?';
    this.confirmDialogRef.afterClosed()
    .subscribe(result => {
        if ( result )
        {
          this._galleryService.deleteAlbums({'id':this.selection.selected})
          .subscribe(deleteResponse=>{
              this.selection.clear();
              //Set Page Index to 0
              this.paginator.pageIndex = 0;
              //send filters params again to maintain page limit search .....
              this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
              this.filterParams['category_type'] = 'G';
              this.filterParams['parent_id']='0'
              this.dataSource.getFilteredGalleries(this.filterParams);
              // Show the success message
              this.showSnackBar(deleteResponse.message, 'CLOSE');
          },
          error => {
              // Show the error message
              this.showSnackBar(error.message, 'RETRY');
          });
        }
        else
        {
            this.selection.clear();
        }
        this.confirmDialogRef = null;
    });
  }
  changeStatus(type:string="A" , id:number){
    this._commonService.changeStatus({'id':this.selection.selected.length ? this.selection.selected : [id],'status':type,'type':'Gallery'})
    .subscribe(statusResponse=>{
        this.selection.clear();
        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);  
        this.filterParams['category_type'] = 'G';   
        this.filterParams['parent_id']='0'                  
        this.dataSource.getFilteredGalleries(this.filterParams);
        // Show the success message
        this.showSnackBar(statusResponse.message, 'CLOSE');
    },
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY');
    });
  }
  /**RESTORE USER */
  restoreOrDeleteGallery(albumId: number=0,permenent:boolean=false){
    if(albumId>0){
        this.selection.selected.push(albumId);
    }
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });
    let confirmMessage = 'Are you sure you want to restore selected gallery?';
    let apiEndPoint    = 'categoriesrestore'; 
    //set ApiEndPoint as per flag
    if(permenent==true){
        confirmMessage = 'Are you sure you want to delete selected gallery? gallery cannot be restored';
        apiEndPoint    = 'categoriespermanentdelete';
    }

    this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
    this.confirmDialogRef.afterClosed()
    .subscribe(result => {
        if ( result )
        {
            this._commonService.restoreItems({'id':this.selection.selected,'endPoint':apiEndPoint})
            .subscribe(restoreResponse=>{
                this.selection.clear();
                //Set Page Index to 0
                this.paginator.pageIndex = 0;
                this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                this.filterParams['category_type'] = 'G';
                this.filterParams['parent_id']='0'
                this.dataSource.getFilteredGalleries(this.filterParams);
                // Show the success message
                this.showSnackBar(restoreResponse.message, 'CLOSE');
            },
            error => {
                // Show the error message
                this.showSnackBar(error.message, 'RETRY');
            });
        }
        else
        {
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
     * @param {GalleryService} _galleryService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _galleryService: GalleryService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._galleryService.galleries;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Album[]>}
     */
    connect(): Observable<Album[]>
    {
        const displayDataChanges = [
            this._galleryService.onAlbumsChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
            map(() => {
                    let data          = this._galleryService.galleries;
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
    filterData(gallerydata): any
    {
        return gallerydata.data.map(c => new Album().deserialize(c,'list'));
    }
    /**
     * Get Filtered Users
     * 
     */
    getFilteredGalleries(params:any){
        return this._galleryService.getGalleries(params).then(Response=>{
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
