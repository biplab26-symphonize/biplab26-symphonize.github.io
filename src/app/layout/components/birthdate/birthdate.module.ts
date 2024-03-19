import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { BirthdateComponent } from './birthdate.component';

@NgModule({
  declarations: [BirthdateComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MatSelectModule
    
  ],
  exports     : [
    BirthdateComponent
  ]
})
export class BirthdateModule { }
