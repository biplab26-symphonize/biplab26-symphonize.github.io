import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ModalEventComponent } from './modal-event.component';
import { RegisterButtonsModule } from 'app/layout/components/events/register-buttons/register-buttons.module';


@NgModule({
  declarations: [ModalEventComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FuseSharedModule,
    RegisterButtonsModule
  ],
  exports:[ModalEventComponent],
  entryComponents:[ModalEventComponent]
})
export class ModalEventModule { }
