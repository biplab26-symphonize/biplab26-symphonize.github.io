import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { StaffmetaComponent } from './staffmeta.component';



@NgModule({
  declarations: [StaffmetaComponent],
  exports : [StaffmetaComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    FieldsComponentModule
  ],
  entryComponents:[StaffmetaComponent],
  providers: []
})
export class StaffmetaModule { }
