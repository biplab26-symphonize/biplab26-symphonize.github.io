import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ImageCropperModule } from 'app/layout/components/file-upload/image-cropper/image-cropper.module';

@NgModule({
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    ImageCropperModule
  ]
})
export class FileUploadModule { }
