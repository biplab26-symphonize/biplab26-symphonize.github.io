import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StaffBiographyComponent } from './staff-biography.component';
import { FuseSharedModule } from '@fuse/shared.module';


@NgModule({
  declarations: [StaffBiographyComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [
    StaffBiographyComponent
  ],
  exports:[
    StaffBiographyComponent
  ]
})
export class StaffBiographyModule { }
