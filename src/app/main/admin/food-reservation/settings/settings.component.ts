import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
//import { MatSnackBar } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { SettingsService,UsersService,RolesService, CommonService, AppConfig } from 'app/_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations   : fuseAnimations
})
export class SettingsComponent implements OnInit {

  public addFoodReservationSetting : FormGroup;
  public tinyMceSettings = {};
  readonly EDITOR_TAB = 4;
  public roleList      :  any=[];
  public userList      :  any=[];
  public selectedUsers :  any=[];
  private file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  mediaInfo: any = [];
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  
  constructor(private fb : FormBuilder,
   private _settingService : SettingsService,
   private _commonService  : CommonService,
   private _matSnackBar : MatSnackBar,
   private _usersService    : UsersService,
   private _rolesService    : RolesService) { }

  ngOnInit() {
    this.setControls();
    console.log('roles service',this._rolesService.roles);
    this.roleList    = this._rolesService.roles.data;  
    
    this.tinyMceSettings = CommonUtils.getTinymceSetting();
    
  }

  //access the user according the roles 
  selectedRoll(event){
    console.log('in selected role',event.value);
    this._usersService.getUsers({'roles':event.value}).then(Response=>{
      console.log('response',Response);
      this.userList   = Response.data; 
    });
  }

  selectedUser($event){
    this.selectedUsers = $event;
  }

  setControls(){
    this.addFoodReservationSetting = this.fb.group({
      first_day_week                            : this.fb.control('sunday'),
      default_booking_status                    : this.fb.control('confirmed'),
      userrole_id                               : this.fb.control('',[Validators.required]),
      admin_user                                : this.fb.control('',[Validators.required]),
      custom_admin_email                        : this.fb.control(''),
      admin_order_confirm_subject               : this.fb.control(''),
      admin_order_confirmation_mail_body        : this.fb.control(''),
      resident_order_confirmation_subject       : this.fb.control(''),
      resident_order_confirmation_mail_body     : this.fb.control(''),
      admin_order_cancel_subject                : this.fb.control(''),
      admin_order_cancel_mail_body              : this.fb.control(''),
      resident_order_cancel_subject             : this.fb.control(''),
      resident_order_cancel_mail_body           : this.fb.control(''),
      image                                     : this.fb.control('')
    });

    let response = this._settingService.foodSetting;
    this.getFoodSettingData(response.data); 
  

  }

  getFoodSettingData(response){
    // let data =JSON.parse(response[0].meta_value);
    // console.log('dd',response[2].meta_value.split(',').map(Number));
    let data ;
    let first_day_week ;                        
    let default_booking_status ;                 
    let userrole_id ;                  
    let admin_user ;                 
    let custom_admin_email ;
    let image;  

    /*this.addFoodReservationSetting = this.fb.group({
      first_day_week                            : this.fb.control(response[4].meta_value),
      default_booking_status                    : this.fb.control(response[3].meta_value),
      userrole_id                               : this.fb.control('',[Validators.required]),
      admin_user                                : this.fb.control(response[2].meta_value.split(',').map(Number)),
      custom_admin_email                        : this.fb.control(response[1].meta_value),
      admin_order_confirm_subject               : this.fb.control(data.admin_order_confirmation.subject),
      admin_order_confirmation_mail_body        : this.fb.control(data.admin_order_confirmation.mail_body),
      resident_order_confirmation_subject       : this.fb.control(data.resident_order_confirmation.subject ),
      resident_order_confirmation_mail_body     : this.fb.control(data.resident_order_confirmation.mail_body),
      admin_order_cancel_subject                : this.fb.control(data.admin_order_cancellation.subject),
      admin_order_cancel_mail_body              : this.fb.control(data.admin_order_cancellation.mail_body),
      resident_order_cancel_subject             : this.fb.control(data.resident_order_cancellation.subject),
      resident_order_cancel_mail_body           : this.fb.control(data.resident_order_cancellation.mail_body)
     
    });*/


    if(response.length > 0)
    { 
      console.log(response);
      for(let i =0;i<response.length;i++){
        if(response[i].meta_key == "email_notification")
        {
          data = JSON.parse(response[i].meta_value);
        }
       
        if(response[i].meta_key == "custom_admin_email")
        {
          custom_admin_email = response[i].meta_value;
        }
        if(response[i].meta_key == "default_booking_status")
        {
          default_booking_status =response[i].meta_value;
        }
        if(response[i].meta_key == "first_day_week")
        {
          first_day_week = response[i].meta_value;
        }
        if(response[i].meta_key == "Default_image"){
          image = response[i].meta_value;
          this.logourl = response[i].meta_value
        }if(response[i].meta_key == "userrole_id"){
          
          userrole_id = response[i].meta_value;
          this._usersService.getUsers({'roles':userrole_id.split(',').map(Number)}).then(Response=>{
            console.log('response',Response);
            this.userList   = Response.data; 
          });
        }
        if(response[i].meta_key == "admin_user")
        {
          admin_user = response[i].meta_value;
          console.log(admin_user);
        }
       
        
      }
      console.log("data",data);
      this.addFoodReservationSetting = this.fb.group({
          first_day_week                            : this.fb.control(first_day_week),
          default_booking_status                    : this.fb.control(default_booking_status),
          custom_admin_email                        : this.fb.control(custom_admin_email),
          userrole_id                               : this.fb.control(userrole_id.split(',').map(Number)),
          image                                     : this.fb.control(image),
          admin_user                                : this.fb.control(admin_user.split(',').map(Number)),
          admin_order_confirm_subject               : this.fb.control(data.admin_order_confirmation.subject!=""?data.admin_order_confirmation.subject:''),
          admin_order_confirmation_mail_body        : this.fb.control(data.admin_order_confirmation.mail_body!=""?data.admin_order_confirmation.mail_body:''),
          resident_order_confirmation_subject       : this.fb.control(data.resident_order_confirmation.subject!=''?data.resident_order_confirmation.subject:''),
          resident_order_confirmation_mail_body     : this.fb.control(data.resident_order_confirmation.mail_body!=''?data.resident_order_confirmation.mail_body:''),
          admin_order_cancel_subject                : this.fb.control(data.admin_order_cancellation.subject!=""?data.admin_order_cancellation.subject:''),
          admin_order_cancel_mail_body              : this.fb.control(data.admin_order_cancellation.mail_body!=""?data.admin_order_cancellation.mail_body:''),
          resident_order_cancel_subject             : this.fb.control(data.resident_order_cancellation.subject!=""?data.resident_order_cancellation.subject:''),
          resident_order_cancel_mail_body           : this.fb.control(data.resident_order_cancellation.mail_body!=""?data.resident_order_cancellation.mail_body:'')
      });


    }
    
  }

  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed

        this.mediaInfo = new FormData();
        this.mediaInfo.append('image', this.file);
        this.mediaInfo.append('type', 'produtDefaultImg');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "");            
            if (uploadResponse.media.image) {
              this.logourl = event.target.result;
              this.addFoodReservationSetting.controls.image.setValue(this.uploadInfo.avatar.url);
            }
          });

      }
    }

  }

  onClickSave(){
    
    let value = this.addFoodReservationSetting.value;
    let formData = {
      "first_day_week": value.first_day_week,
      "default_booking_status": value.default_booking_status  ,
      'userrole_id' : value.userrole_id.toString(),
      "admin_user": value.admin_user.toString(),
      "custom_admin_email": value.custom_admin_email,
      "Default_image": value.image,
      "email_notification": JSON.stringify({
          "admin_order_confirmation":{
            "subject": value.admin_order_confirm_subject,
            "mail_body": value.admin_order_confirmation_mail_body
          },
          "resident_order_confirmation":{
            "subject": value.resident_order_confirmation_subject,
            "mail_body": value.resident_order_confirmation_mail_body
          },
          "admin_order_cancellation":{
            "subject": value.admin_order_cancel_subject,
            "mail_body": value.admin_order_cancel_mail_body
          },
          "resident_order_cancellation":{
            "subject": value.resident_order_cancel_subject,
            "mail_body": value.resident_order_cancel_mail_body
          }
      })
    }


    this._settingService.createFoodReservationSetting(formData)
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
