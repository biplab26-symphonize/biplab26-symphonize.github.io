import {Component,OnInit,ViewChild,Inject,ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormArray,FormBuilder,Validators,FormControl} from '@angular/forms';
import {DynamicFormComponent} from 'app/layout/fields-component/dynamic-form/dynamic-form.component';
import {fuseAnimations} from '@fuse/animations';
import {OptionsList,RolesService} from 'app/_services';
import {SlugifyPipe} from '@fuse/pipes/slugify.pipe';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class FormFieldsComponent implements OnInit {

  public selectOptions: {
      [key: number]: any
  } = {};
  public customTime: boolean = false; //Disable custom inputs for time field discuss @mrnl on 1082020
  public optionsForm: FormGroup;
  public field_content: FormArray;
  public extra_field_content: FormArray;
  public dbsettings_field: FormArray;
  public list_field_content: FormArray;
  public keysFormFieldData: any = [];
  public currentUser: any;
  public columnClass: any;
  public listFieldTypes: any;
  public maskingPatterns: any;
  public fieldDataById: any;
  public dynamicField: {};
  public tabletype: string;
  public dynamicFieldType: [];
  public FormTypeList: [];
  public fieldType: [];
  public user_data: [];
  public field_id: number = 0;
  public title: string = '';
  public dateformat :any;
  public eventhaveAttendees: boolean = false;
  public tinyMceSettings = {};
  public conditional_logic_data;
  public fieldData;
  public AllField :any ;



  @ViewChild(DynamicFormComponent, {
      static: true
  }) form: DynamicFormComponent;
  //  fieldConfig: FieldConfig[];
  fieldConfig: any;

  constructor(
      public dialogRef: MatDialogRef < FormFieldsComponent > ,
      private fb: FormBuilder,
      private _rolesService: RolesService,
      private slugifyPipe: SlugifyPipe,
      @Inject(MAT_DIALOG_DATA) public data: any) {

          //Get All Field Data 
       this.AllField = this.data.AllFieldData;
       this.fieldData = this.data.FormFieldData;
      this.field_content = this.fb.array([]);
      this.extra_field_content = this.fb.array([]);
      this.dbsettings_field = this.fb.array([]);
      this.list_field_content = this.fb.array([]);
      this.tinyMceSettings = CommonUtils.getTinymceSetting();

      this.currentUser = JSON.parse(localStorage.getItem('token'));
      this.columnClass = OptionsList.Options.columnClass;
      this.listFieldTypes = OptionsList.Options.listFieldTypes;
      //Masking options
      this.maskingPatterns = OptionsList.Options.maskingPatterns;
      // DynamicFields
      this.dynamicField = OptionsList.Options.dynamicfields;
      this.dynamicFieldType = OptionsList.Options.fieldtype.dynamictype;
      this.FormTypeList = OptionsList.Options.tables.formtype.fields;
      this.columnClass = OptionsList.Options.columnClass;
      this.dateformat       = OptionsList.Options.dateformat;

  }


  selectionChange(event) {
      this.tabletype = event.value;
  }
  ngOnInit() {

    ////////////   access the roleservice for usersdata////////////// 
    if(!this.data){
        this._rolesService.getRoles({
            data: "data"
        }).then(result => {
            this.user_data = result.data;
        });
    }
      let formField = {
          ...this.data.FormFieldData
      };
      if (this.data.type != "confirm") {
          // this.keysFormFieldData = Object.keys(this.data.FormFieldData);
      }
      if (this.data.type == 'show_form') {
          this.fieldConfig = [...this.data.FormFieldData.formfields];
      } else if (this.data.type == 'recurringUpdate') {
        //If Event Have Attendees then show message
        this.eventhaveAttendees = this.data.eventAttendees.length > 0 ? true : false;  
        this.optionsForm = this.fb.group({
            recType: this.fb.control('C', [Validators.required])
        });
      } else if (this.data.type == 'eventStatusUpdate') {
          this.optionsForm = this.fb.group({
              flag: this.fb.control('C', [Validators.required])
          });
      } else if (this.data.type == 'eventRestore') {
          this.optionsForm = this.fb.group({
              flag: this.fb.control('C')
          });
      } else if (this.data.type == 'eventDelete') {
          this.optionsForm = this.fb.group({
              flag: this.fb.control('C')
          });
      }else if (this.data.type == 'recurringUpdateBooking') {
        this.optionsForm = this.fb.group({
            recUpdateBooking: this.fb.control('', [Validators.required])
        });
      }else {
          let tmpErrorMsg = '';
          if (formField.error_msg != undefined && formField.error_msg!=='') {
              tmpErrorMsg = formField.error_msg;
          } else {
              if (formField.field_content) {
                  if (formField.field_content.extra_field_content != undefined) {
                      tmpErrorMsg = formField.field_content.extra_field_content.error_msg;
                  }
              }
          }
        
          this.optionsForm = this.fb.group({
             
              id: this.fb.control(formField.id, [Validators.required]),
              field_form_type: this.fb.control(formField.field_form_type, [Validators.required]),
              form_element_id: this.fb.control(formField.form_element_id || ''),
            //   inpdf:this.fb.control(formField.inpdf, [Validators.required]),
              field_type: this.fb.control(formField.field_type, [Validators.required]),
              field_label: this.fb.control(formField.field_label, [Validators.required]),
              field_name: this.fb.control(formField.field_name, [Validators.required]),
              field_pregmatch: this.fb.control(formField.field_pregmatch),
              field_required: this.fb.control(formField.field_required),
              field_validation: this.fb.control(formField.field_validation),
              error_msg: this.fb.control(tmpErrorMsg),
              show_field : this.fb.control(''),
              current_date : this.fb.control(''),
              conditional_logic : this.fb.control('')
          });
          if (formField.field_type && formField.field_type != '') {
              this.onChangeFieldType(formField.field_type);
          }
      }
  }
  onChangeFieldType(event) {
      let fieldsForm_Data = {
          ...this.data.FormFieldData
      };
      if (fieldsForm_Data.field_content) {
          for (var i = fieldsForm_Data.field_content.length - 1; i >= 0; i--) {
              this.field_content.removeAt(i);
          }
      }

      if (fieldsForm_Data.extra_field_content) {
          for (var i = fieldsForm_Data.extra_field_content.length - 1; i >= 0; i--) {
              this.extra_field_content.removeAt(i);
          }
      }
      if (fieldsForm_Data.dbsettings_field) {
          for (var i = fieldsForm_Data.dbsettings_field.length - 1; i >= 0; i--) {
              this.dbsettings_field.removeAt(i);
          }
      }



      if (event == 'textarea' || event == 'text' || event =='hidden'  || event == 'password' || event == 'number' || event == 'email' || event == 'dynamic') {
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl(fieldsForm_Data.field_validation, new FormControl(null));
          this.optionsForm.addControl(fieldsForm_Data.field_validation.field_pregmatch, new FormControl(null));
          this.optionsForm.addControl('field_content', this.field_content);
          this.extra_field_content.push(this.fb.group({
              dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
              col_class: this.fb.control(field_contentData.extra_field_content.col_class),
              inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
              isMail: this.fb.control(field_contentData.extra_field_content.isMail),
              class: this.fb.control(field_contentData.extra_field_content.class),
              id: this.fb.control(field_contentData.extra_field_content.id),
              maximum_size :this.fb.control(field_contentData.extra_field_content.maximum_size),
              autopopulate :this.fb.control(field_contentData.extra_field_content.autopopulate),
              autocomplete : this.fb.control(field_contentData.extra_field_content.autocomplete),
              autofill :this.fb.control(field_contentData.extra_field_content.autofill || 'N'),
              send_email : this.fb.control(field_contentData.extra_field_content.send_email ),
              //MASKING STARTS
              ismasking: this.fb.control(field_contentData.extra_field_content.ismasking || 'N'),
              maskingpattern: this.fb.control(field_contentData.extra_field_content.maskingpattern || ""),
              field_current_value :  this.fb.control(field_contentData.extra_field_content.field_current_value ),
              //mASKING END
              field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
              field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
              view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
              view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
          }));
          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'rating') {
          let field_contentData = fieldsForm_Data.field_content;
          if(fieldsForm_Data.field_validation){
            this.optionsForm.addControl(fieldsForm_Data.field_validation, new FormControl(null));
            this.optionsForm.addControl(fieldsForm_Data.field_validation.field_pregmatch, new FormControl(null));
          }
          this.optionsForm.addControl('field_content', this.field_content);
          this.extra_field_content.push(this.fb.group({
              dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
              col_class: this.fb.control(field_contentData.extra_field_content.col_class),
              inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
              isMail: this.fb.control(field_contentData.extra_field_content.isMail),
              checkedcolor: this.fb.control(field_contentData.extra_field_content.checkedcolor),
              uncheckedcolor: this.fb.control(field_contentData.extra_field_content.uncheckedcolor),
              class: this.fb.control(field_contentData.extra_field_content.class),
              id: this.fb.control(field_contentData.extra_field_content.id),
              field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
              field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
                view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
              view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),

          }));
          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'checkbox') {
        let field_contentData = fieldsForm_Data.field_content;
        this.optionsForm.addControl('field_content', this.field_content);
        this.onAddExistingRow(field_contentData.options); // this.onAddSelectRow();

        this.extra_field_content.push(this.fb.group({
            dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
            col_class: this.fb.control(field_contentData.extra_field_content.col_class),
            inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
            isMail: this.fb.control(field_contentData.extra_field_content.isMail),
            class: this.fb.control(field_contentData.extra_field_content.class),
            id: this.fb.control(field_contentData.extra_field_content.id),
            field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
            field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
            show_label : this.fb.control(field_contentData.extra_field_content.show_label),
            viewentry_show_label :this.fb.control(field_contentData.extra_field_content.viewentry_show_label),
            viewentry_show_content :this.fb.control(field_contentData.extra_field_content.viewentry_show_content),
            view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
            view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),  
        }));
          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'dynamic') {
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content);
          this.dbsettings_field.push(this.fb.group({
              is_dynamic: this.fb.control(field_contentData.dbsettings.is_dynamic),
              table: this.fb.control(field_contentData.dbsettings.table),
              key: this.fb.control(field_contentData.dbsettings.key),
              value: this.fb.control(field_contentData.dbsettings.value),
              category_type: this.fb.control(field_contentData.dbsettings.category_type),
              show_as: this.fb.control(field_contentData.dbsettings.show_as),
              field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
              field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
              

          }));



          this.optionsForm.addControl('dbsettings', this.dbsettings_field);
      }


      if (event == 'date') {
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content);
          this.extra_field_content.push(this.fb.group({
              dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
              col_class: this.fb.control(field_contentData.extra_field_content.col_class),
              pickerType: this.fb.control(field_contentData.extra_field_content.pickerType),
              pastdate: this.fb.control(field_contentData.extra_field_content.pastdate),
              inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
              dateformat : this.fb.control(field_contentData.extra_field_content.dateformat),
              isMail: this.fb.control(field_contentData.extra_field_content.isMail),
              class: this.fb.control(field_contentData.extra_field_content.class),
              min_date : this.fb.control(field_contentData.extra_field_content.min_date),
              id: this.fb.control(field_contentData.extra_field_content.id),
              field_class : this.fb.control(field_contentData.extra_field_content.field_class),
              field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
              field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
              view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
              view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
              day_before :  this.fb.control(field_contentData.extra_field_content.day_before),
            }));
          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'upload') {
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content);
          this.extra_field_content.push(this.fb.group({
              fileType: this.fb.control(field_contentData.extra_field_content.fileType),
              col_class: this.fb.control(field_contentData.extra_field_content.col_class),
              dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
              inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
              isMail: this.fb.control(field_contentData.extra_field_content.isMail),
              class: this.fb.control(field_contentData.extra_field_content.class),
              id: this.fb.control(field_contentData.extra_field_content.id),
              field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
              field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
              view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
              view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
          }));
          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'website') {
        let field_contentData = fieldsForm_Data.field_content;
        this.optionsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this.fb.group({
            col_class: this.fb.control(field_contentData.extra_field_content.col_class),
            dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
            inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
            isMail: this.fb.control(field_contentData.extra_field_content.isMail),
            class: this.fb.control(field_contentData.extra_field_content.class),
            id: this.fb.control(field_contentData.extra_field_content.id),
            field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
            field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
            view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
            view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.optionsForm.addControl('extra_field_content', this.extra_field_content);
    }

      if (event == 'html') {
        let field_contentData = fieldsForm_Data.field_content;
        this.optionsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this.fb.group({
            fileType: this.fb.control(field_contentData.extra_field_content.fileType),
            col_class: this.fb.control(field_contentData.extra_field_content.col_class),
            dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
            inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
            isMail: this.fb.control(field_contentData.extra_field_content.isMail),
            class: this.fb.control(field_contentData.extra_field_content.class),
            id: this.fb.control(field_contentData.extra_field_content.id),
            content :this.fb.control(field_contentData.extra_field_content.content),
            field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
            field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
            view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
            view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.optionsForm.addControl('extra_field_content', this.extra_field_content);
    }

      if (event == 'signature') {
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content);
          this.extra_field_content.push(this.fb.group({
              dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
              col_class: this.fb.control(field_contentData.extra_field_content.col_class),
              class: this.fb.control(field_contentData.extra_field_content.class),
              pen_width: this.fb.control(field_contentData.extra_field_content.pen_width),
              canvas_width: this.fb.control(field_contentData.extra_field_content.canvas_width),
              canvas_height: this.fb.control(field_contentData.extra_field_content.canvas_height),
              inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
              isMail: this.fb.control(field_contentData.extra_field_content.isMail),
              field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
              field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
              view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
              view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),

          }));
          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'time') {   
        let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content); 
          this.extra_field_content.push(this.fb.group({
            dafaultValue : this.fb.control(field_contentData.extra_field_content.dafaultValue),
            col_class : this.fb.control(field_contentData.extra_field_content.col_class),
            class : this.fb.control(field_contentData.extra_field_content.class),  
            time_format : this.fb.control(field_contentData.extra_field_content.time_format),
            inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
              isMail: this.fb.control(field_contentData.extra_field_content.isMail),
            time_zone: this.fb.control(field_contentData.extra_field_content.time_zone),
            text_format : this.fb.control(field_contentData.extra_field_content.text_format), 
            time_field_class : this.fb.control(field_contentData.extra_field_content.time_field_class),
            field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
            field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
            view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
            view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
         
          }));
          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }
           

      if (event == 'select' || event == 'radio') {
          
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content);
          this.onAddExistingRow(field_contentData.options); // this.onAddSelectRow();

          if (event == 'radio') {
              this.extra_field_content.push(this.fb.group({
                  dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
                  col_class: this.fb.control(field_contentData.extra_field_content.col_class),
                  inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
                  isMail: this.fb.control(field_contentData.extra_field_content.isMail),
                  class: this.fb.control(field_contentData.extra_field_content.class),
                  id: this.fb.control(field_contentData.extra_field_content.id),
                  field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
                  field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
                  show_label : this.fb.control(field_contentData.extra_field_content.show_label),
                  viewentry_show_label :this.fb.control(field_contentData.extra_field_content.viewentry_show_label),
                  viewentry_show_content :this.fb.control(field_contentData.extra_field_content.viewentry_show_content),
                  view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
                  view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
              
                }));
          } else {
              this.extra_field_content.push(this.fb.group({
                  dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
                  col_class: this.fb.control(field_contentData.extra_field_content.col_class),
                  inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
                  isMail: this.fb.control(field_contentData.extra_field_content.isMail),
                  multiselect: this.fb.control(field_contentData.extra_field_content.multiselect),
                  class: this.fb.control(field_contentData.extra_field_content.class),
                  id: this.fb.control(field_contentData.extra_field_content.id),
                  field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
                  field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
                  view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
                  view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
              }));
          }

          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'autocomplete') {
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content);
          this.field_content.push(this.fb.group({
              onList: this.fb.control([field_contentData.options[0].onList], Validators.required)
          }));

          this.extra_field_content.push(this.fb.group({
              dafaultValue: this.fb.control(field_contentData.extra_field_content.dafaultValue),
              col_class: this.fb.control(field_contentData.extra_field_content.col_class),
              class: this.fb.control(field_contentData.extra_field_content.class),
              inpdf: this.fb.control(field_contentData.extra_field_content.inpdf),
              isMail: this.fb.control(field_contentData.extra_field_content.isMail),
              id: this.fb.control(field_contentData.extra_field_content.id),
              field_label_css_class : this.fb.control(field_contentData.extra_field_content.field_label_css_class),
              field_content_css_class : this.fb.control(field_contentData.extra_field_content.field_content_css_class),
              view_entry_field_label_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
              view_entry_field_content_css_class : this.fb.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
          }));

          this.optionsForm.addControl('extra_field_content', this.extra_field_content);
      }



      if (event == 'list') {
          let field_contentData = fieldsForm_Data.field_content;
          this.optionsForm.addControl('field_content', this.field_content);
          if (field_contentData[0]) {
              this.onAddExistingListRow(field_contentData);
          } else {
              this.onAddListRow();
          }
      }

  }




  onAddExistingRow(rowData) {
      for (var i = 0; i <= rowData.length - 1; i++) {
          this.field_content.push(this.updateItemFormGroup(rowData[i]));
      }
  }

  updateItemFormGroup(rowData) {
      return this.fb.group({
          key: this.fb.control(rowData.key, Validators.required),
          value: this.fb.control(rowData.value, Validators.required)
      });
  }

  onAddSelectRow() {
      this.field_content.push(this.createItemFormGroup());
  }

  /**Create Slug of Role name To save in role_key */
  slugifyMenuAlias() {
      this.optionsForm.get('field_label').setValue(this.optionsForm.get('field_label').value || "");
      this.optionsForm.get('field_name').setValue(this.slugifyPipe.transform(this.optionsForm.get('field_label').value) || "");
  }
  /////////// slug end here///////////  
  createItemFormGroup(): FormGroup {
      return this.fb.group({
          key: this.fb.control(null, Validators.required),
          value: this.fb.control(null, Validators.required)
      });
  }

  onRemoveRow(idx) {
      this.field_content.removeAt(idx);
  }

  onListSelectAddRow(selectidex, optidx) {
      this.selectOptions[selectidex].push({
          'key': '',
          'value': ''
      });
  }

  onChangeKeyValue(field, event, selectidex, optidx) {
      this.selectOptions[selectidex][optidx][field] = event.target.value;
  }

  onListSelectRemoveRow(selectidex, optidx) {
      this.selectOptions[selectidex].splice(optidx, 1);
  }

  onChangeListControl(event, index) {
      this.selectOptions[index] = [{
          'key': 'key11',
          'value': 'value11'
      }];
  }

  onAddListRow() {
      this.field_content.push(this.createListItemFormGroup());
  }

  onAddExistingListRow(rowData) {
      for (var i = 0; i <= rowData.length - 1; i++) {
          this.field_content.push(this.updateListItemFormGroup(rowData[i], i));
      }
  }

  updateListItemFormGroup(rowData, i) {
      if (rowData.field_type == 'select' || rowData.field_type == 'radio' || rowData.field_type == 'checkbox') {
          this.selectOptions[i] = rowData.field_content.options[0] ? rowData.field_content.options : [{
              'key': '',
              'value': ''
          }];
      }

      return this.fb.group({
         
          type: this.fb.control(rowData.field_type, Validators.required),
          name: this.fb.control(rowData.field_name, Validators.required),
          label: this.fb.control(rowData.field_label, Validators.required),
          col_class: this.fb.control(rowData.field_content.extra_field_content.col_class, Validators.required),
          class: this.fb.control(rowData.field_content.extra_field_content.class),
          id: this.fb.control(rowData.field_content.extra_field_content.id),
          defaultValue: this.fb.control(rowData.field_content.extra_field_content.dafaultValue),
          field_required: this.fb.control(rowData.field_required, Validators.required),
          allow_multiple :this.fb.control(rowData.field_content.extra_field_content.allow_multiple || 'N'),
          max_limit: this.fb.control(rowData.field_content.extra_field_content.max_limit || ''),
          autofill: this.fb.control(rowData.field_content.extra_field_content.autofill || 'N'),
          action_field: this.fb.control(rowData.field_content.extra_field_content.action_field || 'B'),
          maximum_size :this.fb.control(rowData.field_content.extra_field_content.maximum_size),
          autopopulate :this.fb.control(rowData.field_content.extra_field_content.autopopulate),
          inpdf: this.fb.control(rowData.inpdf, Validators.required),
          isMail: this.fb.control(rowData.inpdf, Validators.required),
          multiselect: this.fb.control(rowData.field_content.extra_field_content.multiselect),
          pregmatch: this.fb.control(rowData.field_pregmatch),
        //   time_format : this.fb.control(rowData.time_format),
          error_msg: this.fb.control(rowData.error_msg),
          pickerType: this.fb.control(rowData.field_content.extra_field_content.pickerType),
          pastdate: this.fb.control(rowData.field_content.extra_field_content.pastdate),
          multiplefield :this.fb.control(rowData.field_content.extra_field_content.multiplefield),
    
          //MASKING STARTS
          ismasking: this.fb.control(rowData.field_content.extra_field_content.ismasking || 'N'),
          maskingpattern: this.fb.control(rowData.field_content.extra_field_content.maskingpattern || ''),
          //MASKING ENDS
          time_format : this.fb.control(rowData.field_content.extra_field_content.time_format || 'twelve'),
          text_format  : this.fb.control(rowData.field_content.extra_field_content.text_format || 'dropdown'),
          time_zone    : this.fb.control(rowData.field_content.extra_field_content.time_zone || '')
          

      });
  }

  createListItemFormGroup(): FormGroup {
      return this.fb.group({
          type: this.fb.control('', Validators.required),
          name: this.fb.control('', Validators.required),
          label: this.fb.control('', Validators.required),
          col_class: this.fb.control('col-sm-12', Validators.required),
          class: this.fb.control(''),
          id: this.fb.control(''),
          defaultValue: this.fb.control(''),
          maximum_size : this.fb.control(''),
          autopopulate : this.fb.control(''),
          field_required: this.fb.control('Y', Validators.required),
          allow_multiple :this.fb.control('N'),
          max_limit :this.fb.control(''),
          autofill :this.fb.control('N'),
          action_field :this.fb.control('B'),
          inpdf: this.fb.control('Y', [Validators.required]),
          isMail: this.fb.control('Y', Validators.required),
          pregmatch: this.fb.control(''),
          error_msg: this.fb.control(''),
          pickerType: this.fb.control(''),
          pastdate: this.fb.control('N'),
          time_format :this.fb.control('twelve'),
          multiselect :this.fb.control('N'),
         
          //MASKING STARTS
          ismasking: this.fb.control('N'),
          maskingpattern: this.fb.control(''),
          //MASKING ENDS
        //   time_formats : this.fb.control(''),
          text_format  : this.fb.control('dropdown'),
          time_zone    : this.fb.control('select')


      });
  }

  onUpdateFieldClick() {
     
      let fieldData = this.optionsForm.value;
      if (fieldData.field_type == 'list') {
          let tmpContent = [...fieldData.field_content];
          let newFieldsData = [];
          for (var i = 0; i <= tmpContent.length - 1; i++) {
              let tmp_extra_field_content = {
                  'col_class': tmpContent[i].col_class,
                  'class': tmpContent[i].class,
                  'dafaultValue': tmpContent[i].defaultValue,
                  'id': tmpContent[i].id,
                  'allow_multiple' : tmpContent[i].allow_multiple,
                  'max_limit' :tmpContent[i].max_limit,
                  'autofill' :tmpContent[i].autofill,
                  'action_field' :tmpContent[i].action_field,                  
              };

              //If Max_limit is not null 
              if (tmpContent[i].max_limit && tmpContent[i].max_limit>0) {
                tmp_extra_field_content['max_limit'] = tmpContent[i].max_limit;
              }
              //AUTOFILL
              if (tmpContent[i].autofill && tmpContent[i].autofill>0) {
                tmp_extra_field_content['autofill'] = tmpContent[i].autofill;
              }
              //SELECT/BUTTON
              if (tmpContent[i].action_field && tmpContent[i].action_field>0) {
                tmp_extra_field_content['action_field'] = tmpContent[i].action_field;
              }
              //push masking attributes for phone and number
              if (tmpContent[i].type == 'number' || tmpContent[i].type == 'phone') {
                  tmp_extra_field_content['ismasking'] = tmpContent[i].ismasking;
                  tmp_extra_field_content['maskingpattern'] = tmpContent[i].maskingpattern;
              }
              
              if (tmpContent[i].type == 'date') {
                  tmp_extra_field_content['pickerType'] = tmpContent[i].pickerType;
                  tmp_extra_field_content['pastdate']   = tmpContent[i].pastdate;
              }
              if(tmpContent[i].type=='text'|| tmpContent[i].type =='textarea'){
                tmp_extra_field_content['maximum_size'] = tmpContent[i].maximum_size;
              }
              //AutoPopulate
              if(tmpContent[i].type=='text' || tmpContent[i].type =='textarea' || tmpContent[i].type =='email' || tmpContent[i].type =='number'){
                tmp_extra_field_content['autopopulate'] = tmpContent[i].autopopulate;
              }
              if(tmpContent[i].type == 'select'){
                tmp_extra_field_content['multiselect'] = tmpContent[i].multiselect;
              }

              if(tmpContent[i].type == 'time'){
                  tmp_extra_field_content['time_format']= tmpContent[i].time_format;
                  tmp_extra_field_content['text_format']= tmpContent[i].text_format;
                  tmp_extra_field_content['time_zone'] =  tmpContent[i].time_zone;
              }
              
              tmp_extra_field_content['field_required'] = tmpContent[i].field_required;
              
              newFieldsData.push({
                  'field_content': {
                      'options': this.selectOptions[i],
                      'extra_field_content': {
                          ...tmp_extra_field_content
                      },
                  },
                  'field_form_type': '',
                  'current_date' :'',
                  'show_field' : '',
                  'field_label': tmpContent[i].label,
                  'field_name': tmpContent[i].name,
                  'inpdf': tmpContent[i].inpdf,
                  'isMail': tmpContent[i].isMail,
                  'field_pregmatch': tmpContent[i].pregmatch,
                  'allow_multiple' : tmpContent[i].allow_multiple,
                  'max_limit' :tmpContent[i].max_limit,
                  'autofill' :tmpContent[i].autofill,
                  'action_field' :tmpContent[i].action_field,
                  'field_type': tmpContent[i].type,
                  'error_msg': tmpContent[i].error_msg,
                   'ismasking' : tmpContent[i].ismasking,
                   'maskingpattern': tmpContent[i].maskingpattern,
                   "dateformat"    : tmpContent[i].dateformat,
                   'time_format' :tmpContent[i].time_format,
                   'time_zone'   : tmpContent[i].time_zone,
                   'text_format' : tmpContent[i].text_format,
                  'field_validation': '',
                   'multiselect' :tmpContent[i].multiselect,
                   'field_required' :tmpContent[i].field_required
              });
          }

          fieldData.field_content = [...newFieldsData];
      } else {
          let tmp_field_content = [...fieldData.field_content];
          fieldData.field_content = [];
          let final_content: any = {};
          if (fieldData.field_type == 'checkbox') {
              
            this.onAddSelectRow();
          
        }

          if (fieldData.field_type == 'dynamic') {
              final_content['dbsettings'] = {
                  ...fieldData.dbsettings[0]
              }; //Dyamaic Content is Add in FormFields
          }
          final_content['options'] = [...tmp_field_content];
          final_content['extra_field_content'] = {
              ...fieldData.extra_field_content[0]
          };
          final_content['extra_field_content']['error_msg'] = fieldData.error_msg;
          final_content['extra_field_content']['field_required'] = fieldData.field_required;
          //  final_content['dbsettings']['error_msg'] = fieldData.error_msg;
          final_content['extra_field_content']['show_field'] = '';
          final_content['extra_field_content']['current_date'] = '';
          fieldData.field_content = final_content;
          fieldData['created_by'] = this.currentUser.user_id;
          
          delete fieldData['extra_field_content'];
          delete fieldData['error_msg'];
          delete fieldData['dbsettings'];
      }

      if (fieldData.field_pregmatch == null) {
          fieldData.field_pregmatch = '';
      }
      if (fieldData.field_type == 'dynamic') {
          if (fieldData.field_validation) {
              fieldData.field_validation = '';
          }
          if (fieldData.field_pregmatch) {
              fieldData.field_pregmatch = '';
          }
      }

      if (fieldData.field_type == 'autocomplete') {
          if (fieldData.field_validation) {
              fieldData.field_validation = null;
          }
          if (fieldData.field_pregmatch) {
              fieldData.field_pregmatch = null;
          }
      }
    
      this.dialogRef.close(fieldData);
  }

  setFieldValue(event){
    this.conditional_logic_data  = event;
    if(this.conditional_logic_data){
        this.optionsForm.get('conditional_logic').setValue(this.conditional_logic_data);
    }
    
 }

  onYesClick() {
      this.dialogRef.close('Y');
  }

  onNoClick(): void {
      this.dialogRef.close('N');
  }

  onSubmitRec(value) {
      this.dialogRef.close(value.recType);
  }

  onSubmitRecBooking(value) {
    this.dialogRef.close(value.recUpdateBooking);
  }

  onClickCancel() {
      this.dialogRef.close();
  }

  onSubmitStatus(value) {
      this.dialogRef.close(value.flag)
  }

  onSubmitDeleteEvent(value) {
      this.dialogRef.close(value.flag);
  }

}