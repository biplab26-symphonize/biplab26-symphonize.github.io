import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '@fuse/shared.module';
import { FrontQuickPanelComponent } from './front-quick-panel.component';

@NgModule({
  declarations: [FrontQuickPanelComponent],
  imports     : [
    RouterModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    FuseSharedModule,
  ],
  exports: [
    FrontQuickPanelComponent
  ]
})
export class FrontQuickPanelModule { }
