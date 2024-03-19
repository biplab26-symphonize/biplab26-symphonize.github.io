import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
import { MyGuestRoomComponent } from './my-guest-room.component';
import { ViewRoomComponent } from './view-room/view-room.component';
import { GuestRoomService } from 'app/_services';

const routes = [
  { 
    path      : 'my-guestroom', 
    name      : 'My Guest Room',
    component : MyGuestRoomComponent, 
    resolve  	: {
      myguestbooking : GuestRoomService
    },  
    data		   :  { id: 'id'} 
  },
  { 
    path      : 'my-guestroom/view-guest-room/:id', 
    name      : 'view Guest Room',
    component : ViewRoomComponent, 
  }  
];

@NgModule({
  declarations: [MyGuestRoomComponent, ViewRoomComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule
  ]
})
export class MyGuestRoomModule { }
