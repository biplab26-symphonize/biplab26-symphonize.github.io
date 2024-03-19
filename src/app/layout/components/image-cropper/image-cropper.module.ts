import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ImageCropperComponent],
  imports: [
    CommonModule,
    ImageCropperModule,
    MatButtonModule,
  ],
  exports     : [
    ImageCropperComponent
  ],
  entryComponents: [
    ImageCropperComponent
  ]
})
export class ImagesCropperModule { }
