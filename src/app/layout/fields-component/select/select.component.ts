import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from 'app/_services';

@Component({
  selector: 'app-select',
  template: `
  <div [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="fieldContent && (type == 'field' || type == 'resident')">
      
    <mat-form-field class="w-100-p" [ngClass]="fieldContent.extra_field_content.class" [formGroup]="group" appearance="outline">
    <mat-label>{{field.field_label}}</mat-label>
    <mat-select
        [id]="fieldContent.extra_field_content.id"
        [formControlName]="field.field_id"
        [multiple]="fieldContent.extra_field_content.multiselect == 'Y'"
        (selectionChange)="setEmitValue(field.id,$event)">
          <mat-option *ngFor="let item of fieldContent.options" [value]="item.key">{{item.value}}</mat-option>
      </mat-select>

    </mat-form-field>
  </div>
  <div *ngIf="type == 'dynForm'" class="all-entry-tag">
    <mat-form-field class="All-half-full  w-100-p"  [ngClass]="field.content.extra_field_content.class" [formGroup]="group" appearance="outline">
    <mat-label>{{field.description}}</mat-label>
    <span *ngIf="field.content.extra_field_content.multiselect == 'N'">
       <mat-select
        [id]="field.content.extra_field_content.id"
         [formControlName]="field.form_element_id">
          <mat-option *ngFor="let item of field.content.options" [value]="item.key">{{item.value}}</mat-option>
      </mat-select> 
      </span>
      <span *ngIf="field.content.extra_field_content.multiselect == 'Y'" class="w-100-p">
       <mat-select
           [id]="field.content.extra_field_content.id"
           [(ngModel)] ="multiselected "  [ngModelOptions]="{standalone: true}"
           [multiple]="fieldContent.extra_field_content.multiselect == 'Y'"  
           (selectionChange)="multiplaSelectedValue($event,field.form_element_id)" >
            <mat-option *ngFor="let item of field.content.options" [value]="item.key">{{item.value}}</mat-option>
       </mat-select>
       </span>
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

export class SelectComponent implements OnInit {
  
  field: any;
  group: FormGroup;
  type: string;
  multipalselected :any =[];
  multiselected :any;
  fieldContent: any;
  @Output() filterMeta    = new EventEmitter<any>();
  
  constructor(private fb: FormBuilder,
    private _commonService:CommonService) {
  }

  ngOnInit() {
    if(this.type == 'field' || this.type == 'resident'){
    
        this.fieldContent = JSON.parse(this.field.field_content);
        this.createControl();
    }   
    if(this.type == 'dynForm'){
        this.fieldContent = this.field.content;
        this.fieldContent.extra_field_content.defaultValue = this.fieldContent.extra_field_content.dafaultValue;
        if(this.fieldContent.extra_field_content.multiselect == 'Y' && this.fieldContent.extra_field_content.defaultValue != "" && this.fieldContent.extra_field_content.defaultValue != undefined){
          this.multiselected =   this.fieldContent.extra_field_content.defaultValue.split(',')
        }
        this.createControl();
       
    }  
  }

  createControl() {
    let defaultValue
    if(this.fieldContent.extra_field_content.multiselect == 'N'){
      defaultValue= (this.field.field_value) ? this.field.field_value : this.fieldContent.extra_field_content.defaultValue;
    }
    let residentType = (this.type == 'resident' ? '' : this.field.field_required);
    const control = this.fb.control(
       defaultValue,
      this.bindValidations(residentType, this.field.field_pregmatch)
    );
    this.group.addControl(this.field.form_element_id, control);    
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
  //DETECT CHANGES
  setEmitValue(fieldId:number,$event:any){
    if($event.value){
      let filterObj = {field_id:fieldId,field_value:$event.value,field_type:this.field.field_type};
      this._commonService.filterMetaFields.next(filterObj);
    }
  }

  //  the multiselcetd mode 
    multiplaSelectedValue($event,id){
      let data= {
      'form_value':$event.value.join(),
      'id':id
      }
      this._commonService.setdynamicdata(data);  
  }
  ngOnDestroy()
  {
    this._commonService.filterMetaFields.next(null);
  }
}