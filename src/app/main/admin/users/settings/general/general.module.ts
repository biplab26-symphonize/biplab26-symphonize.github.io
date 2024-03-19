import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general.component';
import { MaterialModule } from 'app/main/material.module';
import { OptionsList, CommonService, UsersService, RolesService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatOptionSelectAllModule } from 'app/layout/components/mat-option-select-all/mat-option-select-all.module';

@NgModule({
  declarations: [GeneralComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FileUploadModule,
    FuseSharedModule,
    MatOptionSelectAllModule
  ], 
  exports:[
    GeneralComponent
  ],
  providers: [OptionsList, CommonService, RolesService, UsersService]
})
export class GeneralModule { }
