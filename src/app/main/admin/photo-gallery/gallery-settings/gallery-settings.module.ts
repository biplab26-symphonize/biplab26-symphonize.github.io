import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { GallerySettingsComponent } from './gallery-settings.component';
import { SettingsService } from 'app/_services';


const routes = [
  { 
    path          : 'admin/gallery-settings', 
    component     : GallerySettingsComponent, 
    canActivate   : [AuthGuard],
    data           : { key : "gallery_settings"},
    resolve  : {
      setting : SettingsService
   },
  }
]

@NgModule({
  declarations: [GallerySettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ],
  providers :[SettingsService]
})
export class GallerySettingsModule { }
