import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMeetingRoomComponent } from './my-meeting-room.component';
import { ViewRoomComponent } from './view-room/view-room.component';
import { MeetingRoomService, SettingsService } from 'app/_services';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
      path      : 'my-meeting-room', 
      name      : 'MeetingRoom',
      component : MyMeetingRoomComponent , 
      canActivate: [AuthGuard],
      resolve      : {rooms: MeetingRoomService},
},  
{ 
  
    path      : 'my-meetingroom/view/:id', 
    name      : 'view Meeting Room',
    component : ViewRoomComponent, 

} 
  
];


@NgModule({
  declarations: [MyMeetingRoomComponent, ViewRoomComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgxMaskModule.forRoot(),    
    BreadcumbModule
  ],
  providers : [MeetingRoomService]
})
export class MyMeetingRoomModule { }
