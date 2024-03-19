import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
     dateInput: 'LL',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
     monthYearLabel: 'MMM YYYY',
     dateA11yLabel: 'LL',
     monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-date',
  template: `
  <div [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'" class="dynamic-date">
  <mat-form-field class="w-100-p" [ngClass]="fieldContent.extra_field_content.class" floatLabel="always" [formGroup]="group" appearance="outline">
  <mat-label>{{field.field_label}}: </mat-label>
    <input matInput
      [id]="fieldContent.extra_field_content.id"
      [formControlName]="field.field_name"
      [min]="minDate"
      [max]="maxDate"
      [readonly]="fieldContent.extra_field_content.readonly === 'Y'" 
      [owlDateTimeTrigger]="datetimepicker" [owlDateTime]="datetimepicker"
      [formControl]="group.get(field.field_name)">
     
    <owl-date-time [pickerType]="fieldContent.extra_field_content.pickerType"  [hour12Timer]="true" #datetimepicker></owl-date-time>
    <mat-icon matSuffix>date_range</mat-icon>
    <mat-error *ngIf="group.get(field.field_name).invalid && (group.get(field.field_name).dirty || group.get(field.field_name).touched)">
      {{fieldContent.extra_field_content.error_msg}}
    </mat-error>
  </mat-form-field>
</div>
<div *ngIf="type == 'dynForm'" class="dynamic-date all-entry-tag">
  <mat-form-field class="All-half-full  w-100-p" [ngClass]="field.content.extra_field_content.class" [formGroup]="group" appearance="outline">
  <mat-label class="text-capitalize">{{field.description}} : </mat-label>
  <span *ngIf="field.content.extra_field_content.pickerType !='calendar'" >
  <input matInput
  [id]="field.content.extra_field_content.id"
  [formControlName]="field.caption" 
  [min]="min"
  [readonly]="field.content.extra_field_content.readonly === 'Y'" 
  [owlDateTimeTrigger]="datetimepicker" [owlDateTime]="datetimepicker"
  [formControl]="group.get(field.caption)">
  <owl-date-time [pickerType]="field.content.extra_field_content.pickerType"  [hour12Timer]="true" #datetimepicker></owl-date-time>
  <mat-icon *ngIf="field.content.extra_field_content.pickerType !='timer'" matSuffix>date_range</mat-icon>
  </span>
    <div *ngIf="field.content.extra_field_content.pickerType =='calendar'" style="display:flex;">
      <div *ngIf="field.content.extra_field_content.field_class == 'from'" style="display:flex;" class="w-100-p">
        <div *ngIf="field.content.extra_field_content.min_date == 'min'"> 
          <input matInput
            (dateChange)="convertStartDateFormat($event)"
            [id]="field.content.extra_field_content.id"
            [formControlName]="field.caption" 
            [max]="field.content.extra_field_content.current_date"
            [readonly]="field.content.extra_field_content.readonly === 'Y'" 
            [matDatepicker]="picker"
            [formControl]="group.get(field.caption)">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </div>
          <div *ngIf="field.content.extra_field_content.min_date == 'max'"> 
            <input matInput
              (dateChange)="convertStartDateFormat($event)"
              [id]="field.content.extra_field_content.id"
              [formControlName]="field.caption" 
              [min]="field.content.extra_field_content.current_date"
              [readonly]="field.content.extra_field_content.readonly === 'Y'" 
              [matDatepicker]="picker"
              [formControl]="group.get(field.caption)">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </div>
            <div *ngIf="field.content.extra_field_content.min_date == 'both'"> 
              <input matInput
                (dateChange)="convertStartDateFormat($event)"
                [id]="field.content.extra_field_content.id"
                [formControlName]="field.caption" 
                [readonly]="field.content.extra_field_content.readonly === 'Y'" 
                [matDatepicker]="picker"
                [formControl]="group.get(field.caption)">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
            </div>
        </div>

        <div *ngIf="field.content.extra_field_content.field_class == 'to'" style="display:flex;" class="w-100-p">
          <div *ngIf="field.content.extra_field_content.min_date == 'min'">  
              <input matInput
                [id]="field.content.extra_field_content.id"
                (dateChange)="convertEndDateFormat($event)"
                [formControlName]="field.caption" 
                [max]="field.content.extra_field_content.current_date"
                [readonly]="field.content.extra_field_content.readonly === 'Y'" 
                [matDatepicker]="picker"
                [formControl]="group.get(field.caption)">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
            </div>
            <div *ngIf="field.content.extra_field_content.min_date == 'max'">  
              <input matInput
                [id]="field.content.extra_field_content.id"
                (dateChange)="convertEndDateFormat($event)"
                [formControlName]="field.caption" 
                [min]="min"
                [readonly]="field.content.extra_field_content.readonly === 'Y'" 
                [matDatepicker]="picker"
                [formControl]="group.get(field.caption)">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
            </div>
            <div *ngIf="field.content.extra_field_content.min_date == 'both'">  
              <input matInput
                [id]="field.content.extra_field_content.id"
                (dateChange)="convertEndDateFormat($event)"
                [formControlName]="field.caption" 
                [readonly]="field.content.extra_field_content.readonly === 'Y'" 
                [matDatepicker]="picker"
                [formControl]="group.get(field.caption)">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
            </div>
        </div>

        <div *ngIf="field.content.extra_field_content.field_class == '' || field.content.extra_field_content.field_class == null">
          <div *ngIf="field.content.extra_field_content.min_date == 'min'">   
            <input matInput
              [id]="field.content.extra_field_content.id"
              [formControlName]="field.caption" 
              [max]="field.content.extra_field_content.current_date"
              [readonly]="field.content.extra_field_content.readonly === 'Y'" 
              [matDatepicker]="picker"
              [formControl]="group.get(field.caption)">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
          </div>
          <div *ngIf="field.content.extra_field_content.min_date == 'max'">   
            <input matInput
              [id]="field.content.extra_field_content.id"
              [formControlName]="field.caption" 
              [min]="field.content.extra_field_content.current_date"
              [readonly]="field.content.extra_field_content.readonly === 'Y'" 
              [matDatepicker]="picker"
              [formControl]="group.get(field.caption)">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
          </div>
          <div *ngIf="field.content.extra_field_content.min_date == 'both'">   
              <input matInput
                [id]="field.content.extra_field_content.id"
                [formControlName]="field.caption" 
                [readonly]="field.content.extra_field_content.readonly === 'Y'" 
                [matDatepicker]="picker"
                [formControl]="group.get(field.caption)">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
          </div>
        </div>
      </div>
   
    <mat-error *ngIf="group.get(field.caption).invalid && (group.get(field.caption).dirty || group.get(field.caption).touched)">
      {{field.error_msg}}
    </mat-error>
  </mat-form-field>
</div>
<span class="d-block text-capitalize mb-16" *ngIf="ShowStartDateMsg == true" style="color: rgb(243, 71, 71) " >start date should be less then the end date</span>
<span class="d-block text-capitalize mb-16" *ngIf="ShowEndDateMsg == true" style="color: rgb(243, 71, 71) " >end date should be greater then the start date</span>`,
    styles: [`
    .all-entry-tag{
      max-width: 100%;
      margin:0 4px;
    }
    .mat-input-element{
      
    }
  `] ,
  providers: [

    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class DateComponent implements OnInit {
  
  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;
  minDate:any;
  maxDate:any;
  AllDateArray :any = [];
  min :any = new Date(new Date().setHours(0,0,0,0));
  ShowStartDateMsg : boolean = false;
  ShowEndDateMsg : boolean = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    if(this.type == 'field' || this.type == 'resident'){
      this.fieldContent = JSON.parse(this.field.field_content);

      this.minDate = this.fieldContent.extra_field_content.min_date ? new Date(new Date().setHours(0,0,0,0)) : '';
      this.maxDate = this.fieldContent.extra_field_content.max_date ? new Date(new Date().setHours(0,0,0,0)) : '';
      this.createControl();
    }
    if(this.type == 'dynForm'){
      let date = new Date();
      date.setDate(date.getDate() + this.field.content.extra_field_content.day_before); 
      this.field.content.extra_field_content.current_date = date;
      this.AllDateArray.push(this.field);
      this.fieldContent = this.field.content;
      this.fieldContent.extra_field_content.defaultValue =       this.fieldContent.extra_field_content.dafaultValue
      this.minDate = this.fieldContent.extra_field_content.min_date ? new Date(new Date().setHours(0,0,0,0)) : '';
      this.maxDate = this.fieldContent.extra_field_content.max_date ? new Date(new Date().setHours(0,0,0,0)) : '';
      
      this.createControl();
    }
  }
 


  createControl() {
    let defaultValue = (this.field.field_value) ? this.field.field_value :   this.fieldContent.extra_field_content.defaultValue;
    let residentType = (this.type == 'resident' ? '' : this.field.field_required)
    const control = this.fb.control(
        defaultValue,
        this.bindValidations(residentType, '')
      );
      this.group.addControl(this.field.field_name, control);
  }


  convertEndDateFormat(event){
    this.ShowEndDateMsg = false;
    let startdate =   moment(this.group.get('start-date').value)
    let enddate =     moment(event.value)
       if(startdate > enddate){
        
        this.ShowEndDateMsg = true;
        this.group.get('end-date').reset();
       }
  }

  convertStartDateFormat(event){
      this.ShowStartDateMsg = false;
      let startdate =    moment(event.value)
      let enddate =   moment(this.group.get('end-date').value)
         if(startdate > enddate){
          this.ShowStartDateMsg = true;
          this.group.get('start-date').reset();
         }
  }

  bindValidations(validationRequired = null, validationRegexmatch = null) {
    if(validationRequired === 'Y' || validationRegexmatch != '') {
      const validList = [];
      let tmpValidationRequired, tmpValidationRegexmatch;

      if(validationRequired === 'Y') {
        tmpValidationRequired = Validators.required;
        validList.push(tmpValidationRequired);
      }

      if(validationRegexmatch != '') {
        tmpValidationRegexmatch = Validators.pattern(validationRegexmatch);
        validList.push(tmpValidationRegexmatch);
      }
      return Validators.compose(validList);
    }
  }
}