import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { TemplatesComponent } from './templates.component';
import { PageOptionsList } from 'app/_services';
import { TmplOneComponent } from './tmpl-one/tmpl-one.component';
import { TextComponent } from '../elements/text/text.component';
import { VideoComponent } from '../elements/video/video.component';
import { ButtonComponent } from '../elements/button/button.component';
import { ContentBoxComponent } from '../elements/content-box/content-box.component';
import { ImageComponent } from '../elements/image/image.component';

@NgModule({
  declarations: [TemplatesComponent, TmplOneComponent, TextComponent, VideoComponent, ButtonComponent, ContentBoxComponent, ImageComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule
  ],
  entryComponents: [
    TemplatesComponent,
    TmplOneComponent,
    TextComponent,
    VideoComponent,
    ButtonComponent,
    ContentBoxComponent,
    ImageComponent
  ],
  exports:[
    TemplatesComponent,
    TmplOneComponent,
    TextComponent,
    VideoComponent,
    ButtonComponent,
    ContentBoxComponent,
    ImageComponent
  ],
  providers:[
    PageOptionsList
  ]
})
export class TemplatesModule { }
