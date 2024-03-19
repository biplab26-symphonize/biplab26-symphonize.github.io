import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SettingsService,UsersService, RolesService} from 'app/_services';

const routes = [
    { 
      path          : 'admin/food-reservation/settings', 
      component     : SettingsComponent, 
      canActivate   : [AuthGuard],
      resolve       : {setting:SettingsService,
                      users: UsersService,
                      roles: RolesService},
      data          : { type : "food"}
    },
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    EditorModule
  ],
  providers: [ RolesService, UsersService]
})
export class SettingsModule { }
