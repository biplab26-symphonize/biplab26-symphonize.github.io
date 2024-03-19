import { Component, OnInit, ViewEncapsulation, Input  } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, DiningReservationService, CommonService} from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { DiningReservationmodel } from 'app/_models'

@Component({
  selector: 'app-my-dining',
  templateUrl: './my-dining.component.html',
  styleUrls: ['./my-dining.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None 
})
export class MyDiningComponent implements OnInit {
  @Input() homesettings: any;

  Columns: [];  
  displayedColumns: string[];
  public statusLabel : any =[];
  dataSource: MatTableDataSource<any>;
  length: number = 0;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor( private _DiningReservationService:DiningReservationService,
    private _commonService :CommonService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //get labels

    this._DiningReservationService.getLabels({'meta_key':'status_label'}).subscribe(response =>{
      this.statusLabel  = JSON.parse(response.settingsinfo.meta_value); 
    });
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.Columns            = OptionsList.Options.tables.list.mydinings;
    this.displayedColumns   = OptionsList.Options.tables.list.mydinings.map(col => col.columnDef);
      this._DiningReservationService.getBookingList({'column':'booking_start_date','user_id':JSON.parse(localStorage.getItem('token')).user_id,'print':0,'limit':this.homesettings.dining_limit,'direction':'desc',front:'1'}).then(dinings=>{ 
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
