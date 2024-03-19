import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SnackbarComponent } from './snackbar.component';



@NgModule({
  declarations: [SnackbarComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule
  ],
  entryComponents: [
    SnackbarComponent
  ],
  exports:[
    SnackbarComponent
  ]
})
export class SnackbarModule { }
