import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleGuard } from 'app/_guards';
import { RoomsModule } from './rooms/rooms.module';
import { BookRoomModule } from './book-room/book-room.module';
import { MyMeetingRoomModule } from './my-meeting-room/my-meeting-room.module';


const routes = [
  {
    path: 'meeting-rooms',
    name:'meeting-room',
    canActivate: [RoleGuard],
    loadChildren: () => import('./rooms/rooms.module').then(m => m.RoomsModule)
  },
  {
    path: 'book-room',
    name:'book-room',
    canActivate: [RoleGuard],
    loadChildren: () => import('./book-room/book-room.module').then(m => m.BookRoomModule)
  },
  {
    path: 'my-meeting-rooms',
    name:'my-meeting-room',
    canActivate: [RoleGuard],
    loadChildren: () => import('./my-meeting-room/my-meeting-room.module').then(m => m.MyMeetingRoomModule)
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RoomsModule,
    BookRoomModule,
    MyMeetingRoomModule
  ]
})
export class MeetingRoomModule { }
