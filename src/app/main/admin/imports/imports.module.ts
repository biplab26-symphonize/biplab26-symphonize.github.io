import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StaffModule } from './staff/staff.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';


const appRoutes: Routes = [
  {
      path: 'user-import',
      loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
      path: 'staff-import',
      loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)
  }, 
  {
    path: 'event-import',
    loadChildren: () => import('./events/events.module').then(m => m.EventsModule,)
}, 
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    UserModule,
    StaffModule,
    EventsModule
  ]
})
export class ImportsModule { }
