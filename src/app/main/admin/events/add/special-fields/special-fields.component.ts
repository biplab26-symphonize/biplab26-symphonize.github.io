import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, forwardRef} from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { OptionsList, CommonService } from 'app/_services';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { EventbehavioursubService } from 'app/_services/eventbehavioursub.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'special-fields',
  templateUrl: './special-fields.component.html',
  styleUrls: ['./special-fields.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpecialFieldsComponent),
      multi: true
    },
     {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SpecialFieldsComponent),
      multi: true
    }
  ]
})
export class SpecialFieldsComponent implements OnInit {

  @Input() eventInfo  : any;
  // Private
  private _unsubscribeAll: Subject<any>;
  public editEntry        : boolean = false;
  sendSpecialInfo: any[]  = [];
  public currentEventId   : any = '';
  public eventSettings    : any = '';
  public specialValuesArray     : any[] = [];
  specialForm             : FormGroup;
  @Output() updateSpecialInfo = new EventEmitter<any>();
  specialItems: FormArray;
  optionItems: FormArray;

  constructor(
    private route : ActivatedRoute,
    private _commonService    : CommonService,
    private _formBuilder: FormBuilder,
    private eventbehavioursub : EventbehavioursubService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    
    this.specialForm = this._formBuilder.group({
      specialFields: this._formBuilder.array([])
    }); 

    //Edit View True
    if(this.route.routeConfig.path == 'admin/events/edit/:id' && this.route.params['value'].id>0){
      this.currentEventId = this.route.params['value'].id;
      this.editEntry = true;
    }
    //Event Settings Fromn LocalStorage
    let eventSettings  = this._commonService.getLocalSettingsJson('event-settings');
    this.eventSettings = eventSettings ? eventSettings[0] : {};
  }
  ngOnChanges(){
    if(this.eventInfo!==undefined){
      if(this.eventInfo.specialfields && this.eventInfo.specialfields.length>0){
        this.eventInfo.specialfields.map(item=>{
          if(item.options_text!=='' && item.options_text!==null){
            item.options_text = JSON.parse(item.options_text);
          }
          return item;
        });
        this.specialValuesArray = this.eventInfo.specialfields || [];
      }
      this.patchSpecialValues();
    }
  }
  //get Edit Array
  get specialFields(): FormArray {
    return this.specialForm.get('specialFields') as FormArray;
  }
  addSpecialFields(){
    this.specialItems = this.specialForm.get('specialFields') as FormArray;
    this.specialItems.push(this.createItem());
  }
  //create form control
  createItem(): FormGroup{
    return this._formBuilder.group({
      question_text   : [''],
      field_type      : ['T'],
      options_text    : this._formBuilder.array([])
    });
  }
  //create radio button control
  createOptionItem(): FormGroup{
    return this._formBuilder.group({
      option : ['']
    });
  }
  //create options
  createOptions(fieldIndex:number=0){
    let optionArray = this.specialForm.get('specialFields') as FormArray;
    this.optionItems = optionArray.controls[fieldIndex].get('options_text') as FormArray;
    console.log("this.optionItems",this.optionItems);
    this.optionItems.push(this.createOptionItem());
  }
  showRadioOptions(optionType:string='T',fieldIndex:number=0){
    console.log("optionType",optionType);
    if(optionType=='T'){
      let optionArray = this.specialForm.get('specialFields') as FormArray;  
      this.optionItems = optionArray.controls[fieldIndex].get('options_text') as FormArray;
      this.optionItems.clear();
    }
    setTimeout(() => {
      this.prepareSpecialArray();
    }, 0);
  }
  removeQuestion(fieldIndex:number=0){
    this.specialItems = this.specialForm.get('specialFields') as FormArray;
    this.specialItems.removeAt(fieldIndex);
    setTimeout(() => {
      this.prepareSpecialArray();
    }, 0);
  }
  removeOptions(fieldIndex:number=0,optionIndex:number=0){
    let optionArray = this.specialForm.get('specialFields') as FormArray;
    this.optionItems = optionArray.controls[fieldIndex].get('options_text') as FormArray;
    this.optionItems.removeAt(optionIndex);
    setTimeout(() => {
      this.prepareSpecialArray();
    }, 0);
  }
  patchSpecialValues(){
    if(this.specialValuesArray){
      this.specialValuesArray.map((item, index) => {
        const tempObj = {};
        tempObj['question_text']  = new FormControl(item.question_text);
        tempObj['field_type']     = new FormControl(item.field_type);
        if(item && item.options_text!==null && item.options_text!==undefined && item.options_text.length>0){
          tempObj['options_text']   = this._formBuilder.array(this.patchSpecialOptions(item));        
        }
        else{
          tempObj['options_text']   = this._formBuilder.array([]);        
        }       
        this.specialItems = this.specialForm.get('specialFields') as FormArray;
        this.specialItems.push(this._formBuilder.group(tempObj));
      });
      setTimeout(() => {
        this.prepareSpecialArray();
      }, 0);
    } 
  }
  patchSpecialOptions(item:any){
    let optionsArray=[];
    if(item && item.options_text!==null && item.options_text!==undefined && item.options_text.length>0){
      item.options_text.forEach((element,index) => {
        optionsArray.push(this._formBuilder.group({ option : [element[index]] }));
      });
      return optionsArray;
    }
  }
  prepareSpecialArray(){
    //Pass Values of Form to Parent Compo
    this.sendSpecialInfo = [...this.specialForm.get('specialFields').value.filter(item=>{ return item.question_text!==''})];
    //Change id to user_id for guestinfo array
    if(this.sendSpecialInfo){
      let specialInfoArray = [...this.sendSpecialInfo];
      const newArrayOfObj = specialInfoArray.map(item=>{
        item.optionArray = [];
        if(item.options_text && item.options_text.length>0 && item.field_type=='R'){
          let optionArray = [];
          
          item.options_text.map((optionitem,index) => {
            let objArr      = {};
            objArr[index] = optionitem.option;
            optionArray.push(objArr);
            return optionArray;
          });
          item.optionArray = [...optionArray];       
        }
        return item;
      });
      let finalSpecialArray = [];
      newArrayOfObj.forEach((item,index)=>{
        const tempObj = {};
        tempObj['question_text'] = item.question_text;
        tempObj['field_type'] = item.field_type;
        tempObj['options_text'] = [...item.optionArray];
        finalSpecialArray.push(tempObj);
      }); 
      setTimeout(() => {
        this.updateSpecialInfo.emit(finalSpecialArray);
      });
    }
    
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
