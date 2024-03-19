import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule
  ], 
  exports:[
    UploadComponent
  ],
  entryComponents: [
    UploadComponent
  ]
})
export class UploadModule { }
