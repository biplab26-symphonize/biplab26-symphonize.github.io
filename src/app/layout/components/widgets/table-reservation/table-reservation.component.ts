import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TabelReservationService, CommonService, OptionsList, SettingsService } from 'app/_services';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { DiningReservationmodel } from 'app/_models';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None 
})
export class TableReservationComponent implements OnInit {

  @Input() homesettings: any;
  public  statusName : any =[];

  Columns: [];  
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  length: number = 0;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor( private tabelreservation : TabelReservationService,
    private _settingservice : SettingsService,
    private _commonService :CommonService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this._settingservice.getTableReservaitionSetting({meta_type : "table"}).then(response =>{
      for(let data of response.data)
      {
        if(data.meta_key == 'status_label'){
          this.statusName  = JSON.parse(data.meta_value);
        }   
      }
    })
    this.Columns            = OptionsList.Options.tables.list.mytablebooking;
    this.displayedColumns   = OptionsList.Options.tables.list.mytablebooking.map(col => col.columnDef);
    
      this.tabelreservation.getBookingList({'column':'','direction':'desc','user_id':JSON.parse(localStorage.getItem('token')).user_id,'print':0,'limit':this.homesettings.tablereservation_limit}).then(dinings=>{ 
      let diningData = dinings.data.map(c => new DiningReservationmodel().deserialize(c));
      this.dataSource = new MatTableDataSource(diningData);
      this.length     = dinings.data.length;
    }); 
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}
