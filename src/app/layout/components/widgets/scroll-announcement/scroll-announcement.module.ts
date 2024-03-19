import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnnouncementComponent } from './scroll-announcement.component';
import { AnnouncementService } from 'app/_services';
import { FuseConfigService } from '@fuse/services/config.service';



@NgModule({
  declarations: [ScrollAnnouncementComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [
    ScrollAnnouncementComponent
  ],
  exports: [
    ScrollAnnouncementComponent
  ],
  providers :[AnnouncementService,FuseConfigService]

})
export class ScrollAnnouncementModule { }
