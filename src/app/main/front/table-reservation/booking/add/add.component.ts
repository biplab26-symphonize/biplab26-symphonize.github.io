import { Component, OnInit,ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';
import { TabelReservationService,CommonService,SettingsService } from 'app/_services';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCalendarCellCssClasses, MatCalendar } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations : fuseAnimations
})
export class AddComponent implements OnInit {

  @ViewChild('calendar', {static: true}) calendar: MatCalendar<Date>;
  //public addBookingForm : FormGroup;
  public services : any;
  public selectedDate : any;
  public displayDate : any;
  public displayDateMac : any;
  public displayBookings : boolean = false;
  public serviceTitle : any;
  public serviceDescription : any;
  public serviceImage : any;
  public serviceID : any;
  public groupLimit: any[] = [];
  public startAt : any; 
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
  selectedMonth = new Date();
  public dateRange : any=[];
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public weekday = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  public time_slot_Arrya: any =[];
  public workingTimes : any =[];
  public day_from :any;
  public day_to :any ;

  constructor(private fb : FormBuilder, 
    public datepipe: DatePipe,
  private _fuseConfigService    : FuseConfigService,
  private _tableService : TabelReservationService,
  private router : Router,
  private route : ActivatedRoute,
  private _commonService : CommonService,
  private _settingService : SettingsService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.minDate = new Date();
    this.startDate = new Date();
    let currDate = new Date();
    
    this._tableService.getMaxDays({'meta_key':'accept_booking_days_earlier'}).subscribe(response =>{
      let maxDays = response.settingsinfo.meta_value; 
     
      currDate.setDate(currDate.getDate()+parseInt(maxDays));
      this.maxDate = currDate;
      
      
      while( this.startDate<=this.maxDate){
        this.dateRange.push(new Date(this.startDate));
       this.startDate.setDate(this.startDate.getDate() + 1);
      }

    
    });
    
  }

  ngOnInit() {

    // }
    this.setControls();
    this.getTimeZone();
    this.defaultImage = '/assets/images/backgrounds/diningReservation.jpg';
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  setControls(){
    
    this.displayDate = moment(new Date()).format('YYYY-MM-DD');
    this.displayDateMac = CommonUtils.getStringToDate(this.displayDate);
    this.getServices(moment(new Date()).format('YYYY-MMM-DD')); 
    let future = new Date();
    let getData = this._tableService.getViewBookingData();
    if(getData!='' && getData!=undefined && this.route.routeConfig.path!="restaurant-reservations/services"){
      //  this.selectedMonth = getData.selected_date;
      this.displayDate = moment(new Date(getData.selected_date)).format('YYYY-MM-DD');
      this.displayDateMac = CommonUtils.getStringToDate(this.displayDate);
      this.getServices(this.displayDate);
      this.startAt = moment(new Date(getData.selected_date)).format('YYYY-MM-DD');
      this.selectedDate = moment(new Date(getData.selected_date)).format('YYYY-MM-DD');
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

  showBookings(service_id,service_title,service_image,service_description){
    this.displayBookings=true;
    this.displayData=false;
    this.serviceID = service_id;
    this.serviceTitle = service_title;
    this.serviceDescription = service_description;
    this.serviceImage = service_image;
  }

  
  onSelectDate(event){
    this.displayBookings=false;
    this.selectedDate= event;
    this.getServices(moment(event).format('YYYY-MMM-DD'));
    this.displayDate = moment(event).format('YYYY-MM-DD');
    this.displayDateMac = CommonUtils.getStringToDate(this.displayDate);

  }

  getServices(getdate){
    this._tableService.getServices({'status': 'A','front':1,'date':getdate,'column':'order','direction':'asc'}).subscribe(response =>{
      this.services = response.data;
      this.time_slot_Arrya = [];
      for(let item of this.services){
            let day_count = new Date(getdate).getDay();
            let day = this.weekday[day_count];
              this.day_from = day+'_from'
             this.day_to = day+'_to'
            this.workingTimes = Object.entries(item.workingtimes).map(([type, value]) => ({type, value}));
            let form = this.workingTimes.forEach (item =>  { 
              if(item.type == this.day_from){
                this.day_from = item.value != null ? item.value:'';
              }
              if(item.type == this.day_to){
                this.day_to = item.value != null ? item.value:'';
              }
            });
            let date =  moment(new Date(getdate)).format('YYYY-MM-DD');
            this.time_slot_Arrya.push({from : date+' '+this.day_from, to : date+' '+this.day_to});
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
