import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { DiningReservationService } from 'app/_services';
import { ViewComponent } from './view/view.component';

const routes = [
  { 
    path         : 'admin/dining-reservation/dashboard', 
    component    : DashboardComponent, 
    canActivate  : [AuthGuard],
    resolve      : {bookings: DiningReservationService},
    data         : {service_id:'service_id'}
  },
  { 
    path         : 'admin/dining-reservation/view/:id', 
    component    : ViewComponent, 
    canActivate  : [AuthGuard],
    resolve      : {view: DiningReservationService}
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
