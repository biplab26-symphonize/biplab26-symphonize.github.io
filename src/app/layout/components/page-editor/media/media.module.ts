import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { MediaComponent } from './media.component';
import { MaterialModule } from 'app/main/material.module';
import { GalleryModule } from 'app/layout/components/dialogs/gallery/gallery.module'; 
@NgModule({
  declarations: [MediaComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule,
    GalleryModule
  ],
  entryComponents: [
    MediaComponent
  ],
  exports:[
    MediaComponent
  ],
})
export class MediaModule { }
