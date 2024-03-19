import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllComponent } from './all/all.component';
import { AddComponent } from './add/add.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { CategoryService, AnnouncementService, ChatService } from 'app/_services';
import { FuseSharedModule } from '@fuse/shared.module';
const routes: Routes = [
  {
      path: 'admin/forums/topics/all',
      component : AllComponent,
      canActivate :[AuthGuard],
      resolve  : {
        topics: AnnouncementService,
      }
  },
  {
      path: 'admin/forum/topics/:forum_id',
      component : AllComponent,
      canActivate :[AuthGuard],
      resolve  : {
        topics: AnnouncementService,
      }
  },
  {
    path: 'admin/forums/topics/trash',
    component : AllComponent,
    canActivate :[AuthGuard],
    data     : {trash : 1},
    resolve  : {
      topics: AnnouncementService,
    }
  },
  {
     path: 'admin/forums/topics/add',
     component : AddComponent,
     canActivate : [AuthGuard],
     data        : {type : 'FC'},
     resolve     : { topic : CategoryService}
  },
  {
    path: 'admin/forums/topics/edit/:id',
    component : AddComponent,
    canActivate :[AuthGuard],
    canDeactivate : [DeactivateGuard],
    data     : { type : 'FC'},
    resolve  : {
      forums : CategoryService,
      topics : AnnouncementService,
      chat: ChatService
    }
  },
];

@NgModule({
  declarations: [AllComponent, AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FieldsComponentModule
  ],
  providers : [CategoryService , AnnouncementService]
})
export class TopicsModule { }
