import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { MetaFiltersComponent } from './meta-filters.component';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';


@NgModule({
  declarations: [MetaFiltersComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FuseSharedModule,
    FieldsComponentModule
  ],
  exports:[
    MetaFiltersComponent
  ]
})
export class MetaFiltersModule { }
