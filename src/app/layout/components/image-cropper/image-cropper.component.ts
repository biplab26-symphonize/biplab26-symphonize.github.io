import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { OptionsList } from 'app/_services';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
  
 public   img_url : any ;
  base64;
  getImageUrl : any;
  croppedImage: any;
  resizeWidth: number=128;
  public cropper = {
  x1: 100,
  y1: 100,
  x2: 200,
  y2: 200
  };
  aspectRatio: number = 1/1;
  profileaspectRatio: number = 16/16;
  coveraspectRatio:number = 16/9;
  rotate	:number= 50;
   dataUrl : any
  /**
   * Constructor
   *
   * @param {MatDialogRef<ImageCropperComponent>} dialogRef
   */
  constructor(private _sanitizer:DomSanitizer,
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    let  proxyUrl = 'https://cors-anywhere.herokuapp.com/';  // for the avoid the cros  Error 
    this.toDataURL(proxyUrl + this.data.image_url, function (dataUrl :any ) {
      dataUrl
      localStorage.setItem("imgData", dataUrl); });    
  }

  ngOnInit() {
    this.profileaspectRatio = OptionsList.Options.imageratios.profileimageratio / OptionsList.Options.imageratios.profileimageratio;
    this.coveraspectRatio = OptionsList.Options.imageratios.coverimageratiowidth / OptionsList.Options.imageratios.coverimageratioheight;
    if (this.data.type == 'crop_img') {
      this.img_url = this.data.body.base64;
      this.aspectRatio = this.data.cropperType == 'avatar' ? this.profileaspectRatio : this.coveraspectRatio;
      this.resizeWidth = this.data.cropperType == 'avatar' ? 128 : 700;
    }
    if(this.data.type == 'get_img'){
      // this.img_url = this.data.image_url;
      // this.data.type='crop_img';
      this.img_url =  localStorage.getItem('imgData');

      this.aspectRatio = this.data.cropperType=='avatar'?this.profileaspectRatio:this.coveraspectRatio;
          this.resizeWidth = this.data.cropperType == 'avatar' ? 128 : 700;
    }
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);   
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  // Cropped Image
  onSubmitCrop() {
    this.dialogRef.close(this.croppedImage);
  }
}
