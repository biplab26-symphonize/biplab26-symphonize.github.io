import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileHandle } from './image-upload.directive';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, GalleryService } from 'app/_services';
import { Router } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'gallery-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  @Input() allowMultiple: boolean=false;
  @Input() fileLimit: number=2;
  @Input() albumId:string='0';
  @Input() existingMedialist : any ;
  @Output() onfilesUploaded=new EventEmitter<object>();
  //Edit uploaded file info like name / category
  UploadDialogref: MatDialogRef<DetailsComponent>; //EXTRA Changes  
  uploadInProgress: boolean=false;
  inputAccpets: string="*";
  userInfo: any = {};
  Checkeditems : any =[];
  FinalArray : any =[];
  existingmedia = new FormControl('')
  constructor(
    private router: Router,
    public _matDialog: MatDialog,
    private _authService:AuthService,
    private _galleryService:GalleryService,
    private _matSnackBar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userInfo = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : {};
  }
  files: any = [];

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }
  filesUploaded(event: any):void{    
    if(event.target.files.length>0){
      if(this.allowMultiple==true){
        for (let i = 0; i < event.target.files.length; i++) {
          const file = event.target.files[i];
          const fileSize = file.size;
          let maxfileSize = 1024 * (this.fileLimit * 1024);
          if(fileSize<=maxfileSize){
            this.files.push({ file });
            this.showSnackBar("File added sucessfully !", 'CLOSE');
          }
          else{
            this.showSnackBar('Allowed file size is '+this.fileLimit+' MB','Retry');
          }          
        }
      }
      else{
          this.files = [];
          const file = event.target.files[0];
          const fileSize = file.size;
          let maxfileSize = 1024 * (this.fileLimit * 1024);
          if(fileSize<=maxfileSize){
            this.files.push({ file });
          }
          else{
            this.showSnackBar('Allowed file size is '+this.fileLimit+' MB','Retry');
          }
      }
    }
  }
  
  //Snackbar for invalid file
  invalidFiles(event:any){
    this.showSnackBar(event.message,event.buttonText);
  }

  removeImage(index:any){
    this.files.splice(index, 1);
  }

  removeExistingMedia(index:any){
    this.Checkeditems.splice(index, 1);
  }
  //Upload multiple documents
  multipleMediaUpload(){
    if(this.files){
      this.uploadInProgress = true;
      let uploadInfo = new FormData();
      uploadInfo.append("category_id", this.albumId);
      uploadInfo.append("type", 'gallery');
      for (var i = 0; i < this.files.length; i++) {
        let fileName = this.files[i].title ? this.files[i].title : this.files[i]['file']['name'] ? this.files[i]['file']['name'].split('.').slice(0, -1).join('.') : '';
        uploadInfo.append("images[]", this.files[i]['file']);
        uploadInfo.append("title[]", fileName);
        uploadInfo.append("description[]", this.files[i].description || '');
      }      
      this._galleryService.saveMultipleMedia(uploadInfo)
        .subscribe(uploadResponse=>{         
          if(uploadResponse.status==200){          
            // Show the success message
            this.showSnackBar(uploadResponse.message, 'CLOSE');
            this.files = [];
            this.onfilesUploaded.emit(uploadResponse.status);
          }
          else{
            // Show the error message
            this.showSnackBar(uploadResponse.message, 'CLOSE');
          }
          this.uploadInProgress = false;
      },
      error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY');
      });
    }
  }

  //  existing media select 
  OnselectExistingMedia(value, event){
      if (event.checked) {
        this.Checkeditems.push({"value": value,media_id:value.media_id}); //if value is not  checked..
      }
      if (!event.checked) {
        let index
        for (let i = 0; i < this.Checkeditems.length; i++) {
  
          if (this.Checkeditems[i].media_id == value.media_id) {
            index = i;
          }
        }
        if (index > -1) {
          this.Checkeditems.splice(index, 1); //if value is checked ...
        }
      }
      this.FinalArray=[];
       this.Checkeditems.forEach(element => {
          this.FinalArray.push({media_id:element.media_id,title:element.value.title ?element.value.title :element.value.imagename ? element.value.imagename :'',description:element.value.description ?element.value.description :'',image :element.value.image})         
        });
  }
/** Edit Uploaded File Name or Category */
editUploadedMedia(fileIndex: any,value){    
  this.UploadDialogref = this._matDialog.open(DetailsComponent, {
    disableClose: false,
    data: {
      fileInfo: value
    }
  });        
  this.UploadDialogref.afterClosed()
  .subscribe(result => {
      if ( result ) {
        this.FinalArray =[];
        let fileName                               = result.title ? result.title : '';
        this.Checkeditems[fileIndex].title         = fileName;
        this.Checkeditems[fileIndex].description   = result.description;
        this.Checkeditems.forEach(element => {
        this.FinalArray.push({media_id:element.media_id,title:element.title ?element.title :'',description:element.description ?element.description :'',image :element.value.image});         
        });
      }
      this.UploadDialogref = null;
  });
}
  MediaUpload(){
    this.uploadInProgress = true;

    let savemedia ={
      mediainfo: this.FinalArray,
      category_id:this.albumId,
      "type":"gallery",
    }
    this._galleryService.UploadSelectedMedia(savemedia).subscribe(res=>{
      if(res.status==200){          
        // Show the success message
        this.showSnackBar(res.message, 'CLOSE');
        this.Checkeditems =[];
        this.existingmedia.reset('');
        this.onfilesUploaded.emit(res.status);
      }
      else{
        // Show the error message
        this.showSnackBar(res.message, 'CLOSE');
      }
      this.uploadInProgress = false;
    });
  }



  /** Edit Uploaded File Name or Category */
  editUploadedFileInfo(fileIndex: any){    
    this.UploadDialogref = this._matDialog.open(DetailsComponent, {
      disableClose: false,
      data: {
        fileInfo: this.files[fileIndex]
      }
    });        
    this.UploadDialogref.afterClosed()
    .subscribe(result => {
        if ( result ) {
          let fileName                        = result.title ? result.title : '';
          this.files[fileIndex].title         = fileName;
          this.files[fileIndex].description   = result.description;
        }
        this.UploadDialogref = null;
    });
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }

}
