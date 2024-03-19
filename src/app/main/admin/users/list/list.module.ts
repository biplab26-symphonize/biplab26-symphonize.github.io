import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ListComponent } from './list.component';
import { CommonService, UsersService, RolesService } from 'app/_services';

const routes = [
    { 
        path: 'admin/users/list', 
        component: ListComponent, 
        canActivate: [AuthGuard],
        resolve  : {
            users: UsersService,
            roles: RolesService
        }
    },
    { 
        path: 'admin/users/trash', 
        component: ListComponent, 
        canActivate: [AuthGuard],
        data: {trash: 1},
        resolve  : {
            users: UsersService,
            roles: RolesService
        }
    }
];

@NgModule({
    declarations: [ListComponent],
    imports:[
              CommonModule,
              RouterModule.forChild(routes),
              FuseSharedModule,
              MaterialModule
          ],
    providers: [ CommonService, RolesService, UsersService]        
})
export class ListModule {}
