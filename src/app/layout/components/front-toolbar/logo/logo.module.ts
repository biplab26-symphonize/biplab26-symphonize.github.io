import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { LogoComponent } from './logo.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [LogoComponent],
  imports: [
    CommonModule,
    FuseSharedModule, 
    RouterModule
  ],
  exports: [
    LogoComponent
  ],
})
export class LogoModule { }
