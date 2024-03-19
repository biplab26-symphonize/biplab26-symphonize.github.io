import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CategoryService } from 'app/_services';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule,
    MatNativeDateModule,
    MatMomentDateModule
  ]
})
export class CalendarFormatModule { }
