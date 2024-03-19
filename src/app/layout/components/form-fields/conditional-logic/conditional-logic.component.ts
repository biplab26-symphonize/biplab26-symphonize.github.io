import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-conditional-logic',
  templateUrl: './conditional-logic.component.html',
  styleUrls: ['./conditional-logic.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ConditionalLogicComponent implements OnInit {

  public ConditionalLogic: FormGroup;
  DefaultData = [];
  @Input() Fields = [];
  @Input() fieldData: any;
  @Output() FieldInfo = new EventEmitter<any>();
  public AllField: FormArray;
  public OptionList1: any = [];
  public OptionList2: any = [];
  public ShowField: boolean = false;
  public conditionLogic: any = [];
  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    // create the Control
    this.ConditionalLogic = this.fb.group({
      enable_conditional_logic: this.fb.control(''),
      show_hide: this.fb.control(''),
      all_any: this.fb.control(''),
      AllField: this.fb.array([this.createItem()]),
    })
    this.ShowDefalutValue(this.Fields)
  }

  // show the defalut data in select field
  ShowDefalutValue(Fields) {
    if(Fields){
      for (let i = 0; Fields.length > i; i++) {
        if (Fields[i].field_type != 'list' && Fields[i].field_type !== 'date' && Fields[i].field_type != 'time' && Fields[i].field_type != 'upload' && Fields[i].field_type != 'html') {
          this.DefaultData.push({ 'Field': Fields[i] })
        }
       }
      }
  
    //  set the default value to the selected field
    if (this.fieldData.conditional_logic != '' && this.fieldData.conditional_logic !== undefined && this.fieldData.conditional_logic != null) {
      this.ConditionalLogic.patchValue(this.fieldData.conditional_logic);
      this.ConditionalLogic.get('enable_conditional_logic').setValue(this.fieldData.conditional_logic.enable_conditional_logic == 'Y' ? true : false)
      this.AllField = this.ConditionalLogic.get('AllField') as FormArray;
      this.AllField.removeAt(0);
      let k = 0;
      this.fieldData.conditional_logic.Conditional_field.map((item, index) => {
        this.OptionList1 = [];
        this.conditionLogic[k] = 0;
        let flag = 0;
        Fields.find(items => {
          if ((items.field_label == item.field_label && item.field_label.replace(/\s/g, "") == 'Radio') || (items.field_label == item.field_label && item.field_label.replace(/\s/g, "") == 'Select') || (items.field_label == item.field_label && item.field_label.replace(/\s/g, "") == 'Check Box')) {
            this.OptionList1 = items.field_content.options;
            flag = 1;
            this.conditionLogic[k] = 1;
          }
        });
        if (flag == 1) {
          this.OptionList2[k] = this.OptionList1;
        } else {
          this.OptionList2[k] = '';
        }

        k = k + 1;
        const tempObj = {};
        tempObj['field_label'] = new FormControl(item.field_label);
        tempObj['condition'] = new FormControl(item.condition);
        tempObj['field_id'] = new FormControl(item.field_id);
        tempObj['field_value'] = new FormControl(item.field_value);
        this.AllField = this.ConditionalLogic.get('AllField') as FormArray;
        this.AllField.push(this.fb.group(tempObj));
      });
      this.submitListFieldForm();
    }

  }


  createItem() {
    return this.fb.group({
      field_label: [''],
      field_id: [''],
      condition: [''],
      field_value: ['']

    })

  }

  OnselectLable(event, index) {
    this.OptionList1 = [];
    this.conditionLogic[index] = 0;
    let flag = 0;
    this.Fields.find(item => {
      if ((item.field_label == event.value && item.field_type == 'radio') || (item.field_label == event.value && item.field_type == 'select') || (item.field_label == event.value && item.field_type == 'checkbox')) {
        this.OptionList1 = item.field_content.options;
        flag = 1;
        this.conditionLogic[index] = 1;
      }
    });
    if (flag == 1) {
      this.OptionList2[index] = this.OptionList1;
    } else {
      this.OptionList2[index] = '';
    }
    this.submitListFieldForm();
  }

  onAddSelectRow() {

    this.AllField = this.ConditionalLogic.get('AllField') as FormArray;
    this.AllField.push(this.createItem());
  }

  onRemoveRow(index) {
    this.AllField.removeAt(index)
    this.submitListFieldForm();
  }


  getControls() {
    return (this.ConditionalLogic.get('AllField') as FormArray).controls;
  }

  // submit the form on every field change
  submitListFieldForm() {
    let value = this.ConditionalLogic.value;
    let tmpArray = [];

    for (let j = 0; this.Fields.length > j; j++) {
      for (let i = 0; i < value.AllField.length; i++) {
        if (value.AllField[i].field_label != '' && value.AllField[i].field_label == this.Fields[j].field_label) {
          tmpArray.push({
            field_id: this.Fields[j].id, field_label: value.AllField[i].field_label,
            condition: value.AllField[i].condition, field_value: value.AllField[i].field_value
          });
        }
      }
    }
    let FieldData = {
      enable_conditional_logic: value.enable_conditional_logic == true ? 'Y' : 'N',
      show_hide: value.show_hide,
      all_any: value.all_any,
      Conditional_field: tmpArray,
    }
    this.FieldInfo.emit(FieldData);
    tmpArray = [];
  }

}
