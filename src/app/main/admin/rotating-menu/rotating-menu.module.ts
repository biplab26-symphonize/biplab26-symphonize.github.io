import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllRotatingMenuModule } from './all-rotating-menu/all-rotating-menu.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { AddRotatingMenuModule } from './add-rotating-menu/add-rotating-menu.module';
import { DragDropModule } from 'app/layout/components/file-upload/drag-drop/drag-drop.module';
import { SettingModule } from './setting/setting.module';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';





const appRoutes: Routes = [
  {
      path: 'all',
       loadChildren: () => import('./all-rotating-menu/all-rotating-menu.module').then(m => m.AllRotatingMenuModule)
  },
  {
    path: 'add',
     loadChildren: () => import('./add-rotating-menu/add-rotating-menu.module').then(m => m.AddRotatingMenuModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AllRotatingMenuModule,
    FuseSharedModule,
    AddRotatingMenuModule,
    MaterialModule,
    SettingModule,
    DragDropModule,
    FileUploadModule,
    RouterModule.forChild(appRoutes),
  ]
})
export class RotatingMenuModule { }
