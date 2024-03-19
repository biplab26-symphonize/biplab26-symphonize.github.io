import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListModule } from './list/list.module';
import { AddModule } from './add/add.module';
import { DepartmentsModule } from './departments/departments.module';
import { DesignationModule } from './designation/designation.module';
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
      path: 'departments',
      loadChildren: () => import('./departments/departments.module').then(m => m.DepartmentsModule)
  },
  {
      path: 'designation',
      loadChildren: () => import('./designation/designation.module').then(m => m.DesignationModule)
  },
  {
      path: 'settings',
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ListModule,
    AddModule,
    DepartmentsModule,
    DesignationModule,
    SettingsModule
  ],
  providers: []
})
export class StaffModule { 
  
}
