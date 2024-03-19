import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule
  ]
})
export class DesignModule { }