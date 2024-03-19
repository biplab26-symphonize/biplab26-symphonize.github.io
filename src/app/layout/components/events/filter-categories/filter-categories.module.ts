import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilterCategoriesComponent } from './filter-categories.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';

@NgModule({
  declarations: [FilterCategoriesComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FuseSharedModule
  ],
  exports:[
    FilterCategoriesComponent
  ],
  entryComponents:[
    FilterCategoriesComponent
  ]
})
export class FilterCategoriesModule { }
