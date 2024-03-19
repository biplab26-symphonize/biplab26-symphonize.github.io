import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageCropperComponent } from './image-cropper.component';
import { ImageCropperModule as NgxCropper } from 'ngx-image-cropper';


@NgModule({
  declarations: [ImageCropperComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    NgxCropper
  ], 
  exports:[
    ImageCropperComponent
  ],
  entryComponents: [
    ImageCropperComponent
  ]
})
export class ImageCropperModule { } 
