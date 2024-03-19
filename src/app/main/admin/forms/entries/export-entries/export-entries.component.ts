import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsService } from 'app/_services';
import moment from 'moment';


@Component({
  selector: 'app-export-entries',
  templateUrl: './export-entries.component.html',
  styleUrls: ['./export-entries.component.scss']
})
export class ExportEntriesComponent implements OnInit {
  public addExport: FormGroup;
  public fieldStatus = false;
  public formsinfo: any = [];
  public formField: any = [];
  public coreField: any = [];
  public metaField: any = [];
  public filterData: any;
  public date: any;
  public dateTo: any;
  public categories

  constructor(private fb: FormBuilder,
    public router: Router,
    public dialogRef: MatDialogRef<ExportEntriesComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _formsService: FormsService) { }

  ngOnInit(): void {
    this.filterData = this.data.filterData;
    this.setControls()
    this.selectformfield(this.data.form_id)
  }

  setControls() {
    this.addExport = this.fb.group({
      type: this.fb.control('', [Validators.required]),
      start_date: this.fb.control(''),
      end_date: this.fb.control(''),
      categories: this.fb.control('')
    });
  }



  selectformfield(form_id) {
    this._formsService.getFormContent(form_id).subscribe(response => {
      //this.formsinfo = response.forminfo.formfields;
      let data = response.forminfo.formfields;

      let i = 0;
      data.forEach(item => {
        if (item.fields.field_type != 'html') {
          this.formsinfo[i] = { 'form_element_id': item.form_element_id, 'description': item.description != '' ?  item.description :  item.fields.field_label, 'isSelected': false };
          i = i + 1;
        }
      });
      this.formsinfo[i] = { 'form_element_id': 'entry_id', 'description': 'Entry Id', 'isSelected': false };
      i = i + 1;
      this.formsinfo[i] = { 'form_element_id': 'status', 'description': 'Status', 'isSelected': false };
      i = i + 1;
      this.formsinfo[i] = { 'form_element_id': 'created_at', 'description': 'Entry Date', 'isSelected': false };

    });
    this.fieldStatus = true;
  }
  allSelect(event) {
    if (event.checked == true) {
      let i = 0;
      this.formsinfo.forEach(item => {
        item.isSelected = true;
        this.formField[i] = item.form_element_id;
        i = i + 1;
      });
    } else {
      this.formField = [];
      this.formsinfo.forEach(item => {
        item.isSelected = false;
      });
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
  fromDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.date = new Date(fromDate);
  }
  toDate(event) {
    let fromDate = moment(event.value).format('YYYY-MM-DD');
    this.dateTo = new Date(fromDate);
  }
  onSaveFieldClick() {

    if (this.addExport.valid) {
      if (this.formField.length > 0) {
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
        let select_fields = { "corefields": this.coreField.join(), "metafields": this.metaField.join() };
        let exportFormData = {
          "select_fields": JSON.stringify(select_fields),
          "startdate": startDate,
          "enddate": endDate,
          "form_id": this.data.form_id,
          "type": formData.type,
          "filter_data": this.filterData ? JSON.stringify(this.filterData) : ''
        }

        this._formsService.exportEntries(exportFormData);
        this.router.navigate(['/admin/forms/entries/', this.data.form_id]);
      }
    }

  }

  Close() {
    this.dialogRef.afterClosed()
    this.router.navigate(['/admin/forms/entries/', this.data.form_id]);
  }

}

