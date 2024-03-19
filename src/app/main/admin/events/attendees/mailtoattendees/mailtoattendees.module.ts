import { NgModule } from '@angular/core';
import { MailtoAttendeesComponent } from './mailtoattendees.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MaterialModule } from 'app/main/material.module';

@NgModule({
  declarations: [MailtoAttendeesComponent],
  imports: [
    FuseSharedModule,
    MaterialModule,
    EditorModule
  ],
  exports:[EditorModule],
  entryComponents: [
    MailtoAttendeesComponent
  ],
})
export class MailtoAttendeesModule { }
