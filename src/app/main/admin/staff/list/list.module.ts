import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { ListComponent } from './list.component';
import { MaterialModule } from 'app/main/material.module';
import { StaffService, CommonService,UsersService, SettingsService } from 'app/_services';

const routes = [
  { 
    path         : 'admin/staff/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    data         : { key : "staff_settings" },
    resolve      : {
                        staffs: StaffService,
                        setting :SettingsService
                   }
  },
  { 
    path          : 'admin/staff/trash', 
    component     : ListComponent, 
    canActivate   : [AuthGuard],
    data          : {trash: 1 ,key : "staff_settings"},
    resolve       : {
                      staffs: StaffService,
                      setting :SettingsService
                    }
  }
];

@NgModule({
declarations: [ListComponent],
imports: [
  CommonModule,
  RouterModule.forChild(routes),
  FuseSharedModule,
  MaterialModule
],
providers : [
      CommonService,StaffService,UsersService,SettingsService
]
})
export class ListModule { }
