import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { EditorModule as TinyEditorModule } from '@tinymce/tinymce-angular';
import { TemplatesModule } from './templates/templates.module';
import { TemplateLoaderComponent } from './template-loader/template-loader.component';
import { ContainerComponent } from './container/container.component';
import { PageOptionsList } from 'app/_services';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { ElementsComponent } from './elements/elements.component';
import { TextSettingsComponent } from './settings-dialog/text-settings/text-settings.component';
import { VideoSettingsComponent } from './settings-dialog/video-settings/video-settings.component';
import { ButtonSettingsComponent } from './settings-dialog/button-settings/button-settings.component';
import { ContentBoxesSettingsComponent } from './settings-dialog/content-boxes-settings/content-boxes-settings.component';
import { ImageSettingsComponent } from './settings-dialog/image-settings/image-settings.component';

@NgModule({
  declarations: [EditorComponent, TemplateLoaderComponent, ContainerComponent, SettingsDialogComponent, ElementsComponent, TextSettingsComponent, VideoSettingsComponent, ButtonSettingsComponent, ContentBoxesSettingsComponent, ImageSettingsComponent, ],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule,
    TinyEditorModule,
    TemplatesModule
  ],
  entryComponents: [
    EditorComponent,
    ContainerComponent,
    SettingsDialogComponent,
    TemplateLoaderComponent,
    ElementsComponent,
    TextSettingsComponent,
    VideoSettingsComponent, 
    ButtonSettingsComponent, 
    ContentBoxesSettingsComponent, 
    ImageSettingsComponent
  ],
  exports:[
    EditorComponent,
    ContainerComponent,
    SettingsDialogComponent,
    TemplateLoaderComponent,
    ElementsComponent
  ],
  providers:[
    PageOptionsList
  ]
})
export class EditorModule { }
