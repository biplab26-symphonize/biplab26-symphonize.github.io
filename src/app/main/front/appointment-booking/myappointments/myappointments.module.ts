import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyappointmentsComponent } from './myappointments.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { AppointmentBookingService,CommonService } from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';
import { ViewappointmentsComponent } from './viewappointments/viewappointments.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
    path      : 'my-fitness-reservation', 
    name      : 'My Fitness Reservation',
    component : MyappointmentsComponent, 
    resolve  	: {
      myappointments : AppointmentBookingService
    },  
    data		   :  { id: 'id'} 
  },
  { 
    path      : 'view-fitness-reservation/:id', 
    name      : 'View Fitness Reservation',
    component : ViewappointmentsComponent, 
  }  
];

@NgModule({
  declarations: [MyappointmentsComponent, ViewappointmentsComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule
  ],
  providers : [AppointmentBookingService,CommonService]
})
export class MyappointmentsModule { }
