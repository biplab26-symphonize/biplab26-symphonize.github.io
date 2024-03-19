import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { DisplayBookingsComponent } from './display-bookings/display-bookings.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ConfirmPagesComponent } from './confirm-pages/confirm-pages.component';
import { DiningGuestsModule } from 'app/main/admin/appointment-booking/bookings/dining-guests/dining-guests.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { AppointmentBookingService } from 'app/_services';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
const routes = [
  { 
    path      : 'fitness-reservation', 
    name      : 'view appointment',
    component : AddComponent, 
  },
  { 
    path      : 'view-fitness-reservations', 
    name      : 'view appointment booking',
    component : ViewBookingsComponent, 
  },
  { 
    path      : 'fitness-reservation-confirm-bookings/:id', 
    name      : 'confirm booking',
    component : ConfirmPagesComponent, 
  },
  { 
    path      : 'fitness-reservation/services', 
    name      : 'view dining',
    component : AddComponent, 
  }
  
];

@NgModule({
  declarations: [AddComponent, DisplayBookingsComponent, ViewBookingsComponent, ConfirmPagesComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot(),
    DiningGuestsModule,
    BreadcumbModule
  ],
  providers : [AppointmentBookingService]
})
export class BookingsModule { }
