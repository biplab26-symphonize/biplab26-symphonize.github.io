import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AddModule } from './add/add.module';
import { LibraryModule } from './library/library.module';

const appRoutes: Routes = [
  {
      path: 'add',
      loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
      path: 'library',
      loadChildren: () => import('./library/library.module').then(m => m.LibraryModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    AddModule,
    LibraryModule
  ]
})
export class MediaModule { }
