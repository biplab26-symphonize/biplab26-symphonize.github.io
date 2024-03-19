import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { CommonService, AppConfig, CalendarGeneratorService } from 'app/_services';
import {BehaviorSubject, Observable ,merge} from 'rxjs'
import { map } from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import { CalendarGeneratormodel } from 'app/_models';
//import { MatSnackBar } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {
  @Output() designpartData = new EventEmitter();
  @Input('tempdata')  tempdata;
  
  public designform : FormGroup;
  public defoulttmpvalue :any;
  public designData : any;
  public urlID        :any;
  public getFormValue : any;
  public displayImage : any;
  uploadInfo: any={
    'avatar':{'type':'defaultprofile','media_id':0,'url':"",'apimediaUrl':'media/upload'},
  };

  constructor(private fb:FormBuilder,
              private _commonService : CommonService,
              private _calendarGeneratorService :CalendarGeneratorService,
              private route : ActivatedRoute,
              private _matSnackBar: MatSnackBar ) {

    this.route.params.subscribe( params => {
      this.urlID = params.id;
    });   
   

  }
  private file        : File | null = null;
  filetype            : Boolean =  true;
  url                 : string = '';
  logourl             : string = '';
  public inputAccpets : string = ".jpeg, .jpg, .png";
  mediaInfo: any=[];
  ngOnInit() {
    
   
    this.designform = this.fb.group({
      border_color    : this.fb.control('#000'),
      highlight_color : this.fb.control('#000'),
      color_selection : this.fb.control('full_color'),
      color_scheme    : this.fb.control('default'),
      no_background : this.fb.control('N'),
      background_img : this.fb.control(''),
      logo_img       : this.fb.control(''),
      text_color     : this.fb.control('#000'),
      footer         : this.fb.control(''),
      background_url  : this.fb.control(''),
      logo_url       : this.fb.control('') 
    });
    this.designpartData.emit(this.designform.value);
    
    this.displayImage ='Yes';
    if(this.route.routeConfig.path=='admin/calendar-generator/:id'){
      this._calendarGeneratorService.getCalendarData(this.urlID)
        .then(Response=>{
            this._calendarGeneratorService.setdynamicdata(Response.data); 
            this.getEditData(Response.data);
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

  ngOnChanges()
  {
    if(this.tempdata!=undefined){
      console.log("this.tempdata>>>",this.tempdata);
      this.defoulttmpvalue =this.tempdata;
      this.uploadInfo.avatar.url= ( this.defoulttmpvalue.image? AppConfig.Settings.url.mediaUrl +  this.defoulttmpvalue.image:"");
      this.url =  this.uploadInfo.avatar && this.uploadInfo.avatar.url && this.uploadInfo.avatar.url!=='' ? this.uploadInfo.avatar.url : this.url; 
      this.uploadInfo.avatar.url= ( this.defoulttmpvalue.logo? AppConfig.Settings.url.mediaUrl +  this.defoulttmpvalue.logo:"");
      this.logourl =  this.uploadInfo.avatar && this.uploadInfo.avatar.url && this.uploadInfo.avatar.url!=='' ? this.uploadInfo.avatar.url : this.logourl; 
      //set background_img and logo_img to form
      if(this.defoulttmpvalue.image){
        this.designform.get('background_img').setValue(this.defoulttmpvalue.image);
      }
      if(this.defoulttmpvalue.logo){
        this.designform.get('logo_img').setValue(this.defoulttmpvalue.logo);
      }
      
      if(this.defoulttmpvalue.design !== undefined){
        this.designform.patchValue( JSON.parse(this.defoulttmpvalue.design));
        //set no_background
        let noBackground = this.defoulttmpvalue.no_background || 'N';
        this.displayImage =  this.defoulttmpvalue.no_background == 'Y' ? 'No' : 'Yes';
        this.designform.get('no_background').setValue(noBackground);
        this.designpartData.emit(this.designform.value);
      }
    }
  }

   getEditData(getData){
    this.uploadInfo.avatar.url= ( getData[0].image? AppConfig.Settings.url.mediaUrl +  getData[0].image:"");
    this.url =  this.uploadInfo.avatar.url; 
    this.uploadInfo.avatar.url= ( getData[0].logo? AppConfig.Settings.url.mediaUrl +  getData[0].logo:"");
    this.logourl =  this.uploadInfo.avatar.url; 
    this.getFormValue = getData[0].design;
    //set background_img and logo_img to form
    if(getData[0].image){
      this.designform.get('background_img').setValue(getData[0].image);
    }
    if(getData[0].logo){
      this.designform.get('logo_img').setValue(getData[0].logo);
    }
    this.designform.patchValue(JSON.parse(this.getFormValue));
    //set no_background
    let noBackground = getData[0].no_background || 'N';
    this.displayImage =  getData[0].no_background == 'Y' ? 'No' : 'Yes';
    this.designform.get('no_background').setValue(noBackground);
    this.designpartData.emit(this.designform.value);
  }

  onSelectFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed  
        
        this.mediaInfo = new FormData();
        this.mediaInfo.append('image',this.file);
        this.mediaInfo.append('type','background_img');
        this._commonService.uploadfiles(this.mediaInfo)
         .subscribe(uploadResponse=>{
          this.uploadInfo.avatar.url= uploadResponse.media.image? uploadResponse.media.image:"";
          if(uploadResponse.media.image){
            this.url = event.target.result;
            this.designform.controls.background_img.setValue(this.uploadInfo.avatar.url);
            this.designpartData.emit(this.designform.value);
          }
        });

      }
      
    }
   
  }


  /* Logo Image*/
  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
       
        this.mediaInfo = new FormData();
        this.mediaInfo.append('image',this.file);
        this.mediaInfo.append('type','logo_img');
        this._commonService.uploadfiles(this.mediaInfo)
         .subscribe(uploadResponse=>{
          this.uploadInfo.avatar.url= uploadResponse.media.image? uploadResponse.media.image:"";
          if(uploadResponse.media.image){
            this.logourl = event.target.result;
            this.designform.controls.logo_img.setValue(this.uploadInfo.avatar.url);
            this.designpartData.emit(this.designform.value);
          }
        });
        
      }
    }
   
  }

  getColorSelection(event){
     this.designpartData.emit(this.designform.value);
  }

  displayBackground(event){
    console.log('background event');
    if(event.checked){
      this.displayImage = 'No';
      this.designform.patchValue({no_background:'Y'});
    }else{
      this.displayImage = 'Yes';
       this.designform.patchValue({no_background:'N'});
    }
    this.designpartData.emit(this.designform.value);
  }

  getBorderColor(event){
    this.designpartData.emit(this.designform.value);
  }

  getHighlightColor($event){
    this.designpartData.emit(this.designform.value);
  }

  getTextColor(event){
    
    this.designpartData.emit(this.designform.value);
  }

  getFooterText(event){
    this.designpartData.emit(this.designform.value);
  }
   
 
  


}
