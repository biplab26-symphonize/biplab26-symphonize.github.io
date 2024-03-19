import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListModule } from './list/list.module';
import { AddModule } from './add/add.module';
import { EditModule } from './edit/edit.module';
const appRoutes: Routes = [
  {
      path: 'admin/attendees/list',
      loadChildren: () => import('./list/list.module').then(m => m.ListModule)
  },
  {
      path: 'admin/attendees/add',
      loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
      path: 'admin/attendees/edit',
      loadChildren: () => import('./edit/edit.module').then(m => m.EditModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ListModule,
    AddModule,
    EditModule
  ]
})
export class AttendeesModule { }
