import { Component, OnInit, ViewEncapsulation, Input  } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, FoodReservationService} from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { DiningReservationmodel } from 'app/_models'

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None 
})
export class MyBookingComponent implements OnInit {
  @Input() homesettings: any;

  Columns: [];  
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  length: number = 0;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor( private _FoodReservationService:FoodReservationService,
    private _commonService :CommonService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }


  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.Columns            = OptionsList.Options.tables.list.mybooking;
    this.displayedColumns   = OptionsList.Options.tables.list.mybooking.map(col => col.columnDef);
    setTimeout(() => {
      this._FoodReservationService.getBookingList({'front':'1','current':'1','user_id':JSON.parse(localStorage.getItem('token')).user_id,'print':0,'limit':this.homesettings.foodreservation_limit,'direction':'desc','column':'booking_start_date'}).then(dinings=>{ 
        let diningData = dinings.data.map(c => new DiningReservationmodel().deserialize(c));
        this.dataSource = new MatTableDataSource(diningData);
        this.length     = dinings.data.length;
      });  
    }, 1200);
     
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }


}
