import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SignageComponent } from './signage.component';



@NgModule({
  declarations: [SignageComponent],
  exports     : [SignageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
  ]
})
export class SignageModule { }
