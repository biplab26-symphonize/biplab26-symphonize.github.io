import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaFilterComponent } from './meta-filter.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';

@NgModule({
  declarations: [MetaFilterComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FuseSharedModule,
    FieldsComponentModule
  ],
  exports:[MetaFilterComponent]
})
export class MetaFilterModule { }
