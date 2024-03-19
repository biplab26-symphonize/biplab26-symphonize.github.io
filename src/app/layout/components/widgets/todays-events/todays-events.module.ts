import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodaysEventsComponent } from './todays-events.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({ 
  declarations: [TodaysEventsComponent],
  imports: [ 
    CommonModule,
    FuseSharedModule,
    MatIconModule,
    RouterModule
  ],
  entryComponents: [
    TodaysEventsComponent
  ],
  exports: [
    TodaysEventsComponent
  ],
})
export class TodaysEventsModule { }
