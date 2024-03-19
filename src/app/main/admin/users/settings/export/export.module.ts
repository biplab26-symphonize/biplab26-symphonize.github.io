import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportComponent } from './export.component';
import { MaterialModule } from 'app/main/material.module';
import { OptionsList, CommonService, UsersService, RolesService } from 'app/_services';
import { FuseSharedModule } from '@fuse/shared.module';
@NgModule({
  declarations: [ExportComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule
  ], 
  exports:[
    ExportComponent
  ],
  providers: [OptionsList, CommonService, RolesService, UsersService]
})
export class ExportModule { }
