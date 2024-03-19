import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';
import { AppointmentBookingService,CommonService,SettingsService } from 'app/_services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

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
  public service_desc :any ;
  public serviceImage : any;
  public serviceID : any;
  public groupLimit: any[] = [];
  
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
  private _appointmentService : AppointmentBookingService,
  private router : Router,
  private route : ActivatedRoute,
  private _commonService : CommonService,
  private _settingService : SettingsService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.minDate = new Date();
    this.startDate = new Date();
    console.log('min date',this.minDate);
    let currDate = new Date();
    
    this._appointmentService.getMaxDays({'meta_key':'accept_booking_days_earlier'}).subscribe(response =>{
      let maxDays = response.settingsinfo.meta_value; 
      currDate.setDate(currDate.getDate()+parseInt(maxDays));
      this.maxDate = currDate;
      
      console.log('maxdate',this.maxDate);
      while( this.startDate<=this.maxDate){
        this.dateRange.push(new Date(this.startDate));
       this.startDate.setDate(this.startDate.getDate() + 1);
      }

    
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
    this.defaultImage = '/assets/images/backgrounds/maintenance-request.jpg';
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  setControls(){
    
    this.displayDate = moment(new Date()).format('YYYY-MMM-DD');
    this.getServices(moment(new Date()).format('YYYY-MMM-DD')); 

    let getData = this._appointmentService.getViewBookingData();
 
    if(getData!='' && getData!=undefined && this.route.routeConfig.path!="fitness-reservation/services"){
      this.selectedDate = new Date(getData.booking_start_date);
      this.displayBookings = true;
    }else{
      this.displayBookings = false;
    }

    
    
    /*let maxDays = response.data[1].meta_value;
    console.log('max days',maxDays);
    this.maxDate = new Date(new Date().setMonth(this.minDate.getMonth()+maxDays));
    console.log('maxDate',this.maxDate);*/
  }

  getTimeZone(){
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    let timeZoneSetting = this.generalSettings.APP_TIMEZONE;
    let usaDateTime = new Date().toLocaleString("en-US", {timeZone: timeZoneSetting});
    let usaCurrentTime = usaDateTime.split(',')
    
    //this.getCurrentTime = usaCurrentTime[1].trim();
    this.getCurrentTime = moment(usaCurrentTime[1].trim(), ["h:mm A"]).format("HH:mm:ss");
    console.log("getCurrentTime",this.getCurrentTime);

    this.getCurrentDate = moment(new Date(usaCurrentTime[0])).format('YYYY-MMM-DD');
    this.getCurrentDateTime = moment(new Date(usaCurrentTime[0])).format('YYYY-MMM-DD, hh:mm a');
   
  }

  showBookings(service_id,service_title,service_image,service_description){
    this.displayBookings=true;
    this.displayData=false;
    this.serviceID = service_id;
    this.serviceTitle = service_title;
    this.service_desc = service_description;
    this.serviceImage = service_image;
  }

  
  onSelectDate(event){
    this.displayBookings=false;
    this.selectedDate= event;
    this.getServices(moment(event).format('YYYY-MMM-DD'));
    this.displayDate = moment(event).format('YYYY-MMM-DD');
  }

  getServices(getdate){
    this._appointmentService.getServices({'status': 'A','front':1,'date':getdate,'column':'service_title','direction':'asc'}).subscribe(response =>{
      this.services = response.data;
      for(let item of this.services){
         
          if(item.current_day_reg_cutoff!='' && item.current_day_reg_cutoff!=undefined){
            this.getServiceCutoffTime[item.id]=moment(item.current_day_reg_cutoff, ["h:mm A"]).format("HH:mm:ss");
            //this.getServiceCutoffTime[ir]
          }
      }
      console.log("getServiceCutoffTime",this.getServiceCutoffTime);
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
