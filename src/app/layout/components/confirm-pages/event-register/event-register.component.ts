import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { AppConfig, AuthService, AttendeesService, CommonService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html',
  styleUrls: ['./event-register.component.scss'],
  animations : fuseAnimations
})
export class EventRegisterComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  public attendeeId: number = 0;
  public userInfo  : any; 
  public attendeeInfo : any;
  public calendarSlug: string = '';
  public eventSettings: any;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};

  public appConfig: any;
  constructor(
    private route:ActivatedRoute,
    private _attendeeService: AttendeesService,
    private _commonService:CommonService,
    private _authService:AuthService,
    private _fuseConfigService: FuseConfigService,
    private _matSnackBar: MatSnackBar
  ) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.appConfig         = AppConfig.Settings;
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    //RegistrationId
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(param =>{
      this.attendeeId = param.id;
    });
  }

  ngOnInit() {
    this.userInfo = this._authService.currentUserValue.token.user;

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        
    //Event Settings Fromn LocalStorage
    let eventSettings  = this._commonService.getLocalSettingsJson('event-settings');
    this.eventSettings = eventSettings ? eventSettings[0] : {};
    
    //Get Registration Info Using Attendeeid
    if(this.attendeeId>0){
      this._attendeeService.getAttendee({attendee_id:this.attendeeId}).then(atnInfo=>{
        if(atnInfo.status==200){
          this.attendeeInfo = atnInfo.attendeeinfo;
          this.calendarSlug = this.attendeeInfo.event && this.attendeeInfo.event.eventcalendar && this.attendeeInfo.event.eventcalendar.category_alias ? this.attendeeInfo.event.eventcalendar.category_alias : '';
        }
      })
    }
  }
  //Export To Google Calendar
  exportToGoogle(){
    this._attendeeService.exportGoogleCal({attendee_id:this.attendeeId}).subscribe(response=>{
      if(response.status==200){
        this.showSnackBar(response.message,'CLOSE');
        window.open(response.url, "_blank");
      }
      else{
        this.showSnackBar(response.message,'CLOSE');
      }
    });
  }
  exportToOutlook(){
    if(this.attendeeId>0){
      window.open(this.appConfig.url.apiUrl+'download/ical?attendee_id='+this.attendeeId, "_blank");
    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}
