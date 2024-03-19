import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumsComponent } from './albums.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { GalleryService } from 'app/_services';

const routes = [
  { 
    path          : 'admin/view/gallery/:id', 
    component     : AlbumsComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      albums: GalleryService
    }
  },
  { 
    path          : 'admin/album/list', 
    component     : AlbumsComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      albums: GalleryService
    }
  },
  { 
    path          : 'admin/trash/gallery/:id', 
    component     : AlbumsComponent, 
    canActivate   : [AuthGuard],
    data: {trash: 1},
    resolve  : {
      albums: GalleryService
    }
  },
  { 
    path          : 'admin/album/trash', 
    component     : AlbumsComponent, 
    canActivate   : [AuthGuard],
    data: {trash: 1},
    resolve  : {
      albums: GalleryService
    }
  }
]

@NgModule({
  declarations: [AlbumsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ]
})
export class AlbumsModule { }
