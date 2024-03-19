import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { ChatService, MeetingRoomService } from 'app/_services';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';

const routes = [  
  { 
		path		    : 'admin/meeting-room/booking/list', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve      : {rooms: MeetingRoomService},
  },
  { 
		path		    : 'admin/meeting-room/booking/pending/list', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve      : {rooms: MeetingRoomService},
  },
  { 
		path		    : 'admin/meeting-room/booking/confirmed/list', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve      : {rooms: MeetingRoomService},
  },
  { 
		path		    : 'admin/meeting-room/booking/cancelled/list', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve      : {rooms: MeetingRoomService},
  },
  { 
    path        : 'admin/meeting-room/booking/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/meeting-room/booking/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    // canDeactivate: [DeactivateGuard],
		// resolve  	  : {
    //   editbooking : MeetingRoomService,
    //   chat: ChatService
    // } 
	},
];

@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    BrowserAnimationsModule,
    NgxMaskModule.forRoot()
  ]
})
export class BookingModule { }
