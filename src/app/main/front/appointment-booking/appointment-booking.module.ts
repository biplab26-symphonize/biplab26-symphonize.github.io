import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleGuard } from 'app/_guards';
import { BookingsModule } from './bookings/bookings.module';
import { RouterModule } from '@angular/router';
import { MyappointmentsModule } from './myappointments/myappointments.module';

const routes = [
  {
    path: 'fitness-reservation',
    name:'appointment-bookings',
    canActivate: [RoleGuard],
    loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule)
  },
  {
    path: 'my-fitness-reservation',
    name:'my-fitness-reservation',
    canActivate: [RoleGuard],
    loadChildren: () => import('./myappointments/myappointments.module').then(m => m.MyappointmentsModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BookingsModule,
    MyappointmentsModule
  ]
})

export class AppointmentBookingModule { }
