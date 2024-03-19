import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleGuard } from 'app/_guards';
import { BookingModule } from './booking/booking.module';
import { MydiningModule } from './mydining/mydining.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { DiningGuestsModule } from 'app/main/admin/dining-reservation/bookings/dining-guests/dining-guests.module';

const routes = [
  {
    path: 'dining-reservation',
    name:'dining-reservation',
    canActivate: [RoleGuard],
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule)
  },
  {
    path: 'my-dining',
    name:'my-dining',
    canActivate: [RoleGuard],
    loadChildren: () => import('./mydining/mydining.module').then(m => m.MydiningModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BookingModule,
    MydiningModule,
    FuseSharedModule,
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot(),
    DiningGuestsModule
  ]
})
export class DiningReservationModule { }
