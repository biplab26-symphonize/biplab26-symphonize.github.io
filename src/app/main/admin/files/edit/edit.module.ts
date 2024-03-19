import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit.component';
import { ApplyCategoryComponent } from './applycategory/applycategory.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
@NgModule({
  declarations: [EditComponent, ApplyCategoryComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule
  ], 
  exports:[
    EditComponent, 
    ApplyCategoryComponent
  ],
  entryComponents: [
    EditComponent, 
    ApplyCategoryComponent
  ]
})
export class EditModule { }

