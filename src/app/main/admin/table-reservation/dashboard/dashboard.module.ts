import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ViewComponent } from './view/view.component';
import { AuthGuard } from 'app/_guards';
import { TabelReservationService } from 'app/_services';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes = [
  { 
    path         : 'admin/restaurant-reservations/dashboard', 
    component    : DashboardComponent, 
    canActivate  : [AuthGuard],
    resolve      : {bookings: TabelReservationService},
    data         : {service_id:'service_id'}
  },
  { 
    path         : 'admin/restaurant-reservations/view/:id', 
    component    : ViewComponent, 
    canActivate  : [AuthGuard],
    resolve      : {view: TabelReservationService}
  }
]


@NgModule({
  declarations: [DashboardComponent, ViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule, 
    MatDatepickerModule,
  ]
})
export class DashboardModule { }
