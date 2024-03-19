import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AlbumsModule } from './albums/albums.module';
import { GalleriesModule } from './galleries/galleries.module';
import { AddModule } from './add/add.module';
import { ViewAlbumModule } from './view-album/view-album.module';
import { GallerySettingsModule } from './gallery-settings/gallery-settings.module';

const appRoutes: Routes = [
  {
    path: 'galleries',
    loadChildren: () => import('./galleries/galleries.module').then(m => m.GalleriesModule)
  },
  {
      path: 'list',
      loadChildren: () => import('./albums/albums.module').then(m => m.AlbumsModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
    path: 'view/album/:id',
    loadChildren: () => import('./view-album/view-album.module').then(m => m.ViewAlbumModule)
  },
  {
    path: 'gallery-settings',
    loadChildren: () => import('./gallery-settings/gallery-settings.module').then(m => m.GallerySettingsModule)
  },
  
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    GalleriesModule,
    AlbumsModule,
    AddModule,
    ViewAlbumModule,
    GallerySettingsModule
  ]
})
export class PhotoGalleryModule { }
