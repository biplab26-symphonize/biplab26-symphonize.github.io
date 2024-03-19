import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { Subject, merge, Observable, BehaviorSubject } from 'rxjs';
import { CommonService, OptionsList, UsersService, ChatService } from 'app/_services';
import { AccountService } from 'app/layout/components/account/account.service';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';  
import { fuseAnimations } from '@fuse/animations';
import { Notification } from 'app/_models';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations : fuseAnimations
})
export class NotificationsComponent implements OnInit {

  public title      : string = '';
  userId            : number = 0;
  confirmDialogRef  : MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  filterForm        : FormGroup;
  PaginationOpt     : any = {}; //pagination size,page options
  date              = new Date();
  Columns           : []; 
  NfcTypeList       : any;
  displayedColumns  : string[];
  dataSource        : FilesDataSource | null;
  selection         = new SelectionModel<any>(true,[]);
  public filterParams   : any = {};
  public removeButton   : boolean = true;
  public cancelflag :boolean = false;

  public hasSelected    : boolean ;
  public categories     : any = {};
  public months         : any = {};
  public rowdata        : any;
  public generalSettings: any = {};
  
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
    private _fuseConfigService    : FuseConfigService,
    private _usersService         : UsersService,
    private _accountService       : AccountService,
    private _chatService          : ChatService,
    private _formBuilder          : FormBuilder,
    public _matDialog             : MatDialog,
    private _matSnackBar          : MatSnackBar,
    private _commonService        : CommonService,
    private route                 : Router
  ) { 
    this._unsubscribeAll = new Subject();
     // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.userId = JSON.parse(localStorage.getItem('token')).user_id;
   
  }

  ngOnInit() {
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

    this.NfcTypeList        = OptionsList.Options.notificationtypes;
    this.PaginationOpt      = {...OptionsList.Options.tables.pagination.options}; 
    this.Columns            = OptionsList.Options.tables.list.usernotifications;
    this.generalSettings    = this._commonService.getLocalSettingsJson('general_settings');
    this.displayedColumns   = OptionsList.Options.tables.list.usernotifications.map(col => col.columnDef);
    this.dataSource         = new FilesDataSource(this._usersService,this.paginator,this.sort);
    
    this.filterForm = this._formBuilder.group({
      searchKey   : [''],
      notification_type      : ['']
    });
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
        this.filterParams['id'] = this.userId;
        this.filterParams['column'] = 'created_at';
        delete this.filterParams.trash;
        this.dataSource.getFilteredNotifications(this.filterParams);
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
    this.dataSource.filteredData.data.forEach(row => {
        this.selection.select(row.id);
    });
  }

  //DELETE SELECTED EVENTS
  deleteAll(notificationId:Number=null)
  {
    let deleteData:any=[];
    if(notificationId>0){
      this.selection.selected.push(notificationId);
    }
    deleteData = 
    {
       'id':  this.selection.selected,
       'user_id': this.userId
    }  
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected notifications?';
    this.confirmDialogRef.afterClosed()
        .subscribe(result => {
            if ( result )
            {
             this._usersService.deleteNotification(deleteData)
             .subscribe(deleteResponse=>{
                 // Show the success message
                 this.selection.clear();
                  this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                  this.filterParams['id'] = this.userId;
                  this.filterParams['column'] = 'created_at';
                  this.dataSource.getFilteredNotifications(this.filterParams);
                  this._accountService.onNotificationUpdates.next(true);
                  this.showSnackBar(deleteResponse.message, 'CLOSE');
             },
             error => {
                 // Show the error message
                 this.showSnackBar(error.message, 'Retry');
             });
            }
        })
  }
  /** PROCESS GROUP INVITATION */
  processInvitation(inviteInfo:Object,status:string){
    if(inviteInfo && status){
      let inviteData = {notification_id:inviteInfo['id'], group_id:inviteInfo['group_id'],user_id:inviteInfo['user_id'],status:status}
      this._chatService.processInvitation(inviteData)
             .subscribe(inviteResponse=>{
              if(inviteResponse.status==200){
                this.showSnackBar(inviteResponse.message,'OK');
                this._accountService.onNotificationUpdates.next(true);
              }
             },
             error => {
                 // Show the error message
                 this.showSnackBar(error.message, 'Retry');
             });
    }
  }
  readNotification(notificationInfo:Number=null){
    if(notificationInfo!==null){
      this.selection.selected.push(notificationInfo);
    }  
    this._usersService.readNotification({id:this.selection.selected,status:'R'})
      .subscribe(inviteResponse=>{
      if(inviteResponse.status==200){
        this.selection.clear();
        //Set Page Index to 0
        this.paginator.pageIndex = 0;
        //send filters params again to maintain page limit search .....
        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
        this.filterParams['id'] = this.userId;
        this.filterParams['column'] = 'created_at';
        this.dataSource.getFilteredNotifications(this.filterParams);
        this._accountService.onNotificationUpdates.next(true);   
        this.showSnackBar(inviteResponse.message,'OK');
      }
      },
      error => {
          // Show the error message
          this.showSnackBar(error.message, 'Retry');
      });
  }
// redirect to that page according the type
  OnClick(id,notification_type){

    console.log(id);
            if(notification_type == 'forms'){
              this.readmark(id);
                this.route.navigate(["/forms/my-entries"]);
             
            }
            if(notification_type == 'dining'){
              this.readmark(id);
              this.route.navigate(["my-dining"]);
            }
            if(notification_type == 'food'){
              this.readmark(id);
              this.route.navigate(["my-order"]);
            }
            if(notification_type == 'event'){
              this.readmark(id);
              this.route.navigate(["my-events"]);
            }
            if(notification_type == 'table'){
              this.readmark(id);
              this.route.navigate(["my-reservations"]);
            }
            
  }

    readmark(notification_id){
      this._usersService.readNotification({id:[notification_id],status:'R'})
      .subscribe(inviteResponse=>{
          console.log(inviteResponse);
      if(inviteResponse.status==200){
        // this.selection.clear();
        // //Set Page Index to 0
        // this.paginator.pageIndex = 0;
        // //send filters params again to maintain page limit search .....
        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
        this.filterParams['id'] = this.userId;
        this.filterParams['column'] = 'created_at';
        this.dataSource.getFilteredNotifications(this.filterParams);
        // this._accountService.onNotificationUpdates.next(true);   
       }
      })
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
      this.PaginationOpt = {};
  }
}

export class FilesDataSource extends DataSource<any>
    {
        private _filterChange       = new BehaviorSubject('');
        private _filteredDataChange = new BehaviorSubject('');

        /**
         * Constructor
         *
         * @param {UsersService} _usersService
         * @param {MatPaginator} _matPaginator
         * @param {MatSort} _matSort
         */
        constructor(
            private _usersService: UsersService,
            private _matPaginator: MatPaginator,
            private _matSort: MatSort)
        {
            super();

            this.filteredData = this._usersService.notifications;
        }

        /**
         * Connect function called by the table to retrieve one stream containing the data to render.
         *
         * @returns {Observable<Event[]>}
         */
        connect(): Observable<Event[]>
        {
            const displayDataChanges = [
                this._usersService.onNotificationChanged
            ];
            return merge(...displayDataChanges)
                .pipe(
                map(() => {
                        let data          = this._usersService.notifications;
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
        filterData(notificationData): any
        {   
          if(notificationData && notificationData.data){
            return notificationData.data.map(c =>new Notification().deserialize(c,'list'));
          } 
          return [];            
        }
        /**
         * Get Filtered Users
         * 
         */
        getFilteredNotifications(params:any){
            return this._usersService.getNotifications(params).then(Response=>{
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
