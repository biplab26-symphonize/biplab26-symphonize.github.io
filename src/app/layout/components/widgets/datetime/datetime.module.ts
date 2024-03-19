import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from './datetime.component';
import { MatIconModule } from '@angular/material/icon';
import { FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  declarations: [DatetimeComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FuseWidgetModule,
    FuseSharedModule
  ],
  entryComponents: [
    DatetimeComponent
  ],
  exports: [
    DatetimeComponent
  ],
})
export class DatetimeModule { }
