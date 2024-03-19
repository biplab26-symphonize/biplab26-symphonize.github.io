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
  //USER INTEREST AND COMMITEE
  { 
    path: 'admin/users/interests/list', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {
      type:'INTEREST'
    },
    resolve  : {
      categories: CategoryService
    }
  },
  { 
    path: 'admin/users/interests/trash', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {trash: 1,type:'INTEREST'},
    resolve  : {
      categories: CategoryService
    }
  },
  { 
    path: 'admin/users/interest/add', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data: {
      type:'INTEREST'
    }, 
  },
  { 
    path: 'admin/users/interest/edit/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data: {
      type:'INTEREST'
    },
    resolve  : {
      category: CategoryService
    } 
  },
  { 
    path: 'admin/users/commitees/list', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {
      type:'COMMITEE'
    },
    resolve  : {
      categories: CategoryService
    }
  },
  { 
    path: 'admin/users/commitees/trash', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {trash: 1,type:'COMMITEE'},
    resolve  : {
      categories: CategoryService
    }
  },
  { 
    path: 'admin/users/commitee/add', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data: {
      type:'COMMITEE'
    } 
  },
  { 
    path: 'admin/users/commitee/edit/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data: {
      type:'COMMITEE'
    }, 
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

