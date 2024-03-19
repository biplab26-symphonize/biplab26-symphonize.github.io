import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import { DetailsModule } from './details/details.module';
import { ImageUploadDirective } from './image-upload.directive';
import { MaterialModule } from 'app/main/material.module';


@NgModule({
  declarations: [ImageUploadComponent, ImageUploadDirective],
  imports: [
    CommonModule,
    MaterialModule,
    DetailsModule
  ],
  exports:[
    ImageUploadComponent
  ],
  entryComponents: [
    ImageUploadComponent
  ]
})
export class ImageUploadModule { }
