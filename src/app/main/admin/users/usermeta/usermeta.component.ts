import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, forwardRef, ElementRef} from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonUtils } from 'app/_helpers';
import { ValidateUrl } from 'app/_resolvers/url.validator';
import { EventbehavioursubService, UsersService } from 'app/_services';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MomentDateTimeAdapter } from '@busacca/ng-pick-datetime';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from '@busacca/ng-pick-datetime'
export const MY_USERMETA_CUSTOM_FORMATS = {
  fullPickerInput: 'MM/DD/YY',
  parseInput: 'MM/DD/YY',
  datePickerInput: 'MM/DD/YY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
  };


@Component({
  selector: 'app-usermeta',
  templateUrl: './usermeta.component.html',
  styleUrls: ['./usermeta.component.scss'],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_USERMETA_CUSTOM_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsermetaComponent),
      multi: true
    },
     {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UsermetaComponent),
      multi: true
    }
  ]
})
export class UsermetaComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() restrictFormInfo:boolean = false;
  // Private
  public showErrors         : boolean = false;
  private _unsubscribeAll   : Subject<any>;
  public editEntry          : boolean = false;
  public usermetaForm       : FormGroup;
  public dynamicArray       : any[] = [];
  public extFieldDefault    : any = {
      "defaultValue": "",
      "col_class": "col-sm-12",
      "pickerType": "calendar",
      "min_date": "today",
      "max_date": "",
      "dateformat": "longDate",
      "readonly": "N",
      "class": "",
      "id": "",
      "field_meta_id": "",
      "event": "N",
      "event_name": "",
      "event_fn": "",
      "inpdf": "Y",
      "isMail": "Y",
      "error_msg": ""
  };
  public extOptions : any[] = [];
  
  public MetaUploadInfo: any[]=[];
  @Input() usercontrol: FormControl;
  public uploadedResponse:any={};
  public tinyMceSettings: any={};
  constructor(
    private route : ActivatedRoute,
    private el: ElementRef,
    private _usersService:UsersService,
    private eventbehavioursub : EventbehavioursubService) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.usermetaForm    = new FormGroup({});
  }

  ngOnInit() {    
    //this.createMetaControls();
    this.tinyMceSettings = CommonUtils.getTinymceSetting();
    
    //Get MetafieldsArray From API
    this._usersService.getMetaFields({field_form_type:'U'}).subscribe(meta=>{
      if(meta.status==200 && meta.data.length>0){
        this.MetaUploadInfo = meta.data || [];
        this.createMetaControls();
      }
    })
    
    //Show Errors on Submit of form for required
    this.eventbehavioursub.userMetaValidate
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(validate=>{
      this.validateUserMetaForm(validate);
    });
  }
  //Create Form Controls
  createMetaControls(){
    let fieldvalues = this.usercontrol.value!=null && Array.isArray(this.usercontrol.value) ? [...this.usercontrol.value] : [];

    this.MetaUploadInfo.forEach(metaField=>{
      let isRequired = metaField.field_required =='Y' ? Validators.required : null;
      let isPattern  = null;
      if(metaField.field_name.match( /web|site|url|website|domain/g )){
        isPattern = ValidateUrl;
      }
      else{
        isPattern = metaField.field_pregmatch !='' ? Validators.pattern(metaField.field_pregmatch) : null;
      }      
      //set error msg
      let extraContent              = metaField.field_content!="" ? JSON.parse(metaField.field_content) : {};
      metaField.extra_field_content = extraContent.extra_field_content ? extraContent.extra_field_content : this.extFieldDefault;
      metaField.options             = extraContent.options ? extraContent.options : this.extOptions;
      metaField.show_as             = extraContent.dbsettings && extraContent.dbsettings.show_as ? extraContent.dbsettings.show_as : '';
      
      if(fieldvalues){        
        let dynamicValue            = fieldvalues.find(item=>{return parseInt(item.field_id)==metaField.id});
        metaField.fieldValue        = dynamicValue!=undefined ? dynamicValue : undefined
      }
      
      let FieldArray                = [];
      if(metaField.field_type=='checkbox' || (metaField.show_as=='checkbox' && metaField.field_type=='dynamic')){
        
        if(metaField.dynamicfields.length>0 && metaField.field_type=='dynamic'){          
          FieldArray  = this.createDynamicInput(metaField); //dynamic field
        }
        else if(metaField.options.length>0 && metaField.field_type=='checkbox'){
          FieldArray  = this.createStaticInput(metaField); // static field
        }
        this.usermetaForm.addControl(metaField.id,new FormArray(FieldArray,Validators.compose([ isRequired ])));  
      }
      else if(metaField.field_type=='select'   || (metaField.show_as=='select' && metaField.field_type=='dynamic')){
        //Multiselect
        let setfieldValue = '';
        if(metaField.fieldValue!==undefined && metaField.extra_field_content && metaField.extra_field_content.multiselect=='Y'){
          setfieldValue = metaField.fieldValue.field_value ? metaField.fieldValue.field_value.split(',') : [];
        }
        else if(metaField.fieldValue!==undefined && (metaField.extra_field_content.multiselect=='N' || !metaField.extra_field_content.multiselect)){
          setfieldValue = isNaN(metaField.fieldValue.field_value) ? metaField.fieldValue.field_value : parseInt(metaField.fieldValue.field_value);
        }
        this.usermetaForm.addControl(metaField.id,new FormControl(setfieldValue,Validators.compose([ isRequired, isPattern])));
      }
      else{
        let setfieldValue = '';
        if(metaField.fieldValue!==undefined){
          metaField.fieldValue.field_value = metaField.fieldValue.field_value && isNaN(metaField.fieldValue.field_value) ? metaField.fieldValue.field_value : +metaField.fieldValue.field_value;  
          setfieldValue = metaField.fieldValue.field_value;
        }
        this.usermetaForm.addControl(metaField.id,new FormControl(setfieldValue,Validators.compose([ isRequired, isPattern])));
      }
    });
  }
  //create dynamic checkboxes
  createDynamicInput(metaField:any){
    const controls = metaField.dynamicfields.map(item=>{
      let fieldChecked = false;
      //Mark as as Check for saved checkbox values 
      if(metaField.fieldValue!='' && metaField.fieldValue!=undefined && metaField.fieldValue.field_id==metaField.id && metaField.fieldValue.field_value!=''){
        let savedfieldValueArray = Array.from(metaField.fieldValue.field_value.split(","),Number) || [];
        fieldChecked = savedfieldValueArray.includes(item.id) ? true : false;
      }
      return new FormControl(fieldChecked);
    });
    return controls;
  }
  //create static checkboxes
  createStaticInput(metaField:any){
    const controls = metaField.options.map(item=>{
      let fieldChecked = false;
      //Mark as as Check for saved checkbox values 
      if(metaField.fieldValue!='' && metaField.fieldValue!=undefined && metaField.fieldValue.field_id==metaField.id && metaField.fieldValue.field_value!=''){
        let savedfieldValueArray = metaField.fieldValue.field_value.split(",") || [];
        fieldChecked = savedfieldValueArray.includes(item.value) ? true : false;
      }
      return new FormControl(fieldChecked);
    });
    return controls;
  }
  //Update CheckBoxArray Field
  updateCheckboxValues(id, isChecked, key) {
    let fieldId     = key.toString();
    const chkArray  = this.usermetaForm.get(fieldId) as FormArray;
    let find        = chkArray.controls.find(item=>{return item.value==true});
    if(find==undefined && this.usermetaForm.controls[fieldId].validator!=null){
      this.usermetaForm.controls[fieldId].markAllAsTouched();
    }
  }
  validateEmail(fieldId:any) {
    fieldId = fieldId.toString();
    let validEmail = CommonUtils.validCustomEmail(this.usermetaForm.get(fieldId).value);
    if(validEmail==false){
      this.usermetaForm.get(fieldId).setErrors({'incorrect': true});
      this.usermetaForm.get(fieldId).markAsTouched();
    }
    else{
      this.usermetaForm.get(fieldId).setErrors(null);
    }
  }  
  //Validate MetaForm Fields
  public validateUserMetaForm(isValidate:boolean=false){
    if (isValidate==true && this.usermetaForm.invalid) {
      this.showErrors = isValidate;
      Object.keys(this.usermetaForm.controls).forEach(field => {
        const control = this.usermetaForm.get(field);
        if(Array.isArray(control.value)){
          if(control.value.filter(item=>{return item==true}).length==0){
            control.setErrors({required:true});    
          }
        }
        control.markAsTouched({ onlySelf: true });
      });
      CommonUtils.scrollToFirstInvalidControl(this.el);
    }
  }
  public getMinDate(beforeDays:string='today'){
    var minDate = new Date();
    if(beforeDays!='today'){
      minDate.setDate(minDate.getDate()- parseInt(beforeDays));
    }
    return minDate;
  }
  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.usermetaForm.patchValue(val, { emitEvent: false });
  }
  registerOnChange(formvalues: any): void {
    this.usermetaForm.valueChanges
    .pipe(
      takeUntil(this._unsubscribeAll),
      map(formvalues=>{
        let metaValues = [];

        Object.keys(formvalues).map(function (key) { 
            let fieldValue = Array.isArray(formvalues[key]) ? formvalues[key].join(",") : formvalues[key];
            metaValues.push({field_id:key, field_value:fieldValue}); 
        });
        this.MetaUploadInfo.forEach(meta=>{
          if(meta.field_type=='dynamic' && meta.show_as=='checkbox'){
            let checkfield =  metaValues.find(item=>{return parseInt(item.field_id)==meta.id});
            if(checkfield && checkfield.field_value){
              checkfield.field_value    = checkfield.field_value.split(',');
              
              const selectedPreferences = checkfield.field_value
              .map((checked, index) => {
                return checked=='true' ? meta.dynamicfields[index].id : null;
              })
              .filter(value => value !== null);
              checkfield.field_value = Array.isArray(selectedPreferences) ? selectedPreferences.join(',') : "";
            }            
          }
          else if(meta.field_type=='checkbox'){
            let checkfield =  metaValues.find(item=>{return parseInt(item.field_id)==meta.id});
            if(checkfield && checkfield.field_value){
              checkfield.field_value    = checkfield.field_value.split(',');
              
              const selectedPreferences = checkfield.field_value
              .map((checked, index) => {
                return checked=='true' ? meta.options[index].value : null;
              })
              .filter(value => value !== null);
              checkfield.field_value = Array.isArray(selectedPreferences) ? selectedPreferences.join(',') : "";
            } 
          }
         
        });
        return metaValues;
      })
      )
    .subscribe(formvalues);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.usermetaForm.disable() : this.usermetaForm.enable();
  }
  validate(c: AbstractControl): ValidationErrors | null{
    return this.usermetaForm.valid ? null : { invalidForm: {valid: false, message: "Signage fields are invalid"}};
  }

}
