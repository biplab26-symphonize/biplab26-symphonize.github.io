import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EventmetaComponent } from './eventmeta.component';



@NgModule({
  declarations: [EventmetaComponent],
  exports:[EventmetaComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    FieldsComponentModule,
  ],
  entryComponents:[EventmetaComponent]
})
export class EventmetaModule { }
