import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterButtonsComponent } from './register-buttons.component';
import { MatButtonModule } from '@angular/material/button';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  declarations: [RegisterButtonsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    FuseSharedModule
  ],
  exports:[
    RegisterButtonsComponent
  ]
})
export class RegisterButtonsModule { }
