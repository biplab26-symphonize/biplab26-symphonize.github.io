import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseConfirmDialogModule } from '@fuse/components/confirm-dialog/confirm-dialog.module';
import { CategoryService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

const routes = [
  { 
    path          : 'admin/departments/list', 
    component     : ListComponent, 
    canActivate   : [AuthGuard],
    resolve       : { department : CategoryService },
    data          : { type : "DEPT" ,dept : "Y",column_name:'category_name',direction:'asc'}
  },
  { 
    path          : 'admin/departments/trash', 
    component     : ListComponent, 
    canActivate   : [AuthGuard],
    resolve       : { department : CategoryService },
    data          : { trash : 1 ,type:"DEPT" ,dept : "Y",column_name:'category_name',direction:'asc'}
  },
  { 
    path          : 'admin/departments/add', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    resolve       : { department : CategoryService },
    data          : { type : "DEPT,SUBDEPT" ,dept : "Y",limit:'100',status:"A"}
  },
  { 
    path          : 'admin/departments/edit/:id', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    resolve       : { department : CategoryService },
    data          : { type : "DEPT,SUBDEPT" ,dept : "Y",limit:'100',status:"A"}
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
providers:[
        CategoryService ,CommonUtils
]
})
export class DepartmentsModule { }
