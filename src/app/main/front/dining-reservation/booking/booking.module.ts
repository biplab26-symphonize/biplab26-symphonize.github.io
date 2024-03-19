import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { DisplayBookingsComponent } from './display-bookings/display-bookings.component';
import { DiningGuestsModule } from 'app/main/admin/dining-reservation/bookings/dining-guests/dining-guests.module';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ConfirmPagesComponent } from './confirm-pages/confirm-pages.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
    path      : 'dining-reservations', 
    name      : 'view dining',
    component : AddComponent, 
  },
  { 
    path      : 'view-bookings', 
    name      : 'view booking',
    component : ViewBookingsComponent, 
  },
  { 
    path      : 'confirm-bookings/:id', 
    name      : 'confirm booking',
    component : ConfirmPagesComponent, 
  },
  { 
    path      : 'dining-reservations/services', 
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
  ]
})
export class BookingModule { }
