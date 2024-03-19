import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { MaterialModule } from 'app/main/material.module';
import { OptionsList, CommonService, RolesService } from 'app/_services';
import { SlugifyPipe } from '@fuse/pipes/slugify.pipe';

const routes = [
  { 
    path: 'admin/roles/list', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    resolve  : {
      roles: RolesService
    }
  },
  { 
    path: 'admin/roles/trash', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {trash: 1},
    resolve  : {
      roles: RolesService
    }
  },
  { 
    path: 'admin/roles/add', 
    component: AddComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin/roles/edit/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    resolve  : {
        role: RolesService
    } 
  }
];

@NgModule({
  declarations: [ListComponent, AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule
  ],
  providers: [SlugifyPipe, OptionsList, CommonService, RolesService]
})
export class RolesModule { }
