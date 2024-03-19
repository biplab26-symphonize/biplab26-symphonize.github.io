import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualComponent } from './manual.component';
import { MaterialModule } from 'app/main/material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  declarations: [ManualComponent],
  exports     : [ManualComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    MatMomentDateModule
  ]
})
export class ManualModule { }
