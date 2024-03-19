import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CommonUtils } from 'app/_helpers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EventbehavioursubService } from 'app/_services';

@Component({
  exportAs: "dynamicForm",
  selector: "dynamic-form",
  template: `     
  <form  class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)" autocomplete="off">
    <div class="inner-form-div">
      <ng-container  *ngFor="let field of fields;" dynamicField [field]="field" [group]="form" type="dynForm">
      </ng-container>
    </div>
  </form>
  `,
  styles: []
})
export class DynamicFormComponent implements OnInit {

  @Input() fields: any = [];
  @Output() submitdata: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  private _unsubscribeAll: Subject<any>;
  listformInValid: boolean = false;
  checkformInValid: boolean = false;

  get value() {
    return this.form.value;
  }

  constructor(
    private fb: FormBuilder,
    private eventbehavioursub: EventbehavioursubService,) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.form = this.createControl(); 
    //IF FORM INCLUDES LIST FIELD THEN APPLY VALIDATION
    this.eventbehavioursub.listFieldsLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.listformInValid = response;
      });
    //IF FORM INCLUDES CHECKBOX FIELD THEN APPLY VALIDATION
    this.eventbehavioursub.checkFieldsLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.checkformInValid = response;
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();    
    if (this.form.valid && this.listformInValid==false && this.checkformInValid==false) {
      this.submitdata.emit(this.form);
    } 
    else {
      //list field validation
      this.eventbehavioursub.listFieldsValidate.next(true);
      this.eventbehavioursub.checkFieldsValidate.next(true);
      CommonUtils.validateAllFormFields(this.form);
    }
  }

  createControl() {    
    const group = this.fb.group({});
    this.fields.forEach(field => { 
      // if (field.fields.field_type === "button") return;
      if (field.field_type === "list" || field.field_type === "checkbox") return;
      const control = this.fb.control(
        field.content.extra_field_content.dafaultValue,
        this.bindValidations(field.required, field.regexmatch)
      );
      group.addControl(field.caption, control);
    });
    return group;
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
    return null;
  }
}
