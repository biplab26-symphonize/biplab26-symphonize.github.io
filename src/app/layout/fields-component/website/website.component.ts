import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'app/_services';

@Component({
  selector: 'app-website',
  template: `
  <div [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'">
  <mat-form-field class="w-100-p" [ngClass]="fieldContent.extra_field_content.class" [formGroup]="group" appearance="outline" fxFlex="auto">
  <mat-label>{{field.field_label}}: </mat-label>
    <input matInput
     [id]="fieldContent.extra_field_content.id"
     [formControlName]="field.field_name"
     [placeholder]="field.field_label"
     [readonly]="fieldContent.extra_field_content.readonly === 'Y'"
     (change)="setEmitValue(field.id,$event)">
    <mat-error *ngIf="group.get(field.field_name).invalid && (group.get(field.field_name).dirty || group.get(field.field_name).touched)">
    {{fieldContent.extra_field_content.error_msg}}
    </mat-error>
  </mat-form-field>
</div>

<div  *ngIf="type == 'dynForm'" class="all-entry-tag">
  <mat-form-field class="All-half-full w-100-p"  [ngClass]="field.content.extra_field_content.class" [formGroup]="group" appearance="outline">
  <mat-label>{{field.description}}: </mat-label>
    <input matInput
     [id]="field.content.extra_field_content.id"
     [formControlName]="field.caption"
     [type]="field.field_type"
     pattern="https?://.+"
     [maxlength]="field.content.extra_field_content.maximum_size"
     [readonly]="field.content.extra_field_content.readonly === 'Y'">
    <mat-error *ngIf="group.get(field.caption).error?.pattern && (group.get(field.caption).dirty || group.get(field.caption).touched)">{{field.error_msg}}</mat-error>
  </mat-form-field>
</div>
  `,
  styles: [`
  .all-entry-tag{
    max-width: 100%;
    margin:0 4px;
  }
`]
})
export class WebsiteComponent implements OnInit {

  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;
  pwdhide:boolean = true;
  showhide:boolean = false;
  @Output() filterMeta    = new EventEmitter<any>();
  constructor(private fb: FormBuilder,
    private _commonService:CommonService) {
  }

  ngOnInit() {
    if(this.type == 'field' || this.type == 'resident'){
      // console.log("this.field", this.field);
      this.fieldContent = JSON.parse(this.field.field_content);
      this.createControl();
    }   
    

  }

  createControl() {
    let defaultValue = (this.field.field_value) ? this.field.field_value : this.fieldContent.extra_field_content.defaultValue;
    
    let residentType = (this.type == 'resident') ? '' : this.field.field_required;
   
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
  setEmitValue(fieldId:number,event){
      let filterObj = {field_id:fieldId,field_value:event.target.value,field_type:this.field.field_type};
      this._commonService.filterMetaFields.next(filterObj);
  }
  ngOnDestroy()
  {
    this._commonService.filterMetaFields.next(null);
  }
}
