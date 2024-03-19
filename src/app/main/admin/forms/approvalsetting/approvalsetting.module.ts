import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalsettingComponent } from './approvalsetting.component';
import { AddapprovalComponent } from './addapproval/addapproval.component';
import { AuthGuard } from 'app/_guards';
import { FormsService, UsersService, RolesService, ApprovalService } from 'app/_services';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  { 
    path        : 'admin/form/approvals/:id', 
    component   : ApprovalsettingComponent, 
    canActivate : [AuthGuard],
    resolve     : {approval: ApprovalService},
    data		    : {formid: 'form_id' } 
  },

]
@NgModule({
  declarations: [ApprovalsettingComponent],
  imports: [
            CommonModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MaterialModule,
            NgxMaskModule.forRoot(),
  ],
  providers:[ UsersService,RolesService,ApprovalService]

})
export class ApprovalsettingModule { }
