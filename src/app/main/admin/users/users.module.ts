import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesModule } from './categories/categories.module';
import { RolesModule } from './roles/roles.module';
import { ListModule } from './list/list.module';
import { AddModule } from './add/add.module';
import { ViewuserModule } from 'app/layout/components/users/viewuser/viewuser.module';
import { SettingsModule } from './settings/settings.module';
const appRoutes: Routes = [
  {
      path: 'list',
      loadChildren: () => import('./list/list.module').then(m => m.ListModule)
  },
  {
      path: 'add',
      loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
      path: 'view',
      loadChildren: () => import('app/layout/components/users/viewuser/viewuser.module').then(m => m.ViewuserModule)
  },
  {
      path: 'settings',
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
      path: 'roles',
      loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    AddModule,
    ViewuserModule,
    SettingsModule,
    RolesModule,
    ListModule,
    CategoriesModule
  ]
})
export class UsersModule { }
