import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService, CommonService, AppConfig, OptionsList } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EventsComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  eventImportForm: FormGroup;
  format: '';
  Display_File: boolean = false;
  file: any;
  FormatsList: any = OptionsList.Options.importexportformat;
  inputAccpets: string = ".csv, .xlsx, .json";
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
  constructor(
    private fb: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _commonService: CommonService,
    private _rolesService: RolesService,
  ) { }

  ngOnInit() {

    this.eventImportForm = this.fb.group({
      format: this.fb.control(''),
      corefields: [[], [Validators.required]],
      metafields: [[], [Validators.required]],
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
    this.eventImportForm.patchValue(this.FieldsArray.savedImportFieldsArray);
  }

  /**Download Import document format csv.xlsx */
  DownloadFormat() {
    this._commonService.downloadImportFormat({ 'type': 'events', 'format': this.format })
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

  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;

    this.eventImportForm.get('CSV').setValue(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.Display_File = true;
      reader.onload = (event: any) => { // called once readAsDataURL is complete

      }
    }

  }

  onImportSubmit() {
    // saveUserImportSettings
    event.preventDefault();
    event.stopPropagation();
    if (this.eventImportForm.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.eventImportForm.value, 'eventimportfields', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'eventimportfields', 'meta_value': JsonFormatValues }
      this._commonService.saveUserImportSettings(Settingjson)
        .subscribe(response => {
          if (response.status == 200) {
            let editformData = new FormData();
            editformData.append('file', this.file || '');
            this._commonService.EventImportSettings(editformData).subscribe(res => {
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
