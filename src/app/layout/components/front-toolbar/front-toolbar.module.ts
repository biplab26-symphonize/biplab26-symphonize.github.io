import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseConfirmDialogModule, FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';  //EXTRA Changes
import { FuseSharedModule } from '@fuse/shared.module';
import { LogoModule } from './logo/logo.module';
import { FrontToolbarComponent } from './front-toolbar.component';
import { UserProfileModule } from 'app/main/front/profile/user-profile/user-profile.module';

@NgModule({
  declarations: [
    FrontToolbarComponent
],
imports     : [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,

    FuseSharedModule,
    FuseConfirmDialogModule, //EXTRA Changes
    FuseSearchBarModule,
    FuseShortcutsModule,
    UserProfileModule,
    LogoModule //logoModule
],
exports     : [
  FrontToolbarComponent
]
})
export class FrontToolbarModule { }
