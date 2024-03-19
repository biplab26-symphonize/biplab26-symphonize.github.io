import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsReplyComponent } from './topics-reply.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AnnouncementService } from 'app/_services';

const routes = [
  { 
      path      : 'forum/topic/:content_id',
      component : TopicsReplyComponent, 
      canActivate: [AuthGuard],
  }
];
@NgModule({
  declarations: [TopicsReplyComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    FieldsComponentModule,
    FileUploadModule
  ]
})

export class TopicsReplyModule { }
