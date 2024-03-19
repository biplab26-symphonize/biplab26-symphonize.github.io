import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, FieldsService, AuthService, RolesService, CommonService, ChatService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { Fields } from 'app/_models';
import { SlugifyPipe } from '@fuse/pipes/slugify.pipe';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public fieldsForm: FormGroup;
  public title: string = '';
  public columnClass: any;
  public FormTypeList: [];
  public fieldType: [];
  public field_id: number = 0;
  private user_id: number = 0;
  public field_content: FormArray;
  public extra_field_content: FormArray;
  public list_field_content: FormArray;
  public dbsettings_field: FormArray;
  public sessionInfo: any;
  public fieldDataById: any;
  public dynamicField: {};
  public tabletype: string;
  public dynamicFieldType: [];
  public maskingPatterns: any;
  public dateformat: any;
  public editFieldForm: boolean = false;
  public isSubmit: boolean = false;
  public user_data: [];
  //Field for RD type of form_field
  public userMetaFields: any[] = [];
  //Field for EF type of form_field
  public eventMetaFields: any[] = [];
  filterEventFields: any;
  public beforeDays: string = '90';
  public tinyMceSettings = {};
  // Private
  private _unsubscribeAll: Subject<any>;
  public url_id: any;
  public userId: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    private _dialog: MatDialog,
    private _chatService: ChatService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _matSnackBar: MatSnackBar,
    private _router: Router,
    private _commonService: CommonService,
    private _authService: AuthService,
    private _fieldsService: FieldsService,
    private slugifyPipe: SlugifyPipe,
    private _rolesService: RolesService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    if (this._route.routeConfig.path == 'admin/fields/edit/:id' && this._route.params['value'].id > 0) {
      this.field_id = this._route.params['value'].id;
      this.url_id = this._route.params['value'].id;
      this.editFieldForm = true;
    }

    this.title = this.field_id > 0 ? 'edit field' : 'add new field';

    this.field_content = this._formBuilder.array([]);
    this.extra_field_content = this._formBuilder.array([]);
    this.list_field_content = this._formBuilder.array([]);
    this.dbsettings_field = this._formBuilder.array([]);
    this.tinyMceSettings = CommonUtils.getTinymceSetting();
    ////////////   access the roleservice for user field////////////// 
    this._rolesService.getRoles({ data: "data" }).then(result => {
      this.user_data = result.data;

    });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.FormTypeList = OptionsList.Options.tables.formtype.fields;
    this.fieldType = OptionsList.Options.fieldtype.type;
    this.columnClass = OptionsList.Options.columnClass;
    this.user_id = this._authService.currentUserValue.token.user.id;
    this.dynamicField = OptionsList.Options.dynamicfields;
    this.dynamicFieldType = OptionsList.Options.fieldtype.dynamictype;
    this.maskingPatterns = OptionsList.Options.maskingPatterns;
    this.dateformat = OptionsList.Options.dateformat;
    this.beforeDays = this._commonService.getMinDate(); //For Datepicker Mindate
    this.setFormGroup();

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

  setFormGroup() {
    // Reactive Form
    this.fieldsForm = this._formBuilder.group({
      id: this._formBuilder.control(''),
      field_form_type: this._formBuilder.control('', [Validators.required]),
      field_type: this._formBuilder.control('', [Validators.required]),
      field_name: this._formBuilder.control('', [Validators.required]),
      field_label: this._formBuilder.control('', [Validators.required]),
      // allow_multiple :this._formBuilder.control(''),
      field_validation: this._formBuilder.control(''),
      field_required: this._formBuilder.control('Y', [Validators.required]),
      maximum_size: this._formBuilder.control(''),
      error_msg: this._formBuilder.control(''),

    });

    //Load Edit Form Values
    if (this._route.routeConfig.path == 'admin/fields/edit/:id') {
      this.fillFormValues();
      // this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      // this.getFilteredServices();
    }
    //this.setUserInfo();
    //this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this._fieldsService.getFields({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {
              this.fillFormValues();
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {
            this.fillFormValues();
          }
        }
      });
      this.showDialog();
    });

  }
  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._dialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'printentries',
        data: { type: 'updateFields', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this._router.navigate(['/admin/fields/list']);
        }
        if (result == 'preview') {
          this._router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          //this.editRestrictStaff();
        }
      });
    }
  }
  // editRestrictStaff() {
  //   this._fieldsService.updateForm(this.url_id, 'field').subscribe(response => {      
  //     this.fillFormValues();
  //   });
  // }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.rooms, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter != 2) {
        this.showPopup();
      }

    });
  }
  showPopup() {
    const dialogRef = this._dialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'updateFields', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this._router.navigate(['/admin/fields/list']);
      }
    });
  }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.user_id;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'field';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }

  // SELECTION CHANGE OF TABLE
  selectionChange(event) {
    this.tabletype = event.value;
  }

  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    var fieldData = new Fields().deserialize(this._fieldsService.field, 'single');
    this.fieldsForm.patchValue(fieldData);
    this.fieldDataById = fieldData;
    this.onChangeFieldType(fieldData.field_type, 1);
    //Check FormFieldType if RD call getUserMetaFields**
    if (this.fieldsForm.get('field_form_type').value == 'RD') {
      this.getUserMetaFields(this.fieldsForm.get('field_form_type').value);
    }
    //Check FormFieldType if EF call getUserMetaFields**
    if (this.fieldsForm.get('field_form_type').value == 'EF') {
      this.getUserMetaFields(this.fieldsForm.get('field_form_type').value);
    }
  }


  slugifyMenuAlias() {
    this.fieldsForm.get('field_label').setValue(this.fieldsForm.get('field_label').value || "");
    this.fieldsForm.get('field_name').setValue(this.slugifyPipe.transform(this.fieldsForm.get('field_label').value, '_') || "");
  }

  onChangeFieldType(event, checkCall = null) {

    let field_contentData = this.fieldsForm.value;

    if (field_contentData.field_content) {
      for (var i = field_contentData.field_content.length - 1; i >= 0; i--) {
        this.field_content.removeAt(i);
      }
    }

    if (field_contentData.extra_field_content) {
      for (var i = field_contentData.extra_field_content.length - 1; i >= 0; i--) {
        this.extra_field_content.removeAt(i);
      }
    }

    if (field_contentData.dbsettings_field) {
      for (var i = field_contentData.dbsettings_field.length - 1; i >= 0; i--) {
        this.dbsettings_field.removeAt(i);
      }
    }

    if (checkCall == 1) {
      if (event == 'textarea' || event == 'text' || event == "hidden" || event == 'password' || event == 'number' || event == 'email' || event == 'dynamic') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl(this.fieldDataById.field_validation, new FormControl(null));
        this.fieldsForm.addControl(this.fieldDataById.field_pregmatch, new FormControl(null));
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          maximum_size: this._formBuilder.control(field_contentData.extra_field_content.maximum_size),
          autofill: this._formBuilder.control(field_contentData.extra_field_content.autofill || 'N'),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          field_pregmatch: this._formBuilder.control(field_contentData.extra_field_content.field_pregmatch),
          autocomplete: this._formBuilder.control(field_contentData.extra_field_content.autocomplete),
          //masking
          ismasking: this._formBuilder.control(field_contentData.extra_field_content.ismasking || 'N'),
          maskingpattern: this._formBuilder.control(field_contentData.extra_field_content.maskingpattern || ""),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          field_current_value: this._formBuilder.control(field_contentData.extra_field_content.field_cueernt_value),
          send_email: this._formBuilder.control(field_contentData.extra_field_content.send_email),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'rating') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl(this.fieldDataById.field_validation, new FormControl(null));
        this.fieldsForm.addControl(this.fieldDataById.field_pregmatch, new FormControl(null));
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          checkedcolor: this._formBuilder.control(field_contentData.extra_field_content.checkedcolor),
          uncheckedcolor: this._formBuilder.control(field_contentData.extra_field_content.uncheckedcolor),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'checkbox') {

        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.onAddExistingRow(field_contentData.options); // this.onAddSelectRow();
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          show_label: this._formBuilder.control(field_contentData.extra_field_content.show_label),
          viewentry_show_label: this._formBuilder.control(field_contentData.extra_field_content.viewentry_show_label),
          viewentry_show_content: this._formBuilder.control(field_contentData.extra_field_content.viewentry_show_content),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'date') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          pickerType: this._formBuilder.control(field_contentData.extra_field_content.pickerType),
          min_date: this._formBuilder.control(field_contentData.extra_field_content.min_date),
          max_date: this._formBuilder.control(field_contentData.extra_field_content.max_date),
          dateformat: this._formBuilder.control(field_contentData.extra_field_content.dateformat),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          field_class: this._formBuilder.control(field_contentData.extra_field_content.field_class),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
          day_before: this._formBuilder.control(field_contentData.extra_field_content.day_before),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }


      if (event == 'upload') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          fileType: this._formBuilder.control(field_contentData.extra_field_content.fileType),
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'website') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }


      if (event == 'html') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          content: this._formBuilder.control(field_contentData.extra_field_content.content),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'select' || event == 'radio') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.onAddExistingRow(field_contentData.options); // this.onAddSelectRow();

        if (event == 'radio') {
          this.extra_field_content.push(this._formBuilder.group({
            defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
            col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
            class: this._formBuilder.control(field_contentData.extra_field_content.class),
            id: this._formBuilder.control(field_contentData.extra_field_content.id),
            field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
            inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
            field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
            field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
            isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
            show_label: this._formBuilder.control(field_contentData.extra_field_content.show_label),
            viewentry_show_label: this._formBuilder.control(field_contentData.extra_field_content.viewentry_show_label),
            viewentry_show_content: this._formBuilder.control(field_contentData.extra_field_content.viewentry_show_content),
            view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
            view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
          }));
        }
        else {
          this.extra_field_content.push(this._formBuilder.group({
            defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
            col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
            multiselect: this._formBuilder.control(field_contentData.extra_field_content.multiselect),
            class: this._formBuilder.control(field_contentData.extra_field_content.class),
            id: this._formBuilder.control(field_contentData.extra_field_content.id),
            field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
            inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
            field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
            field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
            isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
            view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
            view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
          }));
        }

        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'autocomplete') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);

        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          id: this._formBuilder.control(field_contentData.extra_field_content.id),
          field_meta_id: this._formBuilder.control(field_contentData.extra_field_content.field_meta_id),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));

        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }


      if (event == 'signature') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);

        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          pen_width: this._formBuilder.control(field_contentData.extra_field_content.pen_width),
          canvas_width: this._formBuilder.control(field_contentData.extra_field_content.canvas_width),
          canvas_height: this._formBuilder.control(field_contentData.extra_field_content.canvas_height),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));

        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }


      if (event == 'time') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(field_contentData.extra_field_content.defaultValue),
          col_class: this._formBuilder.control(field_contentData.extra_field_content.col_class),
          class: this._formBuilder.control(field_contentData.extra_field_content.class),
          time_format: this._formBuilder.control(field_contentData.extra_field_content.time_format),
          time_zone: this._formBuilder.control(field_contentData.extra_field_content.time_zone),
          text_format: this._formBuilder.control(field_contentData.extra_field_content.text_format),
          inpdf: this._formBuilder.control(field_contentData.extra_field_content.inpdf),
          isMail: this._formBuilder.control(field_contentData.extra_field_content.isMail),
          time_field_class: this._formBuilder.control(field_contentData.extra_field_content.time_field_class),
          field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_label_css_class),
          field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.field_content_css_class),
          view_entry_field_label_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_label_css_class),
          view_entry_field_content_css_class: this._formBuilder.control(field_contentData.extra_field_content.view_entry_field_content_css_class),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'dynamic') {
        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.dbsettings_field.push(this._formBuilder.group({
          is_dynamic: this._formBuilder.control(field_contentData.dbsettings.is_dynamic),
          value: this._formBuilder.control(field_contentData.dbsettings.value),
          key: this._formBuilder.control(field_contentData.dbsettings.key),
          table: this._formBuilder.control(field_contentData.dbsettings.table),
          category_type: this._formBuilder.control(field_contentData.dbsettings.category_type),
          show_as: this._formBuilder.control(field_contentData.dbsettings.show_as),
        }));

        this.fieldsForm.addControl('dbsettings', this.dbsettings_field);
      }

      if (event == 'list') {

        let field_contentData = JSON.parse(this.fieldDataById.field_content);
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          allow_multiple: this._formBuilder.control(field_contentData.extra_field_content.allow_multiple),
          max_limit: this._formBuilder.control(field_contentData.extra_field_content.max_limit)

        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

    }
    else {
      if (event == 'textarea' || event == 'text' || event == 'hidden' || event == 'password' || event == 'number' || event == 'email' || event == 'dynamic') {
        this.fieldsForm.addControl('field_validation', new FormControl(''));
        this.fieldsForm.addControl('field_pregmatch', new FormControl(''));
        this.fieldsForm.addControl('field_content', this.field_content);

        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          ismasking: this._formBuilder.control('N'),
          autofill: this._formBuilder.control('N'),
          maskingpattern: this._formBuilder.control(''),
          maximum_size: this._formBuilder.control(''),
          autocomplete: this._formBuilder.control(''),
          field_current_value: this._formBuilder.control(''),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
          send_email: this._formBuilder.control('Y'),

        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'rating') {
        this.fieldsForm.addControl('field_validation', new FormControl(''));
        this.fieldsForm.addControl('field_pregmatch', new FormControl(''));
        this.fieldsForm.addControl('field_content', this.field_content);

        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          checkedcolor: this._formBuilder.control('#ff1010'),
          uncheckedcolor: this._formBuilder.control('#000'),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }





      if (event == 'checkbox') {
        this.fieldsForm.addControl('field_content', this.field_content);
        //ADD KEY VALUE PAIR FIELDS
        if (this.fieldsForm.get('field_type').value != 'dynamic') {

          this.onAddSelectRow();
        }

        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          show_label: this._formBuilder.control('Y'),
          viewentry_show_label: this._formBuilder.control('Y'),
          viewentry_show_content: this._formBuilder.control('Y'),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
        }));

        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);

      }

      if (event == 'date') {
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          pickerType: this._formBuilder.control('both'),
          min_date: this._formBuilder.control(''),
          max_date: this._formBuilder.control(''),
          dateformat: this._formBuilder.control(''),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          field_class: this._formBuilder.control(''),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
          day_before: this._formBuilder.control('0')
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }



      if (event == 'upload') {
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          fileType: this._formBuilder.control([]),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'website') {
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }
      if (event == 'html') {
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          content: this._formBuilder.control(''),

        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'signature') {
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          pen_width: this._formBuilder.control(''),
          canvas_width: this._formBuilder.control(''),
          canvas_height: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'time') {
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          time_format: this._formBuilder.control(''),
          time_zone: this._formBuilder.control(''),
          text_format: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          time_field_class: this._formBuilder.control(''),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),

        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }




      if (event == 'select' || event == 'radio') {
        this.fieldsForm.addControl('field_validation', new FormControl(''));
        this.fieldsForm.addControl('field_pregmatch', new FormControl(''));
        this.fieldsForm.addControl('field_content', this.field_content);
        if (this.fieldsForm.get('field_type').value != 'dynamic') {

          this.onAddSelectRow();
        }

        if (event == 'radio') {
          this.extra_field_content.push(this._formBuilder.group({
            defaultValue: this._formBuilder.control(''),
            col_class: this._formBuilder.control('col-sm-12'),
            class: this._formBuilder.control(''),
            id: this._formBuilder.control(''),
            field_meta_id: this._formBuilder.control(''),
            inpdf: this._formBuilder.control('Y'),
            isMail: this._formBuilder.control('Y'),
            field_label_css_class: this._formBuilder.control(''),
            field_content_css_class: this._formBuilder.control(''),
            show_label: this._formBuilder.control('Y'),
            viewentry_show_label: this._formBuilder.control('Y'),
            viewentry_show_content: this._formBuilder.control('Y'),
            view_entry_field_label_css_class: this._formBuilder.control(''),
            view_entry_field_content_css_class: this._formBuilder.control(''),
          }));
        }
        else {
          this.extra_field_content.push(this._formBuilder.group({
            defaultValue: this._formBuilder.control(''),
            col_class: this._formBuilder.control('col-sm-12'),
            multiselect: this._formBuilder.control('N'),
            class: this._formBuilder.control(''),
            id: this._formBuilder.control(''),
            field_meta_id: this._formBuilder.control(''),
            inpdf: this._formBuilder.control('Y'),
            isMail: this._formBuilder.control('Y'),
            field_label_css_class: this._formBuilder.control(''),
            field_content_css_class: this._formBuilder.control(''),
            view_entry_field_label_css_class: this._formBuilder.control(''),
            view_entry_field_content_css_class: this._formBuilder.control(''),
          }));
        }

        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'list') {
        this.fieldsForm.addControl('field_validation', new FormControl(''));
        this.fieldsForm.addControl('field_pregmatch', new FormControl(''));
        this.fieldsForm.addControl('field_content', this.field_content);
        this.extra_field_content.push(this._formBuilder.group({
          allow_multiple: this._formBuilder.control('N'),
          max_limit: this._formBuilder.control('')

        }));
        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);

      }

      if (event == 'autocomplete') {
        this.fieldsForm.addControl('field_content', this.field_content);

        this.extra_field_content.push(this._formBuilder.group({
          defaultValue: this._formBuilder.control(''),
          col_class: this._formBuilder.control('col-sm-12'),
          class: this._formBuilder.control(''),
          id: this._formBuilder.control(''),
          field_meta_id: this._formBuilder.control(''),
          inpdf: this._formBuilder.control('Y'),
          isMail: this._formBuilder.control('Y'),
          field_label_css_class: this._formBuilder.control(''),
          field_content_css_class: this._formBuilder.control(''),
          view_entry_field_label_css_class: this._formBuilder.control(''),
          view_entry_field_content_css_class: this._formBuilder.control(''),
        }));

        this.fieldsForm.addControl('extra_field_content', this.extra_field_content);
      }

      if (event == 'dynamic') {
        this.fieldsForm.addControl('field_content', this.field_content);

        this.dbsettings_field.push(this._formBuilder.group({
          is_dynamic: this._formBuilder.control('Y'),
          table: this._formBuilder.control(''),
          value: this._formBuilder.control(''),
          key: this._formBuilder.control(''),
          category_type: this._formBuilder.control(''),
          show_as: this._formBuilder.control(''),
        }));

        this.fieldsForm.addControl('dbsettings', this.dbsettings_field);

      }

    }


  }

  onAddSelectRow() {
    this.field_content.push(this.createItemFormGroup());
  }

  onAddExistingRow(rowData) {
    for (var i = 0; i <= rowData.length - 1; i++) {
      this.field_content.push(this.updateItemFormGroup(rowData[i]));
    }
  }

  updateItemFormGroup(rowData) {
    return this._formBuilder.group({
      key: this._formBuilder.control(rowData.key, Validators.required),
      value: this._formBuilder.control(rowData.value, Validators.required)
    });
  }

  createItemFormGroup(): FormGroup {
    return this._formBuilder.group({
      key: this._formBuilder.control('', Validators.required),
      value: this._formBuilder.control('', Validators.required)
    });
  }

  onRemoveRow(idx) {
    this.field_content.removeAt(idx);
  }

  removeEventData() {
    this.fieldsForm.controls['extra_field_content']['controls'][0]['controls']['event_name'].setValue('');
    this.fieldsForm.controls['extra_field_content']['controls'][0]['controls']['event_fn'].setValue('');
  }

  is_required_Change(event) {
    if (event == 'N') {
      this.fieldsForm.get('error_msg').clearValidators();
    }
    if (event == 'Y') {
      this.fieldsForm.get('error_msg').setValidators([Validators.required]);
    }
    this.fieldsForm.get('error_msg').setValue('');
    this.fieldsForm.get('error_msg').updateValueAndValidity();
  }

  onSaveFieldClick(event: Event) {

    event.preventDefault();
    event.stopPropagation();

    if (this.fieldsForm.valid) {

      this.isSubmit = true;
      let fieldData = this.fieldsForm.value;
      if (fieldData.field_type === 'list') {
        let data: any = {
          "error_msg": fieldData.error_msg, 'allow_multiple': fieldData.extra_field_content.allow_multiple,
          'max_limit': fieldData.extra_field_content.max_limit
        }
        fieldData.field_content = {
          "extra_field_content": data
        }
        fieldData.field_content = JSON.stringify(fieldData.field_content);
      }

      else {
        let tmp_field_content = [...fieldData.field_content];
        fieldData.field_content = [];
        let final_content: any = {};

        if (fieldData.field_type == 'dynamic') {
          final_content['dbsettings'] = { ...fieldData.dbsettings[0] }; //Dynamic data is Add in FormFields

        }
        final_content['options'] = [...tmp_field_content];
        final_content['extra_field_content'] = fieldData.extra_field_content ? { ...fieldData.extra_field_content[0] } : {};
        final_content['extra_field_content']['error_msg'] = fieldData.error_msg;
        final_content['extra_field_content']['show_field'] = '';
        final_content['extra_field_content']['current_date'] = '';
        fieldData.field_content = JSON.stringify(final_content);
        delete fieldData['extra_field_content'];
        delete fieldData['error_msg'];
      }

      fieldData['created_by'] = this.user_id

      if (fieldData.field_pregmatch == null) {
        fieldData.field_pregmatch = '';
      }
      if (fieldData.field_type == 'dynamic') {
        if (fieldData.field_validation) {
          fieldData.field_validation = '';
        }
        if (fieldData.field_pregmatch) {
          fieldData.field_pregmatch = '';
        }
      }
      this._fieldsService.createFields(fieldData, this.editFieldForm)
        .subscribe(response => {
          this.isSubmit = false;
          if (response.status == 200) {
            this._matSnackBar.open(response.message, 'Success', {
              verticalPosition: 'top',
              duration: 2000
            });
            this._router.navigate(['admin/fields/list']);
          }
        },
          error => console.log(error));
    }
    else {
      CommonUtils.validateAllFormFields(this.fieldsForm);
    }
  }
  /** Get UsermetaFields */
  getUserMetaFields($event: any) {

    if ($event == 'RD') {
      this._fieldsService.getFields({ field_form_type: 'U' }).then(fieldInfo => {
        this.userMetaFields = fieldInfo.data || [];
      });


    }
    if ($event == 'EF') {
      this._fieldsService.getFields({ field_form_type: 'E' }).then(fieldInfo => {
        this.eventMetaFields = fieldInfo.data || [];

      });
    }
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
