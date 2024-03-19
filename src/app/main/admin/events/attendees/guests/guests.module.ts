import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestsComponent } from './guests.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [GuestsComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule,
    NgxMaskModule.forRoot()
  ],
  exports:[
    GuestsComponent
  ],
  entryComponents:[GuestsComponent]
})
export class GuestsModule { }
