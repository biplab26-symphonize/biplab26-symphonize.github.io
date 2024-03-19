import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from 'app/_helpers';
import { EventbehavioursubService, ProfileService, UsersService, OptionsList } from 'app/_services';

@Component({
  selector: 'list-form-field',
  templateUrl: './list-form-field.component.html',
  styleUrls: ['./list-form-field.component.scss']
})
export class ListFormFieldComponent implements OnInit {

  @Input() userId: number = 0;
  @Input() Fields: any[] = []; //edit list ifno array
  @Input() formSettings: any;
  @Input() listName: any = {};
  @Input() listformvalid: boolean=false; //assume this is array of list
  @Output() resetList = new EventEmitter<number>(); //Send reste count value to parent 
  @Output() updatelistInfo = new EventEmitter<any>(); //Send updated lisfield
  public listcount:any[]=[];
  currentuserInfo:any={};
  ignoreIds: any[]=[];
  autoPopulate:string='N';
  filteredUsers: any[] = [];
  public disableAutoPopulate:boolean=false;
  public customTime: boolean = false; //Disable custom inputs for time field discuss @mrnl on 1082020
  showErrors: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  listForm: FormGroup;
  listItems: FormArray;
  filteredLists: any[] = [];
  sendListInfo: any[] = [];
  checkboxfielderror: any = false;
  Checkeditems: any[]=[];
  enableMultiple: boolean = true;
  time_zoneformat: any;
  time_format: any;
  twelvehoursName: any = [];
  twenty_four_Name: any = [];
  twentyfourhourvalue: any;
  twentyfourminutes: any;
  valid = true;
  currentDate = new Date();
  public autosuggestArray: any[]=OptionsList.Options.autosuggestfields;
  public ignoreUsersArr: any[]=[];
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private el: ElementRef,
    private _matSnackBar: MatSnackBar,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private eventbehavioursub: EventbehavioursubService,
    private _profileservices: ProfileService

  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Convert Limit Number To Array
    this.listcount = this.Fields && this.Fields.length>0 && this.Fields[0].allow_multiple=='Y' ? Array.from(new Array(this.Fields[0].max_limit || 0),(val,index)=>index+1) : [];
    if(this.Fields && this.Fields.length>0){
      let autoPopulate = this.Fields.filter(item=>{return item.autofill=='Y'}).map(item=>{return item.autofill});
      if(autoPopulate && autoPopulate.length>0){
        this.autoPopulate = autoPopulate.join(',');
      }
    }
    
    //Convert Form Settings strings to json
    if (this.formSettings) {
      let formSettings;
      formSettings = CommonUtils.getStringToJson(this.formSettings);
      this.formSettings = formSettings.formsettings;
    }
    
    let fieldRequired = this.Fields.filter(item=> item.field_required=='Y') || [];
    let isRequired = (this.listName && this.listName.required == 'Y' || (fieldRequired.length>0)) ? Validators.required : null;
    this.listForm = this._formBuilder.group({
      form_element_id: [this.listName.form_element_id],
      entryLimit:[1],
      listFields: this._formBuilder.array([],Validators.compose([isRequired]))
    });

    //GET USER INFORMATION
    if(this.userId>0){
      if(this.autoPopulate=='Y'){
        this._profileservices.getProfileInfo().subscribe(res => {
          this.currentuserInfo = res.userinfo;
          this.setAutoPopulateData();
          this.createItem();          
        });
      }
      else{
        this.createItem();
      }
    }
    //Show Errors on Submit of form for required listfields
    this.eventbehavioursub.listFieldsValidate
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(validate=>{
      if(validate==true){
        this.validateListFieldForm(validate);
      }
    });
  }
  ngAfterViewInit(){
    //SEND listForm invalid status to element Component
    this.eventbehavioursub.listFieldsLoaded.next(this.listForm.invalid);
  }
  //get Edit Array
  get listFields(): FormArray {
    return this.listForm.get('listFields') as FormArray;
  }
  

  //Create list form fields
  createItem(): void {
    if (this.Fields.length > 0) {
      let fieldgroup = {};
      this.Fields.forEach((input,index) => {   
        //If Checkbox then add formArray for multiple select options
        let inputRequired = input.field_required && input.field_required == 'Y' ? Validators.required : null;
        if (input.field_type == 'checkbox') {
          if (input.field_content && input.field_content.options.length > 0) {            
            let FieldArray  = [];
            FieldArray  = this.createStaticInput(input); 
            fieldgroup[input.field_name] = new FormArray(FieldArray,Validators.compose([inputRequired]));
          }
        }
        else {
          if (input.field_type == 'time') {
            this.time_zoneformat = input.time_zone;
            this.time_format = input.time_format;
            // create the dynamic  ng model name 
            if (input.text_format == 'text') {
              if (input.time_format == 'twelve') {
                this.twelvehoursName.push({ 'type': 'hours', 'label': input.field_name + 'hours', 'id': input.field_name }, { 'type': 'minutes', 'label': input.field_name + 'minutes', 'id': input.field_name }, { 'type': 'time_zone', 'label': input.field_name + 'time_zone', 'id': input.field_name });
                this.twelvehoursName.forEach(input_template => {
                  fieldgroup[input_template.label] = new FormControl('');
                })
              }
              if (input.time_format == "twenty-four" && input.text_format == 'text') {
                this.twenty_four_Name.push({ 'type': 'twenty_four_hours', 'label': input.field_name + 'twenty_four_hours', 'id': input.field_name }, { 'type': 'twenty_four_minutes', 'label': input.field_name + 'twenty_four_minutes', 'id': input.field_name },);
                this.twenty_four_Name.forEach(input_template => {
                  fieldgroup[input_template.label] = new FormControl('');
                })
              }
            } else {
              fieldgroup[input.field_name] = new FormControl('');
            }
          } 
          else {
            let defaultValue = '';
            if(this.disableAutoPopulate==false && input.field_content && input.field_content.extra_field_content && input.field_content.extra_field_content.defaultValue!=='' && input.field_content.extra_field_content.dafaultValue!==undefined){
              defaultValue = input.field_content.extra_field_content.dafaultValue;
            }
            fieldgroup[input.field_name] = new FormControl(defaultValue,Validators.compose([inputRequired]));            
          }
        }
      });
      this.listItems = this.listForm.get('listFields') as FormArray;
      this.listItems.push(this._formBuilder.group(fieldgroup));
      this.submitListFieldForm();
      this.eventbehavioursub.listFieldsLoaded.next(this.listForm.invalid);
      //Restrict Limit of List Field
      if(this.Fields[0].max_limit && this.listItems.length===parseInt(this.Fields[0].max_limit)){
        this.enableMultiple = false;
      }
      this.disableAutoPopulate = true;  
      this.getUsersAutoList();    
    }
  }
  //Add More Fields by Button
  addMoreFields(): void {
    setTimeout(() => {this.createItem();}, 0);
  }
  //Add More Fields By Select
  //Add More Fields
  selectMoreFields($event): void {
    let entryLimit = this.listForm.get('entryLimit').value;
    this.listItems = this.listForm.get('listFields') as FormArray;
    
    if(entryLimit>this.listItems.length){
      let entryLoopArr = Array.from(new Array(entryLimit-1 || 0),(val,index)=>index);
      entryLoopArr.map(arritem=>{
        setTimeout(() => {this.createItem();}, 0);
      })
    }
    else if(entryLimit<this.listItems.length){
      let removeItems = this.listItems.length - entryLimit; 
      this.listItems.controls.map((items,index)=>{
        const nextIndex = index+1;
        let userName   = this.listItems.at(nextIndex).get('Name').value;
        let finalUser  = userName; 
        //remove autosuugested usersArray
        if(this.autoPopulate=='Y'){          
          let existsName = this.ignoreUsersArr.findIndex(item=>{
            return item.name==finalUser;
          });
          if(existsName>=0){
            this.ignoreUsersArr.splice(existsName,1);
            this.setIgnorIds();
          }
        }
        this.listItems.controls.splice(nextIndex,removeItems);        
      });      
    }
  }
  onRemoveField(idx) {
    this.listItems.removeAt(idx);
    //call validation function
    this.eventbehavioursub.listFieldsLoaded.next(this.listForm.invalid);
    //Remove CheckedItems ArrayElements
    if(typeof this.Checkeditems[idx]){
      this.Checkeditems.splice(idx,1);
    }
    if(this.Fields[0].max_limit && this.listItems.length<this.Fields[0].max_limit){
      this.enableMultiple = true;
    }
  }
  //convert checkbox true false to value of checkbox and assign checkbos array field
  onSelectCheckbox(checkValue: string, listIndex: number, field: any, isChecked: boolean) {
    const checkedArray = this.listItems.controls[listIndex].get(field.field_name) as FormArray;
    if (isChecked) {
      checkedArray.push(new FormControl(checkValue));
    } else {
      let idx = checkedArray.controls.findIndex(x => x.value == checkValue);
      checkedArray.removeAt(idx);
    }
    this.checkboxfielderror = checkedArray.controls.length == 0 && field.field_required == 'Y' ? true : false;
    //set form invalid
    if (this.checkboxfielderror == true) {
      this.listForm.get('listFields').setErrors({ 'incorrect': true });
    }
    //Call event emitter to change value
    this.submitListFieldForm();
  }
  twentyfourhoursValue($event, name) {    
    let TmpArray = [];
    this.twentyfourhourvalue = $event.target.value;
    TmpArray.push($event.target.value, this.twentyfourminutes);    
    let data = TmpArray.join();    
    // this.listForm.get(name)
    // .patchValue(data.replace(/,/g, ':')); 
  }

  twentyfourminutesValue($event, name) {
    let TmpArray = [];
    this.twentyfourminutes = $event.target.value;
    TmpArray.push(this.twentyfourhourvalue, $event.target.value);
    let data = TmpArray.join();
    // this.listForm.get(''+name+'')
    // .patchValue(data.replace(/,/g, ':')); 
  }

  validate($event) {    
  }

  //  used in field type time is valid or not 
  isValid(event: boolean): void {    
    this.valid = event;
  }
  //create static checkboxes
  createStaticInput(metaField:any){
    let controls = [];
    if(metaField.field_content.options){
      let inputRequired = metaField.field_required && metaField.field_required == 'Y' ? Validators.required : null;
      controls = metaField.field_content.options.map(item=>{
        let fieldChecked = false;
        return new FormControl(fieldChecked,Validators.compose([inputRequired]));
      });
      return controls;
    }
  }

  //Update CheckBoxArray Field
  updateCheckboxValues(formgroupIndex, key, fieldType:string='checkbox') {
    let fieldId     = key.toString();
    this.listItems  = this.listForm.get('listFields') as FormArray;
    const fromGroup = this.listItems.controls[formgroupIndex] as FormGroup;
    let metaValues = [];
    let formvalues = fromGroup.value;
    //validate Form Fields
    Object.keys(fromGroup.controls).forEach(field => {
      if(field==key && fieldType=='checkbox'){
        const control = fromGroup.get(field);
        if(Array.isArray(control.value)){
          if(control.value.filter(item=>{return item==true}).length==0){
            control.setErrors({required:true});    
          }
        }
        control.markAsTouched({ onlySelf: true });
      }
    });

    Object.keys(formvalues).map(function (key) { 
        let fieldValue = Array.isArray(formvalues[key]) ? formvalues[key].join(",") : formvalues[key];
        metaValues.push({field_name:key, field_value:fieldValue}); 
    });
    this.Fields.forEach(meta=>{
      if(meta.field_type=='checkbox'){
        let checkfield =  metaValues.find(item=>{return item.field_name==meta.field_name});
        if(checkfield && checkfield.field_value){
          checkfield.field_value    = checkfield.field_value.split(',');
          const selectedPreferences = checkfield.field_value
          .map((checked, index) => {
            return checked=='true' ? meta.field_content.options[index].value : null;
          })
          .filter(value => value !== null);
          checkfield.field_value = Array.isArray(selectedPreferences) ? selectedPreferences.join(',') : "";
        } 
      }
      else{
        let checkfield =  metaValues.find(item=>{return item.field_name==meta.field_name});
        if(checkfield && checkfield.field_value){
          checkfield.field_value    = checkfield.field_value;
        }
      }
    });
    //ARRAY Of Checkboxes with actual Values
    if(typeof this.Checkeditems[formgroupIndex]){
      this.Checkeditems[formgroupIndex] = [...metaValues];
    }
    else{
      this.Checkeditems.push(metaValues);
    }
    //Call event emitter to change value
    this.submitListFieldForm();
  }
  validateListFieldForm(isValidate:boolean=false){
    if (isValidate==true && this.listForm.invalid) {
      this.showErrors  = isValidate;
      this.listItems   = this.listForm.get('listFields') as FormArray;
      const fromGroupsArr = this.listItems.controls;
      
      fromGroupsArr.map(item=>{
        let itemfields = item as FormGroup;
        Object.keys(itemfields.controls).forEach(field => {
          const control = itemfields.get(field);
          if(Array.isArray(control.value) && control.value.filter(item=>{return 'boolean' === typeof item}).length>0){
            if(control.value.filter(item=>{return item==true}).length==0){
              control.setErrors({required:true});    
            }
          }
          control.markAsTouched({ onlySelf: true });
        });
        CommonUtils.scrollToFirstInvalidControl(this.el);
      })
      return false;
      
    }
  }
  //Submit form on every field change
  submitListFieldForm() {
    this.showErrors     = this.listForm.invalid;
    this.sendListInfo   = this.listForm.get('listFields').value;
    let formfieldValue  = this.Checkeditems.length>0 ? JSON.stringify(this.Checkeditems) : "";
    let listfieldValues = { form_element_id: this.listName.form_element_id, form_element_value: formfieldValue, listformValid: this.listForm.invalid }
    this.updatelistInfo.emit(listfieldValues);
  }
  /**
   * PREPARE USER DATA TO BIND WITH FIELDS 
   */
  setAutoPopulateData(){
    if(this.currentuserInfo && this.Fields && this.Fields.length>0){
      let userInfo = {first_name:this.currentuserInfo.first_name,middle_name:this.currentuserInfo.middle_name,last_name:this.currentuserInfo.last_name,email:this.currentuserInfo.email,phone:this.currentuserInfo.phone,birthdate:this.currentuserInfo.birthdate};
      if(this.currentuserInfo.usermeta && this.currentuserInfo.usermeta.length>0){
        this.currentuserInfo.usermeta.map(item=>{
          let fieldName       = item.user_fields.field_name.toLowerCase();
          userInfo[fieldName] = item.dynamicfields;
        });
      }
      this.Fields.forEach(item=>{
        if(item.field_content && item.field_content.extra_field_content && item.field_content.extra_field_content && item.field_content.extra_field_content.autopopulate!==undefined && item.field_content.extra_field_content.autopopulate!==''){
          const neededKeys = item.field_content.extra_field_content.autopopulate.toLowerCase().split(',');
          let DefaultValue = ''; 
          neededKeys.map(key =>{
            if(Object.keys(userInfo).includes(key)){
              DefaultValue += neededKeys.length>1 ? userInfo[key]+' ' : userInfo[key];
            }
          });
          item.field_content.extra_field_content.dafaultValue = DefaultValue.trim();
        }
        return item;
      });
    }
  }

  //Auto list of guest exclude currrentUser
  getUsersAutoList(fieldindex:number=0){
    var listFieldControls = this.listForm.get('listFields') as FormArray;
    //Add Current UserId into ignorecase
    this.setIgnorIds();
    //Get Users Autocompletelist
    listFieldControls.controls.map((item,index)=>{
      listFieldControls.at(index).get('Name').valueChanges.pipe(debounceTime(300),
      switchMap((value) => {      
        return this._userService.getAutoUsers({'searchKey': value,ignore_ids:this.ignoreIds.join(","),type:'users'})
      }))
      .subscribe(users => this.filteredUsers[index] = users.data);
    });
    
  }

  //Set guest Fields
  setlistFormfields($event,index){
    this.listItems = this.listForm.get('listFields') as FormArray;
    if($event.option.value){
      let userInfoObj = this.getUserInfoObject($event.option.value);
      var guestFieldControls = this.listForm.get('listFields') as FormArray;
      //prepare selected users array to avoid in autosuggest duplication
      this.ignoreUsersArr.push({id:$event.option.value.id,name:$event.option.value.first_name+' '+$event.option.value.last_name});
      
      //check fields name and patch value from autosuggest
      if(this.Fields && this.Fields.length>0){
        this.Fields.map(fielditem=>{
          let FieldName = fielditem.field_name.toLowerCase();
          if( FieldName=='name' && this.autosuggestArray.includes(FieldName)){
            guestFieldControls.at(index).get(fielditem.field_name).setValue($event.option.value.first_name+' '+$event.option.value.last_name);  
          }
          else if(this.autosuggestArray.includes(FieldName)){
            guestFieldControls.at(index).get(fielditem.field_name).setValue(userInfoObj[FieldName]);  
          }
        });
      }
    }
    this.setIgnorIds();
  }
  //prepare userinfo array with usermeta and core fields
  getUserInfoObject(userInfo:any){
    let FinalUserMeta = {};
    let userInfoObj = {...userInfo}; 
    if(userInfoObj.usermeta){
      let userMeta = {};
      userInfoObj.usermeta.map(item=>{        
        let fieldName = item.user_fields.field_name.toLowerCase();
        userMeta[fieldName] = item.field_value;
      });
      delete (userInfo.usermeta);
      delete (userInfo.userroles);

      FinalUserMeta = {...userInfo,...userMeta};
      
      return FinalUserMeta;
    }
  }
  //SetIgnoreIds
  setIgnorIds(){
    //push current user into ignore ds
    this.ignoreIds        = [];
    this.ignoreIds.push(this.userId);
    let suggestedUsersIds = this.ignoreUsersArr.map(item=>{return item.id});
    var userIdsIgnore     = this.ignoreIds.concat(suggestedUsersIds);
    this.ignoreIds        = [...userIdsIgnore];
    this.ignoreIds        = [...CommonUtils.removeDuplicates(this.ignoreIds)];
  } 
  /**
  * On destroy
  */
  ngOnDestroy(): void
  {
     // Unsubscribe from all subscriptions
     this._unsubscribeAll.next();
     this._unsubscribeAll.complete();
     
  }
}
