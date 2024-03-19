import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { MaterialModule } from 'app/main/material.module';
import { OptionsList, CommonService, CategoryService } from 'app/_services';

const routes = [
  { 
    path: 'admin/files/categories/list', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {
      type:'D'
    },
    resolve  : {
      categories: CategoryService
    }
  },
  { 
    path: 'admin/files/categories/trash', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {trash: 1,type:'D'},
    resolve  : {
      categories: CategoryService
    }
  },
  { 
    path: 'admin/files/categories/add', 
    component: AddComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin/files/categories/edit/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    resolve  : {
      category: CategoryService
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
  providers: [OptionsList, CommonService, CategoryService]
})
export class CategoriesModule { }

