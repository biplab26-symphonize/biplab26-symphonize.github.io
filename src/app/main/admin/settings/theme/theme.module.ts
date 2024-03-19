import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ThemeComponent } from './theme.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseMaterialColorPickerModule } from '@fuse/components';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';

const routes = [
  { 
    path: 'admin/settings/theme', 
    component: ThemeComponent, 
    canActivate: [AuthGuard] 
  }
];


@NgModule({
declarations: [ThemeComponent],
imports: [
  CommonModule,
  RouterModule.forChild(routes),
  FuseSharedModule,
  MaterialModule,
  FuseMaterialColorPickerModule,
  FileUploadModule
]
})
export class ThemeModule { }
