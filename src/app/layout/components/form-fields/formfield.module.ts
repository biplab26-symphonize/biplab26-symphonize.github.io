import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldsComponent } from './form-fields.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { ListFormFieldModule } from './list-form-field/list-form-field.module';
import { DynamicFormFieldsModule } from './dynamic-form-fields/dynamic-form-fields.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ConditionalLogicComponent } from './conditional-logic/conditional-logic.component';

@NgModule({
  declarations: [FormFieldsComponent, ConditionalLogicComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MatDialogModule,
    MaterialModule,
    FieldsComponentModule,
    ListFormFieldModule,
    DynamicFormFieldsModule,
    EditorModule
  ],
 entryComponents : [FormFieldsComponent]
})
export class FormfieldModule { }
