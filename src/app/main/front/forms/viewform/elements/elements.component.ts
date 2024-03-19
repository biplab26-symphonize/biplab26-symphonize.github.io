import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { FormentriesService, CommonService, AppConfig, ProfileService, UsersService, EventbehavioursubService } from 'app/_services';
import { StarRatingComponent } from 'ng-starrating';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, switchMap, tap } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM/DD/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'form-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  animations: fuseAnimations
})
export class ElementsComponent implements OnInit {


  public checkboxErrorMsg: string = 'Select checkbox';
  @Input() forminfo: any;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  ShowErrormsg: boolean = false;
  ShowEndTimeErrormsg: boolean = false;
  ShowStartTimeErrormsg: boolean = false;
  ShowStartErrormsg: boolean = false;
  StartDate_id: any;
  hour: any;
  minutes: any;
  time_zone: any;
  twentyfourhourvalue: any;
  twentyfourminutes: any;
  viewformGroup: FormGroup;
  formFields: any = [];
  jsonFormFields: any = [];
  Usermetavalue: any = [];
  timefielddata: any = [];
  saveFormData: Object = {};
  apartmentvalue: any;
  unitnumber: any;
  filetypes: any;
  created_by: number;
  listformInValid: boolean = false;
  dynamicformValid: boolean = false;
  filetype: Boolean = false;
  signaturepadvalidate: boolean = false;
  viewform: boolean = false;
  submitButtonData: any;
  EndDate_id: any;
  fileData = null;
  inputAccpets: string;
  private file: File | null = null;
  url: string = '';
  // min: any = new Date(new Date().setHours(0, 0, 0, 0));
  userinfo: any;
  userId: number = 0;
  mytime: Date;
  NewValue: any;
  signatureImage: any;
  array: any = [];
  reatingcolorchacked: any;
  reatingcoloeunchacked: any;
  generalSettings: any;
  minWidth: any;
  selected: string;
  TokenSettings: any;
  canvasWidth: any;
  canvasHeight: any;
  time_zoneformat: any;
  structure_format: any;
  time_format: any;
  timevalue: Date = new Date();
  minTime: Date = new Date();
  maxTime: Date = new Date();
  Checkeditems: any = [];
  CheckeditemsValue: any = [];
  hoursPlaceholder = 'hh';
  minutesPlaceholder = 'mm';
  hours: any;
  minute: any;
  twentyfourhours: any;
  twentyfourminute: any;
  format: any;
  valid = true;
  Formarray: any;
  firstName: any;
  twenty_four_Name: any = [];
  twelvehoursName: any = [];
  public UserData: any = []
  public Kisko_User: any;
  filteredColumns: Observable<string[]>;
  private _unsubscribeAll: Subject<any>;
  reqNameSubject: Subject<string> = new Subject<string>();
  isSubmit: boolean = false;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  DisplayMSG: boolean = false;
  AutoFill: boolean = false;
  charactercount: ''
  StartTimeId: any;
  EndTimeId: any;
  restrictFormInfo: boolean = false;
  currentfielddata: any;
  currentvalue: any;
  allfieldcurrentvalue: any;
  AllUnitNumber = [];
  taxExemptMask = '000-0000||000-000-00000';

  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };

  patternArray: any = ["0000000000", "000-000-000", "(000) 000 0000", "(000) 000-0000", "(0000) 000 000",
    "000-000-0000", "000 000 0000", "(000)-000-0000"];

  //  signature  Code is start here 
  private signaturePadOptions: Object = {

    'minWidth': "",
    'canvasWidth': "",
    'backgroundColor': '#D3D3D3',
    'canvasHeight': "",
  };
  constructor(
    private eventbehavioursub: EventbehavioursubService,
    private _formEntryService: FormentriesService,
    private _commonService: CommonService,
    private _matSnackBar: MatSnackBar,
    private _profileservices: ProfileService,
    private _usersService: UsersService,
    private _eventbehavioursubService: EventbehavioursubService,
    private fb: FormBuilder,
    private router: Router) {
    this._unsubscribeAll = new Subject();

    //USERID PASS TO LIST FIELD
    this.userId = JSON.parse(localStorage.getItem('token')).user_id;
  }

  ngOnInit() {
    this.setTheDefaultValue();
  }

  ngOnChanges() {
    this.setTheDefaultValue();
  }
  setTheDefaultValue() {
    //RESTRICT RESIDENT USER FORM EDIT
    this._eventbehavioursubService.restrictFormEdit
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        if (response == true) {
          this.restrictFormInfo = true;
        }
      });
    let ignoreIds: any = [];
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.Kisko_User = this.generalSettings.kiosk_user ? this.generalSettings.kiosk_user.split(',').map(Number) : '';
    for (let i = 0; i < this.Kisko_User.length; i++) {
      if (this.Kisko_User[i] == JSON.parse(localStorage.getItem('token')).role_id) {
        ignoreIds.push(JSON.parse(localStorage.getItem('token')).user_id);
        ignoreIds.push(1);
        console.log("ignoreIds", ignoreIds);
        this.AutoFill = true;
      }
    }

    this.created_by = this.forminfo.created_by || 0;
    this.submitButtonData = JSON.parse(this.forminfo.form_settings);
    this.formFields = CommonUtils.convertFieldsContent(this.forminfo.formfields);

    this.CreateControl();
    this.setDefaultvalue(ignoreIds);

    this.inputAccpets = ".jpg , .jpeg ,.png ";
    for (let i = 0; i <= this.formFields.length - 1; i++) {
      if (this.formFields[i].caption == "upload") {
        this.filetypes = this.formFields[i].content.extra_field_content.fileType;
      }
    }

    // in upload file accept the input as per ahe file type 
    if (this.filetypes == 'image') {
      this.inputAccpets = ".jpg , .jpeg ,.png ";
    }
    if (this.filetypes == 'txt') {
      this.inputAccpets = " text/*,.txt ";
    }

    if (this.filetypes == 'video') {
      this.inputAccpets = " video/*,.mp4,.hd ";
    }

    this._profileservices.getProfileInfo().subscribe(res => {
      if (this.AutoFill != true) {
        this.setdefaultvalue(res.userinfo)
      }

    });

    // apply the conditional logic here 
    this.conditional_logic(this.formFields);
    //IF FORM INCLUDES LIST FIELD THEN APPLY VALIDATION
    this.eventbehavioursub.listFieldsLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.listformInValid = response;
      })
  }


  CreateControl() {
    if (this.formFields.length > 0) {
      let fieldgroup = {};
      let group = {};

      this.formFields.forEach(input => {
        //  Here we have to  give the canvas height width from back end

        if (input.fields.field_type == 'signature') {
          let fielddata = JSON.parse(input.fields.field_content)
          this.minWidth = fielddata.extra_field_content.pen_width;
          this.canvasWidth = fielddata.extra_field_content.canvas_width;
          this.canvasHeight = fielddata.extra_field_content.canvas_height;
          //set signaturePadOptions 
          this.signaturePadOptions['minWidth'] = this.minWidth;
          this.signaturePadOptions['canvasWidth'] = this.canvasWidth;
          this.signaturePadOptions['canvasHeight'] = this.canvasHeight;

        }
        if (input.fields.field_type == 'time') {
          let fielddata = input.content.extra_field_content;
          this.time_zoneformat = fielddata.time_zone;
          this.time_format = fielddata.time_format;
          this.structure_format = fielddata.text_format;
          // create the dynamic  ng model name 

          if (fielddata.time_format == 'twelve') {
            this.twelvehoursName.push({ 'type': 'hours', 'label': input.form_element_id + 'hours', 'id': input.form_element_id }, { 'type': 'minutes', 'label': input.form_element_id + 'minutes', 'id': input.form_element_id }, { 'type': 'time_zone', 'label': input.form_element_id + 'time_zone', 'id': input.form_element_id });

            this.twelvehoursName.forEach(input_template => {
              fieldgroup[input_template.label] = new FormControl('');
            })
          }

          if (fielddata.time_format == "twenty-four") {
            this.twenty_four_Name.push({ 'type': 'twenty_four_hours', 'label': input.form_element_id + 'twenty_four_hours', 'id': input.form_element_id }, { 'type': 'twenty_four_minutes', 'label': input.form_element_id + 'twenty_four_minutes', 'id': input.form_element_id },);

            this.twenty_four_Name.forEach(input_template => {
              fieldgroup[input_template.label] = new FormControl('');
            })
          }

        }

        if (input.fields.field_type == 'rating') {
          let fielddata = input.content.extra_field_content;
          this.reatingcoloeunchacked = fielddata.uncheckedcolor;
          this.reatingcolorchacked = fielddata.checkedcolor;
        }
        if (input.fields.field_type == 'date') {
          let date = new Date();
          date.setDate(date.getDate() + input.content.extra_field_content.day_before);
          input.content.extra_field_content.current_date = date;
        }

        //*MAS ADDED CODE
        let isRequired = input && input.required == 'Y' ? Validators.required : null;

        if (input.fields.field_type == 'checkbox') {
          let FieldArray = [];
          FieldArray = this.createStaticInput(input);
          fieldgroup[input.form_element_id] = new FormArray(FieldArray, Validators.compose([isRequired]));
        }
        else {
          fieldgroup[input.form_element_id] = new FormControl('');
        }
      });
      console.log("fieldgroup", fieldgroup);
      this.viewformGroup = new FormGroup(fieldgroup);
    }
  }

  setDefaultvalue(ignoreIds) {
    console.log("ignoreIds", ignoreIds);
    this.formFields.forEach(input => {
      if (input.fields.field_type == 'text' || input.fields.field_type == 'email' || input.fields.field_type == 'number') {
        this.viewformGroup
          .get('' + input.form_element_id + '').valueChanges
          .pipe(
            debounceTime(300),
            tap(),
            switchMap(value => this._usersService.getUsers({ 'searchKey': value, ignore_ids: ignoreIds.join(","), autopopulate:1 }))
          )
          .subscribe(users => {
            this.DisplayMSG = false;
            for (let i = 0; i < users.data.length; i++) {
              for (let j = 0; j < users.data[i].usermeta.length; j++) {
                if (input.fields.field_type == 'text') {
                  if (input.content.extra_field_content.autocomplete != undefined && input.content.extra_field_content.autocomplete != '' && users.data[i].usermeta[j].user_fields.field_name.toLowerCase() == input.content.extra_field_content.autocomplete.toLowerCase()) {
                    this.Usermetavalue.push({ "value": users.data[i].usermeta[j].field_value });
                  }
                  if (input.content.extra_field_content.autocomplete != undefined && input.content.extra_field_content.autocomplete != '' && users.data[i].usermeta[j].user_fields.field_name.toLowerCase() == input.content.extra_field_content.autocomplete.toLowerCase()) {
                    this.AllUnitNumber.push({ "value": users.data[i].usermeta[j].field_value });
                  }
                }
              }
            }
            this.UserData = [];

            if (this.AutoFill != true) {
              this.UserData = users.data
            } else {
              users.data.map((element, index) => {
                if (element.userroles.roles.id != 1) {
                  this.UserData.push(element);
                }
              });
            }

          });
      }
    });
  }


  ngAfterViewInit() {
    //  get the All fields  data on the value changes 
    this.viewformGroup.valueChanges.subscribe(response => {
      Object.keys(this.viewformGroup.controls).map(item => {
        this.formFields.every(fielditem => {
          if (fielditem.form_element_id.toString() == item) {
            let fieldId = fielditem && fielditem.field_id ? fielditem.field_id : null;
            let fieldLabel = fielditem && fielditem.fields.field_label ? fielditem.fields.field_label : null;
            this.applyConditionLogic({ form_element_id: item, fieldId: fieldId, formValue: response, fieldLabel: fieldLabel });
            this.getvalue({ form_element_id: item, fieldId: fieldId, formValue: response, fieldLabel: fieldLabel });
            return false;
          }
          return false;
        });

      })
    });
  }

  getvalue(fieldInfo) {
    this.currentfielddata = fieldInfo;
  }
  // conditional logic function to check which field have a conditional logic

  conditional_logic(formFields) {
    if (formFields.length > 0) {
      formFields.forEach(element => {
        if (element.fields.field_type != 'list') {
          if (element.conditional_logic != '' && element.conditional_logic != null) {
            let item = typeof element.conditional_logic == 'string' ? JSON.parse(element.conditional_logic) : element.conditional_logic;
            if (item.enable_conditional_logic == 'Y' && item.show_hide == 'show' || item.show_hide == '') {
              element.content.extra_field_content.show_field = false;
            } else {
              element.content.extra_field_content.show_field = true;
            }
          } else {
            element.content.extra_field_content.show_field = true;
          }
        }

      });
    }

  }

  // show or hide the field accoring the condition 
  applyConditionLogic(fieldInfo) {
    this.formFields.forEach(input => {
      if (input.conditional_logic != '' && input.conditional_logic != null) {
        let item = typeof input.conditional_logic == 'string' ? JSON.parse(input.conditional_logic) : input.conditional_logic;
        if (item.enable_conditional_logic != '' && item.enable_conditional_logic == 'Y') {
          if (item.all_any != '' && item.all_any == 'any') {
            this.applyConditionLogicAnyShowfield(fieldInfo, item, input);
          } else {
            this.applyConditionLogicAllShowfield(fieldInfo, item, input);
          }
        }
      }
    })
  }

  applyConditionLogicAnyShowfield(fieldInfo, item, input) {
    // if field is all read false
    if (item.Conditional_field.length > 0 && item.Conditional_field != null) {
      item.Conditional_field.forEach(data => {
        this.matchFieldValue(data.condition, input, item, fieldInfo);
      });
    }

  }

  matchFieldValue(condition, input, item, fieldInfo) {
    let CureentAllFieldValue = [];
    let tmparray = [];
    CureentAllFieldValue = Object.entries(fieldInfo.formValue).map(([type, value]) => ({ type, value }));
    let conditionType = condition || '';
    let value;
    switch (conditionType) {
      case 'is':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let field = this.formFields.find(fielditem => { return fielditem.form_element_id == fieldvalue.type });
            let fieldLabel = field && field.description ? field.description : null;

            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              if (elementvalue.field_value == fieldvalue.value && elementvalue.field_label == fieldLabel) {
                tmparray.push(true)
                if (tmparray.length > 0) {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            } else {
              this.currentvalue = '';
              this.Valueforanyfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type)

              if (elementvalue.field_value == this.currentvalue && elementvalue.field_label == fieldLabel) {
                tmparray.push(true)
                if (tmparray.length > 0) {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            }

          });

        });

        break;
      case 'not_is':
        value = true;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let field = this.formFields.find(fielditem => { return fielditem.form_element_id == fieldvalue.type });
            let fieldLabel = field && field.description ? field.description : null;
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              if (elementvalue.field_value == fieldvalue.value && elementvalue.field_label == fieldLabel) {
                tmparray.push(true)
                if (tmparray.length > 0) {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            } else {
              this.currentvalue = '';
              this.Valueforanyfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type)

              if (elementvalue.field_value == this.currentvalue && elementvalue.field_label == fieldLabel) {
                tmparray.push(true)
                if (tmparray.length > 0) {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            }
          });

        });
        break;
      case 'grater':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let gtfieldlogicValue;
            let gtfieldformValue = this.gf_try_convert_float(elementvalue.field_value);
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              gtfieldlogicValue = this.gf_try_convert_float(fieldvalue.value);
            } else {
              this.currentvalue = '';
              this.Valueforanyfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              gtfieldlogicValue = this.gf_try_convert_float(this.currentvalue);

            }
            value = this.gformIsNumber(gtfieldformValue) && this.gformIsNumber(gtfieldlogicValue) ? gtfieldformValue > gtfieldlogicValue : false;
            if (value == true) {
              tmparray.push(true);
              if (tmparray.length > 0) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }
          });

        });

        break;
      case 'less':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let ltfieldlogicValue
            let ltfieldformValue = this.gf_try_convert_float(elementvalue.field_value);
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              ltfieldlogicValue = this.gf_try_convert_float(fieldvalue.value);
            } else {
              this.currentvalue = '';
              this.Valueforanyfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type)
              ltfieldlogicValue = this.gf_try_convert_float(this.currentvalue);
            }
            value = this.gformIsNumber(ltfieldformValue) && this.gformIsNumber(ltfieldlogicValue) ? ltfieldformValue < ltfieldlogicValue : false;
            if (value == true) {
              tmparray.push(true);
              if (tmparray.length > 0) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }

          });
        });
        break;
      case 'contains':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let value
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              value = elementvalue.field_value.indexOf(fieldvalue.value) >= 0;
            } else {
              this.currentvalue = '';
              this.Valueforanyfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              value = elementvalue.field_value.indexOf(this.currentvalue) >= 0;
            }
            if (value == true) {
              tmparray.push(true);
              if (tmparray.length > 0) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }
          });

        });
        break;
      case 'start_with':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              value = elementvalue.field_value.indexOf(fieldvalue.value) == 0;
            } else {
              this.currentvalue = '';
              this.Valueforanyfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              value = elementvalue.field_value.indexOf(this.currentvalue) == 0;
            }
            if (value == true) {
              tmparray.push(true);
              if (tmparray.length > 0) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }

          });
        });
        break;
      case 'end_with':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            var start
            let fieldcurrentvalue
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              fieldcurrentvalue = fieldvalue.value
              start = elementvalue.field_value.length - fieldvalue.value.length;
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforanyfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              fieldcurrentvalue = this.allfieldcurrentvalue
              start = elementvalue.field_value.length - this.allfieldcurrentvalue.length;
            }

            if (start < 0) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = false;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = true;
                this.showhidefield(item, value, input, fieldInfo);
              }

            }
            var tail = elementvalue.field_value.substring(start);
            value = fieldcurrentvalue == tail;
            if (value == true) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = fieldcurrentvalue == tail;
                this.showhidefield(item, value, input, fieldInfo);
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }

          });
        });
        break;
      default:
        return false;
        break;
    }
  }



  // CHECK THE CHEKC BOX VALUE FOR  ANY FIELD CONDITIONAL LOGIC  
  Valueforanyfield(input, field_value, currentvalue, form_element_id) {
    this.formFields.forEach(input => {
      if (input.form_element_id == form_element_id && input.fields.field_type == 'checkbox') {
        this.currentvalue = this.checkboxfieldselectedvalue(input, field_value, form_element_id);
      } else {
        if (input.form_element_id == form_element_id && input.fields.field_type == 'select') {
          let value = [];
          if (input.content.extra_field_content.multiselect == 'Y') {
            value = this.viewformGroup.get('' + form_element_id + '').value;
            this.currentvalue = value.find(item => { return item == field_value });
          }
        }
      }
    });
  }

  // get the  check box selected field value
  checkboxfieldselectedvalue(input, field_value, form_element_id) {
    let tmparray = input.content.options;
    let value = [];
    value = this.viewformGroup.get('' + form_element_id + '').value;
    const index = tmparray.findIndex(list => list.key == field_value);
    let currentvalue = value[index];
    if (currentvalue == true) {
      return field_value;;
    }
  }


  // APPLY THE CONDITIONAL LOGIC FOR ALL FIELD
  applyConditionLogicAllShowfield(fieldInfo, item, input) {
    item.Conditional_field.forEach(data => {
      this.MathchFieldCaseForAll(fieldInfo, item, data.condition, input);

    });
  }


  //MATCH FIELD CASES FOR ALL FIELD 
  MathchFieldCaseForAll(fieldInfo, item, condition, input) {
    let CureentAllFieldValue = [];
    let tmparray = [];
    let value;
    CureentAllFieldValue = Object.entries(fieldInfo.formValue).map(([type, value]) => ({ type, value }));

    let conditionType = condition || '';
    switch (conditionType) {
      case 'is':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let field = this.formFields.find(fielditem => { return fielditem.form_element_id == fieldvalue.type });
            let fieldLabel = field && field.description ? field.description : null;

            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              if (elementvalue.field_value == fieldvalue.value) {
                tmparray.push(true)
                if (item.Conditional_field.length == tmparray.length && elementvalue.field_label == fieldLabel) {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforallfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type)

              if (elementvalue.field_value == this.allfieldcurrentvalue && elementvalue.field_label == fieldLabel) {
                tmparray.push(true)
                if (item.Conditional_field.length == tmparray.length) {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            }

          });

        });

        break;
      case 'not_is':
        value = true;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {

            let field = this.formFields.find(fielditem => { return fielditem.form_element_id == fieldvalue.type });
            let fieldLabel = field && field.description ? field.description : null;

            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              if (elementvalue.field_value == fieldvalue.value && elementvalue.field_label == fieldLabel) {
                tmparray.push(true)
                if (item.Conditional_field.length == tmparray.length) {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforallfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type)

              if (elementvalue.field_value == this.allfieldcurrentvalue && elementvalue.field_label == fieldLabel) {
                tmparray.push(true)
                if (item.Conditional_field.length == tmparray.length) {
                  value = false;
                  this.showhidefield(item, value, input, fieldInfo);
                } else {
                  value = true;
                  this.showhidefield(item, value, input, fieldInfo);
                }
              }
            }
          });

        });
        break;
      case 'grater':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let gtfieldlogicValue;
            let gtfieldformValue = this.gf_try_convert_float(elementvalue.field_value);
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              gtfieldlogicValue = this.gf_try_convert_float(fieldvalue.value);
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforallfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              gtfieldlogicValue = this.gf_try_convert_float(this.allfieldcurrentvalue);

            }
            value = this.gformIsNumber(gtfieldformValue) && this.gformIsNumber(gtfieldlogicValue) ? gtfieldformValue > gtfieldlogicValue : false;
            if (value == true) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }
          });

        });

        break;
      case 'less':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let ltfieldlogicValue
            let ltfieldformValue = this.gf_try_convert_float(elementvalue.field_value);
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              ltfieldlogicValue = this.gf_try_convert_float(fieldvalue.value);
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforallfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              ltfieldlogicValue = this.gf_try_convert_float(this.allfieldcurrentvalue);
            }
            value = this.gformIsNumber(ltfieldformValue) && this.gformIsNumber(ltfieldlogicValue) ? ltfieldformValue < ltfieldlogicValue : false;
            if (value == true) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }

          });
        });
        break;
      case 'contains':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            let value
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              value = elementvalue.field_value.indexOf(fieldvalue.value) >= 0;
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforallfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              value = elementvalue.field_value.indexOf(this.allfieldcurrentvalue) >= 0;
            }
            if (value == true) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }
          });

        });
        break;
      case 'start_with':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              value = elementvalue.field_value.indexOf(fieldvalue.value) == 0;
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforallfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              value = elementvalue.field_value.indexOf(this.allfieldcurrentvalue) == 0;
            }
            if (value == true) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = true;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }

          });
        });
        break;
      case 'end_with':
        value = false;
        this.showhidefield(item, value, input, fieldInfo);
        CureentAllFieldValue.forEach(fieldvalue => {
          item.Conditional_field.find(elementvalue => {
            var start
            let fieldcurrentvalue
            if (typeof fieldvalue.value == 'string' || typeof fieldvalue.value == 'number') {
              fieldcurrentvalue = fieldvalue.value
              start = elementvalue.field_value.length - fieldvalue.value.length;
            } else {
              this.allfieldcurrentvalue = '';
              this.Valueforallfield(input, elementvalue.field_value, fieldvalue.value, fieldvalue.type);
              fieldcurrentvalue = this.allfieldcurrentvalue
              start = elementvalue.field_value.length - this.allfieldcurrentvalue.length;
            }

            if (start < 0) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = false;
                this.showhidefield(item, value, input, fieldInfo)
              } else {
                value = true;
                this.showhidefield(item, value, input, fieldInfo);
              }

            }
            var tail = elementvalue.field_value.substring(start);
            value = fieldcurrentvalue == tail;
            if (value == true) {
              tmparray.push(true);
              if (item.Conditional_field.length == tmparray.length) {
                value = fieldcurrentvalue == tail;
                this.showhidefield(item, value, input, fieldInfo);
              } else {
                value = false;
                this.showhidefield(item, value, input, fieldInfo);
              }
            }

          });
        });
        break;
      default:
        return false;
        break;
    }
  }

  // CHECK THE FILD IS SHOW OR HIDE AND ACCORING THAT SHOW OR HIDE THE FIELD
  showhidefield(item, value, input, fieldInfo) {
    if (item.show_hide == '' || item.show_hide == 'show') {
      input.content.extra_field_content.show_field = value;
    } else {
      input.content.extra_field_content.show_field = value == true ? false : true;
    }

  }

  // GET THE CHECKBOX SELECTED AND SELECT BOX SELECTED VLAUE FOR ALL FIELD
  Valueforallfield(input, field_value, currentvalue, form_element_id) {
    this.formFields.forEach(input => {
      if (input.form_element_id == form_element_id && input.fields.field_type == 'checkbox') {
        this.allfieldcurrentvalue = this.checkboxALLfieldselectedvalue(input, field_value, form_element_id);
      } else {
        if (input.form_element_id == form_element_id && input.fields.field_type == 'select') {
          let value = [];
          if (input.content.extra_field_content.multiselect == 'Y') {
            value = this.viewformGroup.get('' + form_element_id + '').value;
            this.allfieldcurrentvalue = value.find(item => { return item == field_value });
          }
        }
      }
    });
  }

  checkboxALLfieldselectedvalue(input, field_value, form_element_id) {
    let tmparray = input.content.options;
    let value = [];
    value = this.viewformGroup.get('' + form_element_id + '').value;
    const index = tmparray.findIndex(list => list.key == field_value);
    let currentvalue = value[index];
    if (currentvalue == true) {
      return field_value;
    }
  }

  check_numbervalue(event) {
  }
  OnValueChange(event, form_element_id, caption) {

    this.formFields.forEach(input => {
      if (input.conditional_logic != '' && input.conditional_logic != null) {
        let item = typeof input.conditional_logic == 'string' ? JSON.parse(input.conditional_logic) : input.conditional_logic;
        if (item.enable_conditional_logic != '' && item.enable_conditional_logic == 'Y') {
          if (item.all_any != '' && item.all_any == 'any') {
            item.Conditional_field.forEach(data => {
              if (data.field_label == caption) {
                setTimeout(() => {
                  this.Setcontrol(input, this.currentfielddata);
                }, 300);

              }
            })
          } else {
            item.Conditional_field.forEach(data => {
              if (data.field_label == caption) {
                setTimeout(() => {
                  this.Setcontrol(input, this.currentfielddata);
                }, 300);

              }
            })
          }
        }
      }
    })
  }

  Setcontrol(input, fieldInfo) {
    let CureentAllFieldValue = [];
    CureentAllFieldValue = Object.entries(fieldInfo.formValue).map(([type, value]) => ({ type, value }));
    CureentAllFieldValue.forEach(item => {
      if (item.type == input.form_element_id) {
        if (input.fields.field_type != 'checkbox' || input.fields.field_type != 'select') {
          if (input.content.extra_field_content.show_field == false) {
            this.viewformGroup.get('' + item.type + '').setValue('');
            this.viewformGroup.get('' + item.type + '').clearValidators();
            this.viewformGroup.get('' + item.type + '').updateValueAndValidity();
            this.viewformGroup.get('' + item.type + '').markAsPristine();
            this.viewformGroup.get('' + item.type + '').markAsUntouched();

          }
        } else {
          if (input.fields.field_type == 'select' && input.content.extra_field_content.multiselect == 'Y' && input.content.extra_field_content.show_field == false) {
            this.viewformGroup.get('' + item.type + '').reset([]);
            this.viewformGroup.get('' + item.type + '').clearValidators();
            this.viewformGroup.get('' + item.type + '').updateValueAndValidity();
            this.viewformGroup.get('' + item.type + '').markAsPristine();
            this.viewformGroup.get('' + item.type + '').markAsUntouched();
          } else {
            this.viewformGroup.get('' + item.type + '').setValue('');
            this.viewformGroup.get('' + item.type + '').clearValidators();
            this.viewformGroup.get('' + item.type + '').updateValueAndValidity();
            this.viewformGroup.get('' + item.type + '').markAsPristine();
            this.viewformGroup.get('' + item.type + '').markAsUntouched();
          }
          if (input.fields.field_type == 'checkbox' && input.content.extra_field_content.show_field == false) {
            this.viewformGroup.get('' + item.type + '').reset([]);
            this.viewformGroup.get('' + item.type + '').clearValidators();
            this.viewformGroup.get('' + item.type + '').updateValueAndValidity();
            this.viewformGroup.get('' + item.type + '').markAsPristine();
            this.viewformGroup.get('' + item.type + '').markAsUntouched();
          }
        }

      }
    })
  }


  //create static checkboxes
  createStaticInput(metaField: any) {
    let controls = [];
    if (metaField.content.options) {
      controls = metaField.content.options.map(item => {
        let fieldChecked = false;
        return new FormControl(fieldChecked);
      });
      return controls;
    }

  }

  //Update CheckBoxArray Field
  updateCheckboxValues(id, isChecked, key) {
    let fieldId = key.toString();
    const chkArray = this.viewformGroup.get(fieldId) as FormArray;
    let find = chkArray.controls.find(item => { return item.value == true });
    if (find == undefined && this.viewformGroup.controls[fieldId].validator != null) {
      this.viewformGroup.controls[fieldId].setErrors({ required: true });
      this.viewformGroup.controls[fieldId].markAllAsTouched();
    }

    let metaValues = [];
    let formvalues = this.viewformGroup.value;
    Object.keys(formvalues).map(function (key) {
      let fieldValue = Array.isArray(formvalues[key]) ? formvalues[key].join(", ") : formvalues[key];
      metaValues.push({ field_id: key, field_value: fieldValue });
    });

    this.formFields.forEach(meta => {
      if (meta.fields.field_type == 'checkbox') {
        let checkfield = metaValues.find(item => { return parseInt(item.field_id) == meta.form_element_id });
        if (checkfield && checkfield.field_value) {
          checkfield.field_value = checkfield.field_value.split(", ");

          const selectedPreferences = checkfield.field_value
            .map((checked, index) => {
              return checked == 'true' ? meta.content.options[index].value : null;
            })
            .filter(value => value !== null);
          checkfield.field_value = Array.isArray(selectedPreferences) ? selectedPreferences.join(", ") : "";
        }
      }
    });
    //ARRAY Of Checkboxes with actual Values
    this.Checkeditems = [...metaValues];
  }
  // check box  check uncheck function
  onChangecheckbox(form_element_id: any, value, event, id) {
    if (event.checked) {
      this.Checkeditems.push({ "form_element_id": form_element_id, "value": value }); //if value is not  checked..
    }
    if (!event.checked) {
      let index
      for (let i = 0; i < this.Checkeditems.length; i++) {

        if (this.Checkeditems[i].value == value) {
          index = i;
        }
      }
      if (index > -1) {
        this.Checkeditems.splice(index, 1); //if value is checked ...
      }
    }

    this.viewformGroup.get('' + form_element_id + '').setValue(JSON.stringify(this.Checkeditems));

  }

  setusermetavalue(UserData) {
    for (let i = 0; i < UserData.length; i++) {
      for (let j = 0; j < UserData[i].usermeta.length; j++) {
        this.formFields.forEach(input => {
          if (input.fields.field_type == 'text' && input.content.extra_field_content.autocomplete != null) {
            if (input.content.extra_field_content.autocomplete != '' && input.content.extra_field_content.autocomplete !== undefined && UserData[i].usermeta[j].user_fields.field_name.toLowerCase() == input.content.extra_field_content.autocomplete.toLowerCase()) {
              this.Usermetavalue.push({ "value": UserData[i].usermeta[j].field_value });
            }
          }
        });
      }
    }
  }

  setdefaultvalue(userinfo) {

    this.userId = userinfo.id;


    this.unitnumber = '';
    this.apartmentvalue = '';
    if (userinfo.usermeta != undefined) {
      for (let userdata of userinfo.usermeta) {
        this.formFields.forEach(input => {
          if (input.fields.field_type == 'text' && input.content.extra_field_content.autocomplete != null) {
            if (input.content.extra_field_content.autocomplete != '' && input.content.extra_field_content.autocomplete !== undefined && userdata.user_fields.field_name.toLowerCase() == input.content.extra_field_content.autocomplete.toLowerCase()) {
              this.apartmentvalue = userdata.field_value;
            }
            if (input.content.extra_field_content.autocomplete != '' && input.content.extra_field_content.autocomplete !== undefined && userdata.user_fields.field_name.toLowerCase() == input.content.extra_field_content.autocomplete.toLowerCase()) {
              this.unitnumber = userdata.field_value;
            }
          }
        })
      }
    }
    this.formFields.forEach(input => {
      if (input.fields.field_type == 'text') {
        if (input.caption == 'first-name' || input.caption == 'first_name') {
          this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.first_name);
        }
        else {

          if (input.caption == 'last-name' || input.caption == 'last_name') {
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.last_name);
          }
          if (input.caption == 'apartment' || input.caption == 'address' || input.caption == 'organisations' || input.content.extra_field_content.autocomplete) {
            this.viewformGroup.get('' + input.form_element_id + '').setValue(this.apartmentvalue);
          }
          if (input.caption == 'unit' || input.caption == 'location-or-unit-number' || input.content.extra_field_content.autocomplete) {
            this.viewformGroup.get('' + input.form_element_id + '').setValue(this.unitnumber);
          }
        }
      }
      if (input.fields.field_type == 'email') {
        if (input.fields.field_type == 'email' && input.content.extra_field_content.autofill != undefined && input.content.extra_field_content.autofill == 'Y') {
          this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.email);
        } else {
          this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.email);
        }
      }

      if (input.fields.field_type == 'number' && input.caption != 'destination-phone-number' && input.caption != 'alternate-number') {
        if (input.content.extra_field_content.autofill == 'Y' && input.content.extra_field_content.ismasking == 'Y') {
          if (input.content.extra_field_content.maskingpattern == "(000) 000-0000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
            userinfo.phone = '(' + values[1] + ') ' + values[2] + '-' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);
          }
          if (input.content.extra_field_content.maskingpattern == "000-000-000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{3})/)
            userinfo.phone = values[1] + '-' + values[2] + '-' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);
          }
          if (input.content.extra_field_content.maskingpattern == "(000) 000 0000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
            userinfo.phone = '(' + values[1] + ') ' + values[2] + ' ' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);
          }
          if (input.content.extra_field_content.maskingpattern == "000-000-0000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
            userinfo.phone = values[1] + '-' + values[2] + '-' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);
          }
          if (input.content.extra_field_content.maskingpattern == "000 000 0000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
            userinfo.phone = values[1] + ' ' + values[2] + ' ' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);

          }
          if (input.content.extra_field_content.maskingpattern == "(0000) 000 000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{4})(\d{3})(\d{3})/)
            userinfo.phone = '(' + values[1] + ') ' + values[2] + ' ' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);

          }
          if (input.content.extra_field_content.maskingpattern == "(0000) 000-000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{4})(\d{3})(\d{3})/)
            userinfo.phone = '(' + values[1] + ') ' + values[2] + '-' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);

          }
          if (input.content.extra_field_content.maskingpattern == "(000)-000-0000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
            userinfo.phone = '(' + values[1] + ')' + '-' + values[2] + '-' + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);

          }
          if (input.content.extra_field_content.maskingpattern == "0000000000") {
            let values = userinfo.phone.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
            userinfo.phone = values[1] + values[2] + values[3];
            this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);

          }
        } else {
          this.viewformGroup.get('' + input.form_element_id + '').setValue(userinfo.phone);
        }
      }
    })

  }


  // reset button setting reset the data 
  ResetData() {
    this._profileservices.getProfileInfo().subscribe(res => {
      this.setdefaultvalue(res.userinfo)
    });
  }

  firstnamechangevalue(value) {
    let currentdata
    for (let data of this.UserData) {
      if (data.first_name == value) {
        currentdata = data;
      }
    }
    this.setdefaultvalue(currentdata);
  }

  lastnamechangevalue(value) {

    let currentlastname
    for (let data of this.UserData) {
      if (data.last_name == value) {
        currentlastname = data;
      }
    }
    this.setdefaultvalue(currentlastname);
  }

  phonechangevalue(value, element_id) {
    let currentphone
    for (let data of this.UserData) {
      if (data.phone == value) {
        currentphone = data;
      }
    }
    this.setdefaultvalue(currentphone);
  }

  highlightInput(event) {
    let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
    event.target.value = '(' + values[1] + ') ' + values[2] + '-' + values[3];
  }
  NumberValidations(event, field_id) {

    if (event.target.value.length == 7) {
      let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
      event.target.value = values[1] + '-' + values[2]
      this.viewformGroup.get('' + field_id + '').setValue(event.target.value);
    }
    else {

      if (event.target.value.length == 10) {
        let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
        event.target.value = values[1] + '-' + values[2] + '-' + values[3];
        this.viewformGroup.get('' + field_id + '').setValue(event.target.value);
      } else {
        if ((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7] == '-' && event.target.value.length == 12)) {
          this.viewformGroup.get('' + field_id + '').setValue(event.target.value);
        } else {
          this.viewformGroup.get('' + field_id + '').setValue('');
        }
      }
    }
  }

  emailchangevalue(value) {
    let currentmail
    for (let data of this.UserData) {
      if (data.email == value) {
        currentmail = data;
      }
    }
    this.setdefaultvalue(currentmail);
  }


  apartmentchangevalue(value) {
    let currentapartment
    for (let data of this.UserData) {

      for (let j = 0; j < data.usermeta.length; j++) {
        if (data.usermeta[j].field_value == value) {
          currentapartment = data;
        }
      }

    }
    this.setdefaultvalue(currentapartment);
  }

  unitchangevalue(value) {
    let currentapartment
    for (let data of this.UserData) {

      for (let j = 0; j < data.usermeta.length; j++) {
        if (data.usermeta[j].field_value == value) {
          currentapartment = data;
        }
      }

    }
    this.setdefaultvalue(currentapartment);
  }

  hoursValue($event, form_element_id) {
    this.hours = $event.target.value;
    let TmpArray = []
    TmpArray.push($event.target.value, this.minute, this.time_zone);
    let data = TmpArray.join();
    this.viewformGroup.get('' + form_element_id + '')
      .patchValue(data.replace(/,/g, ':'));
  }

  minutesValue($event, form_element_id) {
    this.minute = $event.target.value;
    let TmpArray = []
    TmpArray.push(this.hours, $event.target.value, this.time_zone);

    let data = TmpArray.join();
    this.viewformGroup.get('' + form_element_id + '')
      .patchValue(data.replace(/,/g, ':'));
  }

  twentyfourhoursValue($event, form_element_id) {
    let TmpArray = [];
    this.twentyfourhourvalue = $event.target.value;
    TmpArray.push($event.target.value, this.twentyfourminutes);

    let data = TmpArray.join();
    this.viewformGroup.get('' + form_element_id + '')
      .patchValue(data.replace(/,/g, ':'));
  }

  twentyfourminutesValue($event, form_element_id) {
    let TmpArray = [];

    this.twentyfourminutes = $event.target.value;
    TmpArray.push(this.twentyfourhourvalue, $event.target.value);
    let data = TmpArray.join();
    this.viewformGroup.get('' + form_element_id + '')
      .patchValue(data.replace(/,/g, ':'));
  }

  validate($event) {

  }

  //  used in field type time is valid or not 
  isValid(event: boolean): void {

    this.valid = event;
  }

  // this is for radio button  am pm options events  
  onChangeRadio($event, form_element_id: any) {

    this.time_zone = $event.value;
    let TmpArray = []
    TmpArray.push(this.hours, this.minute, $event.value);

    let data = TmpArray.join();
    this.viewformGroup.get('' + form_element_id + '')
      .patchValue(data.replace(/,/g, ':'));
  }

  // this is for select the am pm options events in 
  Onselect($event, form_element_id: any, id) {
    this.time_zone = $event.value;
    let TmpArray = []
    TmpArray.push(this.hours, this.minute, $event.value);

    let data = TmpArray.join();
    this.viewformGroup.get('' + form_element_id + '')
      .patchValue(data.replace(/,/g, ':'));
  }


  clear(form_element_id) {
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    this.viewformGroup.get('' + form_element_id + '').setValue("");
  }

  setReadonly() {
    return false;
  }
  clearDate(event, id) {
    event.stopPropagation();
    this.viewformGroup.get('' + id + '').setValue('');
  }

  drawComplete(form_element_id: any, $event) {

    this.signatureImage = this.signaturePad.toDataURL();
    this.signatureImage = {
      'base64': this.signatureImage

    }
    this.viewformGroup.get('' + form_element_id + '').setValue(this.signatureImage);
  }

  // signature code end 

  onSubmit() {
    event.preventDefault();
    event.stopPropagation();
    const checkboxFields = this.validateCheckboxes();
    if (this.viewformGroup.valid && checkboxFields == true && this.listformInValid == false) {
      let formFieldValues = [];
      Object.entries(this.viewformGroup.value).forEach(([key, value]) => {
        const checkboxValues = this.Checkeditems.find(item => { return parseInt(item.field_id) == parseInt(key) });
        let formFieldValue = checkboxValues && checkboxValues.field_value !== '' && checkboxValues.field_value !== null ? checkboxValues.field_value : value;
        formFieldValues.push({ form_element_id: key, form_element_value: formFieldValue, user_id: this.userId });
      });
      this.addFormEntry(formFieldValues);
    }
    else {
      //normal fields validation
      Object.keys(this.viewformGroup.controls).forEach(field => {

        const control = this.viewformGroup.get(field);
        if (Array.isArray(control.value)) {
          if (control.value.filter(item => { return item == true }).length == 0 && control.validator != null) {
            control.setErrors({ required: true });
          }
        }
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });

      });
      //list field validation
      this.eventbehavioursub.listFieldsValidate.next(true);
    }
  }

  //  rating code start here 
  onRate(form_element_id: any, $event: { oldValue: number, newValue: number, starRating: StarRatingComponent }) {
    this.NewValue = ($event.newValue),
      this.viewformGroup.get('' + form_element_id + '').setValue($event.newValue);
  }
  // rating code end here 

  //  code upload start here 
  onSelectFile(form_element_id: any, event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
        let index = selectedFile.name.lastIndexOf(".") + 1;
        let extFile = selectedFile.name.substr(index, selectedFile.size).toLocaleLowerCase();
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "gif") {
          this.filetype = true;
        }
        else {

          this.filetype = false;
        }

        let mediaInfo = new FormData();
        mediaInfo.append('type', this.filetypes);
        mediaInfo.append('image', this.file);
        this._commonService.uploadfiles(mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "";
            this.viewformGroup.get('' + form_element_id + '').setValue(this.uploadInfo.avatar.url, { emitModelToViewChange: false });
          });

      }
    }

  }
  //  code upload end here 

  changeEventStartD(id) {

    this.ShowStartErrormsg = false;
    let startdate = this.viewformGroup.get('' + id + '').value ? moment(this.viewformGroup.get('' + id + '').value) : '';
    let enddate = this.viewformGroup.get('' + this.EndDate_id + '').value ? moment(this.viewformGroup.get('' + this.EndDate_id + '').value) : '';

    if (startdate > enddate) {
      this.ShowStartErrormsg = true
      this.viewformGroup.get('' + id + '').reset();
    }

  }

  changeEventEndD(datefieldId) {
    this.ShowErrormsg = false;
    let startdate = moment(this.viewformGroup.get('' + this.StartDate_id + '').value)
    let enddate = moment(this.viewformGroup.get('' + datefieldId + '').value)

    if (startdate > enddate) {
      this.ShowErrormsg = true
      this.viewformGroup.get('' + datefieldId + '').reset();
    }

  }

  // for  date field code  start
  convertDateFieldFormat(datefieldId: any, event: MatDatepickerInputEvent<Date>) {
    this.viewformGroup.get('' + datefieldId + '').setValue(moment(event.value));
    this.StartDate_id = datefieldId;
    this.changeEventStartD(datefieldId)
  }

  convertEndDateFieldFormat(datefieldId: any, event: MatDatepickerInputEvent<Date>) {
    this.viewformGroup.get('' + datefieldId + '').setValue(moment(event.value));
    this.EndDate_id = datefieldId;
    this.changeEventEndD(datefieldId)
  }


  convertDateTimeFieldFormat(datefieldId: any, event: MatDatepickerInputEvent<Date>) {
    this.viewformGroup.get('' + datefieldId + '').setValue(moment(event.value));
  }

  // start time end time validation  issue  
  convertStartTimeFieldFormat(datefieldId: any) {
    this.StartTimeId = datefieldId;
    this.ShowStartTimeErrormsg = false;
    let enddate;
    let startdate = this.viewformGroup.get('' + datefieldId + '').value;
    if (this.EndTimeId != undefined) {
      enddate = this.viewformGroup.get('' + this.EndTimeId + '').value;
      if (startdate && startdate > enddate) {
        this.viewformGroup.get('' + datefieldId + '').reset('');
      }
    }
    if (startdate == '') {
      this.ShowStartTimeErrormsg = true;
    }
  }
  // start time end time validation   

  convertEndTimeFieldFormat(datefieldId: any) {
    this.ShowEndTimeErrormsg = false;
    this.EndTimeId = datefieldId;
    let startdate = this.viewformGroup.get('' + this.StartTimeId + '').value;
    let enddate = this.viewformGroup.get('' + datefieldId + '').value;
    if (enddate && startdate > enddate) {
      this.ShowEndTimeErrormsg = true;
      this.viewformGroup.get('' + datefieldId + '').reset('');
    }
    if (enddate == '') {
      this.ShowEndTimeErrormsg = true;
    }

  }

  convertTimeFieldFormat(datefieldId: any, event: MatDatepickerInputEvent<Date>) {
    this.viewformGroup.get('' + datefieldId + '').setValue(moment(event.value));
  }

  // list fields code start here
  setlistInfoFieldValue(form_element_id: any, $event) {

    //enable or disable submit button on list of fields are filled/not
    this.listformInValid = $event.listformValid;

    //check if list field ID and value is !empty
    if (this.listformInValid == false && $event.form_element_id && $event.form_element_value) {
      this.viewformGroup.get('' + form_element_id + '').setValue($event.form_element_value);
    }
    else {
      //list field validation
      //this.eventbehavioursub.listFieldsValidate.next(true);
    }
  }
  // list fields code end here

  // get the Dynamicfields selected Items Value code start
  setdynamicFieldValue(form_element_id: any, $event) {

    this.viewformGroup.get('' + form_element_id + '').setValue($event.form_element_value);

  }
  // get the Dynamicfields selected Items Value code end

  //Add new entry 
  addFormEntry(formfieldValues: any[] = []) {
    let formFieldValues =  this.setHtmlFieldValues(formfieldValues);
    this.isSubmit = true;
    this.saveFormData['form_id'] = this.forminfo.form_id;
    this.saveFormData['formentries'] = JSON.stringify(formFieldValues);
    this.saveFormData['created_by'] = this.userId;
    this.saveFormData['added_at'] = moment().format("YYYY-MM-DD HH:mm:ss");
    this.saveFormData['edited_at'] = moment().format("YYYY-MM-DD HH:mm:ss");
    //Save Form entry in DB
    this._formEntryService.updateEntry('create/formentry', this.saveFormData)
      .subscribe(response => {
        if (response.status == 200) {
          this.showSnackBar(response.message, 'OK');
          this.router.navigate(['forms/view/Showformentry/', response.forminfo.entry_id]);
          this.isSubmit = false;
        }
        else {
          this.showSnackBar(response.message, 'Retry');
          this.isSubmit = false;
        }
      });
  }
  setHtmlFieldValues(formfieldValues){
    let finalformFieldArray = [];
    let htmlFieldIds   = this.formFields.filter(item=>{return item.fields.field_type=='html';}).map(item=>{return item.form_element_id.toString()});
    let htmlFieldArray = this.formFields.filter(item=>{
      return item.fields.field_type=='html';
    }).map(option=>{
      let htmlValue = option.content && option.content.extra_field_content && option.content.extra_field_content.content ? option.content.extra_field_content.content : '';
      var htmlNewValue = { form_element_id: option.form_element_id.toString(), form_element_value: htmlValue, user_id:this.userId }
      return htmlNewValue;
    })
    if(htmlFieldArray && htmlFieldArray.length>0){
      formfieldValues     = formfieldValues.filter(item=>{return !htmlFieldIds.includes(item.form_element_id)})
      console.log("formfieldValues",formfieldValues);
      finalformFieldArray = [...htmlFieldArray, ...formfieldValues];
    }
    else{
      finalformFieldArray = [...formfieldValues];
    }
    return finalformFieldArray;
  }
  //VALIDATE CHECKBOX IS REQUIRED AND SELECTED
  validateCheckboxes() {
    let validCheckbox = true;
    this.formFields.forEach(meta => {
      if (meta.fields.field_type == 'checkbox') {
        let fieldId = meta.form_element_id.toString();
        const chkArray = this.viewformGroup.get(fieldId) as FormArray;
        let find = chkArray.controls.find(item => { return item.value == true });
        if (find == undefined && this.viewformGroup.controls[meta.form_element_id].validator != null) {
          this.viewformGroup.controls[meta.form_element_id].setErrors({ required: true });
          this.viewformGroup.controls[meta.form_element_id].markAllAsTouched();
          validCheckbox = false;
        }
      }
    });
    return validCheckbox;
  }

  //Update form Entry
  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }


  gformIsNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  gf_try_convert_float(text) {
    var format = 'decimal_dot';
    if (this.gformIsNumeric(text, format)) {
      var decimal_separator = format == "decimal_comma" ? "," : ".";
      return this.gformCleanNumber(text, "", "", decimal_separator);
    }
    return text;
  }
  gf_try_convert_float_all(text) {
    var format = 'decimal_dot';
    if (this.gformIsNumeric(text, format)) {
      var decimal_separator = format == "decimal_comma" ? "," : ".";
      return this.gformCleanNumber(text, "", "", decimal_separator);
    }
    return text;
  }
  gformIsNumeric(value, number_format) {
    switch (number_format) {
      case "decimal_dot":
        var r = new RegExp("^(-?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]+)?)$");
        return r.test(value);
        break;

      case "decimal_comma":
        var r = new RegExp("^(-?[0-9]{1,3}(?:\.?[0-9]{3})*(?:,[0-9]+)?)$");
        return r.test(value);
        break;
    }
    return false;
  }
  gformCleanNumber(text, symbol_right, symbol_left, decimal_separator) {
    var clean_number = '',
      float_number = '',
      digit = '',
      is_negative = false;

    //converting to a string if a number as passed
    text = text + " ";

    //Removing symbol in unicode format (i.e. &#4444;)
    text = text.replace(/&.*?;/g, "");

    //Removing symbol from text
    text = text.replace(symbol_right, "");
    text = text.replace(symbol_left, "");

    //Removing all non-numeric characters
    for (var i = 0; i < text.length; i++) {
      digit = text.substr(i, 1);
      if ((parseInt(digit) >= 0 && parseInt(digit) <= 9) || digit == decimal_separator)
        clean_number += digit;
      else if (digit == '-')
        is_negative = true;
    }

    //Removing thousand separators but keeping decimal point
    for (var i = 0; i < clean_number.length; i++) {
      digit = clean_number.substr(i, 1);
      if (digit >= '0' && digit <= '9')
        float_number += digit;
      else if (digit == decimal_separator) {
        float_number += ".";
      }
    }

    if (is_negative)
      float_number = "-" + float_number;

    return this.gformIsNumber(float_number) ? parseFloat(float_number) : false;
  }
  //Remove Validations

  /**
  * On destroy
  */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    //list field validation
    this.eventbehavioursub.listFieldsValidate.next(false);
  }

}
