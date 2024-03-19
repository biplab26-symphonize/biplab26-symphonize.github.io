import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FrontFooterComponent } from './front-footer.component';

@NgModule({
  declarations: [FrontFooterComponent],
  imports     : [
    RouterModule,

    MatButtonModule,
    MatIconModule,
    MatToolbarModule,

    FuseSharedModule
  ],
  exports     : [
    FrontFooterComponent
  ]
})
export class FrontFooterModule { }
