import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonService, EventbehavioursubService, OptionsList, UsersService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM/DD/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: "app-list",
  template: `
  <div *ngIf="type == 'field' || type == 'resident'">
    <mat-form-field  class="w-100-p"class="w-100-p" [ngClass]="fdata.field_content.extra_field_content.class"  appearance="outline">
      <mat-label>{{field.field_label}}: </mat-label>
      <input matInput [id]="fdata.field_content.extra_field_content.id" [formControlName]="field.field_name" [placeholder]="field.field_label" [type]="field.field_type" [readonly]="fdata.field_content.extra_field_content.readonly == 'Y'" />
      <mat-error *ngIf="group.get(field.field_name).invalid && (group.get(field.field_name).dirty || group.get(field.field_name).touched)">{{item.error_msg}}</mat-error>
    </mat-form-field>
  </div>
  <div class="" *ngIf="type == 'dynForm'">
    <h4 class="ml-4 font-weight-600 font-size-16 mb-8 text-capitalize">{{field.caption}} :</h4>
    <div *ngIf="group.get(field.caption)" [formGroup]="group">
      <div [formArrayName]="field.caption"  *ngFor="let fdata of group.get(field.caption)?.controls;let index = index;">
        <div [formGroupName]="index" style="display:flex; flex-wrap:wrap;">
          <div *ngFor="let item of newFieldContent[0]" [ngSwitch]="item.field_type" class="inner-list-div">
            <div *ngSwitchCase="'text'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p">
              <mat-form-field  class="w-100-p"  [ngClass]="item.field_content.extra_field_content.class" *ngIf="fdata.get(item.field_name)" appearance="outline">
                <mat-label class="text-capitalize">{{item.field_label}} : </mat-label>
                <input matInput [matAutocomplete]="autoPopulate=='Y' ? auto : false" [id]="item.field_content.extra_field_content.id" [formControl]="fdata.get(item.field_name)" [readonly]="item.field_readonly === 'Y'" />
                <mat-autocomplete #auto="matAutocomplete" (optionSelected)="setlistFormfields($event,index)">
                  <ng-container *ngFor="let option of filteredUsers[index]">
                      <mat-option *ngIf="!ignoreIds.includes(option.id)" [value]="option" >
                          {{option.first_name+' '+option.last_name}}
                      </mat-option>
                  </ng-container>
                  <mat-option *ngIf="item.field_name=='Name' && filteredUsers[index] && filteredUsers[index].length==0" disabled="true">Users Not Found</mat-option>
                  </mat-autocomplete>
                <mat-error *ngIf="fdata.get(item.field_name).invalid && (fdata.get(item.field_name).dirty || fdata.get(item.field_name).touched)">{{item.error_msg}}</mat-error>
              </mat-form-field>
            </div>
            <div *ngSwitchCase="'password'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p">
              <mat-form-field  class="w-100-p" [ngClass]="item.field_content.extra_field_content.class" *ngIf="fdata.get(item.field_name)" appearance="outline">
                <mat-label class="text-capitalize">{{item.field_label}} : </mat-label>
                <input matInput type="password" [id]="item.field_content.extra_field_content.id" [formControl]="fdata.get(item.field_name)" [readonly]="item.field_readonly === 'Y'" />
                <mat-error *ngIf="fdata.get(item.field_name).invalid && (fdata.get(item.field_name).dirty || fdata.get(item.field_name).touched)">{{item.error_msg}}</mat-error>
              </mat-form-field>
            </div>
            <div *ngSwitchCase="'number'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p">
              <mat-form-field  class="w-100-p" [ngClass]="item.field_content.extra_field_content.class" *ngIf="fdata.get(item.field_name)" appearance="outline">
                <mat-label>{{item.field_label}} : </mat-label>
                <input
                  matInput
                  [id]="item.field_content.extra_field_content.id"
                  [formControl]="fdata.get(item.field_name)"
                  [mask]="item.field_content.extra_field_content.ismasking=='Y' ? item.field_content.extra_field_content.maskingpattern  : ''"
                  [readonly]="item.field_readonly === 'Y'"
                />
                <mat-error *ngIf="fdata.get(item.field_name).invalid && (fdata.get(item.field_name).dirty || fdata.get(item.field_name).touched)">{{item.error_msg}}</mat-error>
              </mat-form-field>
            </div>
            <div *ngSwitchCase="'email'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p text-lowercase">
              <mat-form-field  class="w-100-p" [ngClass]="item.field_content.extra_field_content.class" *ngIf="fdata.get(item.field_name)" appearance="outline">
                <mat-label class="text-capitalize">{{item.field_label}} : </mat-label>
                <input matInput type="email" [id]="item.field_content.extra_field_content.id" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" [formControl]="fdata.get(item.field_name)" [readonly]="item.field_readonly === 'Y'" />
                <mat-error *ngIf="fdata.get(item.field_name).invalid && fdata.get(item.field_name).error?.pattern &&  (fdata.get(item.field_name).dirty || fdata.get(item.field_name).touched)">{{item.error_msg}}</mat-error>
              </mat-form-field>
            </div>
            <div *ngSwitchCase="'hidden'" [ngClass]="item.field_content.extra_field_content.class" class="form-group" class="max-100-p">
              <input [id]="item.field_content.extra_field_content.id" [formControl]="fdata.get(item.field_name)" type="hidden" />
            </div>

            <div *ngSwitchCase="'time'" [ngClass]="item.field_content.extra_field_content.class" class="max-100-p min-100-p">
              <div *ngIf="item.time_format =='twelve' && item.text_format=='dropdown'" class="w-100-p">
                <mat-form-field  class="w-100-p"class="w-100-p" appearance="outline" floatLabel="always">
                  <mat-label>{{item.field_label}} :</mat-label>
                  <input matInput [owlDateTimeTrigger]="datetimepicker" [owlDateTime]="datetimepicker" [formControl]="fdata.get(item.field_name)" />
                  <owl-date-time [pickerType]="'timer'" [hour12Timer]="true" #datetimepicker></owl-date-time>
                  <mat-error>{{item.error_msg}}</mat-error>
                </mat-form-field>
              </div>
            </div>

            <div *ngSwitchCase="'textarea'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p">
              <mat-form-field  class="w-100-p" [ngClass]="item.field_content.extra_field_content.class" *ngIf="fdata.get(item.field_name)" appearance="outline">
                <mat-label>{{item.field_label}} : </mat-label>
                <textarea matInput [id]="item.field_content.extra_field_content.id" [formControl]="fdata.get(item.field_name)" [readonly]="item.field_readonly ==='Y'"> </textarea>
                <mat-error *ngIf="fdata.get(item.field_name).invalid && (fdata.get(item.field_name).dirty || fdata.get(item.field_name).touched)">{{item.error_msg}}</mat-error>
              </mat-form-field>
            </div>

            <div *ngSwitchCase="'checkbox'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p" style="display:flex; align-item:center;">
              <label class="mr-8">{{item.field_label}} : </label>
              <div  [ngClass]="item.field_content.extra_field_content.class">
                <ng-container *ngFor="let checks of item.field_content.options; let j = index" [formArrayName]="item.field_name">
                  <mat-checkbox class="mx-4" [formControlName]="j" [value]="checks.value" (change)="updateCheckbox(index, item.field_name)">{{checks.key}}</mat-checkbox>
                </ng-container>
              </div>
              <!-- checkbox array field error -->
              <div fxLayout="row wrap" fxLayoutAlign="start center" fxLayoutGap="8px grid" >
                  <div fxFlex="calc(100%-8px)" class="text-capitalize mat-error custom-error my-4" *ngIf="fdata.get(item.field_name).invalid">{{field.error_msg || 'Field Required'}}</div>
              </div>
            </div>

            <div *ngSwitchCase="'date'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p">
              <mat-form-field  class="w-100-p abc" [ngClass]="item.field_content.extra_field_content.class" *ngIf="fdata.get(item.field_name)" appearance="outline">
                <mat-label>{{item.field_label}} : </mat-label>
                <span *ngIf="item.field_content.extra_field_content.pickerType !='calendar'">
                  <input matInput [id]="item.field_content.extra_field_content.id" [formControl]="fdata.get(item.field_name)" [owlDateTimeTrigger]="datetimepicker" [owlDateTime]="datetimepicker" [readonly]="item.field_readonly === 'Y'" [min]="item.field_content.extra_field_content.pastdate=='N'?currentDate:''" />
                  <owl-date-time [pickerType]="item.field_content.extra_field_content.pickerType" [pickerMode]="'dialog'" [hour12Timer]="true" #datetimepicker></owl-date-time>
                  <mat-error *ngIf="fdata.get(item.field_name).invalid && (fdata.get(item.field_name).dirty || fdata.get(item.field_name).touched)">{{item.error_msg}}</mat-error>
                </span>

                <span *ngIf="item.field_content.extra_field_content.pickerType =='calendar'" style="display:flex; height: 18px; align-items: center;">
                  <input matInput [matDatepicker]="picker" [id]="item.field_content.extra_field_content.id" [formControl]="fdata.get(item.field_name)" [min]="item.field_content.extra_field_content.pastdate=='N'?currentDate:''"  />
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="fdata.get(item.field_name).invalid && (fdata.get(item.field_name).dirty || fdata.get(item.field_name).touched)">{{item.error_msg}}</mat-error>
                </span>
              </mat-form-field>
            </div>

            <div *ngSwitchCase="'select'" [ngClass]="item.field_content.extra_field_content.col_class" class="max-100-p">
              <mat-form-field  class="w-100-p" [ngClass]="item.field_content.extra_field_content.class" *ngIf="fdata.get(item.field_name)" appearance="outline">
                <mat-select [id]="item.field_content.extra_field_content.id" [multiple]="item.multiselect =='Y'" [formControl]="fdata.get(item.field_name)">
                  <mat-option *ngFor="let type of item.field_content.options;" [value]="type.key">{{type.value}}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </div>
        <div class="ml-4 my-16">
          <i *ngIf="enableMultiple" class="p-4 material-icons icon-size purple-btn-bg font-size-20 fuse-white-fg mr-8" (click)="onPlusClick()" style="cursor:pointer; border-radius: 40px;">add</i>
          <i class="p-4 material-icons icon-size purple-btn-bg font-size-20 fuse-white-fg" style="cursor:pointer; border-radius: 40px;" *ngIf="index > 0" (click)="onRemoveRow(index)">delete</i>
        </div>
      </div>
    </div>
  </div>

  `,
  styles: [`.list-box { border: 1px solid #d4d4d4; border-radius: 15px; box-shadow: 0px 0px 10px #737373; padding: 10px; margin: 10px; }'
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {-webkit-appearance: none;margin: 0;}
   `],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

// *ngIf="tmpOri[0].field_content.max_limit != '' ?tmpOri[0].field_content.max_limit > index+1: tmpOri[0].field_content.max_limit == '' "
/*
<mat-radio-button *ngFor="let item of fdata.field_content.options" [value]="item.value">{{item.key}}</mat-radio-button>
<mat-option *ngFor="let item of fieldContent.options" [value]="item.key">{{item.value}}</mat-option>
*/
export class ListComponent implements OnInit, AfterContentChecked {

  field: any;
  public userId: number = 0;
  editEntry: string = 'N';
  currentuserInfo:any={};
  ignoreIds: any[]=[];
  autoPopulate:string='N';
  filteredUsers: any[] = [];
  public disableAutoPopulate:boolean=false;
  public autosuggestArray: any[]=OptionsList.Options.autosuggestfields;
  public ignoreUsersArr: any[]=[];
  listItems: FormArray;
  
  group: FormGroup;
  type: string;
  fieldContent: any = [];
  checkArray: any = [];
  currentDate = new Date();
  showErrors: boolean = false;
  public enableMultiple: boolean = false;
  public maxlistFields: number = 0;
  public listFields: FormArray;
  public tmpOri: any;
  public keysFormFieldData: any;
  public url: string;
  public newFieldContent: any = [];
  twentyfourhour: any;
  twentyfourminutes: any;
  twenty_four_Name: any = [];
  twelvehoursName: any = [];
  twentyfourHourValue: any;
  twentyfourMinutesValue: any;
  /* =============== Auto Complete vars =============== */
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private el: ElementRef,
    private eventbehavioursub: EventbehavioursubService,
    private commonservice: CommonService,
    private _userService: UsersService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.userId = JSON.parse(localStorage.getItem('token')).user_id;
  }

  ngOnInit() {
    console.log("this.field>>>",this.field);
    /*if(this.type == 'field') {}*/
    let isRequired = this.field && this.field.required == 'Y' ? Validators.required : null;
    this.listFields = this.fb.array([], Validators.compose([isRequired]));
    //Set Limit Of Fields
    this.setListFieldLimit();

    if(this.field && this.field.content && this.field.content.length>0){
      let contentArray = this.field.content[0];
      let autoPopulate = contentArray.filter(item=>{return item.autofill=='Y'}).map(item=>{return item.autofill});
      if(autoPopulate && autoPopulate.length>0){
        this.autoPopulate = autoPopulate.join(',');
      }
    }

    let fieldgroup = {}
    this.field.content.forEach(input => {
      if (input.field_type == 'time') {
        let form_element_value = [];
        if (input.time_format == 'twenty-four' && input.text_format == 'text') {
          if (input.time_format == "twenty-four") {
            form_element_value = this.field.entryinfo.form_element_value.split(',', String);
            
            this.twenty_four_Name.push({ 'type': 'twenty_four_hours', 'label': input.field_name + 'twenty_four_hours', 'id': input.field_name }, { 'type': 'twenty_four_minutes', 'label': input.field_name + 'twenty_four_minutes', 'id': input.field_name },);
            
            this.twenty_four_Name.forEach(input_template => {
              fieldgroup[input_template.label] = new FormControl('');
            })
          }

          this.group = new FormGroup(fieldgroup);
        }

        if (input.time_format == 'twelve') {

          this.twelvehoursName.push({ 'type': 'hours', 'label': input.field_name + 'hours', 'id': input.field_name }, { 'type': 'minutes', 'label': input.field_name + 'minutes', 'id': input.field_name }, { 'type': 'time_zone', 'label': input.field_name + 'time_zone', 'id': input.field_name });

          this.twelvehoursName.forEach(input_template => {
            fieldgroup[input_template.label] = new FormControl('');
          })

        }
        this.group = new FormGroup(fieldgroup);
      }
    });


    this.group.addControl(this.field.caption, this.listFields);
    this.createControl();
    this.onAddSelectRow();

    //Show Errors on Submit of form for required listfields
    this.eventbehavioursub.listFieldsValidate
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(validate => {
        this.validateListFieldForm(validate);
      });

    //DETECT CHANGES IN LIST FIELDS
    this.listFields.valueChanges.subscribe(response => {
      if (response) {
        this.commonservice.setlistdata(response);
        this.validateListLoadForm(true);
      }
    });

    this.getUsersAutoList();
  }
  ngAfterViewInit() {
    this.validateListLoadForm(true);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  createControl() {
    this.tmpOri = [...this.field.content];
    this.editEntry = this.field.edit || 'N';
    if (this.field.edit) {
      this.newFieldContent = this.tmpOri;
    }
    else {
      this.newFieldContent.push(this.tmpOri);
    }
    // this.newFieldContent = tmpOri; // .push(tmpOri); 
  }



  onAddSelectRow() {
    for (var j = 0; j <= this.newFieldContent.length - 1; j++) {
      this.listFields.push(this.createItemFormGroup(this.newFieldContent[j], false));
    }
    //IF LISTFIELDS HAVE VALUE THEN PUSH IT TO SERVICE
    if (this.listFields.value.length > 0) {
      this.commonservice.setlistdata(this.listFields.value);
    }
    //CHECK LIMIT OF LIST FIELD AND DISABLE ADD MORE BUTTON ON LOAD EDIT PAGE
    if(this.maxlistFields > 0 && this.listFields.length < this.maxlistFields ){
      this.enableMultiple = true;
    }
    else{
      this.enableMultiple = false;
    }
  }

  onPlusClick() {
    this.listFields.push(this.createItemFormGroup(this.newFieldContent[0], true));
    //Restrict Limit of List Field
    if(this.maxlistFields > 0 && this.listFields.length < this.maxlistFields ){
      this.enableMultiple = true;
    }
    else{
      this.enableMultiple = false;
    }
    this.getUsersAutoList();
  }
 

  createItemFormGroup(newFieldContent, addnew): FormGroup {
    let control = {};

    let tempnewFieldContent = JSON.parse(JSON.stringify(newFieldContent));
    for (var i = 0; i <= tempnewFieldContent.length - 1; i++) {
      this.fieldContent.push(tempnewFieldContent[i].field_content);
      if (tempnewFieldContent[i].field_type == "checkbox") {
        for (let item of tempnewFieldContent[i].field_content.extra_field_content.dafaultValue) {
          this.checkArray.push(item);
        }
        let inputRequired = tempnewFieldContent[i].field_required && tempnewFieldContent[i].field_required == 'Y' ? Validators.required : null;
        let FieldArray = [];
        FieldArray = this.createStaticInput(tempnewFieldContent[i], addnew);
        control[tempnewFieldContent[i].field_name] = new FormArray(FieldArray, Validators.compose([inputRequired]));
      }
      else {
        let defaultValue = '';
        if (addnew == false) {
          //Multiple select dropdown value conert to array 
          if (tempnewFieldContent[i].multiselect == 'Y' && tempnewFieldContent[i].field_type == "select" && tempnewFieldContent[i].field_content.extra_field_content && tempnewFieldContent[i].field_content.extra_field_content.dafaultValue) {
            defaultValue = tempnewFieldContent[i].field_content.extra_field_content.dafaultValue.split(',');
          }
          else {
            defaultValue = (tempnewFieldContent[i].field_value) ? tempnewFieldContent[i].field_value : tempnewFieldContent[i].field_content.extra_field_content ? tempnewFieldContent[i].field_content.extra_field_content.dafaultValue : '';
            if(tempnewFieldContent[i].field_type=='date' && defaultValue!==''){
              this.currentDate = new Date(defaultValue);
            }
          }

        }
        control[tempnewFieldContent[i].field_name] = this.fb.control(
          defaultValue, this.bindValidations(tempnewFieldContent[i].field_required, tempnewFieldContent[i].field_pregmatch)
        );
      }
    }
    return this.fb.group(control);
  }
  bindValidations(validationRequired = null, validationRegexmatch = null) {
    if (validationRequired === 'Y' || validationRegexmatch != '') {
      const validList = [];
      let tmpValidationRequired, tmpValidationRegexmatch;

      if (validationRequired === 'Y') {
        tmpValidationRequired = Validators.required;
        validList.push(tmpValidationRequired);
      }

      if (validationRegexmatch != '') {
        tmpValidationRegexmatch = Validators.pattern(validationRegexmatch);
        validList.push(tmpValidationRegexmatch);
      }
      return Validators.compose(validList);
    }
  }
  onRemoveRow(idx) {
    this.listFields.removeAt(idx);
    if(this.maxlistFields > 0 && this.listFields.length < this.maxlistFields ){
      this.enableMultiple = true;
    }
  }
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }

  //create static checkboxes
  createStaticInput(metaField: any, addnew: boolean = false) {
    let controls = [];
    if (metaField.field_content.options) {
      let defaultValue = (metaField.field_value) ? metaField.field_value : metaField.field_content.extra_field_content.dafaultValue;
      let inputRequired = metaField.field_required && metaField.field_required == 'Y' ? Validators.required : null;
      controls = metaField.field_content.options.map(item => {
        let fieldChecked = false;
        if (addnew == false) {
          if (Array.isArray(defaultValue) && defaultValue.includes(item.value)) {
            fieldChecked = true;
          }
          else if (defaultValue == item.value) {
            fieldChecked = true;
          }
        }
        return new FormControl(fieldChecked, Validators.compose([inputRequired]));
      });
      return controls;
    }
  }
  //VALIDATE CHECKBOXES
  updateCheckbox(formgroupIndex: number, fieldName: string) {
    let fieldId = fieldName.toString();
    let listItems = this.group.get(this.field.caption) as FormArray;
    const fromGroup = listItems.controls[formgroupIndex] as FormGroup;
    const control = fromGroup.get(fieldId);
    if (Array.isArray(control.value) && control.value.filter(item => { return 'boolean' === typeof item }).length > 0) {
      if (control.value.filter(item => { return item == true }).length == 0) {
        control.setErrors({ required: true });
        this.eventbehavioursub.listFieldsLoaded.next(true);
      }
    }
    control.markAsTouched({ onlySelf: true });
  }
  validateListFieldForm(isValidate: boolean = false) {
    if (isValidate == true && this.listFields.invalid) {
      this.showErrors = isValidate;
      this.listFields = this.group.get(this.field.caption) as FormArray;
      const fromGroupsArr = this.listFields.controls;

      fromGroupsArr.map(item => {
        let itemfields = item as FormGroup;
        Object.keys(itemfields.controls).forEach(field => {
          const control = itemfields.get(field);
          if (Array.isArray(control.value) && control.value.filter(item => { return 'boolean' === typeof item }).length > 0) {
            if (control.value.filter(item => { return item == true }).length == 0) {
              control.setErrors({ required: true });
              this.eventbehavioursub.listFieldsLoaded.next(true);
            }
          }
          else if (control.value == '' && control.validator != null) {
            this.eventbehavioursub.listFieldsLoaded.next(true);
          }
          else {
            this.eventbehavioursub.listFieldsLoaded.next(false);
          }
          control.markAsTouched({ onlySelf: true });
        });
        this.scrollToFirstInvalidControl(this.el);
      })
      return false;
    }
  }
  //VALIDATE ON LOAD
  validateListLoadForm(isValidate: boolean = false) {
    if (isValidate == true) {
      this.showErrors = isValidate;
      this.listFields = this.group.get(this.field.caption) as FormArray;
      const fromGroupsArr = this.listFields.controls;

      fromGroupsArr.map(item => {
        let itemfields = item as FormGroup;
        Object.keys(itemfields.controls).forEach(field => {
          const control = itemfields.get(field);
          if (Array.isArray(control.value) && control.value.filter(item => { return 'boolean' === typeof item }).length > 0) {
            if (control.value.filter(item => { return item == true }).length == 0) {
              control.setErrors({ required: true });
              this.eventbehavioursub.listFieldsLoaded.next(true);
            }
          }
          else if (control.value == '' && control.validator != null) {
            this.eventbehavioursub.listFieldsLoaded.next(true);
          }
          else {
            this.eventbehavioursub.listFieldsLoaded.next(false);
          }
          control.markAsTouched({ onlySelf: true });
        });
        this.scrollToFirstInvalidControl(this.el);
      })
      return false;
    }
  }
  public scrollToFirstInvalidControl(element) {
    const firstInvalidControl: HTMLElement = element.nativeElement.querySelector(".ng-invalid");
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView(); //without smooth behavior
    }
  }
  //SET LIST FIELD LIMIT
  setListFieldLimit(){
    const fieldLimit = this.field.content.find(item => {
      if(Array.isArray(item)){
        const subitem =  item.find(subitem=>{
          if (subitem.allow_multiple=='Y' && subitem.max_limit !== '' && parseInt(subitem.max_limit) > 0) {
            return subitem;
          }
        });
        return subitem;
      }
      else{
        if (item.allow_multiple=='Y' && item.max_limit !== '' && parseInt(item.max_limit) > 0) {
          return item;
        }
      }      
    });
    if(fieldLimit && fieldLimit.length>0 && Array.isArray(fieldLimit)){
      let Maxfield = fieldLimit[0];
      this.maxlistFields = Maxfield.field_content && Maxfield.field_content.extra_field_content ? parseInt(Maxfield.field_content.extra_field_content.max_limit) : 0;
      this.enableMultiple = this.maxlistFields > 0 ? true : false;
    }
    else if(fieldLimit){
      this.maxlistFields = fieldLimit.field_content && fieldLimit.field_content.extra_field_content ? parseInt(fieldLimit.field_content.extra_field_content.max_limit) : 0;
      this.enableMultiple = this.maxlistFields > 0 ? true : false;
    }
  }
  
  //Auto list of guest exclude currrentUser
  getUsersAutoList(fieldindex:number=0){
    var listFieldControls = this.listFields as FormArray;
    console.log("listFieldControls>>>",listFieldControls);
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
    if($event.option.value){
      let userInfoObj = this.getUserInfoObject($event.option.value);
      var guestFieldControls = this.listFields as FormArray;
      //prepare selected users array to avoid in autosuggest duplication
      this.ignoreUsersArr.push({id:$event.option.value.id,name:$event.option.value.first_name+' '+$event.option.value.last_name});
      
      //check fields name and patch value from autosuggest
      if(this.field && this.field.content.length>0){
        let fieldContentArray = this.field.content[0];
        fieldContentArray.map(fielditem=>{
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