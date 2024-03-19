import { Component, OnInit } from '@angular/core';
import { SettingsService, CommonService, RolesService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {
  // Private
  private _unsubscribeAll: Subject<any>;
  public green_bg_header: any;
  public button: any;
  public accent: any;

  directoryform: FormGroup;
  public user_list: any = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  FieldsArray: any = {
    coreFieldsArray: [],
    metaFieldsArray: [],
    profilecoreFieldsArray: [],
    profilemetaFieldsArray: [],
    neighbourcorefieldsArray: [],
    neighbourmetafieldsArray: [],
    savedFieldsArray: {
      corefields: [],
      metafields: [],
      profilecorefields: [],
      profilemetafields: [],
      neighbourcorefields: [],
      neighbourmetafields: [],
      printoptions: {
        showcorefields: [],
        showmetafields: []
      },
      filteroptions: {
        filtercorefields: [],
        filtermetafields: []
      },
      subtractdays: 0,
      user_limit: 0,
      alpha_sorting: '',
      newest_neighbours: '',
      letter_sorting: '',
      directory_view: '',
      edit_user_access: [],
      show_in_list: 'N'
    }
  };
  RoleList: any;

  constructor(
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _settingsService: SettingsService,
    private _commonService: CommonService,
    private _rolesService: RolesService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.RoleList = this._rolesService.roles.data;

    //Form Group
    this.setFormControls();
    //Get Fields Data On Load
    this.patchFieldsArray(this._commonService.usersettings);

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
  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.directoryform = this._formBuilder.group({
      corefields: [[], [Validators.required]],
      metafields: [[], [Validators.required]],
      profilecorefields: [[]],
      profilemetafields: [[]],
      printoptions: this._formBuilder.group({
        showcorefields: ['', [Validators.required]],
        showmetafields: ['', [Validators.required]]
      }),
      filteroptions: this._formBuilder.group({
        filtercorefields: ['', [Validators.required]],
        filtermetafields: ['', [Validators.required]]
      }),
      subtractdays: ['', [Validators.required]],
      user_limit: ['', [Validators.required]],
      alpha_sorting: ['', [Validators.required]],
      newest_neighbours: ['', [Validators.required]],
      letter_sorting: ['', [Validators.required]],
      directory_view: ['', [Validators.required]],
      edit_user_access: [[], [Validators.required]],
      show_in_list: ['N', [Validators.required]],
      neighbourcorefields: [[], [Validators.required]],
      neighbourmetafields: [[], [Validators.required]],
    });
  }

  /** Patch FieldsArray Values with Api Response */
  patchFieldsArray(fieldsData: any) {
    this.FieldsArray.coreFieldsArray = fieldsData.corefields ? fieldsData.corefields : [];
    this.FieldsArray.metaFieldsArray = fieldsData.metafields ? fieldsData.metafields : [];
    //profile fields
    this.FieldsArray.profilecoreFieldsArray = fieldsData.profilecorefields ? fieldsData.profilecorefields : this.FieldsArray.coreFieldsArray;
    this.FieldsArray.profilemetaFieldsArray = fieldsData.profilemetafields ? fieldsData.profilemetafields : this.FieldsArray.metaFieldsArray;

    this.FieldsArray.neighbourcorefieldsArray = fieldsData.neighbourcorefields ? fieldsData.neighbourcorefields : [];
    this.FieldsArray.neighbourmetafieldsArray = fieldsData.neighbourmetafields ? fieldsData.neighbourmetafields : [];
    this.FieldsArray.savedFieldsArray = fieldsData.directoryfields ? fieldsData.directoryfields : this.FieldsArray.savedFieldsArray;
    //PatchValues To Form
    this.fillFormValues();
  }


  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    //Import fields Values
    this.directoryform.patchValue(this.FieldsArray.savedFieldsArray);
  }

  /**SAVE IMPORT FIELDS DATA */
  onSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.directoryform.valid) {
      //get Formatted string to save in MetaValue column
      let JsonFormatValues = CommonUtils.getSettingsJsonFormat(this.directoryform.value, 'residentdirectorysearch', this.FieldsArray);
      let Settingjson = { 'meta_type': 'U', 'meta_key': 'residentdirectorysearch', 'meta_value': JsonFormatValues }

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
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}