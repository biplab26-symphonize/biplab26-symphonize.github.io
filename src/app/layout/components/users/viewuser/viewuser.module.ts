import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewuserComponent } from './viewuser.component';
import { AuthGuard } from 'app/_guards';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { UsersService } from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';
const routes = [
  { 
      path: 'admin/users/view/:id', 
      component: ViewuserComponent, 
      canActivate: [AuthGuard],
      data:{status:'A' ,type : 'U'},
      resolve  : {
        user: UsersService
      } 
  },
  { 
      path: 'view-other-profile/:id', 
      component: ViewuserComponent, 
      canActivate: [AuthGuard],
      data:{status:'A' ,type : 'U'},
      resolve  : {
        user: UsersService
      } 
  },
]
@NgModule({
  declarations: [ViewuserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    NgxMaskModule.forRoot()
  ],
  providers: [UsersService]
})
export class ViewuserModule { }
