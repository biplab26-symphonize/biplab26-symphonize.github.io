import { Component, OnInit,EventEmitter, Output,Input, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl, FormArray } from '@angular/forms';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { OptionsList, CommonService, CalendarGeneratorService } from 'app/_services';
import {DateTimeAdapter,
    OWL_DATE_TIME_FORMATS,
    OWL_DATE_TIME_LOCALE,
    OwlDateTimeComponent,
    OwlDateTimeFormats
} from '@busacca/ng-pick-datetime';
//import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';
import { MomentDateTimeAdapter } from '@busacca/ng-pick-datetime';
import * as _moment from 'moment';
import { Moment } from 'moment';
//import { MatRadioChange, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { MatRadioChange } from '@angular/material/radio';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { ActivatedRoute,Router } from '@angular/router';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'MMMM YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-calendar-format',
  templateUrl: './calendar-format.component.html',
  styleUrls: ['./calendar-format.component.scss'],
  providers: [
        // `MomentDateTimeAdapter` and `OWL_MOMENT_DATE_TIME_FORMATS` can be automatically provided by importing
        // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
        // here, due to limitations of our example generation script.
        {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},

        {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS},
    ]
})


export class CalendarFormatComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  @Output() formatData          = new EventEmitter();
  public calendarformatform     : FormGroup;
  public today                  : Date = new Date();
  public currentMonth           : any;
  public currentYear            : any;
  public cell                   : any;
  public cellText               : any;
  public blank_cell             : any = [];
  public monthAndYear           : any;
  public days                   : any = []
  public startcountcells        : any = []
  public startdays              : any = [];
  public customTextCells        : any = []; 
  public customImageCells       : any = [];
  public textvalue              : "";
  public holidaysarray          : any = [];
  public currentblankcount
  flag;flag_end;week_number;
  public year                   : any;
  public custom_index           : any;
  public custom_value           : any;
  public month_number           : any;
  public currentstartweek       : any
  public currentendweek         : any
  public blackcellstartcount    : any = [];
  public  selectedDate          : any ;
  public blackcellendcount      : any = [];
  public selected               : any = [];
  public displayholidaydata     : any = [];
  public deleteholiday          : any = [];
  public Checkeditems           : any = [];
  public savetemepletdata       : any = [];
  public gettempletdata         : any = [];
  public holidayfinalarray      : any = [];
  public minDate                : any;
  public maxDate                : any;
  public unique                 : any;
  public cutmotextdata               = ''
  public displaythefield        :any;
  public custom_holidays        : FormArray;
  public file                   : File | null = null;
  filetype                      : Boolean =  true;
  url                           : string = '';
  logourl                       : string = '';
  public urlID                  : any;
  public inputAccpets           : string = ".jpeg, .jpg, .png";
  public dateTime = new FormControl(moment());
  public getYear                : any;
  public showCustomText : Boolean = false
  counter;
  uploadInfo: any={
    'avatar':{'type':'defaultprofile','media_id':0,'url':"",'apimediaUrl':'media/upload'},
  };

  mediaInfo: any=[];
  public  currentblankdaycount :any;


  constructor(private fb:FormBuilder,
              private render          : Renderer2,
              private _matSnackBar 	  : MatSnackBar,
              public _matDialog       : MatDialog,
              private calendarService : CalendarGeneratorService,
              private _commonService  : CommonService,
              private route           : ActivatedRoute) {
      
      this.route.params.subscribe( params => {
        this.urlID = params.id;
      }); 
     
     }
  
  
  ngOnInit() {
      // here call the save templete list 

      this.calendarService.getsavetempletslist('ECG').then(res=>{
            
        this.savetemepletdata= res.data;
      })
   
     
    this.selected =""
    this.calendarformatform = this.fb.group({
      start_day           : this.fb.control('sunday'),
      time_disp_format    : this.fb.control('12'),
      start_week          : this.fb.control('1'),
      end_week            : this.fb.control('1'),
      selectedtempletname : this.fb.control(''),
      custom_holiday      : this.fb.control(''),
      custom_template     : this.fb.control(''),
      template_name       : this.fb.control(''),
      disp_five_rows      : this.fb.control(''),
      blank_cells         : this.fb.control(''),
      customphoto         : this.fb.control(''),
      image               : this.fb.control(''),
      date                : this.fb.control(moment()),
      customtext          : this.fb.control(''),
      //datetime            : this.fb.control(moment())
    });

    let formatdate=this.calendarformatform.get('date').value;

    this.calendarformatform.patchValue({date:moment(formatdate._d).format('YYYY-MM-DD')});
    let dateValue = formatdate._d;
    this.formatData.emit(this.calendarformatform.value);
    this. year = dateValue.getFullYear();
  
    this. month_number = dateValue.getMonth()+1;
    
    
    //
    this.weekCount(this.year,this.month_number);
 
    // this.calendarService.displayholiday().subscribe(res =>{
    //   this.displayholidaydata = res;
    //      
    // })
   

    if(this.route.routeConfig.path=='admin/calendar-generator/:id'){
      this.calendarService.getCalendarData(this.urlID)
        .then(Response=>{
            this.calendarService.setdynamicdata(Response.data); 
            this.getEditData(Response.data);
        },
        error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
                    verticalPosition: 'top',
                    duration        : 2000
            });
        });
    }
   
   
    this.calendarService.displayholiday(JSON.parse(localStorage.getItem('token')).user_id).subscribe(res =>
    {
        this.displayholidaydata = res.data; })
    }

//  selected templete name data 
  onSelectTemplateName(event)
  {
   let temdata ={
    'template_id':event.value 
   }
   this.calendarService.getCalendarList(temdata).then(res=>{   
          this.calendarformatform.patchValue(res.data[0]);
          
          this.formatData.emit(res.data[0]);
    
   })
  }

  
  getEditData(getData){
    
    this.calendarformatform.patchValue(getData[0]);
    this.calendarformatform.patchValue({selectedtempletname:getData[0].template_id});
    
  }

  chosenYearHandler( normalizedYear: Moment ) {
      const ctrlValue = this.dateTime.value;
      ctrlValue.year(normalizedYear.year());
      this.dateTime.setValue(ctrlValue);
      this.getYear = normalizedYear.year();
  }

  chosenMonthHandler( normalizedMonth: Moment, datepicker: OwlDateTimeComponent<Moment> ) {
      const ctrlValue = this.dateTime.value;
      ctrlValue.month(normalizedMonth.month());
     
      this.dateTime.setValue(ctrlValue);
      datepicker.close();
      //this.calendarformatform.patchValue({date:ctrlValue._d});
      this.calendarformatform.patchValue({disp_five_rows:false}); 
      this.calendarformatform.patchValue({date:moment(ctrlValue._d).format('YYYY-MM-DD')})
      this.formatData.emit(this.calendarformatform.value);
      this.getMonthYear(this.getYear,normalizedMonth.month()+1);
      let dates; 
      for(let i =0;i<this.displayholidaydata.length;i++)
      {      
            dates = new Date(this.displayholidaydata[i].date);
            if(dates.getMonth()+1 != normalizedMonth.month()+1 ) 
            {
              let deletedata ={
                'month' : dates.getMonth()+1,
                'user_id':JSON.parse(localStorage.getItem('token')).user_id
              }
              this.calendarService.deleteholiday(deletedata).subscribe(res=>
                {
                  this.formatData.emit(this.calendarformatform.value);
                 })
            }
       }
   }

  getMonthYear(year,month_number){
    
    this. year =year;
    this.month_number = month_number;
    this.weekCount(year,month_number);
   
  }

  dispfiverow()
  {
    this.formatData.emit(this.calendarformatform.value);
  }

  getTimeDisplayFormat($event: MatRadioChange){
    this.formatData.emit(this.calendarformatform.value);
  } 

  getStartDay($event: MatRadioChange){
    
    
    this.formatData.emit(this.calendarformatform.value);
    if($event.value == 'monday')
    {
      this.week_number--;
    }else{
      this.week_number++;
    }
    
  }

  customTemplate(e) {
    if (e.checked) {
      this.calendarformatform.get('template_name').setValidators([Validators.required]);
    }else {
      this.calendarformatform.get('template_name').clearValidators();
    }
    this.calendarformatform.get('template_name').updateValueAndValidity();
  }

  // this for the save templete name 
  onKeyEvent(evnet)
  {
    this.formatData.emit(this.calendarformatform.value);
  }

  displayFiveWeeks(event){
    if (event.checked) {
      this.calendarformatform.patchValue({disp_five_rows:'Y'});
    }else{
      this.calendarformatform.patchValue({disp_five_rows:'N'}); 
    }
    this.formatData.emit(this.calendarformatform.value);
  }  

  getTemplateName(event: any) { // without type info
    this.formatData.emit(this.calendarformatform.value);
  }


  weekCount(year,month_number){  
    let startDay = this.calendarformatform.get('start_day').value;
    let firstOfMonth = new Date(year, month_number-1, 1);
    let lastOfMonth = new Date(year, month_number, 0);
    let used = firstOfMonth.getDay() + lastOfMonth.getDate();
    this.week_number = Math.ceil( used / 7);
    if(startDay=='monday'){
      this.week_number--;
    }else{
      this.week_number = this.week_number
    }
    
    
  }

  isStartWeekChange(event)
  {
    
    let end_week_val = this.calendarformatform.get('end_week').value;
    let start_week_val  = event.value;
    this.flag_end=false;
    if(start_week_val>end_week_val){
      this.flag=true;
    }else{
      this.flag=false;
      
    }
    this.formatData.emit(this.calendarformatform.value);
    
  }

  isEndWeekChange(event)
  {
    
    let start_week_val = this.calendarformatform.get('start_week').value;
    let end_week_val  = event.value;
    this.flag=false;
    if(end_week_val<start_week_val){
      this.flag_end=true;
      
    }else{
      this.flag_end=false;
    }
    this.formatData.emit(this.calendarformatform.value);
  }
  
}
  
 
   	/** SHOW SNACK BAR */
	/*(showSnackBar(message:string,buttonText:string){
		this._matSnackBar.open(message, buttonText, {
			verticalPosition: 'top',
			duration        : 2000
		});
	}*/
    