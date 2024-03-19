import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SettingsService } from 'app/_services';


const routes = [
  { 
    path          : 'admin/meeting-room/settings', 
    component     : SettingComponent, 
    canActivate   : [AuthGuard],
    resolve       : {setting :SettingsService},
    data          : { type : "meeting"}
  },
];
@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    EditorModule
  ]
})
export class SettingModule { }
