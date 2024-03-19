import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { ListFormFieldComponent } from './list-form-field.component';
import { NgxMaskModule } from 'ngx-mask';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@busacca/ng-pick-datetime';

@NgModule({
  declarations: [ListFormFieldComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    NgxMaskModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports:[
    ListFormFieldComponent
  ],
  entryComponents: [
    ListFormFieldComponent
  ]
})
export class ListFormFieldModule { }
