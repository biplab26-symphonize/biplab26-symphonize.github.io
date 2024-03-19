import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingsModule } from './settings/settings.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';


const routes: Routes  = [
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./services/services.module').then(m => m.ServicesModule)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    SettingsModule,
    ServicesModule,
    DashboardModule,
    BookingsModule
  ]
})
export class TableReservationModule { }
