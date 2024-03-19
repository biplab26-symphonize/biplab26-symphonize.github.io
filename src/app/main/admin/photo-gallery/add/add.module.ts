import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { AddComponent } from './add.component';
import { OptionsList, CommonService, UsersService, RolesService, GalleryService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { CommonUtils } from 'app/_helpers';
import { EditorModule } from '@tinymce/tinymce-angular';

const routes = [
  { 
    path          : 'admin/albums/add/:galleryid', 
    component     : AddComponent, 
    canActivate   : [AuthGuard]
  },
  { 
    path          : 'admin/albums/add', 
    component     : AddComponent, 
    canActivate   : [AuthGuard]
  },
  { 
    path          : 'admin/albums/edit/:galleryid/:id', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      album: GalleryService
    }
  },
  { 
    path          : 'admin/gallery/add', 
    component     : AddComponent, 
    canActivate   : [AuthGuard]
  },
  { 
    path          : 'admin/gallery/edit/:id', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      gallery: GalleryService
    }
  }
];

@NgModule({
  declarations: [AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FileUploadModule,
    EditorModule,
  ],
  providers: [OptionsList, CommonService, GalleryService, CommonUtils]  
})
export class AddModule { }
