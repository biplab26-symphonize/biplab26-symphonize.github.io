import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsComponent } from './albums.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { GalleryService } from 'app/_services';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
    path      : 'gallery/albums/:id', 
    name      : 'Albums List',
    component : AlbumsComponent      
  }  
]

@NgModule({
  declarations: [AlbumsComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    BreadcumbModule
  ],
  providers : [GalleryService]
})
export class AlbumsModule { }
