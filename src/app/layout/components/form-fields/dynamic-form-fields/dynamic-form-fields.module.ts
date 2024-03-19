import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { DynamicFormFieldsComponent } from './dynamic-form-fields.component';



@NgModule({
  declarations: [ DynamicFormFieldsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    NgxMaskModule.forRoot(),
  ],
  exports:[
    DynamicFormFieldsComponent
  ],
  entryComponents: [
    DynamicFormFieldsComponent
  ]
})
export class DynamicFormFieldsModule { }
