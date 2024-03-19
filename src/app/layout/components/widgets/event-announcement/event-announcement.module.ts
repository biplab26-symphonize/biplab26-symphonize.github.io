import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventAnnouncementComponent } from './event-announcement.component';
import { FusePipesModule } from '@fuse/pipes/pipes.module';


@NgModule({
  declarations: [EventAnnouncementComponent],
  imports: [
    CommonModule,
    FusePipesModule
  ],
  entryComponents: [
    EventAnnouncementComponent
  ],
  exports: [
    EventAnnouncementComponent
  ]
})
export class EventAnnouncementModule { }
