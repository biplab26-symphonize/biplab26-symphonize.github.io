import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { WelcomeComponent } from './welcome.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    FuseSharedModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    RouterModule
  ],
  entryComponents: [
    WelcomeComponent
  ],
  exports: [
    WelcomeComponent
  ],
})
export class WelcomeModule { }