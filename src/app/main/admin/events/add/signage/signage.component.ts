import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, forwardRef} from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { OptionsList, CommonService } from 'app/_services';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { EventbehavioursubService } from 'app/_services/eventbehavioursub.service';
import moment from 'moment-timezone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'signage-form',
  templateUrl: './signage.component.html',
  styleUrls: ['./signage.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignageComponent),
      multi: true
    },
     {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SignageComponent),
      multi: true
    }
  ]
})
export class SignageComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() eventInfo  : any;
  // Private
  private _unsubscribeAll: Subject<any>;
  public editEntry        : boolean = false;
  public currentEventId   : any = '';
  public eventSettings    : any = '';
  public scheduleDays     : any[] = [];
  public playlists        : any[] = [];
  public filterplaylists        : any[] = [];
  public min_end_datetime : any = new Date();
  
  public signageForm      : FormGroup = new FormGroup({    
    layout_id         : new FormControl('template_one', [Validators.required]),
    layout_type       : new FormControl('horizontal', [Validators.required]),
    template_id       : new FormControl('tmpl-event'),
    schedule_type     : new FormControl('M', [Validators.required]),
    start_datetime    : new FormControl(''),
    end_datetime      : new FormControl(''),
    schedule_days     : new FormControl(''),
    playlist_id       : new FormControl([], [Validators.required]),
  });
  constructor(
    private route : ActivatedRoute,
    private _commonService    : CommonService,
    private eventbehavioursub : EventbehavioursubService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Schedule Days 
    this.scheduleDays = OptionsList.Options.schedule_days;
    //Get playlist
    this.getPlaylists();
    //Edit View True
    if(this.route.routeConfig.path == 'admin/events/edit/:id' && this.route.params['value'].id>0){
      this.currentEventId = this.route.params['value'].id;
      this.editEntry = true;
    }
    //Event Settings Fromn LocalStorage
    let eventSettings  = this._commonService.getLocalSettingsJson('event-settings');
    this.eventSettings = eventSettings ? eventSettings[0] : {};
    //Fill Form Values If On Edit Event And Signage == 'Y'
    
    if(this.editEntry ==true && this.eventInfo && this.eventInfo.schedule!=undefined){
      this.fillFormValues(this.eventInfo.schedule);
      this.changePlaylistType(this.eventInfo.schedule.layout_type);
    }
    else{
      this.changePlaylistType('horizontal');
    } 
  }
  //File Form values on edit event
  fillFormValues(formValue:any=null){
    if(formValue!==null){  
      this.signageForm.patchValue(formValue);
    }
  }
  //SET MIN END DATETIME
  setMinendDateTime(){
    this.min_end_datetime = this.signageForm.get('start_datetime').value;
    this.enableEditPopup();
  }
  //Reset Signage Form
  resetSignageFields(value:string=''){
    if(value=='N'){
      this.signageForm.reset();
    }    
  }
  //Change ScheduleType
  changeScheduleType(scheduleType:string=''){
    if(scheduleType=='A'){
      this.signageForm.get('start_datetime').reset();
      this.signageForm.get('start_datetime').setValidators(null);
      this.signageForm.get('start_datetime').updateValueAndValidity();
      this.signageForm.get('end_datetime').reset();      
      this.signageForm.get('end_datetime').setValidators(null);
      this.signageForm.get('end_datetime').updateValueAndValidity();
    }
    else{
      this.signageForm.get('schedule_days').reset();
      this.signageForm.get('schedule_days').setValidators(null);
      this.signageForm.get('schedule_days').updateValueAndValidity();
    }
  }
  changePlaylistType(layoutType='horizontal'){
    this.filterplaylists = this.playlists.filter(item=>{ return item.layout==layoutType});
  }
  //GET PLAYLISTS ARRAY
  getPlaylists(){
    this._commonService.getPlaylists({status:'A'}).subscribe(response=>{
      if(response.status==200 && response.playlists){
        this.playlists = response.playlists.data || [];
        this.filterplaylists = this.playlists;
        this.changePlaylistType('horizontal');
      }
    });
  }
  /** ENABLE POPUP OF EDIT IF ANY CHANGE IN FORM  */
  enableEditPopup(){
    this.eventbehavioursub.EnableRecurringModal.next(true);
  }
  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.signageForm.setValue(val, { emitEvent: false });
  }
  registerOnChange(formvalues: any): void {
    this.signageForm.valueChanges
    .pipe(
      takeUntil(this._unsubscribeAll),
      map(formvalues=>{
        if(formvalues.start_datetime){
          formvalues.start_datetime = moment(formvalues.start_datetime).valueOf();  
        }
        if(formvalues.end_datetime){
          formvalues.end_datetime = moment(formvalues.end_datetime).valueOf();  
        }
        return formvalues;
      })
      )
    .subscribe(formvalues);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.signageForm.disable() : this.signageForm.enable();
  }
  validate(c: AbstractControl): ValidationErrors | null{
    
    return this.signageForm.valid ? null : { invalidForm: {valid: false, message: "Signage fields are invalid"}};
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void{
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this.eventbehavioursub.EnableRecurringModal.next(false);
  }

}
