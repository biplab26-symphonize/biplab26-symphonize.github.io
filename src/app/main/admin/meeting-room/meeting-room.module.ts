import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingModule } from './setting/setting.module';
import { FoodDrinksModule } from './food-drinks/food-drinks.module';
import { EquipmentModule } from './equipment/equipment.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomLayoutModule } from './room-layout/room-layout.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BookingModule } from './booking/booking.module';


const routes: Routes  = [
  {
    path: 'settings',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
  },
  {
    path: 'amenities',
    loadChildren: () => import('./food-drinks/food-drinks.module').then(m => m.FoodDrinksModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule)
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then(m => m.RoomsModule)
  },
  {
    path: 'room-layout',
    loadChildren: () => import('./room-layout/room-layout.module').then(m => m.RoomLayoutModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule)
  }
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    SettingModule,
    FoodDrinksModule,
    EquipmentModule,
    RoomsModule,
    RoomLayoutModule,
    DashboardModule,
    BookingModule
  ]
})
export class MeetingRoomModule { }
