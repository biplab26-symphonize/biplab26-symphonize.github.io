import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/_guards';

import { AddComponent } from './add.component';
import { MaterialModule } from 'app/main/material.module';
import { CategoryService, MediaService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { VgCoreModule } from 'ngx-videogular'
import { ImageCropperComponents } from './image-cropper/image-cropper.component';
import { ImageCropperModule } from './image-cropper/image-cropper.module';





const routes = [
  { 
    path        : 'admin/media/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard] ,
    data        : { type : "M"},
    resolve     : {category : CategoryService ,
                   media : MediaService}
  },
  { 
    path        : 'admin/media/edit/:id', 
    component   : AddComponent, 
    canActivate : [AuthGuard] ,
    data        : { type : "M"},
    resolve     : {category : CategoryService,
                   media : MediaService}
  },
];
@NgModule({
  declarations: [AddComponent, ImageCropperComponents],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    VgCoreModule,
    FileUploadModule,
    ImageCropperModule,
  ],
  exports     : [
    ImageCropperComponents
  ],
  entryComponents: [
    ImageCropperComponents
  ]
})
export class AddModule { }
