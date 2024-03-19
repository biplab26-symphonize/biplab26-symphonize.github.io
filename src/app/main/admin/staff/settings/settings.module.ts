import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { SettingsService, RolesService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';

const routes = [
  { 
    path           : 'admin/staff/settings', 
    component      : SettingsComponent, 
    canActivate    : [AuthGuard],
    data           : { key : "staff_settings" , roleType:"all"},
    resolve        : {
                        data : SettingsService,
                        roles: RolesService
                      } 
  },
];

@NgModule({
declarations: [SettingsComponent],
imports: [
  CommonModule,
  RouterModule.forChild(routes),
  MaterialModule,
  FuseSharedModule,
  FuseConfirmDialogModule,
  FileUploadModule,
],
providers:[
  SettingsService,
  RolesService
]
})
export class SettingsModule { }
