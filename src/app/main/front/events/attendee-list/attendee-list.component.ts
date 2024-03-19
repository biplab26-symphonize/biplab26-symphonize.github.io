import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, AttendeesService, AppConfig, AuthService, SettingsService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendee-list',
  templateUrl: './attendee-list.component.html',
  styleUrls: ['./attendee-list.component.scss'],
  animations : fuseAnimations
})
export class AttendeeListComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  _defaultAvatar: string = AppConfig.Settings.url.defaultAvatar;
  public Columns: any;
  public displayedColumns: any;
  public dataSource;
  public event_id:number = 0;
  public user_id :number = 0;
  public eventInfo: any={};
  public EventSettings: any = {};
  public calendarSlug: string='';
  public joinWaitList: boolean = false;
  public joinRegister: boolean = false;
  public length:number = 0;

  constructor(
    private _fuseConfigService:FuseConfigService,
    private route:ActivatedRoute,
    private authService :AuthService,
    private attendeeService:AttendeesService,
    private _settingService   : SettingsService) { 

    this.route.params.subscribe(param =>{
      this.event_id = param.event_id;
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();

    this.user_id            = this.authService.currentUserValue.token.user.id;
    this.Columns            = OptionsList.Options.tables.list.frontattendeelist;
    this.displayedColumns   = OptionsList.Options.tables.list.frontattendeelist.map(col => col.columnDef);
  }

  ngOnInit() {
    //EventSettings
    const eventsettings = this._settingService.setting;
    this.EventSettings  = CommonUtils.getStringToJson(eventsettings.settingsinfo.meta_value);
    this.EventSettings  = this.EventSettings.length>0 ? this.EventSettings[0] : {};
    this.attendeeService.viewEvents({'event_id':this.event_id,'user_id':this.user_id}).subscribe(response =>{
      this.eventInfo    = response.eventinfo;
      this.calendarSlug = this.eventInfo && this.eventInfo.eventcalendar && this.eventInfo.eventcalendar.category_alias ? this.eventInfo.eventcalendar.category_alias : '';
      //this.eventInfo && this.eventInfo.availablespace.attendeespace==0 && this.eventInfo.availablespace.waitlistspace
      this.joinRegister = this.eventInfo && this.eventInfo.availablespace.attendeespace>0 ? true : false;  
      this.joinWaitList = this.eventInfo && this.eventInfo.availablespace.attendeespace<=0 && this.eventInfo.availablespace.waitlistspace>0 ? true : false;  
      
      
      this.dataSource = this.formatElement(response.eventinfo.eventattendees);
      this.length   = this.dataSource
                    .map(item => item.guestcount)
                    .filter(item => item>0)
                    .reduce((prev, curr) => prev + curr, 0);
    })
  }

  formatElement(ele) {
    let arrAttendee = [];

    for(let i=0 ;i<ele.length;i++)
    {
      let objAttendee:any = {};
      //User Media
      objAttendee.avatar        = ele[i].usermedia.length>0 && ele[i].usermedia[0].media ? AppConfig.Settings.url.mediaUrl + ele[i].usermedia[0].media.image : '';
      
      if(ele[i].status == 'waitlist')
      {
        objAttendee.name        = ele[i].attendee_type=='M' ? ele[i].first_name + ' ' + ele[i].last_name + ' ' + '-'+' '+ ele[i].status : ele[i].first_name + ' ' + ' ' + '-'+' '+ ele[i].status;
      }
      else{
        if(ele[i].attendee_type=='M'){
          objAttendee.name        = ele[i].first_name + ' ' + ele[i].last_name ? ele[i].first_name + ' ' + ele[i].last_name : '---';
        }
        else{
          objAttendee.name        = ele[i].first_name ? ele[i].first_name : '---';
        }
      }
      objAttendee.notes         = ele[i].notes ? ele[i].notes : ' ';
      objAttendee.guestcount    = ele[i].guestcount ? ele[i].guestcount : ' ';
      objAttendee.attendee_type = (ele[i].attendee_type == 'M')? 'Resident': 'Guest';
      
      arrAttendee.push(objAttendee);

      let tmpGuest = ele[i].guests;
      for(let j=0; j<tmpGuest.length; j++)
      {
        let objGuest:any = {};
        
        objGuest.name= tmpGuest[j].first_name+' '+'-'+' '+'Guest of'+' '+ele[i].first_name + ' ' + ele[i].last_name;
        objGuest.notes=tmpGuest[j].notes ? tmpGuest[j].notes : ' ' ;
        objGuest.guestcount=tmpGuest[j].guestcount ? tmpGuest[j].guestcount : ' ';
        objGuest.attendee_type= (tmpGuest[j].attendee_type == 'G') ? 'Guest' : ''; 
        arrAttendee.push(objGuest);
      }
    }
    let arrayAttendeeList = arrAttendee;
    return arrayAttendeeList;
  }

  getPrint(){
    this.attendeeService.viewEvents({'event_id': this.event_id,'print':1}).subscribe(response =>{
      window.open(AppConfig.Settings.url.mediaUrl + response.pdfinfo);
    })
  }

}
