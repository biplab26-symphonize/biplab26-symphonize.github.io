import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesComponent } from './images.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { GalleryService } from 'app/_services';
import { LightboxModule } from 'ngx-lightbox';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
    path      : 'gallery/images/:id', 
    name      : 'Images List',
    component : ImagesComponent      
  }  
]

@NgModule({
  declarations: [ImagesComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    LightboxModule,
    BreadcumbModule
  ],
  providers : [GalleryService]
})
export class ImagesModule { }
