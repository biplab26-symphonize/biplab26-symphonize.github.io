import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'ng-starrating';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@busacca/ng-pick-datetime';

import { MaterialModule } from 'app/main/material.module';
import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { HiddenComponent } from './hidden/hidden.component';
import { ButtonComponent } from './button/button.component';
import { SelectComponent } from './select/select.component';
import { DateComponent } from './date/date.component';
import { RadiobuttonComponent } from './radiobutton/radiobutton.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { UploadComponent } from './upload/upload.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ListComponent } from './list/list.component';
import { RatingComponent } from './star-rating/star-rating.component';
import { DynamicFieldDirective } from './dynamic-field/dynamic-field.directive';
import { DynamicFieldFormDirective } from './dynamic-field-form/dynamic-field-form.directive';
import { FileSaverModule } from 'ngx-filesaver';
import { TinyMceComponent } from './tiny-mce/tiny-mce.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DynamicComponent } from './dynamic/dynamic.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureComponent } from './signature/signature.component';
import { TimeComponent } from './time/time.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WebsiteComponent } from './website/website.component';
import { HtmlComponent } from './html/html.component';


const modules = [
 InputComponent,
 TextareaComponent,
 HiddenComponent,
 ButtonComponent,
 SelectComponent,
 DateComponent,
 RadiobuttonComponent,
 CheckboxComponent,
 UploadComponent,
 AutocompleteComponent,
 ListComponent,
 RatingComponent,
 TinyMceComponent,
 DynamicComponent,
 DynamicFormComponent,
 SignatureComponent,
 TimeComponent,
 HtmlComponent,
 WebsiteComponent
 
];

@NgModule({
imports: [
    CommonModule,
    MaterialModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RatingModule,
    ColorPickerModule,
    FileSaverModule,
    MatSelectModule,
    EditorModule,
    SignaturePadModule,
    MatInputModule
    
],
declarations: [
  
  DynamicFieldDirective,
  DynamicFieldFormDirective,
 ...modules,
 WebsiteComponent,
],
exports: [
    CommonModule,
    MaterialModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormComponent,
    DynamicFieldDirective,
    DynamicFieldFormDirective,
    RatingModule,
    FileSaverModule,
    EditorModule,
    ColorPickerModule,
    SignaturePadModule,
  ...modules
],
entryComponents: [
  ...modules
]
})

export class FieldsComponentModule { }
