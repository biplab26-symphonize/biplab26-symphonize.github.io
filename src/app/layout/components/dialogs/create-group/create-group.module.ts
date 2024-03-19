import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGroupComponent } from './create-group.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';


@NgModule({
  declarations: [CreateGroupComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule
  ],
  entryComponents: [
    CreateGroupComponent
  ],
  exports:[
    CreateGroupComponent
  ]
})
export class CreateGroupModule { }
