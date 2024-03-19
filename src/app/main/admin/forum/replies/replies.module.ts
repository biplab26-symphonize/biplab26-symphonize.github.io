import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddComponent } from './add/add.component';
import { AllComponent } from './all/all.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { ReplyService, AnnouncementService } from 'app/_services';
import { ReplyResolver } from 'app/_resolvers/reply.resolvers';
const routes: Routes = [
  {
    path: 'admin/forums/replies/all',
    component : AllComponent,
    canActivate :[AuthGuard],
    resolve  : {
      replies: ReplyService,
    }
  },
  {
    path: 'admin/forum/replies/:topic_id',
    component : AllComponent,
    canActivate :[AuthGuard],
    resolve  : {
      replies: ReplyService,
    }
  },
  {
    path: 'admin/forums/replies/trash',
    component : AllComponent,
    canActivate :[AuthGuard],
    data      : { trash :1},
    resolve  : {
      replies: ReplyService,
    }
  },
  {
      path: 'admin/forums/replies/add',
      component : AddComponent,
      canActivate : [AuthGuard],
      resolve  : {
        topics : ReplyResolver
      }
  },
  {
    path: 'admin/forums/replies/edit/:id',
    component : AddComponent,
    canActivate : [AuthGuard],
    resolve  : {
      topics : ReplyResolver,
      reply  : ReplyService
    }
  }
];

@NgModule({
  declarations: [AddComponent, AllComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FieldsComponentModule
  ],
  providers : [ReplyService,AnnouncementService,ReplyResolver,DatePipe]
})
export class RepliesModule { }
