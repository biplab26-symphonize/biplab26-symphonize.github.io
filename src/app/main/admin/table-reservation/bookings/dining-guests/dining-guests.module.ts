import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { DiningGuestsComponent } from './dining-guests.component';
import { MaterialModule } from 'app/main/material.module';
import { NgxMaskModule } from 'ngx-mask';
@NgModule({
  declarations: [DiningGuestsComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule,
    NgxMaskModule.forRoot()
  ],
  exports:[
    DiningGuestsComponent
  ],
  entryComponents:[DiningGuestsComponent]
})
export class DiningGuestsModule { }
