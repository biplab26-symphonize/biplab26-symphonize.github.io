import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { SettingsModule } from './settings/settings.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';

const routes: Routes  = [
  {
      path: 'services',
      loadChildren: () => import('./services/services.module').then(m => m.ServicesModule)
  },
  {
      path: 'bookings',
      loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule)
  },
  {
      path: 'settings',
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'Dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
}

];
 
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    ServicesModule,
    SettingsModule,
    DashboardModule,
    BookingsModule
  ]
})
export class DiningReservationModule { }
