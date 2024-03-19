import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MediaService, CommonService } from 'app/_services';


@NgModule({
  declarations: [GalleryComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule
  ],
  entryComponents: [
    GalleryComponent
  ],
  exports:[
    GalleryComponent
  ],
  providers :[MediaService,CommonService]
})
export class GalleryModule { }
