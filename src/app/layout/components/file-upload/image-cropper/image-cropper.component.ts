import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OptionsList } from 'app/_services';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {

imageChangedEvent: any = '';
croppedImage: any = '';    
public cropperType: string;
public fileData: any = null;
public cropper = {
x1: 100,
y1: 100,
x2: 200,
y2: 200
};
aspectRatio: number = 1/1;
profileaspectRatio: number = 16/16;
coveraspectRatio:number = 16/9;
/**
 * Constructor
 *
 * @param {MatDialogRef<ImageCropperComponent>} dialogRef
 */
constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
)
{
    
}

ngOnInit() {
   this.fileChangeEvent(this.fileData);
   this.profileaspectRatio = OptionsList.Options.imageratios.profileimageratio/OptionsList.Options.imageratios.profileimageratio;
   this.coveraspectRatio   = OptionsList.Options.imageratios.coverimageratiowidth/OptionsList.Options.imageratios.coverimageratioheight;
   
   this.aspectRatio        = this.data.cropperType=='avatar'?this.profileaspectRatio:this.coveraspectRatio;
}

fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;    
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

}
