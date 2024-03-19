import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { TabelReservationService, CommonService, AppConfig, OptionsList, MeetingRoomService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import moment from 'moment';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.scss'],
  animations : fuseAnimations
})
export class ViewRoomComponent implements OnInit {

 
  public currentUser: any;
  public url_id: number;
  public dateType: any;
  public fieldConfig: any = [];
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public generalSettings: any = {};
  public homeSettings: any = {};
  public timeformat: any;
  public value: any;
  type: any;
  public content: any ;
  public CustomFormats: any;
  public guestdisp: boolean = false;
  public serviceTitle: any;
  public HourFirstValue :any ;
  public HourLastValue : any ;

  constructor(private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
   private _meetingroom   : MeetingRoomService,
    private _commonService: CommonService) {
    this.route.params.subscribe(params => {
      this.url_id = params.id;
    });
    // Configure the layout 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
    //Get Phone n datePicker Format 
    this.CustomFormats = OptionsList.Options.customformats;
    this.dateType = this.homeSettings.datetimeformat;
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    this.getBooking();

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  getBooking() {
    this._meetingroom.ViewBookingRoomsContent(this.url_id)
      .subscribe(response => {        
        if (response.status == 200) {          
          this.content = response.bookinginfo;
          if(this.content.book_by == 'hour'){
            if( this.content.bookingslots.length>0){
              let  index =  this.content.bookingslots.length-1;
              this.HourFirstValue =  this.content.bookingslots[0].start_hour;
              this.HourLastValue = this.content.bookingslots[index].end_hour;
              console.log("HourLastValue",this.HourLastValue);
          }else{
            let  index =  this.content.bookingslots.length;
            this.HourFirstValue = this.content.bookingslots[0].start_hour
            this.HourLastValue =this.content.bookingslots[index].end_hour;
          }
          }
        
        }
      });
  }

  // print display the value
  getPrint() {

    let params = [];
    params.push(
      {
        'id': this.url_id
      },
      {
        'print': '1'
      }
    );
    this._meetingroom.getPrintBookingEntries('meetingroom/view/meetbookings', params)
  }
}
