import { Component, OnInit, EventEmitter, Output, Input, ElementRef} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventbehavioursubService } from 'app/_services/eventbehavioursub.service';
import { CommonService } from 'app/_services';
import moment from 'moment-timezone';
import { MomentDateTimeAdapter } from '@busacca/ng-pick-datetime';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from '@busacca/ng-pick-datetime'
import { CommonUtils } from 'app/_helpers';
import { EventsDateAdapter } from '../EventsDateAdapter';
import { DateAdapter } from '@angular/material/core';
export const MY_EVENT_CUSTOM_FORMATS = {
  fullPickerInput: 'MM/DD/YY hh:mm A',
  parseInput: 'MM/DD/YY hh:mm A',
  datePickerInput: 'MM/DD/YY hh:mm A',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
  };

@Component({
  selector: 'event-registration-fields',
  templateUrl: './registerdata.component.html',
  styleUrls: ['./registerdata.component.scss'],
  providers:[
    { provide: DateAdapter, useClass: EventsDateAdapter },
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_EVENT_CUSTOM_FORMATS }
  ]
})
export class RegisterdataComponent implements OnInit {
  @Input() sendRegisterData:any;
  @Output() registerdata = new EventEmitter<object>();
  @Output ()registertype  = new EventEmitter<any>();

  public generalSettings  : any;
  public eventSettings    : any = {};
  public editEntry        : boolean = false;
  //Default Start/End Time
  public DefaultStartTime : any = '';
  public DefaultEndTime   : any = '';

  public isregisterform : FormGroup;
  public regType        : any;
  public currentTime    : string = '';
  public today          : any = new Date(new Date().setHours(0,0,0,0));
  public oldEndTimeValue: any;
  public min_end_time   : any;
  public min_start_time : any;
  public registration_start_min : any;
  public registration_end_max : any;
  public event_end_date_max   : any;
  public event_start_date_min : any = new Date();
  // Private
  private _unsubscribeAll: Subject<any>;  

  constructor(private fb:FormBuilder,
    private el              : ElementRef,
    private eventbehavioursub : EventbehavioursubService,
    private _commonService    : CommonService) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
    }

  ngOnInit() {

    //General Settings
    this.generalSettings  = this._commonService.getLocalSettingsJson('general_settings');
    //this.generalSettings.APP_TIMEZONE
    this.currentTime      =  moment().tz(this.generalSettings.APP_TIMEZONE || "America/New_York").format('HH:mm:ssa dddd, MMMM DD,YYYY');
    
    //Event Settings Fromn LocalStorage
    let eventSettings  = this._commonService.getLocalSettingsJson('event-settings');
    this.eventSettings = eventSettings ? eventSettings[0] : {};
    
    //Set Default Start/End Time From Settings
    this.DefaultStartTime = this.eventSettings && this.eventSettings.allday_start_time ? new Date(this.eventSettings.allday_start_time) : '';
    this.DefaultEndTime   = this.eventSettings && this.eventSettings.allday_end_time ? new Date(this.eventSettings.allday_end_time) : '';
    
    this.isregisterform = this.fb.group({
      req_register        : this.fb.control('N',[Validators.required]),
      attendee_limit      : this.fb.control(this.eventSettings.waitlist_settings.attendee_limit || 0),
      group_register      : this.fb.control('N'),
      group_limit         : this.fb.control(0),
      date_range          : this.fb.control('7'),
      register_type       : this.fb.control('A'),
      registration_start  : this.fb.control(''),
      registration_end    : this.fb.control(''),
      is_waitlist         : this.fb.control('N'),
      waitlist_limit      : this.fb.control(0),

      is_all_day          : this.fb.control('N',[Validators.required]),
      event_start_date    : this.fb.control('',[Validators.required]),
      event_end_date      : this.fb.control('',[Validators.required]),
      event_start_time    : this.fb.control(this.DefaultStartTime,[Validators.required]),
      event_end_time      : this.fb.control(this.DefaultEndTime),
      disable_end_time    : this.fb.control(''),
      custom_event_end    : this.fb.control('N'),
      custom_end_time     : this.fb.control(''),
    }); 
    this.setControls();
  }
  ngOnChanges(){
    if(this.sendRegisterData && this.sendRegisterData.event_id>0){
      this.setControls();
    }
  }
  //Call Function For Updating Data Into Manual Recurrence
  ngAfterViewInit(){
    //Send Form Values To Recurring Component OnChange
    this.isregisterform.valueChanges
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(regInfo=>{
      //this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
    });
  }
  setControls(){
    let today = this._commonService.getDateFormat(new Date());
    if(this.sendRegisterData){
      this.editEntry = true;
      //let startT = (this.sendRegisterData.event_start_time) ? new Date(this.sendRegisterData.event_start_time) : '';
      let startT = (this.sendRegisterData.event_start_time) ? new Date(today+' '+this.sendRegisterData.event_start_time) : '';
      let endT = (this.sendRegisterData.event_end_time) ? new Date(today + ' ' + this.sendRegisterData.event_end_time) : '';
      
      
      this.isregisterform.patchValue(this.sendRegisterData);
      
      this.isregisterform.get('event_start_date').setValue(CommonUtils.getStringToDate(this.sendRegisterData.event_start_date));
      this.isregisterform.get('event_end_date').setValue(CommonUtils.getStringToDate(this.sendRegisterData.event_end_date));

      this.isregisterform.get('disable_end_time').setValue(this.sendRegisterData.disable_end_time=='Y' ? true : false);
      this.isregisterform.get('date_range').setValue(this.sendRegisterData.date_range.toString());
      this.isregisterform.get('event_start_time').setValue(startT);
      this.isregisterform.get('event_end_time').setValue(endT);
      
      this.isregisterform.get('registration_start').setValue( this.sendRegisterData.registration_start ? new Date(this.sendRegisterData.registration_start) :'');
      this.isregisterform.get('registration_end').setValue( this.sendRegisterData.registration_end ? new Date(this.sendRegisterData.registration_end) :'');

      //Set Minimum End Time Value
      this.min_end_time = this.isregisterform.get('event_start_time').value;
      
      //Set Max End Registration Date
      this.setRegistrationMaxEndDate();
      
      //Send Form Values To Recurring
      this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
    }
  }
  //////IS ALL DAY /////

  onIsAllDayChange(type) {
    //this.isregisterform.get('event_end_date').setValue('');
    this.isregisterform.get('event_end_date').setValue(this.isregisterform.get('event_start_date').value);
    
    //this.isregisterform.get('event_start_time').setValue('');
    //this.isregisterform.get('event_end_time').setValue('');
    if (type == 'Y') {
        this.isregisterform.get('event_end_date').clearValidators();
        this.isregisterform.get('event_start_time').clearValidators();
        this.isregisterform.get('event_end_time').clearValidators();
        this.event_start_date_min = '';
    }
    else {
        this.isregisterform.get('event_end_date').setValidators([Validators.required]);
        this.isregisterform.get('event_start_time').setValidators([Validators.required]);
        this.isregisterform.get('event_end_time').setValidators([Validators.required]);
    }
    this.isregisterform.get('event_end_date').updateValueAndValidity();
    this.isregisterform.get('event_start_time').updateValueAndValidity();
    this.isregisterform.get('event_end_time').updateValueAndValidity();

    this.isregisterform.get('is_all_day').setValue(type);
    //Send Form Values To Manual Recurring
    this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
  }

  onCustomEndTimeChange(type) {
    //Set Minimum End Time Value
    this.changeEventEndTime({'dateTime':this.isregisterform.controls['event_start_time'].value,'type':'event_end_time'});
    

    if (type == 'Y') {
      this.oldEndTimeValue = this.isregisterform.get('event_end_time').value;
       this.isregisterform.get('event_end_time').setValue('');
       this.isregisterform.get('event_end_time').clearValidators();
  
       this.isregisterform.get('custom_end_time').setValue('');
       this.isregisterform.get('custom_end_time').setValidators([Validators.required]);
     }  
     else {
       this.isregisterform.get('event_end_time').setValue( this.oldEndTimeValue );
       this.isregisterform.get('event_end_time').setValidators([Validators.required]);
  
       this.isregisterform.get('custom_end_time').setValue('');
       this.isregisterform.get('custom_end_time').clearValidators();
       this.isregisterform.get('custom_event_end').clearValidators();
     }
     
     this.isregisterform.get('custom_end_time').updateValueAndValidity();
     this.isregisterform.get('event_end_time').updateValueAndValidity();
   }

   disableEndTime(e) {
    //Set Minimum End Time Value
    this.changeEventEndTime({'dateTime':this.isregisterform.controls['event_start_time'].value,'type':'event_end_time'});
     
    if (e.checked) {
      this.oldEndTimeValue = this.isregisterform.get('event_end_time').value;
      this.isregisterform.get('event_end_time').setValue('');
      this.isregisterform.get('custom_event_end').setValue('N');
 
      this.isregisterform.get('custom_end_time').clearValidators();
      this.isregisterform.get('event_end_time').clearValidators();
      this.isregisterform.get('custom_event_end').clearValidators();
    }
    else {
      this.isregisterform.get('event_end_time').setValue( this.oldEndTimeValue );
      this.isregisterform.get('event_end_time').setValidators([Validators.required]);
      this.isregisterform.get('custom_event_end').setValue('N')
      this.isregisterform.get('custom_event_end').setValidators([Validators.required]);
    }
 
    this.isregisterform.get('custom_event_end').updateValueAndValidity();
    this.isregisterform.get('custom_end_time').updateValueAndValidity();
    this.isregisterform.get('event_end_time').updateValueAndValidity();
  }

  //EVENT START DATE/ END DATE
  changeEventStartD(){
    if(this.isregisterform.controls['event_start_date'].value){
      this.event_start_date_min = this.isregisterform.controls['event_start_date'].value;
      
      this.setRegistrationMaxEndDate();
      
      this.eventbehavioursub.eventstartdateChange.next(this.isregisterform.controls['event_start_date'].value);
      this.eventbehavioursub.RunTimeChange.next(true);
      //set event_end_date to same day
      this.changeEventEndTime({'dateTime':this.isregisterform.controls['event_start_date'].value,'type':'event_end_date'});

      //Send Form Values To Manual Recurring
      this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
      
    }
  }
  //Set Max End Date Of Registration
  setRegistrationMaxEndDate(){
    let event_start_time          = this.isregisterform.controls['event_start_time'].value;
    let max_event_time            = moment(event_start_time).format('hh:mm a');
    if(this.isregisterform.controls['event_start_date'].value){
      this.event_start_date_min   = this.isregisterform.controls['event_start_date'].value;
      this.today                  = this.editEntry==true && !moment().isBefore(moment(this.event_start_date_min)) ? this.event_start_date_min : this.today;
    }
    let max_event_date        = moment(this.event_start_date_min).format('DD-MMM-YYYY');
    this.registration_end_max = new Date(max_event_date+' '+max_event_time);
  }

  changeEventEndD(){
    if(this.isregisterform.controls['event_end_date'].value){
      this.event_end_date_max = this.isregisterform.controls['event_end_date'].value;
    }
    this.setRegistrationMaxEndDate();
    this.eventbehavioursub.eventenddateChange.next(this.isregisterform.controls['event_end_date'].value);
    this.eventbehavioursub.RunTimeChange.next(true);
    //Send Form Values To Manual Recurring
    
    this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
  }

  changeEventEndTime(dateTimeInfo){
    //this.min_end_time =  dateTimeInfo.type =='event_end_time' ? dateTimeInfo.dateTime : this.isregisterform.controls['event_start_time'].value;
    this.min_end_time =  dateTimeInfo.type =='event_end_time' ? new Date(dateTimeInfo.dateTime) : this.isregisterform.controls['event_start_time'].value;
    this.isregisterform.controls[dateTimeInfo.type].setValue(this._commonService.getNextDateTime(dateTimeInfo));
    this.setRegistrationMaxEndDate();
    this.enableEditPopup();
  }

  changeRegEndD(){
    if(this.isregisterform.controls['registration_end'].value){
      //this.registration_end_max = this.isregisterform.controls['registration_end'].value;
    }
    //Set max date for registration_end is same as event start date *MAS
    if(this.isregisterform.controls['event_start_date'].value){ 
      this.event_start_date_min = this.isregisterform.controls['event_start_date'].value;
    }
    //Set min date for registration_end is same as event registration start date *MAS
    if(this.isregisterform.controls['registration_start'].value){ 
      this.registration_start_min = this.isregisterform.controls['registration_start'].value;
    }
    let regDate:any={
      'regStart':this.isregisterform.controls['registration_start'].value,
      'regEnd':this.isregisterform.controls['registration_end'].value,
    }
    this.eventbehavioursub.regStartEnd.next(regDate);
    this.eventbehavioursub.RunTimeChange.next(true);
    //Send Form Values To Manual Recurring
    this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
  }

  ///IS REGISTER/////

  enableEditPopup(){
    this.eventbehavioursub.EnableRecurringModal.next(true);
  }

  onRequireRegChange(type) {
    this.eventbehavioursub.onRequireRegChange.next(type);
    this.isregisterform.get('req_register').setValue(type);
    if (type == 'Y') {
      this.isregisterform.get('attendee_limit').setValidators([Validators.required]);
      this.isregisterform.get('attendee_limit').setValue(this.eventSettings.waitlist_settings.attendee_limit);

      this.isregisterform.get('group_register').setValidators([Validators.required]);
      this.isregisterform.get('group_register').setValue('Y');

      this.isregisterform.get('group_limit').setValidators([Validators.required]);
      this.isregisterform.get('group_limit').setValue('2');

      this.isregisterform.get('register_type').setValidators([Validators.required]);
      this.isregisterform.get('register_type').setValue('A');

      this.isregisterform.get('is_waitlist').setValidators([Validators.required]);
      this.isregisterform.get('is_waitlist').setValue('N');
    }
    else {
      this.isregisterform.get('attendee_limit').setValue('');
      this.isregisterform.get('attendee_limit').clearValidators();

      this.isregisterform.get('group_register').setValue('');
      this.isregisterform.get('group_register').clearValidators();

      this.isregisterform.get('group_limit').setValue(0);
      this.isregisterform.get('group_limit').clearValidators();

      this.isregisterform.get('register_type').setValue('');
      this.isregisterform.get('register_type').clearValidators();

      this.isregisterform.get('is_waitlist').setValue('');
      this.isregisterform.get('is_waitlist').clearValidators();
    }
    this.isregisterform.get('attendee_limit').updateValueAndValidity();
    this.isregisterform.get('group_register').updateValueAndValidity();
    this.isregisterform.get('group_limit').updateValueAndValidity();
    this.isregisterform.get('register_type').updateValueAndValidity();
    this.isregisterform.get('is_waitlist').updateValueAndValidity();
    //Send Updated Form Values
    this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
    this.enableEditPopup();
  }

  onAllowGroupRegChange(type) {
    if (type == 'Y') {
      this.isregisterform.get('group_limit').setValidators([Validators.required]);
      this.isregisterform.get('group_limit').setValue('2');
    }
    else {
      this.isregisterform.get('group_limit').setValue(0);
      this.isregisterform.get('group_limit').clearValidators();
    }
    this.isregisterform.get('group_limit').updateValueAndValidity();
    this.enableEditPopup();
  }

  onRegTypeChange(type) {    
    if (type == 'C') {
      this.isregisterform.get('registration_start').setValue('');
      this.isregisterform.get('registration_end').setValue('');
      this.isregisterform.get('registration_start').setValidators([Validators.required]);
      this.isregisterform.get('registration_end').setValidators([Validators.required]);

      this.isregisterform.get('date_range').clearValidators();
    }
    else if (type == 'D') {
      this.isregisterform.get('date_range').setValue('7');
      this.isregisterform.get('date_range').setValidators([Validators.required]);
      
      this.isregisterform.get('registration_start').clearValidators();
      this.isregisterform.get('registration_end').clearValidators();
    }
    else {
      this.isregisterform.get('date_range').clearValidators();
      this.isregisterform.get('registration_start').clearValidators();
      this.isregisterform.get('registration_end').clearValidators();
    }
    //this.isregisterform.get('date_range').updateValueAndValidity();
    this.isregisterform.get('registration_start').updateValueAndValidity();
    this.isregisterform.get('registration_end').updateValueAndValidity();
    

    this.regType= type!=='' ? type : 'A';
    this.eventbehavioursub.typeChange.next(this.regType);
    this.eventbehavioursub.RunTimeChange.next(true);
    this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
    this.enableEditPopup();
  }

  onWaitlistTypeChange(type) {
    if (type == 'Y') {
      this.isregisterform.get('waitlist_limit').setValidators([Validators.required]);
      this.isregisterform.get('waitlist_limit').setValue('');
    }
    else {
      this.isregisterform.get('waitlist_limit').setValue(0);
      this.isregisterform.get('waitlist_limit').clearValidators();
    }
    this.isregisterform.get('waitlist_limit').updateValueAndValidity();
    this.enableEditPopup();
  }

  isDateRangeChange(range)
  {
    this.eventbehavioursub.dateRangeChange.next(range);
    this.isregisterform.get('date_range').setValidators([Validators.required]);
    this.isregisterform.get('date_range').setValue(range);
    this.isregisterform.get('date_range').clearValidators();
    this.isregisterform.get('date_range').updateValueAndValidity();
    //Send Form Values
    this.eventbehavioursub.RegistrationValues.next(this.isregisterform.value);
    this.enableEditPopup();
  }

  validateNumber(event: any) {
    event = (event) ? event : window.event;
    let charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      event.preventDefault();
    } else {
      return true;
    }
  }

  public validateRegisterForm(isSubmit:boolean){
    if (isSubmit === true && this.isregisterform.valid) {
        let registerFormvalue = {...this.isregisterform.value};

        registerFormvalue.register_type     = registerFormvalue.register_type!=null ? registerFormvalue.register_type : '';
        registerFormvalue.disable_end_time  = registerFormvalue.disable_end_time ? 'Y' : 'N';
        registerFormvalue.event_start_date  = registerFormvalue.event_start_date ? this._commonService.getDateFormat(registerFormvalue.event_start_date): '';
        registerFormvalue.event_end_date    = registerFormvalue.event_end_date ? this._commonService.getDateFormat(registerFormvalue.event_end_date): '';
        registerFormvalue.event_start_time  = registerFormvalue.event_start_time ? this._commonService.getTimeFormat(registerFormvalue.event_start_time): '';
        registerFormvalue.event_end_time    = registerFormvalue.event_end_time ? this._commonService.getTimeFormat(registerFormvalue.event_end_time): '';

        registerFormvalue.registration_start  = registerFormvalue.registration_start ? this._commonService.getDateTimeFormat(registerFormvalue.registration_start): '';
        registerFormvalue.registration_end    = registerFormvalue.registration_end ? this._commonService.getDateTimeFormat(registerFormvalue.registration_end): '';
        this.registerdata.emit(registerFormvalue);
        return true;
    }
    else{
      this.isregisterform.markAllAsTouched();
      let validResult = this.scrollToFirstInvalidControl();
      return validResult;
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
  
  /**
   * On destroy
   */
  ngOnDestroy(): void{
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.eventbehavioursub.RunTimeChange.next(false);
    this.eventbehavioursub.onRequireRegChange.next('');
    this.eventbehavioursub.typeChange.next('');
    this.eventbehavioursub.eventstartdateChange.next('');
    this.eventbehavioursub.eventenddateChange.next('');
    this.eventbehavioursub.dateRangeChange.next('');
    this.eventbehavioursub.regStartEnd.next('');
    this.eventbehavioursub.RegistrationValues.next('');
  }

}
