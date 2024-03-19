import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule
  ], 
  exports:[
    DetailsComponent
  ],
  entryComponents: [
    DetailsComponent
  ]
})
export class DetailsModule { }
