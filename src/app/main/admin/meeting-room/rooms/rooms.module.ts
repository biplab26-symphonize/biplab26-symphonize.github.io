import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ChatService, FoodReservationService, MeetingRoomService } from 'app/_services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkingTimesComponent } from './working-times/working-times.component';


const routes = [  
  { 
		path		    : 'admin/meeting-room/rooms/list', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve      : {rooms: MeetingRoomService},
  },
  { 
		path		     : 'admin/meeting-room/rooms/trash', 
		component	   : ListComponent, 
		canActivate	 : [AuthGuard],
		
	},
  { 
    path        : 'admin/meeting-room/rooms/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/meeting-room/rooms/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve  	  : { chat: ChatService } 
  },
  { 
		path		    : 'admin/meeting-room/rooms/list/trash', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve     : {forms: MeetingRoomService},
    data        : {
                    trash : 1,
                    formid: 'form_id' 
                  }
  },
  { 
		path		    : 'admin/meeting-room/rooms/working-time/:room_id', 
		component	  : WorkingTimesComponent, 
    canActivate	: [AuthGuard],
  },
];
@NgModule({
  declarations: [AddComponent, ListComponent, WorkingTimesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    BrowserAnimationsModule,
  ]
})
export class RoomsModule { }
