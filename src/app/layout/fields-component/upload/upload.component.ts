import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService, AppConfig } from 'app/_services';
import { DomSanitizer,SafeResourceUrl  } from '@angular/platform-browser';

@Component({
  selector: "app-upload",
  template: `
    <div [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident' ">
      <div [ngClass]="fieldContent.extra_field_content.class" [formGroup]="group">
        <div *ngIf="filetype==true">
          <img [src]="url" height="100" width="100" /> 
        </div>
        <input 
          [id]="fieldContent.extra_field_content.id"
          type='file'
          [accept]="inputAccpets"
          (change)="onSelectFile($event)" />
        <mat-error *ngIf="group.get(field.field_name).invalid && (group.get(field.field_name).dirty || group.get(field.field_name).touched)">
          {{content.extra_field_content.error_msg}}
        </mat-error>
      </div>
    </div>
    <div *ngIf="type == 'dynForm'" class="all-entry-tag">
      <div [ngClass]="field.content.extra_field_content.class" [formGroup]="group" class="All-half-full w-100-p mb-8" >
        <div *ngIf="filetype == true">
          <img [src]=" field.content.extra_field_content.dafaultValue "   alt="{{img}}" height="100" width="100" style="height:120px; width:100px;" /> 
        </div>
        <div *ngIf="videotype == true">
        <a href="#" download>{{ field.content.extra_field_content.dafaultValue}} </a>
        </div>
        <div *ngIf="texttype == true">
         <a href="#" download>{{field.content.extra_field_content.dafaultValue}}</a> 
        </div>
          <input 
          [id]="field.content.extra_field_content.id"
          type='file'
          [accept]="inputAccpets"
          (change)="onSelectFile($event)"
          /> 
        <mat-error *ngIf="group.get(field.caption).invalid && (group.get(field.caption).dirty || group.get(field.caption).touched)">{{field.error_msg}}</mat-error>
      </div>
    </div>
    
  `,
  styles: [`
  .all-entry-tag{
    max-width: 100%;
    margin:0 4px;
  }
`]
})

export class UploadComponent implements OnInit {

  srcData : SafeResourceUrl;
  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;
  inputAccpets:string;
  
  URL: string = '';
  img :any;
  textvalue:string ='';
  videovalue :string ='';
  public filetype :boolean = false;
  public texttype :boolean =false;
  public videotype :boolean =false;
  public largeLogoURL: any ;
  public isLargeLogo:boolean = false;
  private file: File | null = null;
  public dafaultValue :any ;
  dateTemp : any = '?' + Math.random(); 

  uploadInfo: any={
    'avatar':{'type':'defaultprofile','media_id':0,'url':"",'apimediaUrl':'media/upload'},
  };
 

  constructor(private fb: FormBuilder,
    private _commonService : CommonService,
    private sanitizer: DomSanitizer) {
  }



  ngOnInit() {
    
    if(this.type == 'field' || this.type == 'resident'){
    
      this.fieldContent = JSON.parse(this.field.field_content); 
      this.createControl();
       
    }
    if(this.type =="dynForm"){
      this.fieldContent =this.field;
      this.createControl();
    }
     console.log(this.field);
    
    if(this.field.content.extra_field_content.fileType === 'image'){
       this.inputAccpets = ".jpg , .jpeg ,.png ";
       this.filetype=true;    
    }
    
    if(this.field.content.extra_field_content.fileType === 'txt'){
      this.inputAccpets = "text/*", ".txt";
      this.textvalue =this.fieldContent.content.extra_field_content.dafaultValue;
      this.texttype  =true;
    
    }

   if(this.field.content.extra_field_content.fileType === 'video'){
    this.inputAccpets =  "video/*",".mp4";
    this.videovalue   = this.fieldContent.content.extra_field_content.dafaultValue;
    this.videotype    = true;
 
    
  }
}
  onSelectFile(event : any) 
  {
     const file = event && event.target.files[0] || null;
     this.file = file;
    
    if (event.target.files && event.target.files[0]) 
    {
        var reader = new FileReader();
        let selectedFile = event.target.files[0];
        reader.readAsDataURL(this.file);
      
      // read file as data url
      reader.onload = (event: any) => 
      { // called once readAsDataURL is completed
        
        this.field.content.extra_field_content.dafaultValue= event.target.result;
        this.group.patchValue({'this.field.field_value':this.file})
        let index=selectedFile.name.lastIndexOf(".")+1;
        let extFile=selectedFile.name.substr(index,selectedFile.size).toLocaleLowerCase();
       console.log(extFile);
        if(extFile=="jpg" || extFile=="jpeg" || extFile=="png" ||extFile=="gif")
        {  this.filetype = true;}
        else{
          
          this.filetype=false;
        }
    
      }
         let mediaInfo = new FormData();
      mediaInfo.append('type',this.field.content.extra_field_content.fileType);
      mediaInfo.append('image',this.file);
      this._commonService.uploadfiles(mediaInfo)   // call the service  here form get the url of images,video
        .subscribe(uploadResponse=>{
          this.uploadInfo.avatar.url= (uploadResponse.media.image? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image:"");
          this.field.content.extra_field_content.dafaultValue = this.uploadInfo.avatar.url;
          this._commonService.setdynamicdata( this.field.content.extra_field_content.dafaultValue);
       
        });

    }
    
   
  }

  createControl() {
    this. dafaultValue = (this.field.field_value) ? this.field.field_value :this.fieldContent.content.extra_field_content.dafaultValue;
    let residentType = (this.type == 'resident' ? ' ': this.field.required);
     
    const control = this.fb.control(
      this. dafaultValue,
      this.bindValidations(residentType, '')
    );
    this.group.addControl(this.field.field_name, control);
  }

  bindValidations(validationRequired = null, validationRegexmatch = null) {
    if(validationRequired === 'Y' || validationRegexmatch != '') {
      const validList = [];
      let tmpValidationRequired, tmpValidationRegexmatch;

      if(validationRequired === 'Y') {
        tmpValidationRequired = Validators.required;
        validList.push(tmpValidationRequired);
      }

      if(validationRegexmatch != '') {
        tmpValidationRegexmatch = Validators.pattern(validationRegexmatch);
        validList.push(tmpValidationRegexmatch);
      }
      return Validators.compose(validList);
    }
  }

 
  }

