import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AllModule } from './all/all.module';
import { AddModule } from './add/add.module';
import { EntriesModule } from './entries/entries.module';
import { MaterialModule } from 'app/main/material.module';
import { ImportModule } from './import/import.module';
import { PreviewModule } from './preview/preview.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AddnotificationModule } from './notifications/addnotification/addnotification.module';
import { ApprovalsettingModule } from './approvalsetting/approvalsetting.module';
import { AddapprovalModule } from './approvalsetting/addapproval/addapproval.module';
import { SettingsModule } from './settings/settings.module';
import { ExportModule } from './export/export.module';








const appRoutes: Routes = [
  {
      path: 'all',
      loadChildren: () => import('./all/all.module').then(m => m.AllModule)
  },
  {
      path: 'add',
      loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
      path: 'import',
      loadChildren: () => import('./import/import.module').then(m => m.ImportModule)
  },
  {
      path: 'entries',
      loadChildren: () => import('./entries/entries.module').then(m => m.EntriesModule)
  },
  {
      path: 'preview',
      loadChildren: () => import('./preview/preview.module').then(m => m.PreviewModule)
  },
  {
    path: 'notifications',
    loadChildren:() => import('./notifications/notifications.module').then(m=> m.NotificationsModule)
  },
  {
    path: 'approvlas',
    loadChildren:() => import('./approvalsetting/approvalsetting.module').then(m=> m.ApprovalsettingModule)
  },
  {
    path: 'addnotification',
    loadChildren:() => import('./notifications/addnotification/addnotification.module').then(m=> m.AddnotificationModule)
  },
  {
    path: 'addapproval',
    loadChildren:() => import('./approvalsetting/addapproval/addapproval.module').then(m=> m.AddapprovalModule)
  },
  {
    path: 'settings',
    loadChildren:() => import('./settings/settings.module').then(m=> m.SettingsModule)
  },
  {
    path: 'export',
    loadChildren:() => import('./export/export.module').then(m=> m.ExportModule)
  },
  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    AllModule,
    AddModule,
    ImportModule,
    EntriesModule,
    MaterialModule,
    PreviewModule,
    FieldsComponentModule,
    NotificationsModule,
    AddnotificationModule,
    ApprovalsettingModule,
    AddapprovalModule,
    SettingsModule,
    ExportModule

  ]
})
export class FormsModule { }
