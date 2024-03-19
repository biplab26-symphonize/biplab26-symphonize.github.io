import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OptionsList, CommonService, EventRruleService } from 'app/_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventbehavioursubService } from 'app/_services/eventbehavioursub.service';
import moment from 'moment-timezone';
import { ActivatedRoute } from '@angular/router';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'recurring-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {

  @Input() recurringInfo  : any;
  public SendFormValues   : any = {recurringdates:[]};
  public recurrences      : any[] = [];
  public currentEventId   : any = '';  
  @Output() manualRecurrences = new EventEmitter<object>();
  @Output() validateForm      = new EventEmitter<any>(); //send tru or false for form fields
  public editEntry        : boolean = false;
  public manualform       : FormGroup;
  public regFormInfo      : any = '';
  public dateformula      : string = 'N';
  public coreDateObject   : any = {event_start_date:'',event_end_date:'',registration_start:'',registration_end:''};
  public eventStartDate   : any = ''; 
  public eventEndDate     : any = ''; 
  public regStartDate     : any = ''; 
  public regEndDate       : any = ''; 
  public req_register     : string = 'N';
  public register_type    : string = 'A';
  public is_all_day       : string = 'N';
  public dateRange        : string = '0'; 
  public disableRecurring : boolean = false;
  public eventStartEndDiff    : number = 0;
  public eventRegStartDiff    : number = 0;
  public eventRegEndDiff      : number = 0;
   
  public recurringDates   : FormArray;
  public duplicateDatesMsg: boolean = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private ref: ChangeDetectorRef,
    private route : ActivatedRoute,
    private _formBuilder: FormBuilder,
    private eventbehavioursub : EventbehavioursubService,
    private _eventRruleService: EventRruleService,
    private _commonService    : CommonService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Edit View True
    if(this.route.routeConfig.path == 'admin/events/edit/:id' && this.route.params['value'].id>0){
      this.currentEventId = this.route.params['value'].id;
      this.editEntry = true;
    }
    //Array Of Dates On Edit
    this.recurrences    = this.recurringInfo && this.recurringInfo.recurrences ? this.recurringInfo.recurrences : [];
    

    this.manualform = this._formBuilder.group({
      recurringdates: this.editEntry ==false ? this._formBuilder.array([this.createItem()]) : this._formBuilder.array([])
    });
    
    //Bind Array Of Dates On Edit Event
    if(this.editEntry==true){
      this.bindEditDatesArray();
    }

    this.eventbehavioursub.RegistrationValues
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(regformInfo=>{
      if(regformInfo!==''){
        this.disableRecurring = false;
        this.regFormInfo      = regformInfo;
        //Set Core Date Values
        this.eventStartDate = this.regFormInfo.event_start_date   ? moment(this.regFormInfo.event_start_date) : '';
        this.eventEndDate   = this.regFormInfo.event_end_date     ? moment(this.regFormInfo.event_end_date) : '';
        this.regStartDate   = this.regFormInfo.registration_start ? moment(this.regFormInfo.registration_start) : '';
        this.regEndDate     = this.regFormInfo.registration_end   ? moment(this.regFormInfo.registration_end) : '';
        this.req_register   = this.regFormInfo.req_register;
        this.register_type  = this.regFormInfo.register_type;
        this.is_all_day     = this.regFormInfo.is_all_day;
        this.dateRange      = this.regFormInfo.date_range;
        this.dateformula    = this.register_type == 'D' || this.register_type == 'A' ? 'N' : this.dateformula;
        
        this.calculateDateDiffrence();
        //Update Existing Recurrences After change in Dates
        this.updateManualRecurrence();

        if(this.regFormInfo.event_start_date=='' || (this.regFormInfo.is_all_day=='N' && this.regFormInfo.event_end_date=='')){
          this.disableRecurring = true;
        }
        if(this.req_register=='Y' && this.regFormInfo.register_type=='C' && ( this.regFormInfo.registration_start=='' && this.regFormInfo.registration_end=='') ){
          this.disableRecurring = true;
        }
      }
      else if(this.recurringInfo!==undefined && this.editEntry==true){
        //Set Core Date Values
        this.eventStartDate = this.recurringInfo.event_start_date   ? moment(this.recurringInfo.event_start_date) : '';
        this.eventEndDate   = this.recurringInfo.event_end_date     ? moment(this.recurringInfo.event_end_date) : '';
        this.regStartDate   = this.recurringInfo.registration_start ? moment(this.recurringInfo.registration_start) : '';
        this.regEndDate     = this.recurringInfo.registration_end   ? moment(this.recurringInfo.registration_end) : '';
        this.req_register   = this.recurringInfo.req_register;
        this.register_type  = this.recurringInfo.register_type;
        this.is_all_day     = this.recurringInfo.is_all_day;
        this.dateRange      = this.recurringInfo.date_range;
        this.dateformula    = this.register_type == 'D' || this.register_type == 'A'  ? 'N' : this.dateformula;
        this.calculateDateDiffrence();
        if(this.recurringInfo.event_start_date=='' || (this.recurringInfo.is_all_day=='N' && this.recurringInfo.event_end_date=='')){
          this.disableRecurring = true;
        }
        if(this.req_register=='Y' && this.recurringInfo.register_type=='C' && ( this.recurringInfo.registration_start=='' && this.recurringInfo.registration_end=='') ){
          this.disableRecurring = true;
        }        
      }
    });

    //Formula Change Subject
    this.eventbehavioursub.dateFormula.subscribe(dateforumla => {
      this.dateformula = dateforumla ? dateforumla:'N';
      this.updateRegistrationDates();
    });
  }
  ngOnChanges(){
    if(this.editEntry==true && this.recurringInfo && this.recurringInfo.recurrences){
      this.bindEditDatesArray();
    }
  }
  validateManualForm(){
    //Validate Form and send to parent component
    if(this.manualform){
      this.eventbehavioursub.manualRecValidate.next(this.manualform.invalid);
    }
  }
  //Bind Edit Items Array on Fields
  bindEditDatesArray(){
    setTimeout(() => {
      if(this.recurrences.length>0){
        this.recurringDates = this.manualform.get('recurringdates') as FormArray;
        this.recurrences.forEach(item=>{
          this.recurringDates.push(this.createItem(item));
          this.ref.detectChanges();
        });
        this.recurringDates.updateValueAndValidity();
        this.prepareRecurringArray();
      }
    },0);  
  }
  //Add Recurring dates Fields
  addManualFields(): void {
    setTimeout(() => {
      this.recurringDates = this.manualform.get('recurringdates') as FormArray;
      this.recurringDates.push(this.createItem());
      this.ref.detectChanges();
      this.validateManualForm();
    },0);    
  }
  //Remove Dynamic Fields
  removeManualFields(item,index):void{
    setTimeout(() => {  
      this.recurringDates = this.manualform.get('recurringdates') as FormArray;
      if(this.recurringDates.length>1){
        this.recurringDates.removeAt(index);
      }
      this.prepareRecurringArray();
      this.validateManualForm();
    },0);
  }

  //Manual form fields
  createItem(editValues=null): FormGroup {
    if(editValues!=null){
      let event_start_date    = editValues.event_start_date   ? CommonUtils.getStringToDate(editValues.event_start_date) : ''; 
      let event_end_date      = editValues.event_end_date     ? CommonUtils.getStringToDate(editValues.event_end_date) : ''; 
      let registration_start  = editValues.registration_start ? CommonUtils.getStringToDate(editValues.registration_start) : ''; 
      let registration_end    = editValues.registration_end   ? CommonUtils.getStringToDate(editValues.registration_end) : ''; 
      let max_event_date      = editValues.event_start_date   ? CommonUtils.getStringToDate(editValues.event_start_date) : ''; 
      //Disable EndDate Picker if is_all_day=='Y'
      let is_disabled         = this.is_all_day=='Y' ? true : false;
      return this._formBuilder.group({
        event_start_date     : [event_start_date],
        event_end_date       : [{value: event_end_date, disabled: is_disabled}, ],
        registration_start   : [registration_start],
        registration_end     : [registration_end],
        max_event_date       : [max_event_date], 
      });
    }
    else{
      return this._formBuilder.group({
        event_start_date     : [],
        event_end_date       : [],
        registration_start   : [''],
        registration_end     : [''],
        max_event_date       : [''], 
      });
    }
  }
  //CHANGE EVENT END DATE MIN DATE
  generateManualRecurrence(index){
    setTimeout(() => {
      this.recurringDates   = this.manualform.get('recurringdates') as FormArray;
      let ManualArrayGroup  = this.recurringDates.controls[index] as FormGroup;
      let MaxEventEndDate   = ManualArrayGroup.get('event_start_date').value;
      ManualArrayGroup.get('max_event_date').setValue(MaxEventEndDate);
      if(this.is_all_day=='Y'){
        ManualArrayGroup.get('event_end_date').setValue(MaxEventEndDate);
      }      

      //If Both Date Are Filled Then Generate Recurrences with reg dates 
      let manualStartDate = ManualArrayGroup.get('event_start_date').value;
      let manualEndDate = ManualArrayGroup.get('event_end_date').value;
      
      let duplicateStart      = this.SendFormValues.recurringdates.filter(item=>{return moment(item.event_start_date).isSame(manualStartDate) && moment(item.event_end_date).isSame(manualEndDate)}) || [];
      let coreduplicateStart  = moment(manualStartDate).isSame(this.eventStartDate) && moment(manualEndDate).isSame(this.eventEndDate) ? true : false ;
      
      if(duplicateStart.length>0 || (coreduplicateStart==true && this.editEntry==false)){
        this.duplicateDatesMsg = true;
        ManualArrayGroup.get('event_start_date').setValue('');
        ManualArrayGroup.get('event_end_date').setValue('');
      }
      else{
        this.duplicateDatesMsg = false;
      }
      
      if(manualStartDate && manualEndDate && this.duplicateDatesMsg==false){
        ManualArrayGroup.get('registration_start').setValue(moment(manualStartDate).subtract(this.eventRegStartDiff, "days").format("YYYY-MM-DD"));
        ManualArrayGroup.get('registration_end').setValue(moment(manualStartDate).subtract(this.eventRegEndDiff, "days").format("YYYY-MM-DD"));
        this.prepareRecurringArray();
      }
      this.validateManualForm();      
    });
  }
  /** GENERATE RECURRENCE ON EDIT FUNCTION TO AVOID DUPLICATE DATES ERROR */
  generateEditManualRecurrence(index){
    setTimeout(() => {
      this.recurringDates   = this.manualform.get('recurringdates') as FormArray;
      let ManualArrayGroup  = this.recurringDates.controls[index] as FormGroup;
      let MaxEventEndDate   = ManualArrayGroup.get('event_start_date').value;
      ManualArrayGroup.get('max_event_date').setValue(MaxEventEndDate);
      if(this.is_all_day=='Y'){
        ManualArrayGroup.get('event_end_date').setValue(MaxEventEndDate);
      }      

      //If Both Date Are Filled Then Generate Recurrences with reg dates 
      let manualStartDate = ManualArrayGroup.get('event_start_date').value;
      let manualEndDate = ManualArrayGroup.get('event_end_date').value;
      
      if(manualStartDate && manualEndDate && this.duplicateDatesMsg==false){
        ManualArrayGroup.get('registration_start').setValue(moment(manualStartDate).subtract(this.eventRegStartDiff, "days").format("YYYY-MM-DD"));
        ManualArrayGroup.get('registration_end').setValue(moment(manualStartDate).subtract(this.eventRegEndDiff, "days").format("YYYY-MM-DD"));
        this.prepareRecurringArray();
      }
      this.validateManualForm();      
    });
  }
  /**
   * CHANGE RECURRENCES REG DATES ACCORDING TO CHANGES ONEDIT VIEW
  */
  updateManualRecurrence(){
    setTimeout(() => {
      if(this.editEntry==true && this.recurrences.length>0){
        //Map on recurreing dates
        this.recurrences.map((rcItem,index)=>{
          this.generateEditManualRecurrence(index);
        });
      }
      else if(this.SendFormValues.recurringdates.length>0){
        this.prepareRecurringArray();
      }
    });
  }
  /** Update registration dates as per dateFormula */
  updateRegistrationDates(){    
    if(this.SendFormValues && this.SendFormValues.recurringdates){
      this.SendFormValues.recurringdates.map(item=>{
        item.event_start_date     = this._commonService.getDateFormat(item.event_start_date);
        item.event_end_date       = item.event_end_date ? this._commonService.getDateFormat(item.event_end_date) : '';
        if(this.dateformula=='N'){
          item.registration_start = item.event_start_date ? moment(item.event_start_date).subtract(this.eventRegStartDiff, "days").format("YYYY-MM-DD") : '';
          item.registration_end   = item.event_end_date   ? moment(item.event_end_date).subtract(this.eventRegEndDiff, "days").format("YYYY-MM-DD") : '';
        }
        else{
          item.registration_start = this.regStartDate ? this._commonService.getDateFormat(this.regStartDate) : '';
          item.registration_end   = this.regEndDate   ? this._commonService.getDateFormat(this.regEndDate) : '';
        }
        return item;
      });
      this.manualRecurrences.emit({'recurrences':this.SendFormValues.recurringdates});
    }
  }
  /**
   * 
   * CALCULATE DATE DIFFRENCE BETWEEN CORE DATES
   */
  calculateDateDiffrence(){
    if(this.register_type== 'D' && parseInt(this.dateRange) > 0){
      this.eventRegStartDiff = parseInt(this.dateRange);
      //this.eventRegEndDiff   = parseInt(this.dateRange);
      this.eventRegEndDiff   = 0;
      //call prepraeArray to update values with latest core values
      this.prepareRecurringArray();
    }
    if(this.register_type == 'C') {
      if(this.dateformula=='N'){
        let registration_start  = this.regStartDate;
        let registration_end    = this.regEndDate;
        if(registration_start && registration_end){
          let dtstartS  = (this.eventStartDate) ? this._commonService.getDateFormat(this.eventStartDate) : '';
          let dtstart   = (dtstartS) ? this._eventRruleService.getDateUTC(dtstartS) : '';

          let regdtstartS   = (registration_start) ? this._commonService.getDateFormat(registration_start) : '';
          let regdtstart    = (regdtstartS) ? this._eventRruleService.getDateUTC(regdtstartS) : '';
          
          this.eventRegStartDiff = this._eventRruleService.calculateDateDiff(dtstart, regdtstart);
          
          let regdtendS = (registration_end) ? this._commonService.getDateFormat(registration_end) : '';
          let regdtend  = (regdtendS) ? this._eventRruleService.getDateUTC(regdtendS) : '';
          
          let dtendS  = (this.eventStartDate) ? this._commonService.getDateFormat(this.eventStartDate) : '';
          let dtend   = (dtendS) ? this._eventRruleService.getDateUTC(dtendS) : '';

          this.eventRegEndDiff = this._eventRruleService.calculateDateDiff(dtend, regdtend);
          //call prepraeArray to update values with latest core values
          this.prepareRecurringArray();
        }
      }
      else{
        //call prepraeArray to update values with latest core values
        this.prepareRecurringArray();
      }      
    }
  }
  /** PREPARE ARRAY OF DATES TO SEND TO MAIN COMPONENT */
  prepareRecurringArray (){
    let coreDatesArray =  this.prepareCoreArray();

    this.SendFormValues = {...this.manualform.value};
    this.SendFormValues.recurringdates.unshift(coreDatesArray);

    if(this.SendFormValues && this.SendFormValues.recurringdates){
      this.SendFormValues.recurringdates.map(item=>{
        item.event_start_date     = this._commonService.getDateFormat(item.event_start_date);
        item.event_end_date       = item.event_end_date ? this._commonService.getDateFormat(item.event_end_date) : '';
        if(this.dateformula=='N'){
          item.registration_start = item.registration_start ? this._commonService.getDateFormat(item.registration_start) : '';
          item.registration_end   = item.registration_end   ? this._commonService.getDateFormat(item.registration_end) : '';
        }
        else{
          item.registration_start = this.regStartDate ? this._commonService.getDateFormat(this.regStartDate) : '';
          item.registration_end   = this.regEndDate   ? this._commonService.getDateFormat(this.regEndDate) : '';
        }
        if(this.req_register=='N' || this.register_type=='A'){
          delete(item.registration_start);
          delete(item.registration_end);
        }
        delete(item.max_event_date);
        return item;
      });
    }
    this.manualRecurrences.emit({'recurrences':this.SendFormValues.recurringdates});
  }

  /** INSERT CORE DATE FIELDS INTO MANUAL ARRAY */
  prepareCoreArray(){
    if(this.register_type == 'C') {
      this.coreDateObject.event_start_date    = this.eventStartDate;
      this.coreDateObject.event_end_date      = this.eventEndDate;
      this.coreDateObject.registration_start  = this.regStartDate;
      this.coreDateObject.registration_end    = this.regEndDate;
    }
    else if(this.register_type == 'D' && parseInt(this.dateRange)>0){
      this.coreDateObject.event_start_date    = this.eventStartDate;
      this.coreDateObject.event_end_date      = this.eventEndDate;
      this.coreDateObject.registration_start  = moment(this.eventStartDate).subtract(this.eventRegStartDiff, "days").format("YYYY-MM-DD");
      this.coreDateObject.registration_end    = moment(this.eventStartDate).subtract(this.eventRegEndDiff, "days").format("YYYY-MM-DD");;
    }
    else{
      this.coreDateObject.event_start_date    = this.eventStartDate;
      this.coreDateObject.event_end_date      = this.eventEndDate;
      this.coreDateObject.registration_start  = '';
      this.coreDateObject.registration_end    = '';
    }
    return this.coreDateObject;
  }
  
  /**
   * On destroy
   */
  ngOnDestroy(): void{
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.manualRecurrences.emit(null);
    this.eventbehavioursub.manualRecValidate.next(false);
  }

}
