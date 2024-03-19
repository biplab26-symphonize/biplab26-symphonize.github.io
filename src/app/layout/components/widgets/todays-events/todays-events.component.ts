import { Component, OnInit, Input } from '@angular/core';
import { EventsService, CommonService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
@Component({
  selector: 'widgets-todays-events',
  templateUrl: './todays-events.component.html',
  styleUrls: ['./todays-events.component.scss']
})
export class TodaysEventsComponent implements OnInit {

  @Input() homesettings: any;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  eventsList: any[]=[];
  constructor(
    private _eventsService:EventsService,
    private _commonService :CommonService
  ) { }

  ngOnInit() {
     //Deault DateTime Formats
     this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
     this._eventsService.getEvents({'active':'1','limit':this.homesettings.todays_event_limit}).then(events=>{
        if(events.status==200){
            events.data.map(item=>{        
              item.event_start_time = CommonUtils.getStringToDate(item.event_start_date+' '+item.event_start_time);
              //multiple locations alter
              if(item && item.eventlocations && item.eventlocations.length>0 ){
                let locationsString = item.eventlocations.map(item=>{
                    return item.eventlocation.category_name;
                });
                item.eventlocation.category_name = locationsString!=='' && locationsString!==undefined ? locationsString.join(', ') : '';
              }
              return item;
           });
          this.eventsList = events.data;
        }
       
        
    }) 
    
  }

}
