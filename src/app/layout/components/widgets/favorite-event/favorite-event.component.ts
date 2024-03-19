import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { OptionsList, EventsService, AuthService, CommonService } from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { Event } from 'app/_models';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-favorite-event',
  templateUrl: './favorite-event.component.html',
  styleUrls: ['./favorite-event.component.scss']
})
export class FavoriteEventComponent implements OnInit {

  @Input() homesettings: any;
  
  Columns: [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  length: number = 0;
  user_id: number = 0;

  constructor(
    private _eventsService:EventsService,
    private _commonService :CommonService,
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.Columns = OptionsList.Options.tables.list.myevent;
    this.displayedColumns = OptionsList.Options.tables.list.myevent.map(col => col.columnDef);

    this.user_id = this._authService.currentUserValue.token.user.id;

    this._eventsService.getFavouriteEvents({'column':'event_id','user_id':this.user_id,'limit':this.homesettings.favorite_event_limit}).then(events => {
      if(events.data && events.data.length>0){
        let eventData   = events.data.map(c => new Event().deserialize(c, 'myeventlist'));
        this.dataSource = new MatTableDataSource(eventData);        
        this.length     = eventData.length;
      }
    });
    
  }

}
