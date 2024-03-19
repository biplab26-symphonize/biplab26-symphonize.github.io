import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogListComponent } from './log-list/log-list.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminRoleGuard, AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ActivitylogService, SettingsService } from 'app/_services';

const routes = [
  { 
    path        : 'admin/activity-log/list', 
    component   : LogListComponent, 
    canActivate : [AuthGuard,AdminRoleGuard],
    resolve     : {activity: ActivitylogService},

  },
  {
    path        : 'admin/activity-log/settings', 
    component   : SettingsComponent, 
    canActivate : [AuthGuard,AdminRoleGuard],
    resolve     : {activity: ActivitylogService},
  },
];

@NgModule({
  declarations: [LogListComponent, SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ],
  providers:[ActivitylogService,SettingsService]
})
export class ActivityLogModule { }
