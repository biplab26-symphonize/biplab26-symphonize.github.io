import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {  Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, FormsService, CommonService, SettingsService, GuestRoomService} from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-my-guest-rooms',
  templateUrl: './my-guest-rooms.component.html',
  styleUrls: ['./my-guest-rooms.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None 
})
export class MyGuestRoomsComponent implements OnInit {
  @Input() homesettings: any;

  Columns: [];  
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  length: number = 0;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public statusName : any =[];
  public createdAt : any;
  
   
    // Private
    private _unsubscribeAll: Subject<any>;
 
    

    /**
     * Constructor
     *
     * 
     */
    constructor(
      private _FormsService:FormsService,
      private _guestService: GuestRoomService ,
      private _commonService :CommonService,
      private settingsservices : SettingsService
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
     
       //Deault DateTime Formats
       this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
      this.Columns            = OptionsList.Options.tables.list.myhomeguestroom;
      this.displayedColumns   = OptionsList.Options.tables.list.myhomeguestroom.map(col => col.columnDef);
      // this.homesettings.form_limit
       this._guestService.getBookingList({'user_id':JSON.parse(localStorage.getItem('token')).user_id,'print':0,'limit': this.homesettings.guest_limit}).then(forms=>{
        let formsData = forms.data;
        this.dataSource = new MatTableDataSource(formsData);
        this.length     = forms.data.length;
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
