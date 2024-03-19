import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { RepliesModule } from './replies/replies.module';
import { TopicsModule } from './topics/topics.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { CategoryService, ChatService } from 'app/_services';
const appRoutes: Routes = [
  {
      path: 'admin/forums/all',
      component : ListComponent,
      canActivate :[AuthGuard],
      data     : { type : 'FC'},
      resolve  : {
        forums: CategoryService,
      }
  },
  {
    path: 'admin/forums/trash',
    component : ListComponent,
    canActivate :[AuthGuard],
    data     : { type : 'FC' ,trash: 1},
    resolve  : {
      forums: CategoryService,
    }
  },
  {
     path: 'admin/forums/add',
     component : AddComponent,
     canActivate : [AuthGuard],
     data     : { type : 'FC'},
     resolve : { forums : CategoryService }
  },
  {
    path: 'admin/forums/edit/:id',
    component : AddComponent,
    canActivate : [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve : { forums : CategoryService, 
      chat: ChatService }
  },
  {
      path: 'replies',
      loadChildren: () => import('./replies/replies.module').then(m => m.RepliesModule)
  },
  {
      path: 'topics',
      loadChildren: () => import('./topics/topics.module').then(m => m.TopicsModule)
  }
];
@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(appRoutes),
    RepliesModule,
    FieldsComponentModule,
    TopicsModule,
    MaterialModule
  ],
  providers : [CategoryService]
})
export class ForumModule { }
