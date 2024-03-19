import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { UsermetaComponent } from './usermeta.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxMaskModule } from 'ngx-mask';
@NgModule({
  declarations: [ UsermetaComponent],
  exports : [UsermetaComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    FieldsComponentModule,
    EditorModule,
    NgxMaskModule.forRoot()
  ],
  entryComponents:[UsermetaComponent],
  providers: []
})
export class UsermetaModule { }
