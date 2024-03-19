import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-radiobutton',
  template: `
    <div  [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'">
      <div [ngClass]="fieldContent.extra_field_content.class"  [formGroup]="group">
      <mat-label class="font-weight-600">{{field.field_label}} : </mat-label>
        <mat-radio-group
          [id]="fieldContent.extra_field_content.id"
          [formControlName]="field.field_name">
          <mat-radio-button *ngFor="let item of fieldContent.options" [value]="item.key" class="mr-8 mb-20">{{item.value}}</mat-radio-button>
          <mat-error *ngIf="group.get(field.field_name).invalid && (group.get(field.field_name).dirty || group.get(field.field_name).touched)">
            {{fieldContent.extra_field_content.error_msg}}
          </mat-error>
        </mat-radio-group>
      </div>
    </div>
    <div *ngIf="type == 'dynForm'" class="all-entry-tag">
      <div [ngClass]="field.content.extra_field_content.class"  [formGroup]="group" class="All-half-full  w-100-p" >
      <mat-label class="font-weight-600">{{field.description}} : </mat-label>
        <mat-radio-group
          [id]="field.content.extra_field_content.id"
          [formControlName]="field.caption">
          <mat-radio-button *ngFor="let item of field.content.options" [value]="item.key" class="mr-8 mb-20">{{item.value}}</mat-radio-button>
          <mat-error *ngIf="group.get(field.caption).invalid && (group.get(field.caption).dirty || group.get(field.caption).touched)">{{field.error_msg}}</mat-error>
        </mat-radio-group>
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
export class RadiobuttonComponent implements OnInit {
  
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
  }

  createControl() {
    let defaultValue = (this.field.field_value) ? this.field.field_value : this.fieldContent.extra_field_content.defaultValue;
    let residentType = (this.type == 'resident' ? '' : this.field.field_required)
    const control = this.fb.control(
      defaultValue,
      this.bindValidations(residentType, this.field.field_pregmatch)
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
