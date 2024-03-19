import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { DiningGuestsModule } from 'app/main/admin/table-reservation/bookings/dining-guests/dining-guests.module';
import { DisplayBookingsComponent } from './display-bookings/display-bookings.component';
import { DisplayBookingsDetailsComponent } from './display-bookings-details/display-bookings-details.component';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ConfirmPagesComponent } from './confirm-pages/confirm-pages.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
const routes = [
  { 
    path      : 'restaurant-reservations', 
    name      : 'view table',
    component : AddComponent
  },
  { 
    path      : 'view-detail-bookings', 
    name      : 'view detail booking',
    component : DisplayBookingsDetailsComponent, 
  },
  { 
    path      : 'view-restaurant-reservations', 
    name      : 'view Restaurant Reservations',
    component : ViewBookingsComponent, 
  },
  { 
    path      : 'confirm-table-bookings/:id', 
    name      : 'Confirm Restaurant Reservations',
    component : ConfirmPagesComponent, 
  },
  { 
    path      : 'restaurant-reservations/services', 
    name      : 'view table',
    component : AddComponent, 
  }
  
];


@NgModule({
  declarations: [AddComponent, DisplayBookingsComponent, DisplayBookingsDetailsComponent, ViewBookingsComponent, ConfirmPagesComponent],
  imports: [
    BreadcumbModule,
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot(),
    DiningGuestsModule
  ]
})
export class BookingModule { }
