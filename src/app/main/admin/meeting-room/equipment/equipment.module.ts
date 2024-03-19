import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { ListEquipmentComponent } from './list-equipment/list-equipment.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { ChatService, MeetingRoomService } from 'app/_services';



const routes = [
  { 
    path         : 'admin/meeting-room/services/list', 
    component    : ListEquipmentComponent, 
    canActivate  : [AuthGuard],
    resolve      : {Equipment: MeetingRoomService},
    data         : {id:'id'}
  },
  { 
    path        : 'admin/meeting-room/services/add', 
    component   : AddEquipmentComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/meeting-room/services/edit/:id', 
		component	  : AddEquipmentComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
		resolve  	  : { chat: ChatService } 
	},
 

];

@NgModule({
  declarations: [AddEquipmentComponent, ListEquipmentComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule
  ],
  providers : [MeetingRoomService]
})
export class EquipmentModule { }
