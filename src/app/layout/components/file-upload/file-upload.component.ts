import { Component, Input, ElementRef, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCropperComponent } from 'app/layout/components/file-upload/image-cropper/image-cropper.component';
import { CommonService,AppConfig } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageCropperComponents} from 'app/main/admin/media/add/image-cropper/image-cropper.component';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'] 
})
export class FileUploadComponent implements OnInit  {

  @Input() uploadInfo: any;
  @Input() uploadlabel: string;
  @Input() cropper: boolean=false;
  @Input() docUpload: boolean=false;
  @Input() mediaUpload: boolean=false;
  @Output() imageUploaded=new EventEmitter<object>();
  @ViewChild('inputfile') inputfile;
  imgUploadName  :any ;
  imgCategory_id : any ;
  imgMedia_id    : any ;
  showEditbutton : boolean = false ;

  dateTemp : any = '?' + Math.random();

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes   
  cropperDialogref: MatDialogRef<ImageCropperComponent>; //EXTRA Changes  
  public inputAccpets : string = ".jpeg, .jpg, .png";
  private file: File | null = null;
  croppedImage: string ="";
  hiddencroppedImage: boolean=false;
  public uploadedResponse:any={};
  button: { 'background-color': any; 'font-size': any; color: any; };

  fileChangeEvent(event: any): void {
    const file = event && event.target.files[0] || null;
    this.file = file;
    
    if(this.cropper ==true){
      this.OpenCropper(event);
    }
    else if(this.docUpload==true){
      this.openImportConfirm();
    }
    else if(this.uploadInfo.formControlName=='defaultpdf'){
      this.saveDefaultPdf();
    }
    else if(this.mediaUpload==true){
      this.saveMediaUpload();
    }
    else{
      this.saveWithoutCrop();
    }
  }

  constructor( 
    private host: ElementRef<HTMLInputElement>,
    public _matDialog: MatDialog,
    private _router : Router,
    public _matSnackBar:MatSnackBar,
    private route           : ActivatedRoute,
    public _commonService:CommonService) {
      
    }

  ngOnInit(){
    //Accept only csv or excel in case of uploading any file other than image   
    if(this.uploadInfo.type=='importusers'){
      this.inputAccpets = ".csv, .xlsx, .json";
    }
    //Set Media For Remove Button Procesa    
    if(this.uploadInfo.media_id){
      this.uploadedResponse.media_id = this.uploadInfo.media_id;
    }
    if(this.uploadInfo.type=='media'){
      this.uploadedResponse.media_id = this.uploadInfo.media_id;
    }
    //Pdf Uploading
    if(this.uploadInfo.type=='defaultpdf'){
      this.uploadedResponse.media_id = this.uploadInfo.media_id;
      this.inputAccpets = ".pdf";
    } 
    //mediaupload
    if(this.uploadInfo.type=='mediaUpload'){
      this.inputAccpets = ".jpeg, .jpg, .png, .pdf, .csv, .xlsx";
    }
    //mediaupload
    if(this.uploadInfo.type=='mediaUpload'){
      this.inputAccpets = ".jpeg, .jpg, .png, .pdf, .csv, .xlsx";
    }

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }

  /** OPEN CROPPPER DIALOG HERE */
  OpenCropper(fileData: any){
    this.cropperDialogref = this._matDialog.open(ImageCropperComponent, {
      disableClose: false,
      width:'500px',
      height:'600px',
      data:{
        cropperType:this.uploadInfo.type
      }
  });
  this.cropperDialogref.componentInstance.cropperType = 'avatar';
  this.cropperDialogref.componentInstance.fileData = fileData;
  this.cropperDialogref.afterClosed()
      .subscribe(result => {
          if ( result )
          {
            this.saveMedia(result);
          }
          this.cropperDialogref = null;
          this.inputfile.nativeElement.value = '';
      });
  }

  /** SAVE MEDIA WITH ORG IMAGE AND CROPPED IMAGE AND MEDIA ID */
  saveMedia(base64String:string){
    //Define formdata
    let mediaInfo = new FormData();    
    console.log(this.uploadInfo.category_id);
    mediaInfo.append('media_id',this.uploadInfo.media_id);
    mediaInfo.append('image',this.file);
    mediaInfo.append('base64',base64String);
    mediaInfo.append('type',this.uploadInfo.type);
    this._commonService.saveMedia(mediaInfo,this.uploadInfo.apimediaUrl)
      .subscribe(uploadResponse=>{
        // Show the success message
        this.showSnackBar(uploadResponse.message, 'CLOSE', 2000);
        this.croppedImage = base64String;
        this.uploadedResponse.media_id = uploadResponse.media || 0;
        this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});
    },
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY', 2000);
    });
  }
  /**Save Media Without Cropping On user general settings page /users/settings */
  saveWithoutCrop(){
    //Define formdata
    let mediaInfo = new FormData();
    mediaInfo.append('media_id',this.uploadInfo.media_id);
    mediaInfo.append('image',this.file);
    mediaInfo.append('type',this.uploadInfo.type);
    this._commonService.saveMedia(mediaInfo,this.uploadInfo.apimediaUrl)
      .subscribe(uploadResponse=>{
        // Show the success message
        this.showSnackBar(uploadResponse.message, 'CLOSE', 2000);
        this.uploadInfo.url = uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image + this.dateTemp : ""; 
        console.log("this.uploadInfo.url",this.uploadInfo.url);
        this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});
    },
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY', 2000);
    });
  }
  /**SAVE CSV OR XLSX OR JSON ON SERVER */
  openImportConfirm(){
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to import users?';
    this.confirmDialogRef.afterClosed()
    .subscribe(result => {
      if ( result )
      {
        this.saveDocument();
      }
      else
      {

      }
      this.confirmDialogRef = null;
    });
  }

  /**SAVE DOCUMENTS */
  saveDocument(){
    
    //Define formdata
    let documentInfo = new FormData();
    documentInfo.append('file',this.file);
    documentInfo.append('type',this.uploadInfo.type);
    this._commonService.saveMedia(documentInfo,this.uploadInfo.apimediaUrl)
      .subscribe(uploadResponse=>{
        if(uploadResponse.status==200){
          // Show the success message
          this.showSnackBar(uploadResponse.message, 'CLOSE');
          this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});
          if(this.uploadInfo.type=='mediaUpload'){
            this._router.navigate(['admin/media/library']);
          }
        }
        else{
          // Show the success message
        this.showSnackBar('Unable to import users list', 'Retry');
        }
        
    },
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY');
    });
  }
  /** SAVE DEFAULT PDF FOR DOCUMENTS */
  saveDefaultPdf(){
 
    //Define formdata
    let documentInfo = new FormData();
    documentInfo.append('file',this.file);
    documentInfo.append('type',this.uploadInfo.type);
    this.showSnackBar('Uploading Pdf...', '', 8000);
    this._commonService.saveMedia(documentInfo,this.uploadInfo.apimediaUrl)
      .subscribe(uploadResponse=>{
        if(uploadResponse.status==200){
          // Show the success message
          this.showSnackBar(uploadResponse.message, 'CLOSE', 2000);
          this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});
          if(this.uploadInfo.type=='mediaUpload'){
            this._router.navigate(['admin/media/library']);
          }
        }
        else{
          // Show the success message
        this.showSnackBar('Unable to upload default pdf', 'Retry', 2000);
        }
        
    },
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY', 2000);
    });
  }
  /**SAVE MEDIA UPLOAD */
  saveMediaUpload(){
   
    let type:string = ''
    let imageExtension:any = ['jpeg','jpg','png'];
    let audioExtension:any = ["aif ","mid","mp3","mpa","ogg","wma","wpl"];
    let videoExtension:any = ["mp4","mpeg","avi","wmv","mov"];
    let documentExtension:any = ["ppt","pptx","pdf","docx"];
    let index = this.file.name.lastIndexOf(".")+1;
    let extFile = this.file.name.substr(index,this.file.size).toLocaleLowerCase();
    if(imageExtension.includes(extFile)){
      type = 'globalmedia';
      this.showEditbutton = true ;
    }
    else if(audioExtension.includes(extFile)){
      type = 'audio';
      this.showEditbutton = false;
    }
    else if(videoExtension.includes(extFile)){
      type = 'video';
      this.showEditbutton = false;
    }
    else if(documentExtension.includes(extFile)){
      type = 'document';
      this.showEditbutton = false;
    }
    else{
      this.showSnackBar("This type media is not supported", 'CLOSE', 2000);
    }
    //Define formdata

    let documentInfo = new FormData();
    documentInfo.append('type',type);
    documentInfo.append('image',this.file);
    documentInfo.append('category_id',this.uploadInfo.category_id);
    this._commonService.saveMedia(documentInfo,this.uploadInfo.apimediaUrl)
      .subscribe(uploadResponse=>{
        if(uploadResponse.status==200){
          // Show the success message
          if(uploadResponse.media.type  ==  "globalmedia"){
            this.imgUploadName = uploadResponse.media.image;
            this.imgCategory_id = uploadResponse.media.category_id;
             this.imgMedia_id           = uploadResponse.media.id
          }
          this.showSnackBar(uploadResponse.message, 'CLOSE', 2000);
          this.uploadedResponse.media_id = uploadResponse.media.id || 0;
          this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});
          // if(this.uploadInfo.type=='mediaUpload'){
          //   this._router.navigate(['admin/media/library']);
          // }
        }
        else{
          // Show the success message
        this.showSnackBar('Unable to Upload Global Media', 'Retry', 2000);
        }
        
    },
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY', 2000);
    });
  }

  /** Remove Media From Page And Server Also */
  RemovePicture(){
    if(this.uploadInfo.media_id){
      this.uploadedResponse.media_id = this.uploadInfo.media_id;
    }    
    if(this.uploadedResponse){
      if(this.uploadInfo.type=='avatar' || this.uploadInfo.type=='cover' || this.uploadInfo.type=='mediaUpload' || this.uploadInfo.type=='gallery'){
        this._commonService.removeMedia({media_id:[this.uploadedResponse.media_id || 0]})
        .subscribe(deleteResponse=>{
          if(deleteResponse.status == 200){
            // Show the success message
            this.showSnackBar(deleteResponse.message, 'CLOSE');
            this.imageUploaded.emit({'uploadResponse':deleteResponse,'formControlName':this.uploadInfo.formControlName});
            this.croppedImage = '';
            this.uploadInfo.url = '';
            if(this.uploadInfo.type=='mediaUpload'){
              this._router.navigate(['admin/media/library']);
            }
          }
        },
        error => {
            // Show the error message
            this.showSnackBar(error.message, 'RETRY');
        });
      }
      else if(this.uploadInfo.type=='defaultprofile' || this.uploadInfo.type=='defaultcover'){

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
        });
        
        this.confirmDialogRef.componentInstance.confirmMessage = this.uploadInfo.type =='defaultprofile' ? 'Are you sure you want to remove default profile picture?' : 'Are you sure you want to remove default cover picture?' ;
        this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if ( result )
          {
            this.imageUploaded.emit({'uploadResponse':'','formControlName':this.uploadInfo.formControlName});
            this.croppedImage = '';
            this.uploadInfo.url = '';
          }
        });        
      }
      else {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
        });
        
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want To Remove Picture ?' ;
        this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if ( result ) {
            this.imageUploaded.emit({'uploadResponse':'','formControlName':this.uploadInfo.formControlName});
            this.uploadInfo.url = '';
          }
        });        
      }      
    }    
  }
  

  EditPicture(media_id,Url){

    const dialogRef = this._matDialog.open(ImageCropperComponents, {
      disableClose: true,
      width: '50%',
      data: { type:'add_img',image_url:Url}
    });
    dialogRef.afterClosed().subscribe(result => {        
      if(result){
        this.saveEditMedia(result,media_id)
      }
    }); 

  }


      saveEditMedia(result,media_id){
      //Define formdata
      let mediaInfo = new FormData();
      mediaInfo.append('media_id',media_id);
      mediaInfo.append('image',this.imgUploadName);
      mediaInfo.append('base64',result);
      mediaInfo.append('type','globalmedia');
      mediaInfo.append('category_id',this.imgCategory_id);
      this._commonService.uploadMedia(mediaInfo)
        .subscribe(uploadResponse=>{
          // Show the success message          
          this.uploadedResponse.media_id = uploadResponse.media.media_id || 0;
          this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});           
          this.showSnackBar(uploadResponse.message, 'CLOSE', 2000);
          if(this.uploadInfo.type=='mediaUpload'){
            this._router.navigate(['admin/media/library']);
          }
          // this.croppedImage = result;
          // this.uploadedResponse.media_id = uploadResponse.media || 0;
          // this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});
      },
      error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY', 2000);
      });
    }
  /** SHOW SNACK BAR */
    showSnackBar(message:string,buttonText:string,duration:number=2000){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : duration
      });
  }
}
