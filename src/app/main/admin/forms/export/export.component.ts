import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService, FormsService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  animations: fuseAnimations
})
export class ExportComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public addExport: FormGroup;
  public formFilter: any = {};
  public formList: any;
  public formsinfo: any = [];
  public formField: any = [];
  public coreField: any = [];
  public metaField: any = [];
  public fieldStatus: boolean = false;
  public filterParams: any = [];
  public formFieldSelected: boolean = false;
  public type;
  public filterData;
  public allCheck: any = [];
  public date: any;
  public dateTo: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes 
  constructor(
    private _commonService: CommonService,
    public router: Router,
    private _matSnackBar: MatSnackBar,
    public _matDialog: MatDialog,
    private _formsService: FormsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExportComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.type = this.data.type;
    this.filterData = this.data.filterData;
    this.setControls();
    this.formFilter['column'] = '';
    this.formFilter['direction'] = '';
    this.formFilter['front'] = '1';
    this.getForms(this.formFilter);

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
  setControls() {
    this.addExport = this.fb.group({
      forms: this.fb.control('', [Validators.required]),
      type: this.fb.control('', [Validators.required]),
      start_date: this.fb.control(''),
      end_date: this.fb.control(''),
    });
  }
  getForms(params: any) {
    return this._formsService.getForms(params).then(Response => {
      this.formList = Response.data;
    });
  }
  getFormField(event) {
    this.formField = [];
    this.formsinfo = [];
    this._formsService.getFormContent(event.value).subscribe(response => {
      //this.formsinfo = response.forminfo.formfields;
      let data = response.forminfo.formfields;
      let i = 0;
      data.forEach(item => {
        if (item.fields.field_type != 'html') {
          this.formsinfo[i] = { 'form_element_id': item.form_element_id, 'description': item.description != '' ? item.description : item.fields.field_label, 'isSelected': false };
          i = i + 1;
        }
      });
      this.formsinfo[i] = { 'form_element_id': 'entry_id', 'description': 'Entry Id', 'isSelected': false };
      i = i + 1;
      this.formsinfo[i] = { 'form_element_id': 'status', 'description': 'Status', 'isSelected': false };
      i = i + 1;
      this.formsinfo[i] = { 'form_element_id': 'created_at', 'description': 'Entry Date', 'isSelected': false };
      this.fieldStatus = true;
      this.allCheck[0] = { 'isSelected': false };
    });

  }

  allSelect(event) {
    this.formField = [];
    this.metaField = [];
    this.coreField = [];
    if (event.checked == true) {
      let i = 0;
      this.formsinfo.forEach(item => {
        item.isSelected = true;
        this.formField[i] = item.form_element_id;
        i = i + 1;
      });
    } else {
      let i = 0;
      this.formsinfo.forEach(item => {
        item.isSelected = false;
        this.formField.splice(i, 1);
        i = i + 1;
      });
    }

  }
  getFormFieldId(event, id) {

    let len = this.formField.length;
    if (len > 0) {
      if (event.checked == true) {
        this.formField[len] = id;
      } else {
        let index;
        let i = 0;
        this.formField.forEach(item => {
          if (item == id) {
            index = i;
          }
          i = i + 1;
        });
        this.formField.splice(index, 1);
      }
    } else {
      this.formField[0] = id;
    }

  }
  getCoreField(event, field) {

    let len = this.coreField.length;
    if (len > 0) {
      if (event.checked == true) {
        this.coreField[len] = field;
      } else {
        let index;
        let i = 0;
        this.coreField.forEach(item => {
          if (item == field) {
            index = i;
          }
          i = i + 1;
        });
        this.coreField.splice(index, 1);
      }
    } else {
      this.coreField[0] = field;
    }

  }
  fromDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.date = new Date(fromDate);
  }
  toDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.dateTo = new Date(fromDate);
  }
  onSaveFieldClick() {
    if (this.addExport.invalid) {
      return;
    }
    if (this.formField.length > 0) {
      this.metaField = [];
      this.coreField = [];
      let k = 0;
      let m = 0;
      this.formField.forEach(item => {
        if (!isNaN(item)) {
          this.metaField[k] = item;
          k = k + 1;
        } else {
          this.coreField[m] = item;
          m = m + 1;
        }
      });

      this.formFieldSelected = false;
      let formData = this.addExport.value;
      let startDate: any;
      let endDate: any;
      if (formData.start_date != '') {
        startDate = moment(formData.start_date).format('YYYY-MM-DD')
      } else {
        startDate = '';
      }
      if (formData.end_date != '') {
        endDate = moment(formData.end_date).format('YYYY-MM-DD')
      } else {
        endDate = '';
      }
      let select_fields = { "metafields": this.metaField.join(), "corefields": this.coreField.join() };
      let exportFormData = {
        "select_fields": JSON.stringify(select_fields),
        "conditional_logic": '',
        "startdate": startDate,
        "enddate": endDate,
        "form_id": formData.forms,
        "type": formData.type,
        "filterData": this.filterData ? JSON.stringify(this.filterData) : ''
      }

      this._formsService.exportEntries(exportFormData)
       this.addExport.get('forms').setValue('');
       this.addExport.get('type').setValue('');
       this.addExport.get('start_date').setValue('');
       this.addExport.get('end_date').setValue('');
       this.formsinfo = [];
    } else {
      this.formFieldSelected = true;
    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }
}

