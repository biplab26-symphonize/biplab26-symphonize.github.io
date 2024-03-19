import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, forwardRef, ElementRef} from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonUtils } from 'app/_helpers';
import { ValidateUrl } from 'app/_resolvers/url.validator';
import { EventbehavioursubService, UsersService } from 'app/_services';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-staffmeta',
  templateUrl: './staffmeta.component.html',
  styleUrls: ['./staffmeta.component.scss'],
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StaffmetaComponent),
    multi: true
  },
   {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => StaffmetaComponent),
    multi: true
  }
  ]
})
export class StaffmetaComponent implements OnInit ,ControlValueAccessor, Validator {
  private _unsubscribeAll   : Subject<any>;
  public editEntry          : boolean = false;
  public satffmetaForm       : FormGroup;
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
  @Input() usercontrolValue: any;
  public uploadedResponse:any={};
  constructor(private route : ActivatedRoute,
    private el: ElementRef,
    private _usersService:UsersService,
    private eventbehavioursub : EventbehavioursubService) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.satffmetaForm    = new FormGroup({});
    }
 

  ngOnInit() {

    this._usersService.getMetaFields({field_form_type:'S'}).subscribe(meta=>{
      if(meta.status==200 && meta.data.length>0){
        this.MetaUploadInfo = meta.data || [];
        this.createMetaControls();
      }
    })
    
  }
  ngOnChanges(){
    if(this.usercontrolValue && this.usercontrol){
      this.setMetaFieldValue();
    }
  }
  createMetaControls(){
    let fieldvalues = this.usercontrolValue!=null && Array.isArray(this.usercontrolValue) ? [...this.usercontrolValue] : [];

    this.MetaUploadInfo.forEach(metaField=>{
      let isRequired = metaField.field_required =='Y' ? Validators.required : null;    
      //set error msg
      let extraContent              = metaField.field_content!="" ? JSON.parse(metaField.field_content) : {};
      metaField.extra_field_content = extraContent.extra_field_content ? extraContent.extra_field_content : this.extFieldDefault;
      metaField.options             = extraContent.options ? extraContent.options : this.extOptions;
      metaField.show_as             = extraContent.dbsettings && extraContent.dbsettings.show_as ? extraContent.dbsettings.show_as : '';
      
      if(fieldvalues){        
        let dynamicValue            = fieldvalues.find(item=>{return parseInt(item.field_id)==metaField.id});
        metaField.fieldValue        = dynamicValue!=undefined ? dynamicValue : undefined
      }
      let setfieldValue = '';      
      this.satffmetaForm.addControl(metaField.id,new FormControl(setfieldValue));
    });
  }
  setMetaFieldValue(){
    
    this.MetaUploadInfo.forEach(metaField=>{
      
      let setfieldValue = '';

      if(this.usercontrolValue && Array.isArray(this.usercontrolValue)){        
        let dynamicValue            = this.usercontrolValue.find(item=>{return parseInt(item.field_id)==metaField.id});
        metaField.fieldValue        = dynamicValue!=undefined ? dynamicValue : undefined
      }      
      
      if(metaField.fieldValue!==undefined && metaField.fieldValue.field_value!==''){
        metaField.fieldValue.field_value = metaField.fieldValue.field_value && isNaN(metaField.fieldValue.field_value)==true ? metaField.fieldValue.field_value : metaField.fieldValue.field_value;  
        setfieldValue = metaField.fieldValue.field_value;
      }
      this.satffmetaForm.controls[metaField.id].setValue(setfieldValue);
    });

    /* 
    
    */
  }

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.satffmetaForm.patchValue(val, { emitEvent: false });
  }
       
  registerOnChange(formvalues: any): void {
    this.satffmetaForm.valueChanges
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
    isDisabled ? this.satffmetaForm.disable() : this.satffmetaForm.enable();
  }
  validate(c: AbstractControl): ValidationErrors | null{
    return this.satffmetaForm.valid ? null : { invalidForm: {valid: false, message: "Signage fields are invalid"}};
  }
}
