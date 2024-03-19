import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DiningGuestsModule } from './dining-guests/dining-guests.module';
import { AppointmentBookingService, ChatService } from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';
const routes = [
  { 
    path         : 'admin/fitness-reservation/bookings/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {bookings: AppointmentBookingService},
    data         : {id:'id'}
  },
  {  
    path        : 'admin/fitness-reservation/bookings/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },{ 
		path		    : 'admin/fitness-reservation/bookings/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
		resolve  	  : {editbooking : AppointmentBookingService, chat: ChatService} 
	},
  
];

@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    DiningGuestsModule,
    NgxMaskModule.forRoot()
  ],
  providers : [AppointmentBookingService]
})
export class BookingsModule { }
