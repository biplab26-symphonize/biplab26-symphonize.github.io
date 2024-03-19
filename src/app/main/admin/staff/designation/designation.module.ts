import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import {  CategoryService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { FuseConfirmDialogModule } from '@fuse/components';

const routes = [
  { 
    path          : 'admin/title/list', 
    component     : ListComponent, 
    canActivate   : [AuthGuard] ,
    resolve       : { designation : CategoryService },
    data          : {type:"DESIGNATION"}
  },
  {
    path          : 'admin/title/trash',
    component     : ListComponent,
    canActivate   : [ AuthGuard],
    resolve       : { designation : CategoryService },
    data          : { trash: 1 ,type:"DESIGNATION"}
  },
  { 
    path          : 'admin/title/add', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    resolve       : { designation : CategoryService },
    data          : {type:"DESIGNATION"}
  },
  { 
    path          : 'admin/title/edit/:id', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    resolve       : { designation : CategoryService },
    data          : {type:"DESIGNATION"}
  }
];

@NgModule({
declarations: [ListComponent,AddComponent],
imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
],
providers: [
       CategoryService
]
})
export class DesignationModule {
  
 }
