import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { CommonService } from 'app/_services';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styles: []
})
export class CheckboxComponent implements OnInit {

  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;
  checkeditem: any = [];
  Checkeditems: any = [];

  constructor(private fb: FormBuilder,
    private commonservice: CommonService) {
  }

  ngOnInit() {

    if (this.type == 'field' || this.type == 'resident') {
      setTimeout(() => {
        this.fieldContent = JSON.parse(this.field.field_content);
        this.createControl();
      }, 0);
    }
    if (this.type == 'dynForm') {
      let FieldArray = [];
      FieldArray = this.createStaticInput(this.field);
      let isRequired = this.field.required == 'Y' ? Validators.required : null;
      this.group.addControl(this.field.form_element_id, new FormArray(FieldArray, Validators.compose([isRequired])))
      this.group.controls[this.field.form_element_id].markAllAsTouched();
    }
  }
  //CALL CHECKBOX UPDATE FUNCTION IF USER DONT CLICK ON CHECKBOX
  ngAfterViewInit(){
    if(this.field && this.field.content.options && this.group.controls[this.field.form_element_id]){
      let fieldChecked = false;
      this.field.content.options.forEach((element,index) => {
        if(this.field.entryinfo.form_element_value){
          let savedfieldValueArray = this.field.entryinfo.form_element_value.split(",") || [];
          fieldChecked = savedfieldValueArray.includes(element.value) ? true : false;
        }
        this.updateCheckboxValues(element.value, fieldChecked, this.field.form_element_id);
      });
    }
  }
  isChecked(key) {
    //  Stored  the selected data in array
    if (this.fieldContent.extra_field_content.dafaultValue != "" && this.fieldContent.extra_field_content.dafaultValue != undefined) {
      return JSON.parse(this.fieldContent.extra_field_content.dafaultValue).some(item => item.value == key);
    }
  }

  createControl() {
    let defaultValue = (this.field.field_value) ? this.field.field_value : this.fieldContent.extra_field_content.dafaultValue;
    let residentType = (this.type == 'resident' ? '' : this.field.field_required);
    const control = this.fb.control(
      defaultValue,
      this.bindValidations(residentType, this.field.field_pregmatch)
    );
    this.group.addControl(this.field.field_name, control);
  }

  bindValidations(validationRequired = null, validationRegexmatch = null) {
    if (validationRequired === 'Y' || validationRegexmatch != '') {
      const validList = [];
      let tmpValidationRequired, tmpValidationRegexmatch;

      if (validationRequired === 'Y') {
        tmpValidationRequired = Validators.requiredTrue;
        validList.push(tmpValidationRequired);
      }

      if (validationRegexmatch != '') {
        tmpValidationRegexmatch = Validators.pattern(validationRegexmatch);
        validList.push(tmpValidationRegexmatch);
      }
      return Validators.compose(validList);
    }
  }
  checkboxselect(event, value, form_element_id, caption) {
    let flag = 0;
    let k = 0;
    for (let i = 0; i < this.checkeditem.length; i++) {
      if (this.checkeditem[i].value == value) {
        flag = 1;
        k = i;
      }
    }
    if (flag == 0) {
      this.checkeditem.push({ "form_element_id": form_element_id, "value": value });
    } else {
      this.checkeditem.splice(k, 1);
    }

    this.commonservice.setdynamicdata(JSON.stringify(this.checkeditem));
  }
  //FORM CHECKBOX FIELD FUNCTIONS
  //create static checkboxes
  createStaticInput(metaField: any) {
    let controls = [];
    if (metaField.content.options) {
      controls = metaField.content.options.map(item => {
        let fieldChecked = false;
        if (metaField.entryinfo && metaField.entryinfo.form_element_value != '' && metaField.entryinfo.form_element_value != undefined && metaField.form_element_id == metaField.entryinfo.form_element_id) {
          let savedfieldValueArray = metaField.entryinfo.form_element_value.split(",") || [];
          fieldChecked = savedfieldValueArray.includes(item.value) ? true : false;
        }
        return new FormControl(fieldChecked);
      });
      return controls;
    }

  }

  updateCheckboxValues(id, isChecked, key) {
    let fieldId = key.toString();
    const chkArray = this.group.get(fieldId) as FormArray;
    let find = chkArray.controls.find(item => { return item.value == true });
    if (find == undefined && this.group.controls[fieldId].validator != null) {
      this.group.controls[fieldId].setErrors({required:true});
      this.group.controls[fieldId].markAllAsTouched();
    }
    let metaValues = [];
    let fieldmetaValues = [];
    let formvalues = this.group.value;
    Object.keys(formvalues).map(function (key) {
      let fieldValue = Array.isArray(formvalues[key]) ? formvalues[key].join(",") : formvalues[key];
      metaValues.push({ field_id: key, field_value: fieldValue });
    });
    let checkfield;
    fieldmetaValues = metaValues.filter(item => { return parseInt(item.field_id) == this.field.form_element_id })
    if (this.field.field_type == 'checkbox') {
      checkfield = fieldmetaValues.find(item => { return parseInt(item.field_id) == this.field.form_element_id });
      if (checkfield && checkfield.field_value) {
        checkfield.field_value = checkfield.field_value.split(',');
        const selectedPreferences = checkfield.field_value
          .map((checked, index) => {
            return checked == 'true' ? this.field.content.options[index].value : null;
          })
          .filter(value => value !== null);
        checkfield.field_value = Array.isArray(selectedPreferences) ? selectedPreferences.join(',') : "";
      }
    }
    //ARRAY Of Checkboxes with actual Values
    this.Checkeditems = { ...checkfield };
    this.commonservice.setcheckboxdata(this.Checkeditems);
  }
}