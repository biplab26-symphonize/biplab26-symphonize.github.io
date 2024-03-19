import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { OptionsList, EventsService, AuthService, CommonService } from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { Event } from 'app/_models';

@Component({
  selector: 'widget-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MyEventsComponent implements OnInit {
  @Input() homesettings: any;

  Columns: [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  length: number = 0;
  user_id: number = 0;

  // Private
  private _unsubscribeAll: Subject<any>;


  /**
   * Constructor
   *
   * 
   */
  constructor(
    private _eventsService: EventsService,
    private _authService: AuthService,
    private _commonService: CommonService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.Columns = OptionsList.Options.tables.list.myevent;
    this.displayedColumns = OptionsList.Options.tables.list.myevent.map(col => col.columnDef);

    this.user_id = this._authService.currentUserValue.token.user.id;

    this._eventsService.getMyEvents({ 'user_id': this.user_id, 'limit': this.homesettings.event_limit }).then(events => {
      if(events.data && events.data.length>0){
        let eventData   = events.data.map(c => new Event().deserialize(c, 'myeventlist'));
        this.dataSource = new MatTableDataSource(eventData);        
        this.length     = eventData.length;
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

