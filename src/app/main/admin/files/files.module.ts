import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesModule } from './categories/categories.module';
import { AddModule } from './add/add.module';
import { ReplaceModule } from './replace/replace.module';
import { LibraryModule } from './library/library.module';
import { MaterialModule } from 'app/main/material.module';
import { SettingsModule } from './settings/settings.module'; 
const appRoutes: Routes = [
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
  },
  {
      path: 'library',
      loadChildren: () => import('./library/library.module').then(m => m.LibraryModule)
  },
  {
      path: 'add',
      loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
      path: 'replace',
      loadChildren: () => import('./replace/replace.module').then(m => m.ReplaceModule)
  },
  {
      path: 'settings',
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    CategoriesModule,
    AddModule,
    ReplaceModule,
    MaterialModule,
    LibraryModule,
    SettingsModule
  ]
})
export class FilesModule { }
