import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAnnouncementComponent } from './home-announcement.component';
import { FusePipesModule } from '@fuse/pipes/pipes.module';

@NgModule({
  declarations: [HomeAnnouncementComponent],
  imports: [
    CommonModule,
    FusePipesModule
  ],
  entryComponents: [
    HomeAnnouncementComponent
  ],
  exports: [
    HomeAnnouncementComponent
  ]
})
export class HomeAnnouncementModule { }
