import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcumbComponent } from './breadcumb.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  declarations: [BreadcumbComponent],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    FuseSharedModule
  ],
  entryComponents: [
    BreadcumbComponent
  ],
  exports: [
    BreadcumbComponent
  ],
})
export class BreadcumbModule { }
