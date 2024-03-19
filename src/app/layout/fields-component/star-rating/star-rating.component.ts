import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StarRatingComponent } from 'ng-starrating';

@Component({
  selector: "app-star-rating",
  template: ` <div  [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'">
               <label>{{field.field_label}}: </label>
                <star-rating 
                  [value]="fieldContent.extra_field_content.dafaultValue" 
                  [checkedcolor]="fieldContent.extra_field_content.checkedcolor" 
                  [uncheckedcolor]="fieldContent.extra_field_content.uncheckedcolor" 
                  size="24px" 
                  [readonly]="fieldContent.extra_field_content.readonly === 'Y'" 
                  (rate)="onRate($event)">
                </star-rating>  
              </div>
              <div  *ngIf="type == 'dynForm'" class="all-entry-tag">
                <star-rating 
                class="All-half-full mb-8 w-100-p" 
                  [value]="field.content.extra_field_content.dafaultValue" 
                  [checkedcolor]="field.content.extra_field_content.checkedcolor" 
                  [uncheckedcolor]="field.content.extra_field_content.uncheckedcolor" 
                  size="24px" 
                  [readonly]="field.content.extra_field_content.readonly === 'Y'" 
                  (rate)="onRate($event)">
                  </star-rating>        
              </div>
  `,
  styles: [`
            .all-entry-tag{
              max-width: 100%;
              margin:0 4px;
            }
          `]
})

export class RatingComponent implements OnInit {
  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    if(this.type == 'field' || this.type == 'resident'|| this.type=='dynForm'){
      this.fieldContent = Array.of(this.field);
      this.createControl();
    }    
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    let caption = this.field.field_name ? this.field.field_name : this.field.caption;
    this.group.get(caption).setValue($event.newValue);
  }

  createControl() {
    let dafaultValue = (this.field.field_value) ? this.field.field_value : this.fieldContent[0].content.extra_field_content.dafaultValue;
    let residentType = (this.type == 'resident' ? '' : this.field.field_required);
    const control = this.fb.control(
      dafaultValue,
   
      this.bindValidations(this.field.field_required, this.field.field_pregmatch)
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