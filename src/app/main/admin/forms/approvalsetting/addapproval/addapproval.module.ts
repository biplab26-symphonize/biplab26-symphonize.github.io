import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddapprovalComponent } from './addapproval.component';
import { AuthGuard } from 'app/_guards';
import { FormsService, UsersService, RolesService } from 'app/_services';
import { RouterModule } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';


const routes = [
  { 
    path        : 'admin/forms/approvals/addapproval/:id', 
    component   : AddapprovalComponent, 
    canActivate : [AuthGuard],
    resolve     : {forms: FormsService,
                   users: UsersService,
                   roles: RolesService},
    data        : {form_id :'form_id'},
  },
  {
    path        : 'admin/addapproval/edit/:id', 
    component   : AddapprovalComponent, 
    canActivate : [AuthGuard],
    resolve     : {forms: FormsService,
                   users: UsersService,
                   roles: RolesService},
    data        : {form_id :'form_id'}
    }
  
  ]


@NgModule({
  declarations: [AddapprovalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [ FormsService, RolesService, UsersService]
})
export class AddapprovalModule { }
