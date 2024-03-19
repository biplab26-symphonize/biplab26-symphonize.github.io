import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SettingsService} from 'app/_services';

const routes = [
  { 
    path          : 'admin/fitness-reservation/settings', 
    component     : SettingsComponent, 
    canActivate   : [AuthGuard],
    resolve       : {setting :SettingsService},
    data          : { type : "appointment"}
  },
];


@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    EditorModule
  ]
})
export class SettingsModule { }
