import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: "app-autocomplete",
  template: `
    <div [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'" [formGroup]="group">
      <mat-form-field [ngClass]="fieldContent.extra_field_content.class" appearance="outline">
      <mat-label>{{field.field_label}}: </mat-label>
        <input 
          matInput 
          type="text" 
          [id]="fieldContent.extra_field_content.id"
          [formControlName]="field.field_name"
          [matAutocomplete]="auto">
        <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
          <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
            {{option}}
          </mat-option>
        </mat-autocomplete>
        <mat-error *ngIf="group.get(field.field_name).invalid && (group.get(field.field_name).dirty || group.get(field.field_name).touched)">Has errors</mat-error>
      </mat-form-field>
    </div>
    <div *ngIf="type == 'dynForm'" [formGroup]="group" class="all-entry-tag">
      <mat-form-field [ngClass]="field.content.extra_field_content.class" appearance="outline" class="w-100-p All-half-full">
      <mat-label>{{field.field_label}}: </mat-label>  
        <input 
          matInput 
          type="text" 
          [id]="field.content.extra_field_content.id"
          [formControlName]="field.caption"
          [matAutocomplete]="auto">
        <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
          <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
            {{option}}
          </mat-option>
        </mat-autocomplete>
        <mat-error *ngIf="group.get(field.caption).invalid && (group.get(field.caption).dirty || group.get(field.caption).touched)">{{field.error_msg}}</mat-error>
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

export class AutocompleteComponent implements OnInit {
  
  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    if(this.type == 'field' || this.type == 'resident'){
      this.fieldContent = JSON.parse(this.field.field_content);
      this.createControl();
    }
   
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  createControl() {
    let defaultValue = (this.field.field_value) ? this.field.field_value : this.fieldContent.extra_field_content.defaultValue;
    let residentType = (this.type == 'resident' ? '' : this.field.field_required);
    const control = this.fb.control(
      defaultValue,
      this.bindValidations(residentType, '')
    );
    this.group.addControl(this.field.field_name, control);
    this.filteredOptions = this.group.get(this.field.field_name).valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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