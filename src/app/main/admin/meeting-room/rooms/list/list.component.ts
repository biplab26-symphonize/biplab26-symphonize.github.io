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
import { OptionsList, CommonService, AppConfig, MeetingRoomService, SettingsService } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { ExportComponent } from 'app/layout/components/export/export.component';
import { MeetingRoommodel } from 'app/_models';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations   : fuseAnimations
})
export class ListComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
//  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
  public title : string = '';
  filterForm: FormGroup;
  filterParams: any={};
  PaginationOpt: any = {}; //pagination size,page options
  Columns: [];  
  RoleList: any={};
  StatusList: any;
  displayedColumns: string[];
  dataSource: FilesDataSource | null;
  selection = new SelectionModel<any>(true, []);
  public removeButton : boolean = true;
  public trash : boolean  = false;
  public selectStatus= {'A':'Active','I':'Inactive'};
  public default_img;
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
    private   settingservice : SettingsService,
    private _meetingRoomService:MeetingRoomService,
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
      if(this.route.routeConfig.path=="admin/meeting-room/rooms/list/trash")
      {         
          this.title = "Rooms Trash List"
          this.trash = true;
          this.removeButton = false;
      }
      else
      {
          this.title = "All Rooms"
      }
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
      this.Columns          = OptionsList.Options.tables.list.myrooms;
      this.displayedColumns = OptionsList.Options.tables.list.myrooms.map(col => col.columnDef);
      this.dataSource       = new FilesDataSource(this._meetingRoomService, this.paginator, this.sort);
     
      this.settingservice.getFoodSetting({meta_type : "food"}).then(res=>{
        for(let item of res.data){
          if(item.meta_key == 'Default_image'){
            this.default_img = item.meta_value;
            console.log(this.default_img);
          }
        }
    })
      //Declare Filter Form
      this.filterForm = this._formBuilder.group({
          searchKey   : [''],
          status      : [''],
          trash       : ['']
          
      });
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
          this.trash==true? this.filterParams['trash'] = 1 : '';
          this.dataSource.getFilteredRooms(this.filterParams);
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

  deselectAll(){
      this.selection.clear();
  }

  deleteAll()
  {
      this.deleteService(this.selection.selected)
  }
  /**ACTION FUNCTIONS */
  deleteService(id){
  
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected Rooms?';
      this.confirmDialogRef.afterClosed()
          .subscribe(result => {
            if ( result )
            {
              let deleteData = {
                  'id': id.toString().split(','),
              };
              let deleteUrl =  'meetingroom/delete/meetroomstrash';              
              this._meetingRoomService.deleteService(deleteUrl,deleteData)
              .subscribe(deleteResponse=>{
                  // Show the success message
                  this.selection.clear();
                  this.trash == true ? this.filterParams['trash'] = 1 : '';
                  this.dataSource.getFilteredRooms(this.filterParams);
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
  permanentDeleteAll(){
    this.permenentDelete(this.selection.selected);
  }
  permenentDelete(id){
  
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected Rooms?';
    this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if ( result )
          {
            let deleteData = {
                'room_id': id.toString().split(','),
            };
            let deleteUrl =  'meetingroom/delete/meetroomsdelete';            
            this._meetingRoomService.permenentDeleteService(deleteUrl,deleteData)
            .subscribe(deleteResponse=>{
                // Show the success message
                this.selection.clear();
                this.trash == true ? this.filterParams['trash'] = 1 : '';
                this.dataSource.getFilteredRooms(this.filterParams);
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
  
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }
  restoreAll() 
  {
      this.restoreItem(this.selection.selected);
  }
  restoreItem(id){
  
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to restore selected Rooms?';
    this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if ( result )
          {
            let deleteData = {
                'room_id': id.toString().split(','),
            };
            let deleteUrl =  'meetingroom/delete/meetroomsrestore';            
            this._meetingRoomService.restoreService(deleteUrl,deleteData)
            .subscribe(deleteResponse=>{
                // Show the success message
                this.selection.clear();
                this.trash == true ? this.filterParams['trash'] = 1 : '';
                this.dataSource.getFilteredRooms(this.filterParams);
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
          'room_id':[element.id],
          'status':event.value=='A'?'A':'I',
      }
      this._meetingRoomService.updateServiceStatus(value)
      .subscribe(response =>
      {
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
   * @param {MeetingRoomService} _meetingRoomService
   * @param {MatPaginator} _matPaginator
   * @param {MatSort} _matSort
   */
  constructor(
      private _meetingRoomService: MeetingRoomService,
      private _matPaginator: MatPaginator,
      private _matSort: MatSort
  )
  {
      super();

      this.filteredData = this._meetingRoomService.serviceList;
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @returns {Observable<MeetingRoommodel[]>}
   */
  connect(): Observable<MeetingRoommodel[]>
  {
      const displayDataChanges = [
          this._meetingRoomService.onServiceChanged
      ];
      return merge(...displayDataChanges)
          .pipe(
          map(() => {
                  let data          = this._meetingRoomService.serviceList;
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
      return formdata.data.map(c => new MeetingRoommodel().deserialize(c));
  }
  /**
   * Get Filtered Form
   * 
   */
  getFilteredRooms(params:any){
      return this._meetingRoomService.getRoomsList(params).then(Response=>{
        console.log("Response",Response);
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
