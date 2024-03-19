import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
//import { MatSnackBar } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { SettingsService, CommonService, AppConfig } from 'app/_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations   : fuseAnimations
})
export class SettingsComponent implements OnInit {

  public addTableReservationSetting : FormGroup;
  public Imagetable               : FormArray;
  public tinyMceSettings = {};
  readonly EDITOR_TAB = 4;
  public file                   : File | null = null;
  filetype                      : Boolean =  false;
  url                           : string = '';
  logourl                       : string = '';
  Tablelogourl                  : any = [];
  public inputAccpets           : string = ".jpeg, .jpg, .png";
  public displayImage           : Boolean=false;
  mediaInfo: any=[];
  Imagetablevalue  : any;
  displayImg : any ;
    public accent: any;
  uploadInfo: any={
    'avatar':{'type':'defaultprofile','media_id':0,'url':"",'apimediaUrl':'media/upload'},
  };
  
  constructor(private fb : FormBuilder,
     private _settingService : SettingsService,
     private _commonService  : CommonService,
     private _matSnackBar : MatSnackBar) { }

  ngOnInit() {
    this.setControls();  
    this.tinyMceSettings = CommonUtils.getTinymceSetting();

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
        let currentData = JSON.parse(themeData);
        themeData = currentData[0];
    }    
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    
  }

    setControls(){
      this.addTableReservationSetting = this.fb.group({

        first_day_week                            : this.fb.control('sunday'),
        default_booking_status                    : this.fb.control('confirmed'),
        accept_booking_earlier                    : this.fb.control(''),
        accept_cancel_earlier                     : this.fb.control(''),
        accept_booking_days_earlier               : this.fb.control(''),
        admin_booking_confirm_subject             : this.fb.control(''),
        admin_booking_confirmation_mail_body      : this.fb.control(''),
        resident_booking_confirmation_subject     : this.fb.control(''),
        resident_booking_confirmation_mail_body   : this.fb.control(''),
        admin_booking_cancel_subject              : this.fb.control(''),
        admin_booking_cancel_mail_body            : this.fb.control(''),
        resident_booking_cancel_subject           : this.fb.control(''),
        resident_booking_cancel_mail_body         : this.fb.control(''),
        display_past_dates                        : this.fb.control('N'),
        restrict_service_registration_only_once   : this.fb.control('N'),
        guest_field_required                      : this.fb.control('Y'),
        update_service_resident_mail              : this.fb.control(''),
        update_service_resident_mail_mail_body    : this.fb.control(''),
        imagesrc                                  : this.fb.control(''),
        Imagetable                                : this.fb.array([]),
        default_image                             : this.fb.control('',[Validators.required]),
        confirmed                                 : this.fb.control('Confirmed'),
        pending                                   : this.fb.control('Pending'),
        cancelled                                 : this.fb.control('Cancelled')
  
      
        
      });
    
      this._settingService.getTableReservaitionSetting({meta_type : "table"}).then(res=>{
        this.getTabelReservationSettingData(res.data);
    })
 }


      createItem()
      {
        return this.fb.group({
      Min_table_size  : ['1',Validators.required],
      Max_table_size  : ['1',Validators.required],
      image           : ['']

        })
      }


    onAddSelectRow() {  
     
      this.Tablelogourl.push({'id':'','url':''})
      this.Imagetable = this.addTableReservationSetting.get('Imagetable') as FormArray;
      this.Imagetable.push(this.createItem());
    }

    onRemoveRow(index)
    {
      console.log('custom holidays',this.Imagetable);
      this.Tablelogourl.splice(index, 1);
      this.Imagetable.removeAt(index)
    }


    getControls() {
      //console.log('custom holiday',this.calendarcustomizationform.get('custom_holidays') as FormArray));
      return (this.addTableReservationSetting.get('Imagetable') as FormArray).controls;
    }


  getTabelReservationSettingData(response){
    console.log('response',response);
    let data ;
    let first_day_week ;                        
    let default_booking_status ;                 
    let accept_booking_earlier ;                  
    let accept_cancel_earlier ;                 
    let accept_booking_days_earlier ;  
    let restrict_service_registration_only_once;  
    let display_past_dates;  
    let guest_field_required;
    let defaultimg
    let status
    if(response.length > 0)
    {
      for(let i =0;i<response.length;i++){
        if(response[i].meta_key == "email_notification")
        {
          data = JSON.parse(response[i].meta_value);
        }
        if(response[i].meta_key == "restrict_service_registration_only_once")
        {
          restrict_service_registration_only_once = response[i].meta_value;
        }
        if(response[i].meta_key == "accept_booking_days_earlier")
        {
          accept_booking_days_earlier = response[i].meta_value;
        }
        if(response[i].meta_key == "accept_cancel_earlier")
        {
          accept_cancel_earlier = response[i].meta_value;
        }
        if(response[i].meta_key == "accept_booking_earlier")
        {
          accept_booking_earlier =  response[i].meta_value;
        }
        if(response[i].meta_key == "default_booking_status")
        {
          default_booking_status =response[i].meta_value;
        }
        if(response[i].meta_key == "first_day_week")
        {
          first_day_week = response[i].meta_value;
        }
        if(response[i].meta_key == "display_past_dates")
        {
          display_past_dates = response[i].meta_value;
        }
        if(response[i].meta_key == "guest_field_required")
        {
          guest_field_required = response[i].meta_value;
        }
        if(response[i].meta_key == "table_image")
        {
          this.Imagetablevalue = JSON.parse(response[i].meta_value);
        }
        if(response[i].meta_key == "default_image")
        {
          defaultimg =  response[i].meta_value;
          this.displayImage =true;
          this.logourl = response[i].meta_value; 
        
        }
        if(response[i].meta_key == "status_label")
        {
          status = JSON.parse(response[i].meta_value);
        }
       

      }
      
      console.log(status);
      this.addTableReservationSetting = this.fb.group({
        first_day_week                            : this.fb.control(first_day_week),
        default_booking_status                    : this.fb.control(default_booking_status),
        accept_booking_earlier                    : this.fb.control(accept_booking_earlier),
        accept_cancel_earlier                     : this.fb.control(accept_cancel_earlier),
        accept_booking_days_earlier               : this.fb.control(accept_booking_days_earlier),
        admin_booking_confirm_subject             : this.fb.control(data.admin_booking_confirmation.subject  !=""?data.admin_booking_confirmation.subject:''),
        admin_booking_confirmation_mail_body      : this.fb.control(data.admin_booking_confirmation.mail_body  !=""?  data.admin_booking_confirmation.mail_body:''),
        resident_booking_confirmation_subject     : this.fb.control(data.resident_booking_confirmation.subject !=""? data.resident_booking_confirmation.subject : '' ),
        resident_booking_confirmation_mail_body   : this.fb.control(data.resident_booking_confirmation.mail_body !=""? data.resident_booking_confirmation.mail_body :''),
        admin_booking_cancel_subject              : this.fb.control(data.admin_booking_cancellation.subject !=""? data.admin_booking_cancellation.subject :''),
        admin_booking_cancel_mail_body            : this.fb.control(data.admin_booking_cancellation.mail_body !=''? data.admin_booking_cancellation.mail_body :''),
        resident_booking_cancel_subject           : this.fb.control(data.resident_booking_cancellation.subject !='' ? data.resident_booking_cancellation.subject :''),
        resident_booking_cancel_mail_body         : this.fb.control(data.resident_booking_cancellation.mail_body !=''? data.resident_booking_cancellation.mail_body : ''),
        display_past_dates                        : this.fb.control(display_past_dates), 
        restrict_service_registration_only_once   : this.fb.control(restrict_service_registration_only_once),
        update_service_resident_mail              : this.fb.control(data.update_service_resident.subject !=""?data.update_service_resident.subject:''),
        update_service_resident_mail_mail_body    : this.fb.control(data.update_service_resident.mail_body !=""?data.update_service_resident.mail_body:''),
        guest_field_required                      : this.fb.control(guest_field_required),
        Imagetable                                : this.fb.array([]),
        default_image                             : this.fb.control(defaultimg),
        confirmed                                 : this.fb.control(status.confirmed),
        pending                                   : this.fb.control(status.pending),
        cancelled                                 : this.fb.control(status.cancelled)
  
      });
    
      if(this.Imagetablevalue){
        this.filetype =true;
        this.Imagetablevalue.map((item, index) => {
          const tempObj = {};
          tempObj['Min_table_size']      = new FormControl(item.Min_table_size);
          tempObj['Max_table_size']     = new FormControl(item.Max_table_size);
          tempObj['image']              = new FormControl(item.image);
          this.Tablelogourl.push({'id':index,'url':item.image})
          this.Imagetable           = this.addTableReservationSetting.get('Imagetable') as FormArray;
  
          this.Imagetable.push(this.fb.group(tempObj));
          //AutoComplete List
        });
      }  
           
    }
  }

get employees(): FormArray {

  return this.addTableReservationSetting.get('Imagetable') as FormArray;
} 


// set the tables img
      onSelectLogoFile(event,index) 
    {
        const file = event && event.target.files[0] || null ;
        this.file = file;
        if (event.target.files && event.target.files[0])
          {
              var reader = new FileReader();
              let selectedFile = event.target.files[0];
              reader.readAsDataURL(event.target.files[0]); // read file as data url

              reader.onload = (event: any) => 
              { // called once readAsDataURL is completed
            
                  this.mediaInfo = new FormData();
                  this.mediaInfo.append('image',this.file);
                  this.mediaInfo.append('type',  'TableReservation');
                  this._commonService.uploadfiles(this.mediaInfo)
                  .subscribe(uploadResponse=>{    
                      this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image: "");
                    // 
                      let data = this.addTableReservationSetting.get('Imagetable').value;
                      for(let i =0;i<data.length;i++){
                        data[index].image = this.uploadInfo.avatar.url;
                      } 
                      this.filetype =true;
                      this.addTableReservationSetting.get('Imagetable').setValue(data);
                      if (this.Tablelogourl.find(x => x.id == index)) {
                        this.Tablelogourl[index].url = this.uploadInfo.avatar.url;
                     }else{
                      this.Tablelogourl.splice(index, 1)
                      this.Tablelogourl.push({'id':index,'url': this.uploadInfo.avatar.url}) ;
                     }
                        console.log(this.Tablelogourl);
                  });
                  
              }
        }

    }

// set the defaut img 

    onDefautlfile(event)
    {
      const file = event && event.target.files[0] || null;
        this.file = file;
        if (event.target.files && event.target.files[0])
          {
              var reader = new FileReader();
              let selectedFile = event.target.files[0];
              reader.readAsDataURL(event.target.files[0]); // read file as data url

              reader.onload = (event: any) => 
              { // called once readAsDataURL is completed
            
                  this.mediaInfo = new FormData();
                  this.mediaInfo.append('image',this.file);
                  this.mediaInfo.append('type',  'TableReservationDefautlImg');
                  this._commonService.uploadfiles(this.mediaInfo)
                  .subscribe(uploadResponse=>{
                    console.log("upload info",uploadResponse);
                    this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image: "");
                      this.displayImage = true;
                      this.logourl = this.uploadInfo.avatar.url;
                        this.addTableReservationSetting.get('default_image').setValue(this.uploadInfo.avatar.url)
                    });
                  
              }
        }
    }




  onClickSave(){
    if(this.addTableReservationSetting.valid)
    {
      let value = this.addTableReservationSetting.value;
      console.log(value);
      let formData = {
        "first_day_week": value.first_day_week,
        "default_booking_status": value.default_booking_status,
        "accept_booking_earlier": value.accept_booking_earlier,
        "accept_cancel_earlier": value.accept_cancel_earlier,
        "accept_booking_days_earlier":value.accept_booking_days_earlier,
        "guest_field_required" : value.guest_field_required, 
        "display_past_dates":value.display_past_dates,
        "default_image"     : value.default_image,
        "table_image"  : JSON.stringify(value.Imagetable),
        "email_notification": JSON.stringify({
            "admin_booking_confirmation":{
              "subject": value.admin_booking_confirm_subject,
              "mail_body": value.admin_booking_confirmation_mail_body
            },
            "resident_booking_confirmation":{
              "subject": value.resident_booking_confirmation_subject,
              "mail_body": value.resident_booking_confirmation_mail_body
            },
            "admin_booking_cancellation":{
              "subject": value.admin_booking_cancel_subject,
              "mail_body": value.admin_booking_cancel_mail_body
            },
            "resident_booking_cancellation":{
              "subject": value.resident_booking_cancel_subject,
              "mail_body": value.resident_booking_cancel_mail_body
            },
            'update_service_resident' :{
              "subject": value.update_service_resident_mail,
              "mail_body": value.update_service_resident_mail_mail_body
            }
        }),
  
        "status_label": JSON.stringify({
          'confirmed'    : value .confirmed,
          'pending'      : value.pending,
          'cancelled'     : value.cancelled
        })
     }

    this._settingService.createTableRseravtionSetting(formData)
    .then(response =>
        {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration        : 2000
        });
        },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
                  verticalPosition: 'top',
                  duration        : 2000
          });
      });
    }
  }

 

}