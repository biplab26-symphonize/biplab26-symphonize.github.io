import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingsModule } from './settings/settings.module';
import { ServicesModule } from './services/services.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { BookingsModule } from './bookings/bookings.module';

const routes: Routes  = [
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'services',
    loadChildren : () => import('./services/services.module').then(m=>m.ServicesModule)
  },
  {
    path: 'dashboard',
    loadChildren : () => import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
  },
  {  
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule)
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SettingsModule,
    ServicesModule,
    MaterialModule,
    DashboardModule,
    FuseSharedModule,
    BookingsModule

  ]
})
export class AppointmentBookingModule { }
