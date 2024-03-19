import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportComponent } from './import.component';
import { MaterialModule } from 'app/main/material.module';
import { OptionsList, CommonService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { FuseSharedModule } from '@fuse/shared.module';
@NgModule({
  declarations: [ImportComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    FileUploadModule
  ], 
  exports:[
    ImportComponent
  ],
  providers: [OptionsList, CommonService]
})
export class ImportModule { }
