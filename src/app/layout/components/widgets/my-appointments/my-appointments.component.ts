import { Component, OnInit, ViewEncapsulation, Input  } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, AppointmentBookingService, CommonService} from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { DiningReservationmodel } from 'app/_models'


@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None 
})
export class MyAppointmentsComponent implements OnInit {
  @Input() homesettings: any;
  Columns: [];  
  public statusLabel : any =[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  length: number = 0;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(private _AppointmentBookingService:AppointmentBookingService,
    private _commonService :CommonService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._AppointmentBookingService.getLabels({'meta_key':'status_label'}).subscribe(response =>{
      this.statusLabel  = JSON.parse(response.settingsinfo.meta_value); 
    });
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.Columns            = OptionsList.Options.tables.list.myhomeappointments;
    this.displayedColumns   = OptionsList.Options.tables.list.myhomeappointments.map(col => col.columnDef);
      this._AppointmentBookingService.getBookingList({'display':'list','user_id':JSON.parse(localStorage.getItem('token')).user_id,'print':0,'limit':this.homesettings.form_limit,front:'1'}).then(appointments=>{ 
      let appointmentData = appointments.BookingList.data.map(c => new DiningReservationmodel().deserialize(c));
      this.dataSource = new MatTableDataSource(appointmentData);
      this.length     = appointments.BookingList.data.length;
    }); 
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}
