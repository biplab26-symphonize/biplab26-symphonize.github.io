import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { FormentriesService, CommonService, AppConfig } from 'app/_services';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-viewentry',
  templateUrl: './viewentry.component.html',
  styleUrls: ['./viewentry.component.scss'],
  animations: fuseAnimations
}) 
export class ViewentryComponent implements OnInit {
  public dynamicForm: FormGroup;
  public currentUser: any;
  public url_id: number;
  public entry_id: number;
  public dynamicFormDataById: any;
  public pickertype: any;
  public fieldConfig: any = [];
  public timevalue: any;
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
  public minute: any;
  public twentyfourHours: any;
  public twentyfourminute: any;
  public timeformat: any;
  public timehours: any;
  listFieldDate: any = [];
  public value: any;
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
  public showdata: boolean = false;
  public checkboxarray: any;
  public SubmittedDate: any;

  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };

  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _formsEntryService: FormentriesService,
    private _commonService: CommonService,
    private dynamiclist: CommonService) {
    this.route.params.subscribe(params => {
      this.url_id = params.id;      
    });
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
    this.dateType = this.homeSettings.datetimeformat;
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    this.getField();

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  getField() {    //accessing the form enty services for for data
    this._formsEntryService.getEntries(this.url_id)
      .subscribe(response => {

        if (response.status == 200) {
          let fieldDisplaySetting = JSON.parse(response.entryinfo.formmeta.form_settings);
          this.SubmittedDate =   CommonUtils.getStringToDate(response.entryinfo.created_at);
          if (fieldDisplaySetting.formsettings.pdf.empty_fields == "N") {
            this.showdata = true;
          }
          if (response.entryinfo != null) {
            this.dynamicFormDataById = response.entryinfo.formmeta;
            this.tmpentriesmeta = CommonUtils.convertFieldsContent(response.entryinfo.formfields);
            this.tmpentriesmeta = response.entryinfo.formfields;            
            //  
            //  this. tmpFieldConfig = response.entryinfo.formmeta.formfields;
            this.entry_id = this.tmpentriesmeta[0].entryinfo.entry_id;
            this.form_title = this.dynamicFormDataById.form_title;
          }
          for (let i = 0; i <= this.tmpentriesmeta.length - 1; i++) {

            if(this.tmpentriesmeta[i].fields.field_type == 'checkbox'){       
             this.checkboxarray =   this.tmpentriesmeta[i].entryinfo.form_element_value.split(',')            
            }
          }

          for (let j = 0; j <= this.tmpentriesmeta.length - 1; j++) {
            if (this.tmpentriesmeta[j].fields.field_type == 'signature') {
              let imgurl = this.tmpentriesmeta[j].entryinfo.form_element_value;
              this.tmpentriesmeta[j].entryinfo.form_element_value = (imgurl ? AppConfig.Settings.url.mediaUrl + imgurl : "");
              
            }
          }

          for (let j = 0; j <= this.tmpentriesmeta.length - 1; j++) {
            if (this.tmpentriesmeta[j].fields.field_type == 'list') {
              this.listFieldDate = typeof this.tmpentriesmeta[j].entryinfo.form_element_value == 'string' ? JSON.parse(this.tmpentriesmeta[j].entryinfo.form_element_value) : this.tmpentriesmeta[j].entryinfo.form_element_value;
              //add field properties with values
              console.log("listFieldDate",this.listFieldDate);
              this.listFieldDate.map(item=>{
                item.map(listitem=>{
                  const fieldcontent = this.tmpentriesmeta[j].content.find(contentitem=>{
                    return contentitem.field_name==listitem.field_name;
                  });
                  
                  if(fieldcontent && fieldcontent.field_name){
                    listitem.field_type       = fieldcontent.field_type;
                    listitem.ismasking        = fieldcontent.ismasking;
                      listitem.maskingpattern = fieldcontent.maskingpattern;
                  }
                  if(fieldcontent && fieldcontent.field_content  && fieldcontent.field_content.extra_field_content){
                    listitem.pickertype = fieldcontent.field_content.extra_field_content.pickerType;
                  }
                  return listitem;
                })
              });
            }
          }

        }
      });

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

    );
    this._formsEntryService.getPrintfromentry('view/entries', params)
  }
  //  view the upload data 

  ViewUpload(ViewData) {
    window.open(ViewData);
  }
  showUrlData(Urldata) {
    window.open(Urldata);
  }
}
