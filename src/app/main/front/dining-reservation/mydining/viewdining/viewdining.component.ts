import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { DiningReservationService, CommonService, AppConfig,OptionsList } from 'app/_services';
import { FormGroup} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-viewdining',
  templateUrl: './viewdining.component.html',
  styleUrls: ['./viewdining.component.scss'],
  animations : fuseAnimations
})
export class ViewdiningComponent implements OnInit {

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
  public CustomFormats      : any;
  public guestdisp            : boolean=false;

  constructor(private route    : ActivatedRoute,
    private _fuseConfigService : FuseConfigService,
    private _diningReservationService : DiningReservationService,
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
    this._diningReservationService.getBookingContent(this.url_id)
    .subscribe(response =>
    {
      //console.log('response',response);
      if (response.status == 200 ) 
      {
        this.content = response.bookinginfo;
        console.log('content',this.content.service_name);
        if(this.content.guestinfo.length>0 ){
          this.guestdisp = true;
        }
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
     this._diningReservationService.getPrintDiningentry('diningreservation/view/diningbooking', params)
   }

}
