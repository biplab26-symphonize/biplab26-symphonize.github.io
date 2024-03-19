import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-html',
  template: `
 
`,
  styles: []
})
export class HtmlComponent implements OnInit {
  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;
  @Output() filterMeta    = new EventEmitter<any>();
  public tinyMceSettings = {};

  constructor(private fb: FormBuilder,
    private _commonService:CommonService) {
  }


  ngOnInit() {

     this.tinyMceSettings = CommonUtils.getTinymceSetting();
    if(this.type == 'field' || this.type == 'resident'){
      this.fieldContent = JSON.parse(this.field.field_content);
      this.createControl();
    }  
    if(this.type == 'dynForm'){
      this.fieldContent = this.field.content;
      this.createControl();
      // this.fieldContent.extra_field_content.defaultValue  = this.fieldContent.extra_field_content.dafaultValue;

    }  
  }

  createControl() {
    let content = (this.field.field_value) ? this.field.field_value : this.fieldContent.extra_field_content.defaultValue;
    
    let residentType = (this.type == 'resident') ? '' : this.field.field_required;
   
    const control = this.fb.control(
      content,
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
    this.fieldContent.extra_field_content.content = this.fieldContent.extra_field_content.dafaultValue;
       let filterObj = {field_id:fieldId,field_value:this.fieldContent.extra_field_content.dafaultValue,field_type:this.field.field_type};
       this._commonService.filterMetaFields.next(filterObj);
  }
  ngOnDestroy()
  {
    this._commonService.filterMetaFields.next(null);
  }
  

}
