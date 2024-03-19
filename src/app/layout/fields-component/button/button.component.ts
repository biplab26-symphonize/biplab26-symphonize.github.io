import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-button",
  template: `
    <div  [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'" [formGroup]="group">
      <button 
        mat-raised-button
        color="primary"
        [type]="fieldContent.extra_field_content.type"
        [id]="fieldContent.extra_field_content.id"
        [ngClass]="fieldContent.extra_field_content.class" >{{field.field_label}}</button>
    </div>
    <div *ngIf="type == 'dynForm'" class="All-half-full w-100-p all-entry-tag">
      <button 
        mat-raised-button
        color="primary"
        [type]="field.content.extra_field_content.type"
        [id]="field.content.extra_field_content.id"
        [ngClass]="field.content.extra_field_content.class" >{{field.description}}</button>
    </div>
  `,
  styles: [`
  .all-entry-tag{
    max-width: 100%;
    margin:0 4px;
  }
`] 
})

export class ButtonComponent implements OnInit {
  
  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;
  isSubmit : boolean = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if(this.type == 'field' || this.type == 'resident'){
      this.fieldContent = JSON.parse(this.field.field_content);
      this.createControl();
    }
  }

  createControl() {
    const control = this.fb.control(
      this.fieldContent.extra_field_content.defaultValue,
      this.bindValidations('', '')
    );
    this.group.addControl(this.field.field_name, control);
  }

  bindValidations(validationRequired = null, validationRegexmatch = null) {
    if(validationRequired === 'Y' || validationRegexmatch != '') {
      const validList = [];
      let tmpValidationRequired, tmpValidationRegexmatch;

      if(validationRequired === 'Y') {
        this.isSubmit = false;
        tmpValidationRequired = Validators.required;
        validList.push(tmpValidationRequired);
      }

      if(validationRegexmatch != '') {
        this.isSubmit = false;
        tmpValidationRegexmatch = Validators.pattern(validationRegexmatch);
        validList.push(tmpValidationRegexmatch);
      }
      return Validators.compose(validList);
    }
  }
}