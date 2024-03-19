import { Component, OnInit, Input, EventEmitter, Output, ElementRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OptionsList, CommonService, EventRruleService, SettingsService } from 'app/_services';
import { EventbehavioursubService } from 'app/_services/eventbehavioursub.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import moment from 'moment-timezone';
import { CommonUtils } from 'app/_helpers';
import { DateAdapter } from '@angular/material/core';
import { EventsDateAdapter } from '../EventsDateAdapter';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss'],
  providers:[
    { provide: DateAdapter, useClass: EventsDateAdapter },
  ]
})
export class RecurringComponent implements OnInit {
  
  @Input() recurringData: any;
  @Output() metaUploaded      = new EventEmitter<object>();
  public recurringform        : FormGroup;
  public everySuffix          : string = 'Day';
  public showRule             : boolean = false;
  displayedColumns            = ['srno', 'event_start_date', 'event_end_date', 'registration_start', 'registration_end'];
  public Occurrences          : any[] = [];
  public today                : any = new Date(new Date().setHours(0,0,0,0));
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public recurring_everyList  : any = [];
  public week_days            : any = [];
  public getEventSettings     : any = [];
  public register_type        : any;
  public recDates             : any = [];
  public manualrecDates       : any = [];
  public recText              : string = '';
  public recRule              : string;
  public eventStartEndDiff    : number = 0;
  public eventRegStartDiff    : number = 0;
  public eventRegEndDiff      : number = 0;
  public isRecEndDates        : boolean = false;
  public isRegStartDates      : boolean = false;
  public isRegEndDates        : boolean = false;
  public eventstartdate       : any;
  public eventenddate         : any;
  public editeventstartdate   : any;
  public editeventenddate     : any;
  public reqRegister_type     : any;
  public dateRange            : any;
  public regStartDate         : any;
  public regEndDate           : any;
  public selectedDayOfWeek    : string='';
  public prevRececRule        : any = '';
  public PrevRecArray         : any = [];
  public isPrevRecEndDates    : boolean = false;
  public isPrevRegStartDates  : boolean = false;
  public isPrevRegEndDates    : boolean = false;
  public isEditRecurring      : boolean = false;

  //Default SelectedValues
  public onTheDay: string = '';
  public onTheNum: any[] = [];
  public onTheMonth: any[] = [];

  public isRecurringRepeats: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb                : FormBuilder,
    private el                : ElementRef,
    private eventbehavioursub : EventbehavioursubService,
    private _commonService    : CommonService,
    private _eventRruleService: EventRruleService,
    private _settingService   : SettingsService){
      // Set the private defaults
      this._unsubscribeAll = new Subject();
     }

  ngOnInit() {
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.recurring_everyList = OptionsList.Options.recurring_everyList;
    this.week_days           = OptionsList.Options.week_days;
    this.Occurrences         = [...Array(OptionsList.Options.occurence_limit).keys()] 
    //Event Settings Fromn LocalStorage
    let eventSettings        = this._commonService.getLocalSettingsJson('event-settings');
    this.getEventSettings    = eventSettings ? eventSettings[0] : {};

    this.recurringform = this.fb.group({
      is_recurring          : this.fb.control('N',[Validators.required]),
      registration_date_formula: this.fb.control('N'),
      recurring_type        : this.fb.control(''),
      recurring_repeat_on   : this.fb.control(''),
      recurring_every       : this.fb.control(1),
      recurring_repeat_end  : this.fb.control(''),
      recurring_occurrence  : this.fb.control(''),
      recurrance_end_date   : this.fb.control(''),
      on_the_num            : this.fb.control([]),
      on_the_day            : this.fb.control({value: '', disabled: true}),
      monthly_on            : this.fb.control(''),
      on_monthly_day        : this.fb.control([]),
      week_day              : this.fb.control(''),
    }); 
    
    this.getEditData();

    //CALL RECURRENC RULE FUNCTION ONLY ON REGISTER DATE TIME FIELD CHANGES *MAS
    this.eventbehavioursub.RunTimeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(result => {
      if(result==true){
        this.onMonthlyOnChange(this.recurringform.get('monthly_on').value);
        this.isValidForRec();
      }
    });

    //GET ALL VALUES OF REGISTER FORM DATES RELATED
    this.eventbehavioursub.RegistrationValues
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(regInfo => {
      this.reqRegister_type     = regInfo.req_register;
      this.register_type        = regInfo.register_type;
      this.eventstartdate       = regInfo.event_start_date ? regInfo.event_start_date : this.recurringData && this.recurringData.event_start_date ? this.recurringData.event_start_date : '';
      this.eventenddate         = regInfo.event_end_date;
      this.dateRange            = regInfo.date_range;
      this.regStartDate         = regInfo && regInfo.registration_start ? regInfo.registration_start : '';
      this.regEndDate           = regInfo && regInfo.registration_end ? regInfo.registration_end : '';
      if(this.eventstartdate && this.eventenddate){
        this.isValidForRec();
        this.setDayOfWeek();
      }      

    });

    //GET REGISTER TYPE
    this.eventbehavioursub.typeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(regtype => {
      this.register_type = (regtype!=='' && regtype!==null) ? regtype : this.recurringData ? this.recurringData.register_type:'A';
    });

    //GET EVENT START DATE
    this.eventbehavioursub.eventstartdateChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(eventstartdate => {
      this.eventstartdate = eventstartdate ? eventstartdate : this.recurringData && this.recurringData.event_start_date ? this.recurringData.event_start_date : '';
      if(eventstartdate){
        this.setDayOfWeek(true);
      }
      else{
        this.setDayOfWeek();
      }
      
    });

    //GET EVENT END DATE
    this.eventbehavioursub.eventenddateChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(eventenddate => {
      this.eventenddate = eventenddate ? eventenddate : this.eventstartdate;
      if(eventenddate){
        this.setDayOfWeek(true);
      }
    });

    //GET REQUIRED REGISTER TYPE
    this.eventbehavioursub.onRequireRegChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(reqRegType => {
      this.reqRegister_type = reqRegType ? reqRegType : this.recurringData && this.recurringData.req_register ? this.recurringData.req_register : 'N';
    });

    //GET REGISTER DATE RANGE
    this.eventbehavioursub.dateRangeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(dateRange => {
      this.dateRange = dateRange ? dateRange : this.recurringData && this.recurringData.date_range ? this.recurringData.date_range : '7';
    });

    this.eventbehavioursub.regStartEnd
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(regstartend => {
      this.regStartDate = regstartend.regStart ? regstartend.regStart : this.recurringData && this.recurringData.registration_start ? this.recurringData.registration_start : '';
      this.regEndDate   = regstartend.regEnd ? regstartend.regEnd : this.recurringData && this.recurringData.registration_end ? this.recurringData.registration_end : '';
    });
  }

  ngOnChanges(){
    if(this.recurringData){
      this.getEditData();
    }
  }

  getEditData()
  {
    if(this.recurringData){
      this.isEditRecurring = true;
      let recurringdata         = this.recurringData.recurring_meta ? JSON.parse(this.recurringData.recurring_meta) :'';
      //recurringdata.is_recurring = this.recurringData.is_recurring;
      this.editeventstartdate   = new Date(this.recurringData.event_start_date);
      this.editeventenddate     = new Date(this.recurringData.event_end_date);
      
      //change suffix of every field as per selection
      this.everySuffix = recurringdata.recurring_repeat_on=='M' ? 'Month' : recurringdata.recurring_repeat_on=='W' ? 'Week' : 'Day';

      if(this.recurringData.recurring_type=='A'){
        this.recurringform.patchValue(recurringdata);        
        if(recurringdata.is_recurring == 'Y') {
          this.setPrevRecRule(this.recurringData);
        }
      }
      else if(this.recurringData.recurring_type=='M'){
        this.recurringform.patchValue(this.recurringData);
      }
      //SetDateFormula Yes/No
      this.recurringform.get('registration_date_formula').setValue(recurringdata.registration_date_formula);
    }
  }
  //ON EDIT RECURRENCES
  setPrevRecRule(meta){
    this.prevRececRule = meta.recurring_rule ? meta.recurring_rule : '';
    if(meta.event_end_date){
      this.isPrevRecEndDates = true;
    }
    if(meta.registration_start && meta.registration_end && this.recurringData.register_type!=='A'){
      this.isPrevRegStartDates = true;
      this.isPrevRegEndDates = true;
    }
    this.PrevRecArray = meta.recurrences;
  }

  onIsRecurringChange(type) {
    this.eventbehavioursub.isRecurringChange.next(type);
    this.recurringform.get('recurring_type').setValue('A');
    this.recurringform.get('recurring_type').clearValidators();

    this.recurringform.get('recurring_repeat_on').setValue('D');
    this.recurringform.get('recurring_repeat_on').clearValidators();

    this.recurringform.get('recurring_every').setValue('1');
    this.recurringform.get('recurring_every').clearValidators();

    this.recurringform.get('recurring_repeat_end').setValue('');
    this.recurringform.get('recurring_repeat_end').clearValidators();

    this.recurringform.get('recurring_occurrence').setValue('');
    this.recurringform.get('recurring_occurrence').clearValidators();

    this.recurringform.get('recurrance_end_date').setValue('');
    this.recurringform.get('recurrance_end_date').clearValidators();

    //this.recurringform.get('on_the_num').setValue('');
    //this.recurringform.get('on_the_num').clearValidators();

    //this.recurringform.get('on_the_day').setValue('');
    //this.recurringform.get('on_the_day').clearValidators();
    //SET WEEK DAY ON on_the_day Input
    this.setDayOfWeek();

    this.recurringform.get('monthly_on').setValue('');
    this.recurringform.get('monthly_on').clearValidators();

    //this.recurringform.get('on_monthly_day').setValue('');
    this.recurringform.get('on_monthly_day').clearValidators();

    this.recurringform.get('week_day').setValue('');
    this.recurringform.get('week_day').clearValidators();

    if(type == 'N'){
      this.recDates = [];
      this.PrevRecArray = [];
    }

    if (type == 'Y') {
      this.recurringform.get('recurring_type').setValue('A');
      this.recurringform.get('recurring_type').setValidators([Validators.required]);

    }
    this.recurringform.get('recurring_type').updateValueAndValidity();
    this.recurringform.get('recurring_repeat_on').updateValueAndValidity();
    this.recurringform.get('recurring_every').updateValueAndValidity();
    this.recurringform.get('recurring_repeat_end').updateValueAndValidity();
    this.recurringform.get('recurring_occurrence').updateValueAndValidity();
    this.recurringform.get('recurrance_end_date').updateValueAndValidity();
    this.recurringform.get('on_the_num').updateValueAndValidity();
    this.recurringform.get('on_the_day').updateValueAndValidity();
    this.recurringform.get('monthly_on').updateValueAndValidity();
    this.recurringform.get('on_monthly_day').updateValueAndValidity();
    this.recurringform.get('week_day').updateValueAndValidity();
    this.isValidForRec();
  }

  onRecurringTypeChange(type) {
    this.recurringform.get('recurring_repeat_end').setValue('');
    this.recurringform.get('recurring_occurrence').setValue('');
    this.recurringform.get('recurrance_end_date').setValue('');
    if (type == 'A') {
      this.recurringform.get('recurring_repeat_on').setValidators([Validators.required]);
      this.recurringform.get('recurring_repeat_on').setValue('D');

      this.recurringform.get('recurring_every').setValidators([Validators.required]);
      this.recurringform.get('recurring_every').setValue('1');

      this.recurringform.get('recurring_repeat_end').setValidators([Validators.required]);
      this.recurringform.get('recurring_occurrence').setValidators([Validators.required]);
      this.recurringform.get('recurrance_end_date').setValidators([Validators.required]);
      //Set Manual Array to Empty
      this.manualrecDates = [];
      this.isValidForRec();
    }
    else {
      this.recurringform.get('recurring_repeat_on').clearValidators();
      this.recurringform.get('recurring_repeat_on').setValue('');

      this.recurringform.get('recurring_every').clearValidators();
      this.recurringform.get('recurring_every').setValue('');

      this.recurringform.get('recurring_repeat_end').clearValidators();
      this.recurringform.get('recurring_occurrence').clearValidators();
      this.recurringform.get('recurrance_end_date').clearValidators();
    }

    this.recurringform.get('recurring_repeat_on').updateValueAndValidity();
    this.recurringform.get('recurring_every').updateValueAndValidity();
    this.recurringform.get('recurring_repeat_end').updateValueAndValidity();
    this.recurringform.get('recurring_occurrence').updateValueAndValidity();
    this.recurringform.get('recurrance_end_date').updateValueAndValidity();
    //Call Date Formula Yes/No on selection recurring type and send to manual recurring section
    this.onIsFormulaChange(this.recurringform.get('registration_date_formula').value);
    this.isValidForRec();
  }

  onRecurringRepeatChange(type) {
    this.recurringform.get('monthly_on').setValue('');
    this.recurringform.get('week_day').setValue('');
    //this.recurringform.get('on_the_num').setValue('');
    //this.recurringform.get('on_the_day').setValue('');
    this.recurringform.get('on_the_num').clearValidators();
    this.recurringform.get('on_the_day').clearValidators();
    if (type == 'M') {
      this.recurringform.get('monthly_on').setValidators([Validators.required]);
      this.recurringform.get('week_day').clearValidators();
      this.everySuffix  = 'Month';
    }
    else if (type == 'W') {
      this.recurringform.get('week_day').setValidators([Validators.required]);
      this.recurringform.get('monthly_on').clearValidators();
      this.everySuffix  = 'Week';
    }
    else {
      this.recurringform.get('week_day').clearValidators();
      this.recurringform.get('monthly_on').clearValidators();
      this.everySuffix  = 'Day';
    }
    this.recurringform.get('week_day').updateValueAndValidity();
    this.recurringform.get('monthly_on').updateValueAndValidity();
    this.recurringform.get('on_the_num').updateValueAndValidity();
    this.recurringform.get('on_the_day').updateValueAndValidity();
    this.isValidForRec();
  }

  onRecurringEndChange(type) {
    this.recurringform.get('recurrance_end_date').setValue('');
    if (type == 'interval') {
      this.recurringform.get('recurring_occurrence').setValidators([Validators.required]);
      this.recurringform.get('recurring_occurrence').setValue('1');
      this.recurringform.get('recurrance_end_date').clearValidators();
    }
    else {
      this.recurringform.get('recurrance_end_date').setValidators([Validators.required]);
      this.recurringform.get('recurring_occurrence').clearValidators();
      this.recurringform.get('recurring_occurrence').setValue('');
    }
    this.recurringform.get('recurring_occurrence').updateValueAndValidity();
    this.recurringform.get('recurrance_end_date').updateValueAndValidity();
    this.isValidForRec();
  }

  onMonthlyOnChange(type) {
    this.recurringform.get('monthly_on').setValue(type);
    
    //this.recurringform.get('on_monthly_day').setValue('');
    //this.recurringform.get('on_the_num').setValue('');
    //this.recurringform.get('on_the_day').setValue('');
    if(type!==''){
      if (type == 'on_day') {
        this.recurringform.get('on_monthly_day').setValue(this.onTheMonth);
        this.recurringform.get('on_monthly_day').setValidators([Validators.required]);
        this.recurringform.controls['on_the_day'].reset({ value: '', disabled: false });
        this.recurringform.get('on_the_num').setValue('');
        this.recurringform.get('on_the_num').clearValidators();
        this.recurringform.get('on_the_day').clearValidators();
      }
      else {
        this.recurringform.controls['on_the_day'].reset({ value: this.onTheDay, disabled: true });
        this.recurringform.get('on_the_num').setValue(this.onTheNum);
        this.recurringform.get('on_the_num').setValidators([Validators.required]);
        this.recurringform.get('on_the_day').setValidators([Validators.required]);
        
        this.recurringform.get('on_monthly_day').setValue('');
        this.recurringform.get('on_monthly_day').clearValidators();
      }
    }
    
    this.recurringform.get('on_monthly_day').updateValueAndValidity();
    this.recurringform.get('on_the_num').updateValueAndValidity();
    this.recurringform.get('on_the_day').updateValueAndValidity();
    //Reset Day Of Week Option
    this.setDayOfWeek(false);
    
    this.isValidForRec();
  }
  onIsFormulaChange(type){
    this.recurringform.get('registration_date_formula').setValue(type);
    this.eventbehavioursub.dateFormula.next(type);
    this.isValidForRec();    
  }
  validateNumber(event: any) {
    const pattern = /[0-9\+\-]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  isValidForRec() {
    this.recDates         = [];
    this.isRecEndDates    = false;
    this.isRegStartDates  = false;
    this.isRegEndDates    = false;
    let event_start_date  = this.eventstartdate ? this.eventstartdate : this.editeventstartdate;
    let event_end_date    = this.eventenddate ? this.eventenddate : this.editeventenddate;
    
    if(!event_end_date) {
      event_end_date = event_start_date;
    }
    let is_recurring = this.recurringform.get('is_recurring').value;
    let recurring_type = this.recurringform.get('recurring_type').value;
    let recurring_every = this.recurringform.get('recurring_every').value;
    if(event_start_date && event_end_date && is_recurring == 'Y' && recurring_type == 'A' && recurring_every > 0) 
    {
      let recurring_repeat_end = this.recurringform.get('recurring_repeat_end').value;
      let recurring_occurrence = this.recurringform.get('recurring_occurrence').value;
     
      let recurrance_end_date   = this.recurringform.get('recurrance_end_date').value;
      if((recurring_repeat_end == 'interval' && recurring_occurrence > 0) || (recurring_repeat_end == 'on_date' && recurrance_end_date)) 
      {
        let recurring_repeat_on = this.recurringform.get('recurring_repeat_on').value;
        let recurring_week_day  = this.recurringform.get('week_day').value;
        let recurring_week_dayvalue = recurring_week_day ? recurring_week_day.toString() : '';

        let on_monthly_day      = this.recurringform.get('on_monthly_day').value;
        let on_the_num          = this.recurringform.get('on_the_num').value;
        let on_the_day          = this.recurringform.get('on_the_day').value;
        let monthly_on          = this.recurringform.get('monthly_on').value || "";
        recurring_occurrence = recurring_occurrence * (recurring_week_day.length ? recurring_week_day.length : 1);
        let dtstartS  = (event_start_date) ? this._commonService.getDateFormat(event_start_date) : '';
        let dtstart   = (dtstartS) ? this._eventRruleService.getDateUTC(dtstartS) : '';

        let untilS  = (recurrance_end_date) ? this._commonService.getDateFormat(recurrance_end_date) : '';
        let until   = (untilS) ? this._eventRruleService.getDateUTC(untilS) : '';
        let recRule: any = {
          'dtstart'   : dtstart,
          'freq'      : recurring_repeat_on,
          'interval'  : recurring_every,
          'recurring_repeat_end': recurring_repeat_end,
          'count'       : recurring_occurrence,
          'until'       : until,
          'byweekday'   : recurring_week_dayvalue,
          'bymonthday'  : on_monthly_day,
          'bysetpos'    : on_the_num,
          'byday'       : on_the_day,
          'monthly_on'  : monthly_on
        };
        let recStartInfo = this._eventRruleService.generateRecurrances(recRule);
        if(recStartInfo) 
        {
          this.recText = recStartInfo.text;
          this.recRule = is_recurring=='Y'? recStartInfo.rule :'';

          if(event_end_date) 
          {
            this.isRecEndDates = true;
            let dtendS  = (event_end_date) ? this._commonService.getDateFormat(event_end_date) : '';
            let dtend   = (dtendS) ? this._eventRruleService.getDateUTC(dtendS) : '';
            this.eventStartEndDiff = this._eventRruleService.calculateDateDiff(dtstart, dtend);
          }
          if(this.reqRegister_type == 'Y')
          {
            let date_range = this.dateRange;
            if(this.register_type == 'D' && date_range > 0) 
            {
              this.isRegStartDates  = true;
              this.isRegEndDates    = true;
              this.eventRegStartDiff= date_range;
              this.eventRegEndDiff  = date_range;
            }
            else if(this.register_type == 'C') {
              let registration_start  = this.regStartDate;
              let registration_end    = this.regEndDate;
              if(registration_start && registration_end) 
              {
                this.isRegStartDates  = true;
                this.isRegEndDates    = true;

                let regdtstartS   = (registration_start) ? this._commonService.getDateFormat(registration_start) : '';
                let regdtstart    = (regdtstartS) ? this._eventRruleService.getDateUTC(regdtstartS) : '';
                
                this.eventRegStartDiff = this._eventRruleService.calculateDateDiff(dtstart, regdtstart);
                
                let regdtendS = (registration_end) ? this._commonService.getDateFormat(registration_end) : '';
                let regdtend  = (regdtendS) ? this._eventRruleService.getDateUTC(regdtendS) : '';
                
                let dtendS  = (event_start_date) ? this._commonService.getDateFormat(event_start_date) : '';
                let dtend   = (dtendS) ? this._eventRruleService.getDateUTC(dtendS) : '';

                this.eventRegEndDiff = this._eventRruleService.calculateDateDiff(dtend, regdtend);
              }
            }
          }
          let ref = this;
          this.recDates = recStartInfo.dates.map(ele => this.formatEvents(ele, ref));
        }
      }
      //Enable Edit Popup on Submit button 
      this.enableEditPopup();
    }
  }

  formatEvents(ele, ref) {
    let event_start_date  : any = ele;
    let event_end_date    : any;
    let registration_start: any;
    let registration_end  : any;
    if(ref.isRecEndDates) {
      event_end_date = new Date(ele);
      event_end_date.setDate( event_end_date.getDate() + parseInt(ref.eventStartEndDiff) );
    }
    if(this.reqRegister_type == 'Y'){
      let date_range = this.dateRange;
      if(this.register_type== 'D' && date_range > 0) 
      {
        if(ref.isRegStartDates) {
          const regStart      = new Date(event_start_date);
          registration_start  = regStart.setDate( regStart.getDate() - parseInt(ref.eventRegStartDiff) );
        }
        if(ref.isRegEndDates && event_end_date) {
          const regEnd      = new Date(event_start_date);
          registration_end  = regEnd.setDate( regEnd.getDate());
        }
      }
      if(this.register_type == 'C') 
      {
        if(ref.recurringform.get('registration_date_formula').value == 'N')
        {
          if(ref.isRegStartDates) {
            const regStart      = new Date(event_start_date);
            registration_start  = regStart.setDate( regStart.getDate() - parseInt(ref.eventRegStartDiff) );
          }
          if(ref.isRegEndDates) {
            const regEnd      = new Date(event_start_date);
            registration_end  = regEnd.setDate( regEnd.getDate() - parseInt(ref.eventRegEndDiff) );
          }
        }
        else if(ref.recurringform.get('registration_date_formula').value == 'Y'){ 

          if(ref.isRegStartDates) {
            const regStart      = new Date(ref.regStartDate);
            registration_start  = regStart.setDate(regStart.getDate());
          }
          if(ref.isRegEndDates) {
            const regEnd      = new Date(ref.regEndDate);
            registration_end  = regEnd.setDate( regEnd.getDate());
          }
        }
      }
    }
    return {
      event_start_date  : event_start_date,
      event_end_date    : event_end_date,
      registration_start: registration_start,
      registration_end  : registration_end
    };
  }

  formatSaveRec(ele, ref) {
    let event_start_date  = (ele.event_start_date) ? ref._commonService.getDateFormat(ele.event_start_date) : '';
    let event_end_date    = (ele.event_end_date) ? ref._commonService.getDateFormat(ele.event_end_date) : '';
    let registration_start      : any = '';
    let registration_start_time : any = this.getEventSettings.allday_start_time ? this._commonService.getTimeFormat(this.getEventSettings.allday_start_time) : '';
    let registration_end        : any = '';
    let registration_end_time   : any = this.getEventSettings.allday_end_time ? this._commonService.getTimeFormat(this.getEventSettings.allday_end_time) : '';
    if(ele.registration_start){
      registration_start = (ele.registration_start) ? ref._commonService.getDateFormat(ele.registration_start) : '';
      if (ref.regStartDate){
        registration_start_time = this._commonService.getTimeFormat(ref.regStartDate);
      }
      registration_start = registration_start + ' ' + registration_start_time;
    }

    if(ele.registration_end){
      registration_end = (ele.registration_end) ? ref._commonService.getDateFormat(ele.registration_end) : '';
      if (ref.regEndDate){
        registration_end_time = this._commonService.getTimeFormat(this.regEndDate);
      }
      registration_end = registration_end + ' ' + registration_end_time;
    }
    return {
      event_start_date: event_start_date,
      event_end_date: event_end_date,
      registration_start: registration_start,
      registration_end: registration_end
    };
  }

  validateUserMetaForm(isSubmit:boolean){
    if (isSubmit === true) {
      if(this.recurringform.valid){
        let ref       = this;
        let recEvents = [];
        let value     = this.recurringform.getRawValue();
        value['recurring_type'] = value.recurring_type;
        
        if(value['recurring_type']=='A'){
          this.manualrecDates = [];
          recEvents = this.recDates.map(ele => this.formatSaveRec(ele, ref));
        }
        else{
          recEvents = this.manualrecDates.map(ele => this.formatSaveRec(ele, ref));
        }
        recEvents     = (recEvents.length > 0) ? recEvents : this.PrevRecArray;
        
        let recRule = this.recRule ? this.recRule : this.prevRececRule ? this.prevRececRule:'';
        this.metaUploaded.emit({'recurring_meta':value,'recurrences':recEvents,'recRule':recRule});
        return true;
      } 
      else{
        this.recurringform.markAllAsTouched();
        let validResult =  this.scrollToFirstInvalidControl();
        return validResult;
      }
    }
  }
  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector("form .ng-invalid");
    if(firstInvalidControl){
      firstInvalidControl.scrollIntoView(); //without smooth behavior
      return false;
    }
    return true;
  }
  //SET MANUAL RECURRING DATES ARRAY INTO recDates Variable
  setManualRecurrences($event){
    if($event && $event.recurrences){
      this.manualrecDates = $event.recurrences || [];
      this.enableEditPopup();
    }
  }
  /** ENABLE POPUP OF EDIT IF ANY CHANGE IN FORM  */
  enableEditPopup(){
    this.eventbehavioursub.EnableRecurringModal.next(true);
  }
  /** SET NO OF DAY AND DAY OF WEEK TO START DATE ON MONTHLY RECURRENCE MAS* */
  setDayOfWeek(startChange=false){
    if(this.eventstartdate){
      //Set on_the_day
      let Dayname = moment(this.eventstartdate).format('dddd');
      let dayKey = Object.keys(this.week_days).find(k=>this.week_days[k]===Dayname);
      this.onTheDay = dayKey;
      //this.recurringform.controls['on_the_day'].reset({ value: dayKey, disabled: true });
      
      //Set on_the_num
      let generalSettings = this._commonService.getLocalSettingsJson('general_settings');
      let startofWeek     = generalSettings && generalSettings['week_starts_on'] ? generalSettings['week_starts_on'] : 0;
      let weekOfMonth     = CommonUtils.getDayofMonth(new Date(this.eventstartdate));
      let ontheNumValue   = weekOfMonth>=5 ? '-1' : weekOfMonth.toString();
      let EditonTheNum    = [];
      if(this.recurringform.get('on_the_num').value && startChange==false){
        EditonTheNum      = [...this.recurringform.get('on_the_num').value];
      }
      this.onTheNum       = [...new Set([...EditonTheNum, ...[ontheNumValue]])];
      
      // this.recurringform.get('on_the_num').setValue(this.onTheNum);
      // this.recurringform.get('on_the_num').updateValueAndValidity();
      
      //Set Day Of Month in number
      let dayNumber       = moment(this.eventstartdate).format('D');
      let EditonTheMonth  = [];
      if(this.recurringform.get('on_monthly_day').value && startChange==false){
        EditonTheMonth    = [...this.recurringform.get('on_monthly_day').value];
      }
      this.onTheMonth     = [...EditonTheMonth, ...[dayNumber]] ;
      
      // this.recurringform.get('on_monthly_day').setValue(this.onTheMonth);
      // this.recurringform.get('on_monthly_day').updateValueAndValidity();
      
    }
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this.eventbehavioursub.EnableRecurringModal.next(false);
      this.eventbehavioursub.isRecurringChange.next('N');
  }
}
