import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingsService} from 'app/_services';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'app/main/material.module';
const routes = [
  { 
    path          : 'admin/calendar_generator/settings', 
    component     : SettingsComponent, 
    canActivate   : [AuthGuard], 
    resolve       : {setting:SettingsService},
    data          : { key : "calendar_generator_setting"},
  },
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ],
  providers: [SettingsService]

})
export class SettingsModule { }
