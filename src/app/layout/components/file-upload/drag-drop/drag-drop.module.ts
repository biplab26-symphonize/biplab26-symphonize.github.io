import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropComponent } from './drag-drop.component';

import { DragDropDirective } from './drag-drop.directive';
import { MaterialModule } from 'app/main/material.module';
import { UploadModule } from './upload/upload.module';
@NgModule({
  declarations: [DragDropComponent, DragDropDirective],
  imports: [
    CommonModule,
    MaterialModule,
    UploadModule
  ], 
  exports:[
    DragDropComponent
  ],
  entryComponents: [
    DragDropComponent
  ]
})
export class DragDropModule { }
