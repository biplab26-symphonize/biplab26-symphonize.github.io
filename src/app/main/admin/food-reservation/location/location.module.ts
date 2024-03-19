import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { ChatService, FoodReservationService } from 'app/_services';
import { ListComponent } from './list/list.component';
import { WorkingtimesComponent } from './workingtimes/workingtimes.component';



const routes = [
  { 
    path         : 'admin/food-reservation/location/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {location: FoodReservationService},
    data         : {id:'id'}
  },
  { 
    path        : 'admin/food-reservation/location/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/food-reservation/location/edit/:id', 
		component	  : AddComponent, 
		canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
		resolve  	  : {editbooking : FoodReservationService, chat: ChatService} 
	},
  { 
		path		    : 'admin/food-reservation/location/workingtimes/:id', 
		component	  : WorkingtimesComponent, 
		canActivate	: [AuthGuard],
		resolve  	  : {workingtimes : FoodReservationService}, 
    data        : {location_id:'id'}
	}

];



@NgModule({
  declarations: [AddComponent, ListComponent, WorkingtimesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule, 
  ],
  providers : [FoodReservationService]
})
export class LocationModule { }
