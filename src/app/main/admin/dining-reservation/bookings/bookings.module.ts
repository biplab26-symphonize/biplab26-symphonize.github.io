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
import { ChatService, DiningReservationService } from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';
const routes = [
  { 
    path         : 'admin/dining-reservation/bookings/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {bookings: DiningReservationService},
    data         : {id:'id'}
  },
  { 
    path        : 'admin/dining-reservation/bookings/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },{ 
		path		    : 'admin/dining-reservation/bookings/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
		resolve  	  : {editbooking : DiningReservationService, chat: ChatService,} 
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
  providers : [DiningReservationService]
})
export class BookingsModule { }
