import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'app/main/material.module';
import { SettingsService, CategoryService } from 'app/_services';

const routes = [
  { 
    path           : 'admin/files/settings', 
    component      : SettingsComponent, 
    canActivate    : [AuthGuard],
    data           : { key : "documentsettings",type:"D"},
    resolve        : { 
      settings     : SettingsService, 
      categories   : CategoryService, 
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
  FileUploadModule
],
providers:[
  SettingsService,
  CategoryService
]
})
export class SettingsModule { }
