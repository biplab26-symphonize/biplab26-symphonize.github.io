import { Component, OnInit, Input} from '@angular/core';
import * as moment from 'moment';
import { SettingsService, CommonService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'event-register-buttons',
  templateUrl: './register-buttons.component.html',
  styleUrls: ['./register-buttons.component.scss']
})
export class RegisterButtonsComponent implements OnInit {

  public eventSettings: any={};
  
  @Input() event: any;
  @Input() listType: string = 'front';
  @Input() page: string = 'eventgrid';
  public favEvents:any={};
  public alreadyFav: boolean = false;
  public showNoRegistrationRequired: boolean  = false;
  public showRegistrationAlwaysOpen: boolean  = false;
  public showRegistrationNotOpen: boolean     = false;
  public showRegistrationRequired: boolean    = false;
  public showRegistered                       = false;
  public showRegistrationClosed: boolean      = false;
  public showClosed: boolean                  = false;
  public showJoinWaitlist: boolean            = false;
  public showAttendees: boolean               = false;
  public showEventFull: boolean               = false;
  public showCancelled: boolean               = false;
  public showEventClosed: boolean             = false;
  public userId: number=0;
  
  public TodaysDate: Date;
  constructor(
    public _matSnackBar:MatSnackBar,
    private _commonService : CommonService) {
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
    }

  ngOnInit() {
    
    //Event Settings From LocalStorage
    let eventSettings  = this._commonService.getLocalSettingsJson('event-settings');
    this.eventSettings = eventSettings ? eventSettings[0] : {};
    let localUserInfo = JSON.parse(localStorage.getItem('token'));
    if(localUserInfo && localUserInfo.favourite_events){
      this.favEvents  = localUserInfo;
      this.alreadyFav = this.favEvents.favourite_events.includes(this.event.event_id);
    }
    //Event start end datetime
    // const eventStart = this.event.event_start_date+' '+this.event.event_start_time;
    // const eventEnd   = this.event.event_end_date+' '+this.event.event_end_time;
    
    let eventStart = this.listType=='admin' ? this.event.event_start_time : this.event.event_start_date;
    let eventEnd   = '';
    
    
    if(this.listType=='admin'){
      if(this.event.disable_end_time=='Y' || this.event.custom_event_end=='Y'){
        eventEnd   = this.event.event_end_date+' '+'23:59:00';
      }
      if(this.event.disable_end_time=='N' && this.event.custom_event_end=='N' && this.event.event_end_time!=''){
        eventEnd   = this.event.event_end_date +' '+this.event.event_end_time;
      }
      else{
        eventEnd   = this.event.event_end_date+' '+'23:59:00';
      }
    }
    else{
      if(this.event.event_check_in && this.page=='eventgrid'){
        eventStart   = this.event.event_check_in;
      }
      if(this.event.event_check_out){
        eventEnd   = this.event.event_check_out;
      }
      else{
        eventEnd   = this.event.event_end_date;
      }      
    }
    
    //EVENT IS CANCELLED
    if(this.event.status=='C'){
      this.showCancelled = true;
    }
    else if(this.event.req_register=='N'){
      this.showNoRegistrationRequired = true;
    }
    else if(moment(eventStart).isSameOrAfter(moment()) && this.listType=='admin' && this.event.req_register=='Y' && (this.event.register_type=='A' || (this.event.register_type=='C' && moment().isBetween(moment(this.event.registration_start), moment(this.event.registration_end)) || this.event.register_type=='D' && moment().isBetween(moment(this.event.registration_start), moment(this.event.registration_end)))) ){
      this.showRegistrationAlwaysOpen = true;
    }
    else if(this.listType=='admin' && this.event.req_register=='Y' && ((this.event.register_type=='C' || this.event.register_type=='D') && moment().isAfter(moment(this.event.registration_end)) ) ){
      this.showRegistrationClosed = true;
    }
    else if(moment(eventEnd).isSameOrAfter(moment())){
      //Registration Not Open
      if(this.event.req_register=='Y' && moment().isBefore(moment(this.event.registration_start))){
        this.showRegistrationNotOpen = true;
      }
      //Registration Required
      if((this.event.register_type=='C' || this.event.register_type=='D') && (this.event.registered==false || this.eventSettings.event_registration_settings.restrict_registration_only_once=="N") && this.event.availablespace.attendeespace>0 && this.event.req_register=='Y' && moment().isBetween(moment(this.event.registration_start), moment(this.event.registration_end))){
        this.showRegistrationRequired = true;
      }
      //Registration Always Open Show Register Button
      if(moment(eventStart).isSameOrAfter(moment()) && this.event.register_type=='A' && (this.event.registered==false || this.eventSettings.event_registration_settings.restrict_registration_only_once=="N") && this.event.availablespace.attendeespace>0 && this.event.req_register=='Y'){
        this.showRegistrationRequired = true;
      }
      //Join Waitlist
      if((this.event.req_register=='Y' && moment().isBetween(moment(this.event.registration_start), moment(this.event.registration_end)) && this.eventSettings.event_registration_settings.restrict_registration_only_once=="N" && this.event.is_waitlist=='Y' && this.event.availablespace.waitlistspace>0 && this.event.availablespace.attendeespace==0) || (this.event.req_register=='Y' && this.event.register_type=='A' && this.eventSettings.event_registration_settings.restrict_registration_only_once=="N" && this.event.is_waitlist=='Y' && this.event.availablespace.waitlistspace>0 && this.event.availablespace.attendeespace==0)){
        this.showJoinWaitlist = true;
      }
      //Registration Closed
      if((this.event.register_type=='A' && moment(eventStart).isBefore(moment())) || ((this.event.register_type=='C' || this.event.register_type=='D') && this.event.req_register=='Y' && moment().isAfter(moment(this.event.registration_end)))){
        this.showRegistrationClosed = true;
      }
      //Attendees Button
      if(this.event.eventattendees.length>0){
        this.showAttendees = true;
      }
      //Registred if allow multiple = 'N'
      if(this.event.registered==true && this.eventSettings.event_registration_settings.restrict_registration_only_once=="Y" ){
        this.showRegistered = true;
      }
      //EVENT IS CANCELLED
      if(this.event.status=='C'){
        this.showCancelled = true;
      }
      //EVENT IS FULL
      if(this.event.availablespace.attendeespace==0 && this.event.availablespace.waitlistspace==0){
        this.showEventFull = true;
      }
    }
    else if(moment(eventEnd).isBefore(moment())){
      this.showEventClosed = true;
    }
    
  }

  //add to favourite
  addToFavourite(eventId){
    let eventInfo = {event_id:eventId,user_id:this.userId};
    console.log(this.event);
    this._commonService.addToFavourite(eventInfo).subscribe(response=>{
      if(response.message){
        if(this.favEvents && this.favEvents.favourite_events){
          this.alreadyFav = true;
          this.favEvents.favourite_events.push(eventId);
          //Update localStorage Contacts
          localStorage.setItem('token',JSON.stringify(this.favEvents));
        }        
        this.showSnackBar(response.message,'OK',2000);
      }
    })
  }
  //remove Favourite
  removeFavourite(eventId){
    let eventInfo = {event_id:[eventId],user_id:this.userId};
    this._commonService.removeFavourite(eventInfo).subscribe(response=>{
      if(response.message){
        if(this.favEvents && this.favEvents.favourite_events){
          this.alreadyFav = false;
          let localUserInfo = JSON.parse(localStorage.getItem('token'));
          if(localUserInfo.favourite_events.length>0){
              localUserInfo.favourite_events.splice(localUserInfo.favourite_events.indexOf(eventId), 1);
              localStorage.setItem('token',JSON.stringify(localUserInfo));
          }
          this.favEvents.favourite_events.push(eventId);
          //Update localStorage Contacts
          localStorage.setItem('token',JSON.stringify(this.favEvents));
        }        
        this.showSnackBar(response.message,'OK',2000);
      }
    })
  }
  showSnackBar(message:string,buttonText:string,duration:number=2000){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : duration
    });
  }
}
