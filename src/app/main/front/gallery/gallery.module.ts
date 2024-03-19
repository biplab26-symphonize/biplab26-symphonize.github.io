import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ListModule } from './list/list.module';
import { AlbumsModule } from './albums/albums.module';
import { ImagesModule } from './images/images.module';
import { AuthGuard } from 'app/_guards';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const appRoutes = [
  {
    path: 'list',
    name:'Galleries',
    canActivate: [AuthGuard],
    loadChildren: () => import('./list/list.module').then(m => m.ListModule)
  },
  {
    path: 'albums',
    name:'Albums',
    canActivate: [AuthGuard],
    loadChildren: () => import('./albums/albums.module').then(m => m.AlbumsModule)
  },
  {
    path: 'images',
    name:'Images',
    canActivate: [AuthGuard],
    loadChildren: () => import('./images/images.module').then(m => m.ImagesModule)
  }
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ListModule,
    MaterialModule,
    FuseSharedModule,
    AlbumsModule,
    ImagesModule,
    BreadcumbModule
  ]
})
export class GalleryModule { }
