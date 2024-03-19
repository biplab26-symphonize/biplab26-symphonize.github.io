import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { FormentriesService, CommonService, AppConfig, SettingsService } from 'app/_services';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-entries',
  templateUrl: './view-entries.component.html',
  styleUrls: ['./view-entries.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ViewEntriesComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public newform: FormGroup;
  public currentUser: any;
  public url_id: number;
  public entry_id: number;
  public dynamicFormDataById: any;
  public pickertype: any;
  public fieldConfig: any = [];
  public tmpentriesmeta: any;
  public tmpFieldConfig: any;
  public dateType: any;
  public datepickerdate: any;
  datepickertime: any;
  public dynamicdata: any = [];
  public newEntrysData: any;
  public dynamicfield: any;
  public form_element_value: any;
  public pickertypesdate: any;
  public pickertypetime: any;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public generalSettings: any = {};
  public homeSettings: any = {};
  dynamiclistdata: any = [];
  public newValue: any = [];
  public Hours: any;
  public twentyfourHours: any;
  public twentyfourminute: any;
  public minute: any;
  public timeformat: any;
  public timehours: any;
  public form_title
  public params: object = { table: "", category_type: "", roles: "" };
  table = "";
  category_type = "";
  rating: any;
  checkcolor: any;
  uncheckcolor: any;
  roles = "";
  type: any;
  public content: any;
  listFieldDate: any = [];
  checkboxarray: any = [];
  ApprovalSetting: any = [];
  CurrentUser_id: any;
  Current_status: any;
  Form_id: any;
  edited_by: any;
  EmailFieldValue: any = [];
  NoteEntries: any = [];
  defaultImg: any = [];
  Checkeditems: any = [];
  includes: any;
  public statusName: any = [];
  SubmittedDate: any;
  showApproval: boolean = false;
  ShowAddButton :boolean = true;


  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };


  constructor(
    private route: ActivatedRoute,
    private _formsEntryService: FormentriesService,
    private _commonService: CommonService,
    private _matSnackBar: MatSnackBar,
    private formentries: FormentriesService,
    private settingsservices: SettingsService,
    private _settingsService: SettingsService,
    private fb: FormBuilder,) {
    this.route.params.subscribe(params => {
      this.url_id = params.id;
    });


  }

  ngOnInit() {

    this.newform = this.fb.group({
      notes: this.fb.control('', Validators.required),
      email: this.fb.control(''),
      subject: this.fb.control('')

    })
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
    this.dateType = this.homeSettings.datetimeformat;
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    // user id get 
    this.CurrentUser_id = JSON.parse(localStorage.getItem('token')).user_id;

    this.getField();

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.settingsservices.getSetting({
      'meta_type': 'F',
      'meta_key': 'form-settings'
    }).then(response => {
      this.statusName = JSON.parse(response.settingsinfo.meta_value);
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

  getField() {    //accessing the form enty services for for data
    this._formsEntryService.getEntries(this.url_id)
      .subscribe(response => {
        if (response.status == 200) {

          if (response.entryinfo != null) {
            this.dynamicFormDataById = response.entryinfo.formmeta;
            this.ApprovalSetting = response.entryinfo.formapproval;
            this.SubmittedDate = response.entryinfo.created_at;
            this.Current_status = response.entryinfo.status;
            this.Form_id = response.entryinfo.form_id;
            this.edited_by = response.entryinfo.edited_by;
            if (response.entryinfo.entriesnote.length !== 0) {
              this.NoteEntries = response.entryinfo.entriesnote;
              this.setImage(this.NoteEntries);

            }

            for (let i = 0; i < response.entryinfo.formapproval.length; i++) {
              if (response.entryinfo.formapproval[i].user && response.entryinfo.formapproval[i].user.id == this.CurrentUser_id) {
                this.showApproval = true;
                console.log("hiiiiiiiiiiiiii");
              }
            }
            this.tmpentriesmeta = CommonUtils.convertFieldsContent(response.entryinfo.formfields);
            //  this. tmpFieldConfig = response.entryinfo.formmeta.formfields;

            // this.entry_id = this.tmpentriesmeta[0].entryinfo.entry_id;
            this.form_title = this.dynamicFormDataById.form_title;

          }
          for (let i = 0; i <= this.tmpentriesmeta.length - 1; i++) {

            if (this.tmpentriesmeta[i].entryinfo != null) {
              this.entry_id = this.tmpentriesmeta[i].entryinfo.entry_id;
            }
            if (this.tmpentriesmeta[i].fields.field_type == 'checkbox') {
              this.checkboxarray = this.tmpentriesmeta[i].entryinfo.form_element_value;
            }

            if (this.tmpentriesmeta[i].fields.field_type == 'email') {
              this.EmailFieldValue.push(this.tmpentriesmeta[i].entryinfo.form_element_value);
            }

          }

          for (let j = 0; j <= this.tmpentriesmeta.length - 1; j++) {
            if (this.tmpentriesmeta[j].fields.field_type == 'list') {
              if (this.tmpentriesmeta[j].entryinfo != null) {
                this.listFieldDate = typeof this.tmpentriesmeta[j].entryinfo.form_element_value == 'string' ? JSON.parse(this.tmpentriesmeta[j].entryinfo.form_element_value) : this.tmpentriesmeta[j].entryinfo.form_element_value;

                //add field properties with values
                if (this.listFieldDate) {
                  this.listFieldDate.map(item => {
                    item.map(listitem => {
                      const fieldcontent = this.tmpentriesmeta[j].content.find(contentitem => {
                        return contentitem.field_name == listitem.field_name;
                      });

                      if (fieldcontent && fieldcontent.field_name) {
                        listitem.field_type = fieldcontent.field_type;
                        listitem.ismasking = fieldcontent.ismasking;
                        listitem.maskingpattern = fieldcontent.maskingpattern;
                      }
                      if (fieldcontent && fieldcontent.field_content && fieldcontent.field_content.extra_field_content) {
                        listitem.pickertype = fieldcontent.field_content.extra_field_content.pickerType;
                      }
                      return listitem;
                    })
                  });
                }
              }

            }
          }

          for (let j = 0; j <= this.tmpentriesmeta.length - 1; j++) {

            if (this.tmpentriesmeta[j].fields.field_type == 'signature') {

              let imgurl = this.tmpentriesmeta[j].entryinfo.form_element_value;
              this.tmpentriesmeta[j].entryinfo.form_element_value = (imgurl ? AppConfig.Settings.url.mediaUrl + imgurl : "");
            }
          }

        }
      });

  }


  // include check box value 
  includenotes(event) {
    if (event.checked) {
      this.includes = '1'

    }
    if (!event.checked) {
      this.includes = ''
    }
  }
  // print display the value
  getPrint() {

    let params = [];
    params.push(
      {
        'entry_id': this.url_id
      },
      {
        'print': '1'
      },
      {
        'notes': this.includes
      }

    );
    this._formsEntryService.getPrintfromentry('view/entries', params)
  }


  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }


  // view the upload data
  ViewUpload(ViewData) {
    window.open(ViewData);
  }
  setImage(NoteEntries) {

    for (let item of NoteEntries) {
      if (item.usermeta.usermedia.length !== 0) {
        this.uploadInfo.avatar.url = (item.usermeta.usermedia[0].media.image ? AppConfig.Settings.url.mediaUrl + item.usermeta.usermedia[0].media.image : "");
        this.defaultImg.push(this.uploadInfo.avatar.url);
      } else {
        this._settingsService.getSetting({ 'meta_key': 'users_settings' }).then(res => {
          let profile = JSON.parse(res.settingsinfo.meta_value);
          this.uploadInfo.avatar.url = (profile.users_settings.defaultprofile ? AppConfig.Settings.url.mediaUrl + profile.users_settings.defaultprofile : "");
          this.defaultImg.push(this.uploadInfo.avatar.url);
        })
      }
    }
  }

  // show the  Url  field data 
  showUrlData(UrlData) {
    window.open(UrlData);
  }

  //  on add notes button 
  AddTheNote() {
    let value = this.newform.value;
    this.ShowAddButton = false;
    let FormData = {
      'entry_id': this.entry_id,
      'user_id': this.CurrentUser_id,
      'note': value.notes,
      'email': value.email,
      'subject': value.subject
    }

    this.formentries.addTheNotes(FormData).subscribe(res => {

      this.showSnackBar(res.message, 'CLOSE');

      this._formsEntryService.getEntries(this.url_id)
        .subscribe(response => {
          if (response.status == 200) {
            if (response.entryinfo != null) {
              
              this.dynamicFormDataById = response.entryinfo.formmeta;
              this.ApprovalSetting = response.entryinfo.formapproval;
              this.Current_status = response.entryinfo.status;
              this.Form_id = response.entryinfo.form_id;
              this.edited_by = response.entryinfo.edited_by;
              this.NoteEntries = response.entryinfo.entriesnote;
              this.setImage(this.NoteEntries);
              this.newform.get('notes').reset();
              this.newform.get('email').setValue('');
              this.newform.get('subject').setValue('')
              this.ShowAddButton = true;
            }

          }
        });

    },
      error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY');
      });

  }

  // delete the noties
  onChangecheckbox(value, event) {

    if (event.checked) {
      this.Checkeditems.push(value); //if value is not  checked..

    }
    if (!event.checked) {
      let index
      for (let i = 0; i < this.Checkeditems.length; i++) {

        if (this.Checkeditems[i] == value) {
          index = i;
        }
      }
      if (index > -1) {
        this.Checkeditems.splice(index, 1); //if value is checked ...
      }
    }
  }


  // delete the notes 

  deleteAll() {
    this._formsEntryService.deleteNotes({ 'id': this.Checkeditems }).subscribe(Response => {
      this.showSnackBar(Response.message, 'CLOSE');
      this._formsEntryService.getEntries(this.url_id)
        .subscribe(response => {
          if (response.status == 200) {
            this.dynamicFormDataById = response.entryinfo.formmeta;
            this.ApprovalSetting = response.entryinfo.formapproval;
            this.Current_status = response.entryinfo.status;
            this.Form_id = response.entryinfo.form_id;
            this.edited_by = response.entryinfo.edited_by;
            this.NoteEntries = response.entryinfo.entriesnote;
            this.setImage(this.NoteEntries);
            this.Checkeditems = [];
          }
        });
    },

      error => {
        // Show the error message
        this.showSnackBar(error.message, 'Retry');
      });
  }
  // changes the status of the enrty 
  statusChange(value) {
    let formvalue = {
      'entry_id': this.entry_id,
      'status': value,
      'form_id': this.Form_id,
      'edited_by': this.CurrentUser_id
    }

    this._formsEntryService.formEntryStatus(formvalue)
      .subscribe(response => {
        this.showSnackBar(response.message, 'CLOSE');

        this._formsEntryService.getEntries(this.url_id)
          .subscribe(response => {
            if (response.status == 200) {
              this.dynamicFormDataById = response.entryinfo.formmeta;
              this.ApprovalSetting = response.entryinfo.formapproval;
              this.Current_status = response.entryinfo.status;
              this.Form_id = response.entryinfo.form_id;
              this.edited_by = response.entryinfo.edited_by;
            }
          });

      },
        error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY');
        });
  }

}

