import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { RolesService } from 'app/_services';
import { PermissionsComponent } from './permissions.component';


const routes = [
  { 
    path: 'admin/settings/permissions', 
    component: PermissionsComponent, 
    canActivate: [AuthGuard],
    resolve  : {
      roles: RolesService
    }
  }
];

@NgModule({
  declarations: [PermissionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ],
  providers: [RolesService]    
})
export class PermissionsModule { }


