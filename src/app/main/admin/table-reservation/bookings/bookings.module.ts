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
import { ChatService, TabelReservationService } from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';
import { DiningGuestsModule } from './dining-guests/dining-guests.module';

const routes = [
  { 
    path         : 'admin/restaurant-reservations/bookings/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {bookings: TabelReservationService},
    data         : {id:'id'}
  },
  { 
    path        : 'admin/restaurant-reservations/bookings/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },{ 
		path		    : 'admin/restaurant-reservations/bookings/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate : [DeactivateGuard],
		resolve  	  : {editbooking : TabelReservationService, chat: ChatService,} 
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
  providers : [TabelReservationService]
})
export class BookingsModule { }
