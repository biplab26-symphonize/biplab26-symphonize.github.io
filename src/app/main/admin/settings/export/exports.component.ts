import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, AppConfig, RolesService, SettingsService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
@Component({
  selector: 'app-exports',
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ExportsComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  exportfieldsform: FormGroup;
  exportstafffieldsform: FormGroup;
  exporteventfieldsform: FormGroup;
  exporteventattendeefieldsform: FormGroup;
  exportactivitylogfieldsform: FormGroup;
  userSettings: any;
  FieldsArray: any = {
    coreFieldsArray: [],
    metaFieldsArray: [],

    coreStaffFieldsArray: [],
    metaStaffFieldsArray: [],

    coreEventFieldsArray: [],
    metaEventFieldsArray: [],

    coreEventAttendeeFieldsArray: [],
    metaEventAttendeeFieldsArray: [],

    coreActivityLogFieldsArray: [],
    metaActivityLogFieldsArray: [],

    savedExportFieldsArray: {
      corefields: [],
      metafields: []
    },
    savedStaffExportFieldsArray: {
      corefields: [],
      metafields: []
    },
    savedEventExportFieldsArray: {
      corefields: [],
      metafields: []
    },
    savedEventAttendeeExportFieldsArray: {
      corefields: [],
      metafields: []
    },
    savedActivityLogExportFieldsArray: {
      corefields: [],
      metafields: []
    }

  };
  RoleList: any;


  constructor(private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _settingsService: SettingsService,
    private _commonService: CommonService,
    private _rolesService: RolesService) {

  }

  ngOnInit() {
    this.RoleList = this._rolesService.roles.data;
    this.setFormControls();

    this._commonService.getExportFields({ type: 'export' }).then(res => {

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

  setFormControls() {
    //Export Fields Form
    this.exportfieldsform = this._formBuilder.group({
      corefields: [[], [Validators.required]],
      metafields: [[], [Validators.required]]
    });

    //staff
    this.exportstafffieldsform = this._formBuilder.group({
      corefields: [[], [Validators.required]],
      metafields: [[], [Validators.required]]
    });

    //event
    this.exporteventfieldsform = this._formBuilder.group({
      corefields: [[], [Validators.required]],
      //metafields    : [[],[Validators.required]]
      metafields: [[]]
    });

    //event attendee
    this.exporteventattendeefieldsform = this._formBuilder.group({
      corefields: [[], [Validators.required]],
      //metafields    : [[],[Validators.required]]
      metafields: [[]]
    });

    this.exportactivitylogfieldsform = this._formBuilder.group({
      corefields: [[], [Validators.required]],
      //metafields    : [[],[Validators.required]]
      metafields: [[]]
    });

  }

  patchFieldsArray(fieldsData: any) {
    this.FieldsArray.coreFieldsArray = fieldsData.users.corefields ? fieldsData.users.corefields : [];
    this.FieldsArray.metaFieldsArray = fieldsData.users.metafields ? fieldsData.users.metafields : [];

    //Staff 
    this.FieldsArray.coreStaffFieldsArray = fieldsData.staff.corefields ? fieldsData.staff.corefields : [];
    this.FieldsArray.metaStaffFieldsArray = fieldsData.staff.metafields ? fieldsData.staff.metafields : [];

    //event
    this.FieldsArray.coreEventFieldsArray = fieldsData.events.corefields ? fieldsData.events.corefields : [];
    this.FieldsArray.metaEventFieldsArray = fieldsData.events.metafields ? fieldsData.events.metafields : [];


    //event attendee
    this.FieldsArray.coreEventAttendeeFieldsArray = fieldsData.eventattendees.corefields ? fieldsData.eventattendees.corefields : [];
    this.FieldsArray.metaEventAttendeeFieldsArray = fieldsData.eventattendees.metafields ? fieldsData.eventattendees.metafields : [];

    //activity log

    this.FieldsArray.coreActivityLogFieldsArray = fieldsData.activitylog.corefields ? fieldsData.activitylog.corefields : [];
    this.FieldsArray.metaActivityLogFieldsArray = fieldsData.activitylog.metafields ? fieldsData.activitylog.metafields : [];

    //Export Fields
    this.FieldsArray.savedExportFieldsArray.corefields = fieldsData.users.saveexportfields ? fieldsData.users.saveexportfields.corefields : this.FieldsArray.savedExportFieldsArray.coreFields;
    this.FieldsArray.savedExportFieldsArray.metafields = fieldsData.users.saveexportfields ? fieldsData.users.saveexportfields.metafields : this.FieldsArray.savedExportFieldsArray.metaFields;

    //Export Staff
    this.FieldsArray.savedStaffExportFieldsArray.corefields = fieldsData.staff.saveexportfields ? fieldsData.staff.saveexportfields.corefields : this.FieldsArray.savedStaffExportFieldsArray.coreFields;
    this.FieldsArray.savedStaffExportFieldsArray.metafields = fieldsData.staff.saveexportfields ? fieldsData.staff.saveexportfields.metafields : this.FieldsArray.savedStaffExportFieldsArray.metaFields;


    //Export Event
    this.FieldsArray.savedEventExportFieldsArray.corefields = fieldsData.events.saveimportfields ? fieldsData.events.saveimportfields.corefields : this.FieldsArray.savedEventExportFieldsArray.coreFields;
    this.FieldsArray.savedEventExportFieldsArray.metafields = fieldsData.events.saveimportfields ? fieldsData.events.saveimportfields.metafields : this.FieldsArray.savedEventExportFieldsArray.metaFields;

    //Export Event Attendee
    this.FieldsArray.savedEventAttendeeExportFieldsArray.corefields = fieldsData.eventattendees.saveimportfields ? fieldsData.eventattendees.saveimportfields.corefields : this.FieldsArray.savedEventAttendeeExportFieldsArray.coreFields;
    this.FieldsArray.savedEventAttendeeExportFieldsArray.metafields = fieldsData.eventattendees.saveimportfields ? fieldsData.eventattendees.saveimportfields.metafields : this.FieldsArray.savedEventAttendeeExportFieldsArray.metaFields;

    //Export Activity Log
    this.FieldsArray.savedActivityLogExportFieldsArray.corefields = fieldsData.activitylog.saveimportfields ? fieldsData.activitylog.saveimportfields.corefields : this.FieldsArray.savedActivityLogExportFieldsArray.coreFields;
    this.FieldsArray.savedActivityLogExportFieldsArray.metafields = fieldsData.activitylog.saveimportfields ? fieldsData.activitylog.saveimportfields.metafields : this.FieldsArray.savedActivityLogExportFieldsArray.metaFields;

    //PatchValues To Form
    this.fillFormValues();
  }

  fillFormValues() {

    //Export fields values
    this.exportfieldsform.patchValue(this.FieldsArray.savedExportFieldsArray);
    this.exportstafffieldsform.patchValue(this.FieldsArray.savedStaffExportFieldsArray);
    this.exporteventfieldsform.patchValue(this.FieldsArray.savedEventExportFieldsArray);
    this.exporteventattendeefieldsform.patchValue(this.FieldsArray.savedEventAttendeeExportFieldsArray);
    this.exportactivitylogfieldsform.patchValue(this.FieldsArray.savedActivityLogExportFieldsArray);

  }

  /** ON EXPORT SUBMIT DATA */
  onExportSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.exportfieldsform.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.exportfieldsform.value, 'userexportfields', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'userexportfields', 'meta_value': JsonFormatValues }
      this._settingsService.createSetting(Settingjson)
        .then(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
          }
          else {
            this.showSnackBar(response.message, 'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message, 'CLOSE');
        });

    }
  }

  onExportStaffSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.exportstafffieldsform.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.exportstafffieldsform.value, 'staffexportfields', this.FieldsArray);

      let Settingjson = { 'meta_type': 'U', 'meta_key': 'staffexportfields', 'meta_value': JsonFormatValues }
      this._settingsService.createSetting(Settingjson)
        .then(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
          }
          else {
            this.showSnackBar(response.message, 'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message, 'CLOSE');
        });

    }
  }

  onExportEventSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.exporteventfieldsform.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.exporteventfieldsform.value, 'eventexportfields', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'eventexportfields', 'meta_value': JsonFormatValues }
      this._settingsService.createSetting(Settingjson)
        .then(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
          }
          else {
            this.showSnackBar(response.message, 'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message, 'CLOSE');
        });

    }
  }

  onExportEventAttendeeSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.exporteventattendeefieldsform.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.exporteventattendeefieldsform.value, 'exporteventattendeefields', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'exporteventattendeefields', 'meta_value': JsonFormatValues }
      this._settingsService.createSetting(Settingjson)
        .then(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
          }
          else {
            this.showSnackBar(response.message, 'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message, 'CLOSE');
        });

    }
  }

  onExportActivityLogSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.exportactivitylogfieldsform.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.exportactivitylogfieldsform.value, 'exportactivitylogfields', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'exportactivitylogfields', 'meta_value': JsonFormatValues }
      this._settingsService.createSetting(Settingjson)
        .then(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'CLOSE');
          }
          else {
            this.showSnackBar(response.message, 'RETRY');
          }
        }).catch(error => {
          this.showSnackBar(error.message, 'CLOSE');
        });

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
