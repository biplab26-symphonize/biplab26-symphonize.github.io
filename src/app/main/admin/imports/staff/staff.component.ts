import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionsList, RolesService, CommonService, AppConfig, CategoryService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StaffComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  StaffImportForm: FormGroup
  public inputAccpets: string = ".xlsx,.xls";
  FormatsList: any = OptionsList.Options.importexportformat;
  RoleList: any;
  Display_File: boolean = false;
  file: any;
  format: string = '';
  departments: any = [];
  designations: any = [];

  FieldsArray: any = {
    coreFieldsArray: [],
    metaFieldsArray: [],
    savedImportFieldsArray: {
      corefields: [],
      metafields: [],
      userroles: ''
    },
    savedExportFieldsArray: {
      corefields: [],
      metafields: []
    }
  };

  constructor(private fb: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _rolesService: RolesService,
    private _commonUtils: CommonUtils,
    private _categoryService: CategoryService,
    private _commonService: CommonService) { }

  ngOnInit() {
    this._categoryService.DepartmentList.data
    this.departments = this._commonUtils.getFormatElementofDepartment(this._categoryService.DepartmentList.data);
    this.designations = this._categoryService.Categorys.data;
    this.StaffImportForm = this.fb.group({
      format: this.fb.control(''),
      corefields: [[], [Validators.required]],
      metafields: [[], [Validators.required]],
      designation: this.fb.control(''),
      departement: this.fb.control(''),
      CSV: this.fb.control('')
    })

    this._commonService.getExportFields({ type: 'import' }).then(res => {
      this.patchFieldsArray(res);
    });
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }


  patchFieldsArray(fieldsData: any) {
    this.FieldsArray.coreFieldsArray = fieldsData.users.corefields ? fieldsData.users.corefields : [];
    this.FieldsArray.metaFieldsArray = fieldsData.users.metafields ? fieldsData.users.metafields : [];
    this.FieldsArray.savedImportFieldsArray.corefields = fieldsData.users.saveimportfields ? fieldsData.users.saveimportfields.corefields : this.FieldsArray.savedImportFieldsArray.corefields;
    this.FieldsArray.savedImportFieldsArray.metafields = fieldsData.users.saveimportfields ? fieldsData.users.saveimportfields.metafields : this.FieldsArray.savedImportFieldsArray.metafields;
    //PatchValues To Form
    this.fillFormValues();
  }
  fillFormValues() {
    //Import fields Values
    this.StaffImportForm.patchValue(this.FieldsArray.savedImportFieldsArray);
  }

  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;

    this.StaffImportForm.get('CSV').setValue(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.Display_File = true;
      reader.onload = (event: any) => { // called once readAsDataURL is complete

      }
    }

  }

  /**Download Import document format csv.xlsx */
  DownloadFormat() {
    this._commonService.downloadImportFormat({ 'type': 'staff', 'format': this.format })
      .subscribe(uploadResponse => {
        // Show the success message
        this.showSnackBar(uploadResponse.message, 'CLOSE');
        if (uploadResponse.exportinfo.filepath) {
          window.open(AppConfig.Settings.url.mediaUrl + uploadResponse.exportinfo.filepath, "_blank");
        }
      },
        error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY');
        });
  }


  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  onImportSubmit() {
    // saveUserImportSettings
    event.preventDefault();
    event.stopPropagation();
    if (this.StaffImportForm.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.StaffImportForm.value, 'staffimportfields', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'staffimportfields', 'meta_value': JsonFormatValues }
      this._commonService.saveUserImportSettings(Settingjson)
        .subscribe(response => {
          let dept_id = this.StaffImportForm.get('departement').value.split(',')
          if (response.status == 200) {

            let editformData = new FormData();
            editformData.append('designation', this.StaffImportForm.get('designation').value || "");
            editformData.append('department', dept_id[0] || "");
            editformData.append('subdepartment', dept_id[1] || "");
            editformData.append('file', this.file || '');
            this._commonService.StaffImportSettings(editformData).subscribe(res => {
              if (res.status == 200) {
                this.showSnackBar(res.message, 'CLOSE');
              }
              else {
                this.showSnackBar(res.message, 'RETRY');
              }
            })

          }

        })
    }
  }


}
