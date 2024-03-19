import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SpecialFieldsComponent } from './special-fields.component';



@NgModule({
  declarations: [SpecialFieldsComponent],
  exports     : [SpecialFieldsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
  ]
})
export class SpecialFieldsModule { }
