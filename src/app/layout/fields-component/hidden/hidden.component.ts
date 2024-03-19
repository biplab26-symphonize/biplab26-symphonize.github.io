import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-input",
  template: `
    <div [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'">
      <div [ngClass]="fieldContent.extra_field_content.class" [formGroup]="group">
        <input 
          [id]="fieldContent.extra_field_content.id"
          [formControlName]="field.field_name"
          type="hidden"
          [value]="fieldContent.extra_field_content.defaultValue">
      </div>
    </div>
    <div *ngIf="type == 'dynForm'" class="all-entry-tag">
      <div [ngClass]="field.content.extra_field_content.class" [formGroup]="group" class="w-100-p All-half-full">
        <input 
          [id]="field.content.extra_field_content.id"
          [formControlName]="field.caption"
          type="hidden"
          [value]="field.content.extra_field_content.defaultValue">
      </div>
    </div>
  `,
  styles: [`
    .all-entry-tag{
      max-width: 100%;
      margin:0 4px;
    }
  `]
})

export class HiddenComponent implements OnInit {  

  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    if(this.type == 'field' || this.type == 'resident'){
      this.fieldContent = JSON.parse(this.field.field_content);
      this.createControl();
    }
    if(this.type == 'dynForm'){
      this.fieldContent = this.field.content;
      console.log(this.fieldContent.extra_field_content.defaultValue);
      this.createControl();

    }
  }

  createControl() {
    let defaultValue = (this.field.field_value) ? this.field.field_value : this.fieldContent.extra_field_content.defaultValue;
    let residentType = (this.type == 'resident' ? '' : this.field.field_required)
    const control = this.fb.control(
      defaultValue,
      this.bindValidations(residentType, '')
    );
    this.group.addControl(this.field.field_name, control);
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