import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FuseSharedModule } from '@fuse/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule,
    MatNativeDateModule,
    MatMomentDateModule
  ],
  providers: [ 
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}
  ]
})
export class CalendarCustomizationModule { }
