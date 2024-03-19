import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'app/_guards';
import { AppointmentBookingService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { ViewComponent } from './view/view.component';


const routes = [
  { 
    path         : 'admin/fitness-reservation/dashbord', 
    component    : DashboardComponent, 
    canActivate  : [AuthGuard],
    resolve      : {bookings: AppointmentBookingService},
    data         : {service_id:'service_id'}
  },
  { 
    path         : 'admin/fitness-reservation/dashbord/:date', 
    component    : DashboardComponent, 
    canActivate  : [AuthGuard],
    resolve      : {bookings: AppointmentBookingService},
    data         : {service_id:'service_id'}
  },
  { 
    path         : 'admin/fitness-reservation/view/:id/:date', 
    component    : ViewComponent, 
    canActivate  : [AuthGuard]
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
