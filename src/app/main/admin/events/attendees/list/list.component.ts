import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
//Export Option Compo
import { ExportComponent } from 'app/layout/components/export/export.component';

import { DataSource,SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { Attendee } from 'app/_models';
import { OptionsList,  AttendeesService, CommonService } from 'app/_services';
import { ActivatedRoute } from '@angular/router';
import { MailtoAttendeesComponent } from '../mailtoattendees/mailtoattendees.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

    isTrashView:boolean=false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
    mailtoAttendeesDialogRef: MatDialogRef<MailtoAttendeesComponent>; //EXTRA Changes  
    filterForm: FormGroup;
    public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
    filterParams: any={};
    PaginationOpt: {'pageSize':'',pageSizeOptions:[]}; //pagination size,page options
    Columns: [];  
    event_id: number = 0;
    eventInfo: any={};
    StatusList: any;
    allRoute:any=['/admin/events/all'];
    displayedColumns: string[];
    dataSource: FilesDataSource | null;
    selection = new SelectionModel<any>(true, []);
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
    private _attendeesService:AttendeesService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _commonService :CommonService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
       //Deault DateTime Formats
       this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        //Load Users Settings From Localstorage
        this.event_id           = this.route.params['value'].event_id || 0;
        //EventInfo
        this.eventInfo          = this._attendeesService.attendeeEventInfo; 
        if(this.eventInfo && this.eventInfo.eventcalendar && this.eventInfo.eventcalendar.category_alias){
            this.allRoute = ['/admin/event/',this.eventInfo.eventcalendar.category_alias];
        }   
        //Pagination Options
        this.PaginationOpt      = OptionsList.Options.tables.pagination.options;  
        //Roles List
        this.StatusList         = {...OptionsList.Options.tables.status.attendeestatus};
        this.Columns            = OptionsList.Options.tables.list.attendees;
        this.displayedColumns   = OptionsList.Options.tables.list.attendees.map(col => col.columnDef);
        this.dataSource         = new FilesDataSource(this._attendeesService, this.paginator, this.sort);
        console.log(this.dataSource);
        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey   : [''],
            status      : [''],
            event_id    : [this.route.params['value'].event_id || '']            
        });
        //Show Buttons Of permenat Delete and restore on trash view
        this.isTrashView = this.route.routeConfig.path=='admin/attendees/trash/:event_id' ? true : this.isTrashView;
        
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
            this.dataSource.getFilteredAttendees(this.filterParams);
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
        this.dataSource.filteredData.data.forEach(row => this.selection.select(row.attendee_id));
    }
    /**ACTION FUNCTIONS */
    /** SOFT OR PERMENENT DELETE USER */
    deleteAttendee(attendeeId: number=0){
        if(attendeeId>0){
            this.selection.selected.push(attendeeId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want Trash Selected Attendees ?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                  this._attendeesService.deleteAttendee('delete/attendeesdelete',{'attendee_id':this.selection.selected,'event_id':[this.route.params['value'].event_id || 0]})
                  .subscribe(deleteResponse=>{
                      this.selection.clear();
                      //Set Page Index to 0
                      this.paginator.pageIndex = 0;
                      //send filters params again to maintain page limit search .....
                      this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                      this.dataSource.getFilteredAttendees(this.filterParams);
                      // Show the success message
                      this.showSnackBar(deleteResponse.message, 'CLOSE');
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

    /**RESTORE USER */
    restoreOrDeleteAttendee(attendeeId: number=0,permenent:boolean=false){
        if(attendeeId>0){
            this.selection.selected.push(attendeeId);
        }
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        let confirmMessage = 'Are you sure you want to restore selected attendee?';
        let apiEndPoint    = 'attendeesrestore'; 
        //set ApiEndPoint as per flag
        if(permenent==true){
            confirmMessage = 'Are you sure you want to delete selected attendee? attendee cannot be restored';
            apiEndPoint    = 'attendeespermanentdelete';
        }

        this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._commonService.restoreItems({'attendee_id':this.selection.selected,'endPoint':apiEndPoint})
                    .subscribe(restoreResponse=>{
                        this.selection.clear();
                        //Set Page Index to 0
                        this.paginator.pageIndex = 0;
                        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
                        this.dataSource.getFilteredAttendees(this.filterParams);
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
    /** APPLY CATEGORY MODAL BOX */
    mailtoAttendees(){
        this.mailtoAttendeesDialogRef = this._matDialog.open(MailtoAttendeesComponent, {
        disableClose: false,
        height: '550px',
        width: '600px',
        data: {
            attendee_id: this.selection.selected,
            event_id: this.event_id
        }
        });        
        this.mailtoAttendeesDialogRef.afterClosed()
            .subscribe(result => {
                if ( result ) {
                    this.selection.clear();
                    this.showSnackBar(result.message,'OK');
                }
                this.mailtoAttendeesDialogRef = null;
            });
    }
    /***** CHANGE ATTENDEE STATUS *****/
    markAsCheckedIn()
    {
	    this._attendeesService.statusUpdate({'status':'checkedin', 'event_id': this.event_id,'attendee_id': this.selection.selected})
	    .subscribe(response =>
	        {
                this.selection.clear();
                this.filterParams['event_id'] = this.event_id;
                this.dataSource.getFilteredAttendees(this.filterParams);  
                this.showSnackBar(response.message, 'CLOSE');  
	       	},
	       	error => {
                // Show the error message
                this.showSnackBar(error.message, 'CLOSE');  
            });
            this.confirmDialogRef = null;
    }
    /***** EXPORT ATTENDEE *****/
    exportAttendeeData(){
      this.exportDialogref = this._matDialog.open(ExportComponent, {
          disableClose: false
      });        
      this.exportDialogref.afterClosed()
          .subscribe(result => {
              if ( result )
              {   
                this.showSnackBar('Exporting Data', 'CLOSE');  
                this.filterParams.type = result; 
                this.filterParams.event_id = this.route.params['value'].event_id;
                this._attendeesService.exportAttendee(this.filterParams);
              }
              this.exportDialogref = null;
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
     * @param {AttendeesService} _attendeesService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _attendeesService: AttendeesService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData      = this._attendeesService.attendee;
        this.filteredData.data = this.filterData(this.filteredData);
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Attendee[]>}
     */
    connect(): Observable<Attendee[]>
    {
        const displayDataChanges = [
            this._attendeesService.onAttendeeChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
            map(() => {
                    let data          = this._attendeesService.attendee;
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
    filterData(attendeesdata): any
    {
        return attendeesdata.data.map(c => new Attendee().deserialize(c,'list'));
    }
    /**
     * Get Filtered Users
     * 
     */
    getFilteredAttendees(params:any){
        return this._attendeesService.getAttendees(params).then(Response=>{
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