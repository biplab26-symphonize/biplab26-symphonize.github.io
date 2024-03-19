import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GalleriesComponent } from './galleries.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { GalleryService } from 'app/_services';

const routes = [
  { 
    path          : 'admin/galleries/list', 
    component     : GalleriesComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      galleries: GalleryService
    }
  },
  { 
    path: 'admin/galleries/trash', 
    component: GalleriesComponent, 
    canActivate: [AuthGuard],
    data: {trash: 1},
    resolve  : {
      galleries: GalleryService
    }
  }
]

@NgModule({
  declarations: [GalleriesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ]
})
export class GalleriesModule { }
