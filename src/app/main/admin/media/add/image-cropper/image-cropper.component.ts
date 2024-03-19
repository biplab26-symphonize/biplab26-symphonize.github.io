import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { OptionsList, AppConfig, MediaService } from 'app/_services';
import { DomSanitizer } from '@angular/platform-browser';
import { base64ToFile } from './component/image-cropper/utils/blob.utils';
import { ImageTransform } from './interface/image-transform.interface';
import { Dimensions } from './interface/dimensions.interface';


@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})



export class ImageCropperComponents implements OnInit {
 
  public   img_url : any ;
  base64Img;
  getImageUrl : any;
  croppedImage: any;
  resizeWidth: number=128;
  aspectRatio: number = 1 / 1;
  profileaspectRatio: number = 16 / 16;
  coveraspectRatio: number = 16 / 9;
  // rotate	:number= 50;
  //  dataUrl : any
  //  canvasRotation = 0;
  //  rotation = 0;
  //  scale = 1;
  //  showCropper = false;
  //  containWithinAspectRatio = false;
  //  Imgname : any ;
  //  transform: ImageTransform = {};

    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};

  /**
   * Constructor
   *
   * @param {MatDialogRef<ImageCropperComponent>} dialogRef
   */
  constructor(private _sanitizer:DomSanitizer,
    private mediaserives : MediaService,
    public dialogRef: MatDialogRef<ImageCropperComponents>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {

        this.profileaspectRatio = OptionsList.Options.imageratios.profileimageratio / OptionsList.Options.imageratios.profileimageratio;
        this.coveraspectRatio = OptionsList.Options.imageratios.coverimageratiowidth / OptionsList.Options.imageratios.coverimageratioheight;
        this.mediaserives.ConvertBase64({imageurl : this.data.image_url}).subscribe(res =>{
        if(res.status == 200){
        this.base64Img = res.image;
        
        if(this.data.type == 'get_img'){
          this.img_url = "data:image/png;base64,"+this.base64Img;
          this.showCropper = true;
           this.aspectRatio = this.data.cropperType=='avatar'?this.profileaspectRatio:this.coveraspectRatio;
          //     this.resizeWidth = this.data.cropperType == 'avatar' ? 128 : 700;
        }
        if(this.data.type == 'add_img'){
          this.img_url = "data:image/png;base64,"+this.base64Img;
          this.showCropper = true;
           this.aspectRatio = this.data.cropperType=='avatar'?this.profileaspectRatio:this.coveraspectRatio;
          //     this.resizeWidth = this.data.cropperType == 'avatar' ? 128 : 700;
        }
      }
      
    })
  
  }



imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
}

imageLoaded() {
   this.showCropper = true;
}

cropperReady(sourceImageDimensions: Dimensions) {
}

loadImageFailed() {
}

rotateLeft() {
  this.canvasRotation--;
  this.flipAfterRotate();
}

rotateRight() {
  this.canvasRotation++;
  this.flipAfterRotate();
}

private flipAfterRotate() {
  const flippedH = this.transform.flipH;
  const flippedV = this.transform.flipV;
  this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
  };
}


flipHorizontal() {
  this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
  };
}

flipVertical() {
  this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
  };
}

resetImage() {
  this.scale = 1;
  this.rotation = 0;
  this.canvasRotation = 0;
  this.transform = {};
}

zoomOut() {
  this.scale -= .1;
  this.transform = {
      ...this.transform,
      scale: this.scale
  };
}

zoomIn() {
  this.scale += .1;
  this.transform = {
      ...this.transform,
      scale: this.scale
  };
}

toggleContainWithinAspectRatio() {
  this.containWithinAspectRatio = !this.containWithinAspectRatio;
}

updateRotation() {
  this.transform = {
      ...this.transform,
      rotate: this.rotation
  };
}
  // Cropped Image
  onSubmitCrop() {
    this.dialogRef.close(this.croppedImage);
  }
  // on click cancel
  OnClose(){
    this.dialogRef.close(false);
  }
 


}
