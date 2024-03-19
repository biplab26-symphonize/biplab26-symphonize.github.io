import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import {SettingsService } from 'app/_services';
import { SettingComponent } from './setting.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';

const routes = [
  { 
    path        : 'admin/rotating-menu/setting', 
    component   : SettingComponent, 
    canActivate : [AuthGuard],
    data           : { key : "rotating_menu_settings",type:"D"},
    resolve        : { 
      settings     : SettingsService, 
       
    } 
  },
]

@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FileUploadModule
  ],
  providers:[
    SettingsService
  ]
})
export class SettingModule { }
