import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService, FormsService } from 'app/_services';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PreviewComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public url_id: number;
  public currentUser: any;
  public dynamicForm: FormGroup;
  public dynamicFormDataById: any;
  public fieldConfig: any = [];
  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _formService: FormsService,
    private _matSnackbar: MatSnackBar
  ) {
    this.route.params.subscribe(params => {
      this.url_id = params.id;
    });
  }

  ngOnInit() {

    this.getField();
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    this.dynamicForm = this.fb.group({
      form_id: this.fb.control('', [Validators.required]),
      form_type: this.fb.control('', [Validators.required]),
      form_title: this.fb.control('', [Validators.required]),
      form_desc: this.fb.control('U', [Validators.required]),
      created_by: this.fb.control(this.currentUser.user_id, [Validators.required]),
    });

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
    this._matSnackbar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  getField() {
    let previewData = {
      'form_id': this.url_id.toString().split(',')
    };
    this._formService.formPreview(previewData)
      .subscribe(response => {
        this.dynamicFormDataById = response.forminfo;
        let tmpFieldConfig = this.dynamicFormDataById.formfields;

        for (var i = tmpFieldConfig.length - 1; i >= 0; i--) {
          if (tmpFieldConfig[i].fields != null) {
            if (tmpFieldConfig[i].fields.field_type == "list") {
              let tmpcontent = JSON.parse(tmpFieldConfig[i].content)
              tmpFieldConfig[i].content = tmpcontent;
            }

            else {
              let tmpcontent = JSON.parse(tmpFieldConfig[i].content)
              tmpFieldConfig[i].content = tmpcontent[0];
            }
          }
          tmpFieldConfig[i]['field_type'] = tmpFieldConfig[i].fields != null ? tmpFieldConfig[i].fields.field_type : '';
        };

        this.fieldConfig = tmpFieldConfig;
        this.dynamicForm = this.fb.group({
          form_id: this.fb.control(response.forminfo.form_id, [Validators.required]),
          form_type: this.fb.control(response.forminfo.form_type, [Validators.required]),
          form_title: this.fb.control(response.forminfo.form_title, [Validators.required]),
          form_desc: this.fb.control(response.forminfo.form_desc, [Validators.required]),
          created_by: this.fb.control(this.currentUser.user_id, [Validators.required]),
        });
      },
        error =>
          this._matSnackbar.open(error.message, 'Retry'));
  }

}
