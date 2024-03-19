import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FormentriesService, CommonService } from 'app/_services';
import { DynamicFormComponent } from 'app/layout/fields-component/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-editentry',
  templateUrl: './editentry.component.html',
  styleUrls: ['./editentry.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EditentryComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public dynamicForm: FormGroup;
  @ViewChild(DynamicFormComponent) forms: DynamicFormComponent;
  public currentUser: any;
  public url_id: number;
  public dynamicFormDataById: any;
  public fieldConfig: any = [];
  public submitButtonData: any;
  public dynamicdata: any = [];
  public isReadOnly: boolean;
  public confirmationShown: boolean;
  public saveData;
  public isSubmit: boolean = false;
  public form_id: any;

  constructor(
    private _commonService: CommonService,
    private commanservice: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _formEntryService: FormentriesService,
    private _matSnackBar: MatSnackBar,
    private router: Router) {
    this.route.params.subscribe(params => {
      this.url_id = params.id;
    });
  }

  ngOnInit() {
    this.isReadOnly = true
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    this.dynamicForm = this.fb.group({
      form_id: this.fb.control('', [Validators.required]),
      created_by: this.fb.control(this.currentUser.user_id, [Validators.required])
    });

    this._formEntryService.getEntries(this.url_id)
      .subscribe(response => {

        this.submitButtonData = JSON.parse(response.entryinfo.formmeta.form_settings);
        this.getField(response);
      })

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

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }




  getField(response) {
    if (response.status == 200) {
      this.dynamicFormDataById = response.entryinfo.formfields;
      let tmpentriesmeta = [...response.entryinfo.formfields];
      for (let i = tmpentriesmeta.length - 1; i >= 0; i--) {
        this.form_id = tmpentriesmeta[i].form_id;
        if (tmpentriesmeta[i].fields != null) {
          if (tmpentriesmeta[i].fields.field_type == 'list') {
            let tmpcontent = JSON.parse(tmpentriesmeta[i].content)
            let finalArr = tmpcontent;
            for (var j = 0; j <= tmpentriesmeta.length - 1; j++) {
              if (tmpentriesmeta[j].entryinfo.form_element_id !== "") {


                let tmpentriesmetaValue = typeof tmpentriesmeta[i].entryinfo.form_element_value == "string" ?
                  JSON.parse(tmpentriesmeta[i].entryinfo.form_element_value) : tmpentriesmeta[i].entryinfo.form_element_value;
                var entMeta = tmpentriesmetaValue.length;

                finalArr = this.entriesMetaListValue([...tmpentriesmetaValue], [...tmpcontent]);

                if (entMeta > 1) {
                  tmpentriesmeta[i]['edit'] = 'Y';
                }
              }

            }


            tmpentriesmeta[i].content = finalArr;


          }

          else {
            // form_element_value
            let tmpcontent = JSON.parse(tmpentriesmeta[i].content);
            if (tmpentriesmeta[i].fields.field_type !== 'button' && tmpentriesmeta[i].fields.field_type !== 'hidden' && tmpentriesmeta[i].entryinfo.form_element_id !== null && tmpentriesmeta[i].fields.field_type != 'html') {
              tmpcontent[0].extra_field_content.dafaultValue = tmpentriesmeta[i].entryinfo.form_element_value;
            }
            if (tmpentriesmeta[i].fields.field_type == 'html' && tmpentriesmeta[i].fields.field_type !== 'button' && tmpentriesmeta[i].fields.field_type !== 'hidden' && tmpentriesmeta[i].entryinfo.form_element_id !== null) {
              if (tmpentriesmeta[i].entryinfo.form_element_value !== '') {
                tmpcontent[0].extra_field_content.dafaultValue = tmpentriesmeta[i].entryinfo.form_element_value;
              } else {
                tmpcontent[0].extra_field_content.dafaultValue = tmpcontent[0].extra_field_content.content
              }

            }

            tmpentriesmeta[i].content = tmpcontent[0];
          }
        }
        if (tmpentriesmeta[i].fields.field_type != 'html') {
          tmpentriesmeta[i]['field_type'] = tmpentriesmeta[i].fields != null ? tmpentriesmeta[i].fields.field_type : '';

        }
      };

      this.fieldConfig = tmpentriesmeta;

      this.dynamicForm = this.fb.group({
        form_id: this.fb.control(response.entryinfo.formmeta.form_id, [Validators.required]),
        created_by: this.fb.control(this.currentUser.user_id, [Validators.required]),
      });
    }

  }



  entriesMetaListValue(entriesmetaValue, content) {
    let finArr = [];
    if (entriesmetaValue.length > 1) {
      for (var m = 0; m <= entriesmetaValue.length - 1; m++) {
        let tempArr = [];
        for (var i = 0; i <= content.length - 1; i++) {
          let itr = JSON.parse(JSON.stringify(content[i]));
          let ent = JSON.parse(JSON.stringify(entriesmetaValue[m]));
          const fieldValue = Array.isArray(ent) ? ent.find(item => { return item.field_name == itr.field_name }) : '';
          if (fieldValue && fieldValue.field_value) {
            if (itr.field_type == 'checkbox') {
              itr.field_content.extra_field_content.dafaultValue = fieldValue.field_value !== "" ? fieldValue.field_value.split(',') : fieldValue.field_value;
            }
            else {
              itr.field_content.extra_field_content.dafaultValue = fieldValue.field_value;
            }
          }
          else {
            itr.field_content.extra_field_content.dafaultValue = '';
          }

          tempArr.push(itr);
          if (i == content.length - 1) {
            finArr.push(tempArr);
            tempArr = [];
          }
        }
      }
    }
    else {
      let tempArr = [];
      for (var i = 0; i <= content.length - 1; i++) {
        let itr = JSON.parse(JSON.stringify(content[i]));
        let ent = entriesmetaValue[0] && entriesmetaValue[0].length > 0 ? JSON.parse(JSON.stringify(entriesmetaValue[0])) : [];
        const fieldValue = Array.isArray(ent) ? ent.find(item => { return item.field_name == itr.field_name }) : '';
        if (fieldValue && fieldValue.field_value) {
          if (itr.field_type == 'checkbox') {
            itr.field_content.extra_field_content.dafaultValue = fieldValue.field_value !== "" ? fieldValue.field_value.split(',') : fieldValue.field_value;
          }
          else {
            itr.field_content.extra_field_content.dafaultValue = fieldValue.field_value;
          }
        }
        else {
          itr.field_content.extra_field_content.dafaultValue = '';
        }

        tempArr.push(itr);
        if (i == content.length - 1) {
          finArr = tempArr;
          tempArr = [];
        }
      }
    }
    return finArr;

  }

  Getsubmitdata(event) {
    this.forms.onSubmit(event);
    if (event !== undefined) {
      this.getData(event);
    }

  }

  getData(event) {
    let formEntry = [];
    let values;
    if (event.value !== undefined) {
      values = event.value;
      for (var i = 0; i <= this.fieldConfig.length - 1; i++) {
        let field = this.fieldConfig[i];
        if (field.fields.field_type == 'list' && values !== undefined) {
          const listdata = this.commanservice.getlistdata()
          //GetBackend Edit Entry List Fields Values
          const listFieldValues = this.getEditListFieldValues(field, listdata);
          formEntry.push({
            'form_element_id': field.form_element_id,
            'form_element_value': JSON.stringify(listFieldValues),
          });

        }
        else if (field.fields.field_type == 'checkbox' && values !== undefined) {
          formEntry.push({
            'form_element_id': field.form_element_id,
            'form_element_value': '',
          })
        }
        else {
          if (field.fields.field_type != 'button' && field.fields.field_type != 'select' && field.fields.field_type != 'hidden' && values !== undefined) {
            const field_value = (values[field.caption] instanceof Array) ? values[field.caption].toString() : values[field.caption];
            formEntry.push({
              'form_element_id': field.form_element_id,
              'form_element_value': field_value
            })
          }
          if (field.fields.field_type == 'select') {
            const field_value = (values[field.form_element_id] instanceof Array) ? values[field.form_element_id].toString() : values[field.form_element_id];
            formEntry.push({
              'form_element_id': field.form_element_id,
              'form_element_value': field_value
            })
          }

        }
        this.dynamicdata = this.commanservice.getdynamicdata() // service is call to access the dynamic field data

        if (field.fields.field_type == 'dynamic')  //here set the value of the dynamictype field
        {
          for (let j = 0; j < formEntry.length; j++) {
            if (formEntry[j].form_element_id == field.form_element_id) {
              formEntry[j].form_element_value = JSON.stringify(this.dynamicdata != undefined ? this.dynamicdata : formEntry[j].form_element_value);

            }
          }
        }
        if (field.fields.field_type == 'checkbox')  //here set the value of the check box  field
        {
          this.dynamicdata = this.commanservice.getcheckboxdata() // service is call to access the dynamic field data
          for (let j = 0; j < formEntry.length; j++) {
            if (formEntry[j].form_element_id == field.form_element_id) {
              const dynamicCheckValue = this.dynamicdata.find(item => { return item.field_id == field.form_element_id });
              formEntry[j].form_element_value = dynamicCheckValue.field_value ? dynamicCheckValue.field_value : formEntry[j].form_element_value;
            }
          }
        }
        if (field.fields.field_type == 'select')  //here set the value of the check box  field
        {

          for (let j = 0; j < formEntry.length; j++) {
            if (formEntry[j].form_element_id == field.form_element_id) {
              if (this.dynamicdata != undefined && field.form_element_id == this.dynamicdata.id) {
                formEntry[j].form_element_value = this.dynamicdata != undefined ? this.dynamicdata.form_value : formEntry[j].form_element_value;
              }

            }
          }
        }


        if (field.fields.field_type == 'upload') //here set the value of the upload field
        {
          for (let j = 0; j < formEntry.length; j++) {
            if (formEntry[j].form_element_id == field.form_element_id) {
              formEntry[j].form_element_value = this.dynamicdata != undefined ? this.dynamicdata : formEntry[j].form_element_value;
            }
          }
        }
        if (field.fields.field_type == 'time' && field.content.extra_field_content.text_format == 'text') //here set the value of the upload field
        {
          for (let j = 0; j < formEntry.length; j++) {
            if (formEntry[j].form_element_id == field.form_element_id) {
              if (this.dynamicdata != undefined && field.form_element_id == this.dynamicdata.id) {
                formEntry[j].form_element_value = this.dynamicdata != undefined ? this.dynamicdata.form_value : formEntry[j].form_element_value;
              }
            }
          }
        }
      }
      let formData = this.dynamicForm.value;
      formData['formentries'] = JSON.stringify(formEntry);
      formData['entry_id'] = this.url_id;
      delete formData['form_desc'];
      delete formData['form_title'];
      delete formData['form_type'];
      localStorage.setItem("entry", JSON.stringify(formData));
      this.isSubmit = true;
      this._formEntryService.updateEntry('update/formentry', formData)
        .subscribe(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
            this.router.navigate(['/admin/forms/entries/', this.form_id]);
            this.isSubmit = false;
          }
          else {
            this._matSnackBar.open('Form Entry Edited Fail !', 'Error', { duration: 2000 });
            this.isSubmit = false;
          }
        },
          error => this.showSnackBar(error.message, 'Retry')
        );
    }

  }

  /** LIST FIELDS VALUES FOMRATS */
  getEditListFieldValues(field = null, values = null) {
    let formElementValue = [];
    if (field && values) {
      let contentObject: any[] = [];
      if (field.content && field.content.length > 0) {
        field.content.map(item => {
          if (Array.isArray(item)) {
            const contentItem = item.map(subitem => {
              if (subitem.field_content && subitem.field_content.options && subitem.field_type == 'checkbox') {
                contentObject.push({ field_name: subitem.field_name, field_type: subitem.field_type, options: subitem.field_content.options });
              }
            });
          }
          else {
            const contentItem = Array.isArray(item) && item.length > 0 ? item[0] : item;
            if (contentItem.field_content && contentItem.field_content.options && contentItem.field_type == 'checkbox') {
              contentObject.push({ field_name: contentItem.field_name, field_type: contentItem.field_type, options: contentItem.field_content.options });
            }
          }
        });
      }

      let listmetaValues = [];
      const listfieldsValues = values;
      listfieldsValues.map(item => {
        let metaValues = [];
        Object.keys(item).map(function (key) {
          let fieldValue = Array.isArray(item[key]) ? item[key].join(",") : item[key];
          metaValues.push({ field_name: key, field_value: fieldValue });
        });
        listmetaValues.push(metaValues);
      });
      //convert checkbox boolean to actual values 
      if (listmetaValues.length > 0) {
        //IF FIELD IS CHECKBOX AND IT HAVE OPTIONS IN EXTRA CONTENT
        if (contentObject.length > 0) {
          contentObject.map(obj => {
            listmetaValues.forEach(element => {
              let checkfield = element.find(item => { return item.field_name == obj.field_name });
              if (checkfield && checkfield.field_value && obj.field_type == 'checkbox') {
                checkfield.field_value = checkfield.field_value.toString().split(',');
                const selectedPreferences = checkfield.field_value
                  .map((checked, index) => {
                    return checked == 'true' ? obj.options[index].value : null;
                  })
                  .filter(value => value !== null);
                checkfield.field_value = Array.isArray(selectedPreferences) && selectedPreferences.length > 0 ? selectedPreferences.join(',') : checkfield.field_value;
              }
            });
          });
        }

        formElementValue = listmetaValues.map(item => {
          if (Array.isArray(item)) {
            item.map(subitem => {
              if (Array.isArray(subitem.field_value)) {
                subitem.field_value = subitem.field_value.join(',');
              }
              return subitem;
            });
          }
          return item;
        });

      }
    }

    return formElementValue.length > 0 ? formElementValue : '';
  }


}
