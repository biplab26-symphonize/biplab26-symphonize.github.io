import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { GalleryService } from 'app/_services';
import { ViewAlbumComponent } from './view-album.component';
import { LightboxModule } from 'ngx-lightbox';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { DetailsModule } from './image-upload/details/details.module';

const routes = [
  { 
    path          : 'admin/view/album/:id', 
    component     : ViewAlbumComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      album: GalleryService,
      medias: GalleryService
    }
  }
]

@NgModule({
  declarations: [ViewAlbumComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    LightboxModule,
    ImageUploadModule,
    DetailsModule
  ]
})
export class ViewAlbumModule { }
