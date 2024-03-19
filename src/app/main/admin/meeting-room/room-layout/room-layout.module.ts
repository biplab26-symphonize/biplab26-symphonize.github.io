import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ChatService, MeetingRoomService } from 'app/_services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes = [  
  { 
		path		    : 'admin/meeting-room/room-layout/list', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve      : {roomlyout: MeetingRoomService},
  },
  { 
    path        : 'admin/meeting-room/room-layout/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/meeting-room/room-layout/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve  	  : { chat: ChatService } 
  }
];

@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    BrowserAnimationsModule,
  ]
})
export class RoomLayoutModule { }
