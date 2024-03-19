import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiningAnnouncementComponent } from './dining-announcement.component';
import { FusePipesModule } from '@fuse/pipes/pipes.module';



@NgModule({
  declarations: [DiningAnnouncementComponent],
  imports: [
    CommonModule,
    FusePipesModule
  ],
  entryComponents: [
    DiningAnnouncementComponent
  ],
  exports: [
    DiningAnnouncementComponent
  ]
})
export class DiningAnnouncementModule { }
