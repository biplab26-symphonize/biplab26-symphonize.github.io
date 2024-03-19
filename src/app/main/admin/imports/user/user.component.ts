import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, AppConfig, RolesService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  file: File;
  FormatsList: any = OptionsList.Options.importexportformat;
  UserImportForm: FormGroup
  format: string = '';
  RoleList: any;
  Display_File: boolean = false;

  public inputAccpets: string = ".xlsx,.xls";
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
  uploadInfo: any = {
    'importusers': { 'type': 'importusers', 'media_id': 0, 'formControlName': 'importusers', 'url': "", 'apimediaUrl': 'import/users' }
  };
  constructor(private fb: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _rolesService: RolesService,
    private _commonService: CommonService) { }


  ngOnInit() {

    this.RoleList = this._rolesService.roles.data;
    this.UserImportForm = this.fb.group({
      format: this.fb.control(''),
      corefields: [[], [Validators.required]],
      metafields: [[], [Validators.required]],
      userroles: ['', [Validators.required]],
      existuserupdate: this.fb.control('', [Validators.required]),
      CSV: this.fb.control('', [Validators.required]),
      file: this.fb.control('', [Validators.required]),
      updateexistingrole: this.fb.control('', [Validators.required]),
      updatemetavalue: this.fb.control('', [Validators.required]),
      sendmail: this.fb.control(''),
      sendemailto: this.fb.control(''),
      custompassword: this.fb.control('')
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
    this.UserImportForm.patchValue(this.FieldsArray.savedImportFieldsArray);
  }


  /**Download Import document format csv.xlsx */
  DownloadFormat() {
    this._commonService.downloadImportFormat({ 'type': 'users', 'format': this.format })
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

  onSelectLogoFile(event) {
    this.file = event && event.target.files[0] || null
    this.UserImportForm.get('file').setValue(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.Display_File = true;
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is complete

      }
    }

  }

  onImportSubmit() {
    // saveUserImportSettings
    event.preventDefault();
    event.stopPropagation();
    if (this.UserImportForm.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.UserImportForm.value, 'userimportfields', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'userimportfields', 'meta_value': JsonFormatValues }
      this._commonService.saveUserImportSettings(Settingjson)
        .subscribe(response => {
          if (response.status == 200) {

            let sendmail = this.UserImportForm.get('sendmail').value == true ? 1 : 0;
            let sendmailto = this.UserImportForm.get('sendemailto').value == true ? 'A' : 'C';
            this.UserImportForm.get('sendmail').setValue(sendmail);
            let editformData = new FormData();
            editformData.append('existuserupdate', this.UserImportForm.get('existuserupdate').value || "");
            editformData.append('updateexistingrole', this.UserImportForm.get('updateexistingrole').value || "");
            editformData.append('updatemetavalue', this.UserImportForm.get('updatemetavalue').value || '');
            editformData.append('custompassword', this.UserImportForm.get('custompassword').value || '');
            editformData.append('roleid', this.UserImportForm.get('userroles').value || '');
            editformData.append('sendmail', this.UserImportForm.get('sendmail').value || '');
            editformData.append('sendmailto', sendmailto)
            editformData.append('file', this.file || "");
            this._commonService.saveUserOtherImportSettings(editformData).subscribe(res => {
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

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }

}
