import { Component, Injectable, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';
import { DiningReservationService,CommonService,SettingsService } from 'app/_services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations : fuseAnimations
})
export class AddComponent implements OnInit {
  //public addBookingForm : FormGroup;
  public services : any;
  public selectedDate : any;
  public displayDate : any;
  public displayBookings : boolean = false;
  public serviceTitle : any;
  public serviceImage : any;
  public serviceID : any;
  public groupLimit: any[] = [];
  public startDay: any;
  
  public displayData : boolean = true;
  public generalSettings:any = {};
  public getCurrentTime : any;
  public getCurrentDate : any;
  public minDate : any;
  public maxDate : any;
  public startDate : any;
  public defaultImage : any;
  public getCurrentDateTime : any;
  public getServiceCutoffTime : any[] = [];
  public dateRange : any=[];
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};

  constructor(private fb : FormBuilder, 
  private _fuseConfigService    : FuseConfigService,
  private _diningService : DiningReservationService,
  private router : Router,
  private route : ActivatedRoute,
  private _commonService : CommonService,
  private _settingService : SettingsService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.minDate = new Date();
    this.startDate = new Date();
    console.log('min date',this.minDate);
    let currDate = new Date();
    
    this._diningService.getMaxDays({'meta_key':'accept_booking_days_earlier'}).subscribe(response =>{
      let maxDays = response.settingsinfo.meta_value; 
      currDate.setDate(currDate.getDate()+parseInt(maxDays));
      this.maxDate = currDate;
      
      console.log('maxdate',this.maxDate);
      while( this.startDate<=this.maxDate){
        this.dateRange.push(new Date(this.startDate));
       this.startDate.setDate(this.startDate.getDate() + 1);
      }

    
    });
    this._diningService.getMaxDays({ 'meta_key': 'first_day_week' }).subscribe(response => {
      this.startDay = response.settingsinfo.meta_value;
      console.log("startDay",this.startDay);
      localStorage.setItem('startDay', this.startDay);
    });
    
    //console.log('date range',this.dateRange);
  }

  ngOnInit() {
    // if(this.route.routeConfig.path=="dining-reservations/services"){
    //   this.displayBookings = false;
    //   console.log('display booking',this.displayBookings);
    // }
    
    this.setControls();
    this.getTimeZone();
    this.defaultImage = '/assets/images/backgrounds/diningReservation.jpg';
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  setControls(){
    
    this.displayDate = moment(new Date()).format('YYYY-MMM-DD');
    this.getServices(moment(new Date()).format('YYYY-MMM-DD')); 

    let getData = this._diningService.getViewBookingData();
   
    if(getData!='' && getData!=undefined && this.route.routeConfig.path!="dining-reservations/services"){
      //this.selectedDate= moment(getData.booking_start_date).format('YYYY-MMM-DD');
      this.selectedDate = new Date(getData.booking_start_date);
      this.displayBookings = true;
    }else{
      this.displayBookings = false;
    }
  }

  getTimeZone(){
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    let timeZoneSetting = this.generalSettings.APP_TIMEZONE;
    let usaDateTime = new Date().toLocaleString("en-US", {timeZone: timeZoneSetting});
    let usaCurrentTime = usaDateTime.split(',')
    
    //this.getCurrentTime = usaCurrentTime[1].trim();
    this.getCurrentTime = moment(usaCurrentTime[1].trim(), ["h:mm A"]).format("HH:mm:ss");

    this.getCurrentDate = moment(new Date(usaCurrentTime[0])).format('YYYY-MMM-DD');
    this.getCurrentDateTime = moment(new Date(usaCurrentTime[0])).format('YYYY-MMM-DD, hh:mm a');
   
  }

  showBookings(service_id,service_title,service_image){
    this.displayBookings=true;
    this.displayData=false;
    this.serviceID = service_id;
    this.serviceTitle = service_title;
    this.serviceImage = service_image;
    console.log('display booking',this.displayBookings);
  }

  
  onSelectDate(event){
    this.displayBookings=false;
    this.selectedDate= event;
    this.getServices(moment(event).format('YYYY-MMM-DD'));
    this.displayDate = moment(event).format('YYYY-MMM-DD');
  }

  getServices(getdate){
    this._diningService.getServices({'status': 'A','front':1,'date':getdate,'column':'service_title','direction':'asc'}).subscribe(response =>{
      this.services = response.data;
      
      for(let item of this.services){
         
          if(item.current_day_reg_cutoff!='' && item.current_day_reg_cutoff!=undefined){
            this.getServiceCutoffTime[item.id]=moment(item.current_day_reg_cutoff, ["h:mm A"]).format("HH:mm:ss");
            //this.getServiceCutoffTime[ir]
          }
        
        
      }
    });
    
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      let dateval = new Date(date);
      //console.log('date',dateval);
     // let dateValue = date._d;
      const highlightDate = this.dateRange
        .map(strDate => new Date(strDate))
        .some(d => d.getDate() === dateval.getDate() && d.getMonth() === dateval.getMonth() && d.getFullYear() === dateval.getFullYear());
      
      return highlightDate ? 'special-date' : '';
    };
  }

  displayFrontBooking(event){
    this.displayBookings = false;
  }
}
@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  getFirstDayOfWeek(): number {
    return localStorage.getItem('startDay') == 'sunday' ? 0 : 1;
  }

}