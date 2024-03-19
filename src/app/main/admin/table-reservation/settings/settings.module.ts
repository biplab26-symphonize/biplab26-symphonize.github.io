import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsService } from 'app/_services';
import { AuthGuard } from 'app/_guards';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';


const routes = [
  { 
    path          : 'admin/restaurant-reservations/settings', 
    component     : SettingsComponent, 
    canActivate   : [AuthGuard],
    resolve       : {setting :SettingsService},
    data          : { type : "table"}
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
