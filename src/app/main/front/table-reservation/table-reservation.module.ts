import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleGuard } from 'app/_guards';
import { BookingModule } from './booking/booking.module';
import { RouterModule } from '@angular/router';
import { MyreservationsModule } from './myreservations/myreservations.module';

const routes = [
  {
    path: 'restaurant-reservations',
    name:'restaurant-reservations',
    canActivate: [RoleGuard],
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule)
  },
  {
    path: 'my-reservations',
    name:'my-reservations',
    canActivate: [RoleGuard],
    loadChildren: () => import('./myreservations/myreservations.module').then(m => m.MyreservationsModule)
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BookingModule,
    MyreservationsModule
  ]
})
export class TableReservationModule { }
