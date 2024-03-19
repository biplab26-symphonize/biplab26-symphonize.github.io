import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { AppointmentBookingService, CommonService, AppConfig,OptionsList, GuestRoomService } from 'app/_services';
import { FormGroup} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.scss'],
  animations : fuseAnimations

})
export class ViewRoomComponent implements OnInit {



  public currentUser          : any;
  public url_id               : number;
  public dateType             : any;
  public fieldConfig          : any = [];
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public generalSettings      : any = {};
  public homeSettings         : any = {};
  public timeformat           : any ;
  public value                : any;
  type                        : any; 
  public content              : any = {};
  public CustomFormats        : any;
  public guestdisp            : boolean=false;
  public serviceTitle         : any;
  public guestCount = 0;
  public nights: any;
  constructor(private route    : ActivatedRoute,
    private _fuseConfigService : FuseConfigService,
    private _guestroomBookingService : GuestRoomService,
    private  _commonService    : CommonService) {
      this.route.params.subscribe( params => {
        this.url_id = params.id;
      });
      // Configure the layout 
      this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.homeSettings     = this._commonService.getLocalSettingsJson('home_settings');
    //Get Phone n datePicker Format 
    this.CustomFormats = OptionsList.Options.customformats;
    this.dateType=this.homeSettings.datetimeformat;
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    this.getBooking();
     
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat; 
  }


  getBooking(){
    this._guestroomBookingService.getBookingRoomsContents(this.url_id)
    .subscribe(response =>
    {
      //console.log('response',response);
      if (response.status == 200 ) 
      {
        setTimeout(() => {
          console.log(response);
          this.content = response.bookinginfo;
          let currentDate = new Date(this.content.date_to);
          let dateSent = new Date(this.content.date_from);
          this.nights = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
          this.nights = Number(this.nights);
          this.content.bookingrooms.map((element, index)=>{
            this.guestCount = this.guestCount + Number(element.adults) + Number(element.children)
          });
          this.content.bookingextras.map((element, index)=>{
            if(element.extras.per_price == 'day'){
              let total = Number(element.extras.price) * Number(this.nights);
              element['total'] = total;
            }
            if(element.extras.per_price == 'day_person'){
              let total = Number(element.extras.price) * Number(this.guestCount);
              let final_total = Number(this.nights) * total;
              element['total'] = final_total;
            }
            if(element.extras.per_price == 'person'){
              let total = Number(element.extras.price) * Number(this.guestCount);
              element['total'] = total;
            }           
          });
          console.log("this.content",this.content);
        
        },200);
        
      }
    });     
  }

   // print display the value
  getPrint(){
  
    let params = [];
    params.push(
       {
         'id': this.url_id 
       },
       {
         'print':'1'
       }
    );
     this._guestroomBookingService.getPrintguestroomBookingEntries('guestroom/view/booking', params)
   }

}

