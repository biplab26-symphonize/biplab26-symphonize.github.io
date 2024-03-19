import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingsModule } from './settings/settings.module';
import { RoomModule } from './room/room.module';
import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportModule } from './report/report.module';
import { LimitModule } from './room/limit/limit.module';

const routes: Routes  = [
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room.module').then(m => m.RoomModule)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
  },
  {
    path: 'limit',
    loadChildren: () => import('./room/limit/limit.module').then(m => m.LimitModule)
  }

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SettingsModule,
    RoomModule,
    MaterialModule,
    FuseSharedModule,
    RoomModule,
    BookingsModule,
    DashboardModule,
    ReportModule,
    LimitModule
    
  ]
})
export class GuestRoomModule { }
