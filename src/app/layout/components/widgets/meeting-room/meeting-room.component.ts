import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SettingsService, CommonService, OptionsList, MeetingRoomService } from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { MeetingRoomModule } from './meeting-room.module';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None 
})
export class MeetingRoomComponent implements OnInit {

  
  @Input() homesettings: any;
  public  statusName : any =[];

  Columns: [];  
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  length: number = 0;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _settingservice : SettingsService,
    private meetingroomservices : MeetingRoomService,
    private _commonService :CommonService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    // this._settingservice.getTableReservaitionSetting({meta_type : "table"}).then(response =>{
    //   for(let data of response.data)
    //   {
    //     if(data.meta_key == 'status_label'){
    //       this.statusName  = JSON.parse(data.meta_value);
    //     }   
    //   }
    // })
    this.Columns            = OptionsList.Options.tables.list.mymeetingroom;
    this.displayedColumns   = OptionsList.Options.tables.list.mymeetingroom.map(col => col.columnDef);
    
      this.meetingroomservices.getMeetingRoomBookingList({'front':1,'column':'start_date','direction':'desc','user_id':JSON.parse(localStorage.getItem('token')).user_id,'print':0,'limit':this.homesettings.meetingroom_limit}).then(reponse=>{ 
     console.log(reponse);
      this.dataSource = new MatTableDataSource(reponse.data);
      this.length     = reponse.data.length;
    }); 
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}
