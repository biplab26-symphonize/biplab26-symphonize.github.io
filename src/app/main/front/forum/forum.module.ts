import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllBulletinComponent } from './all-bulletin/all-bulletin.component';
import { AuthGuard } from 'app/_guards';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const appRoutes = [
  {
      path      : 'forums', 
      name      : 'News & Social',
      component : AllBulletinComponent,
      canActivate: [AuthGuard]
  
  },
  {
      path: 'topics/:id',
      component : AllTopicsComponent,
      canActivate : [AuthGuard]
  },
  {
      path : 'create-topic/:id',
      component : CreateTopicComponent,
      canActivate : [AuthGuard]
  },
  {
      path : 'edit-topic/:id',
      component : CreateTopicComponent,
      canActivate : [AuthGuard]
  },
  {
    path : 'forums/create-topic',
    component : CreateTopicComponent,
    canActivate : [AuthGuard]
}
];
@NgModule({
  declarations: [ 
    AllBulletinComponent,
    AllTopicsComponent,
    CreateTopicComponent
  ],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(appRoutes),
    MaterialModule,
    FieldsComponentModule,
    FileUploadModule,
    BreadcumbModule
  ],
  // providers:[]
})
export class ForumModule { }
