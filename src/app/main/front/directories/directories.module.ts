import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StaffDirectoryModule } from './staff-directory/staff-directory.module';
import { ResidentModule } from './resident/resident.module';

const appRoutes: Routes = [
  {
      path: 'resident-directorys',
      loadChildren: () => import('./resident/resident.module').then(m => m.ResidentModule)
  },
  {
      path: 'staffs',
      loadChildren: () => import('./staff-directory/staff-directory.module').then(m => m.StaffDirectoryModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    StaffDirectoryModule,
    ResidentModule
  ],
  entryComponents: [],
})
export class DirectoriesModule { }
