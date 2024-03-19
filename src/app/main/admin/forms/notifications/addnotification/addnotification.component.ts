import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { CommonService, FormsService, OptionsList } from 'app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-addnotification',
  templateUrl: './addnotification.component.html',
  styleUrls: ['./addnotification.component.scss'],
  animations: fuseAnimations
})
export class AddnotificationComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public notificationSetting: FormGroup;
  public tinyMceSettings = {};
  public url_id: any;
  public notificationsetting: any;
  public AllField: any;
  emailRegEx = '[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}';
  notificationEvent: any;
  public OptionList1: any = [];
  public OptionList2: any = [];
  public ShowField: boolean = false;
  public conditionLogic: any = [];
  public Fields: any;
  public DefaultData = [];
  public formField: any = [];
  public bracket1: any = '{';
  public bracket2: any = '}';
  public form_title: any = '{form-title}';
  public form_id: any = '{form-id}';
  public date: any = '{date}';
  public all_fields: any = '{all-fields}';
  public form_content_id: any

  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _formsService: FormsService,
    public router: Router
  ) {
    this.notificationEvent = OptionsList.Options.fieldtype.notificationEvent;

    this.tinyMceSettings = CommonUtils.getTinymceSetting('notifications');
    this.route.params.subscribe(params => {
      this.url_id = params.id;


    });
  }

  ngOnInit() {    
    this.notificationSetting = this.fb.group({

      //  notification settings 
      id: this.fb.control(''),
      name: this.fb.control(''),
      event: this.fb.control(''),
      sendto: this.fb.control('enter_email', [Validators.required]),
      send_to_email: this.fb.control('', [Validators.required]),
      send_to_field: this.fb.control('', [Validators.required]),
      from_name: this.fb.control(''),
      from_email: this.fb.control('', [Validators.pattern(this.emailRegEx)]),
      replyto: this.fb.control('', [Validators.required, Validators.pattern(this.emailRegEx)]),
      bcc: this.fb.control('', [Validators.pattern(this.emailRegEx)]),
      cc: this.fb.control('', [Validators.pattern(this.emailRegEx)]),
      subject: this.fb.control('', [Validators.required]),
      message: this.fb.control('', [Validators.required]),
      enable_conditional_logic: this.fb.control(''),
      show_hide: this.fb.control(''),
      all_any: this.fb.control(''),
      AllField: this.fb.array([this.createItem()]),
    });

    if (this.route.routeConfig.path == 'admin/notification/edit/:id') {
      this._formsService.editNotification(this.url_id).subscribe(res => {
        console.log("res.notificationsettings.form_id", res.notificationsettings.form_id);
        this.notifcationValues(res);
        this.pathchDefalutValue(res.notificationsettings);
        this.form_content_id = res.notificationsettings.form_id;
        this._formsService.getFormContent(this.form_content_id).subscribe(res => {
          this.formField = res.forminfo;
          console.log("formField", this.formField.formfields);
        })
      })
      
    }
    else {
      this._formsService.getFormContent(this.url_id).subscribe(res => {

        this.notificationsetting = res.forminfo;
        this.formField = res.forminfo;
        //  this.AllField = res.forminfo;
        this.Fields = res.forminfo;
        this.ShowDefalutValue(res.forminfo.formfields);
      })
    }
    
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };

  }



  notifcationValues(res) {

    this.url_id = res.notificationsettings.form_id;
    this.notificationSetting.patchValue(res.notificationsettings);
    if (res.notificationsettings.sendto == "enter_email") {
      this.notificationSetting.patchValue({ send_to_email: res.notificationsettings.to });
    } else {
      this.notificationSetting.patchValue({ send_to_field: res.notificationsettings.to });
    }
  }



  ShowDefalutValue(formfield) {
    for (let i = 0; formfield.length > i; i++) {
      if (formfield[i].fields.field_type != 'list' && formfield[i].fields.field_type !== 'date' && formfield[i].fields.field_type != 'time' && formfield[i].fields.field_type != 'upload' && formfield[i].fields.field_type != 'html') {
        this.DefaultData.push({ 'Field': formfield[i] });
      }

    }
    this.Fields = formfield;
  }

  pathchDefalutValue(notificationsettings) {
    this._formsService.getFormContent(this.url_id).subscribe(res => {

      //  this.AllField = res.forminfo;
      this.Fields = res.forminfo;
      this.ShowDefalutValue(res.forminfo.formfields);
      //  set the default value to the selected field
      let conditionalsetting = typeof notificationsettings.conditionallogic == 'string' ? JSON.parse(notificationsettings.conditionallogic) : notificationsettings.conditionallogic

      this.notificationSetting.patchValue(conditionalsetting);
      if (conditionalsetting != '' && conditionalsetting !== undefined && conditionalsetting != null) {
        this.notificationSetting.get('enable_conditional_logic').setValue(conditionalsetting.enable_conditional_logic == 'Y' ? true : false)
        this.AllField = this.notificationSetting.get('AllField') as FormArray;
        this.AllField.removeAt(0);
        let k = 0;
        conditionalsetting.Conditional_field.map((item, index) => {
          this.OptionList1 = [];
          this.conditionLogic[k] = 0;
          let flag = 0;
          this.Fields.find(items => {
            if ((items.form_element_id == item.form_element_id && items.fields.field_type == 'radio') || (items.form_element_id == item.form_element_id && item.field_label == 'select') || (items.form_element_id == item.form_element_id && items.fields.field_type == 'checkbox')) {
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
          tempObj['form_element_id'] = new FormControl(item.form_element_id);
          tempObj['condition'] = new FormControl(item.condition);
          tempObj['field_value'] = new FormControl(item.field_value);
          this.AllField = this.notificationSetting.get('AllField') as FormArray;
          this.AllField.push(this.fb.group(tempObj));
        });
      }
    })

  }
  createItem() {
    return this.fb.group({
      form_element_id: [''],
      condition: [''],
      field_value: ['']

    })

  }

  OnselectLable(event, index) {
    this.OptionList1 = [];
    this.conditionLogic[index] = 0;
    let flag = 0;
    this.Fields.find(item => {
      if ((item.form_element_id == event.value && item.fields.field_type == 'radio') || (item.form_element_id == event.value && item.fields.field_type == 'select') || (item.form_element_id == event.value && item.fields.field_type == 'checkbox')) {
        let content = typeof item.content == 'string' ? JSON.parse(item.content) : item.content;
        this.OptionList1 = content[0].options;
        flag = 1;
        this.conditionLogic[index] = 1;
      }
    });
    if (flag == 1) {
      this.OptionList2[index] = this.OptionList1;
    } else {
      this.OptionList2[index] = '';
    }
    // this.submitListFieldForm();
  }

  onAddSelectRow() {

    this.AllField = this.notificationSetting.get('AllField') as FormArray;
    this.AllField.push(this.createItem());
  }

  onRemoveRow(index) {
    this.AllField.removeAt(index)
    // this.submitListFieldForm();
  }

  getControls() {
    return (this.notificationSetting.get('AllField') as FormArray).controls;
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.notificationSetting.controls[controlName].hasError(errorName);
  }

  onClickSave() {
    let value = this.notificationSetting.value;
    let FieldData = {
      enable_conditional_logic: value.enable_conditional_logic == true ? 'Y' : 'N',
      show_hide: value.show_hide,
      all_any: value.all_any,
      Conditional_field: value.AllField,
    }

    let notificationsettings: any = {
      "id": value.id !== "" ? value.id : "",
      "form_id": this.url_id,
      "isactive": "Y",
      "name": value.name,
      "subject": value.subject,
      "event": value.event,
      "from_name": value.from_name,
      "sendto": value.sendto,
      "to": value.send_to_email != "" ? value.send_to_email : value.send_to_field,
      "from_email": value.from_email,
      "replyto": value.replyto,
      "bcc": value.bcc,
      "cc": value.cc,
      "message": value.message,
      "disableautoformat": "",
      "conditionallogic": JSON.stringify(FieldData),
      "routing": ""
    }


    this._formsService.saveFormNotificationSettings(notificationsettings)
      .subscribe(response => {
        this.showSnackBar(response.message, 'CLOSE');
        this.router.navigate(['admin/form/notification/', this.url_id]);
      },
        error => {
          // Show the error message
          this.showSnackBar(error.message, 'Retry');
        });
  }

}