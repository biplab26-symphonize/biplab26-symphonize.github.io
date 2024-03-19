import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaModule } from 'app/layout/components/page-editor/media/media.module';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorGalleryComponent } from './editor-gallery.component';


@NgModule({
  declarations: [EditorGalleryComponent],
  imports: [
    CommonModule,
    MediaModule,
    MaterialModule,
    FuseSharedModule
  ],
  entryComponents: [
    EditorGalleryComponent
  ],
  exports:[
    EditorGalleryComponent
  ],
})
export class EditorGalleryModule { }
