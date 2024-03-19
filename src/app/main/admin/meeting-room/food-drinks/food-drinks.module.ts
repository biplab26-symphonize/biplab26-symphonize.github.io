import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { ChatService, MeetingRoomService } from 'app/_services';


const routes = [
  { 
    path         : 'admin/meeting-room/amenities/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {location: MeetingRoomService},
    data         : {id:'id'}
  },
  { 
    path        : 'admin/meeting-room/amenities/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/meeting-room/amenities/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
		resolve  	  : {chat: ChatService } 
	},
 

];


@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule
  ],
  providers : [MeetingRoomService]
})
export class FoodDrinksModule { }
