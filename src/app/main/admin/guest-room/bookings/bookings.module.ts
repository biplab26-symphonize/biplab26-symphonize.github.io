import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { ListModule } from './list/list.module';
import { AddModule } from './add/add.module';
import { GuestRoomCalendarComponent } from './guest-room-calendar/guest-room-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { GuestRoomCalendarModule } from './guest-room-calendar/guest-room-calendar.module';
import { InvoicesModule } from './invoices/invoices.module';
import { RoomCalenderMadalComponent } from './room-calender-madal/room-calender-madal.component';


const routes: Routes  = [
  {
    path: 'booking',
    loadChildren: () => import('./list/list.module').then(m => m.ListModule)
  },
  {
    path: 'booking-add',
    loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
    path: 'booking-add',
    loadChildren: () => import('./guest-room-calendar/guest-room-calendar.module').then(m => m.GuestRoomCalendarModule)
  },
  {
    path: 'invoices',
    loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
  }

]
@NgModule({
  declarations: [RoomCalenderMadalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    ListModule,
    AddModule,
    MatMomentDateModule,
    ColorPickerModule,
    FullCalendarModule,
    GuestRoomCalendarModule,
    InvoicesModule
  ]
})
export class BookingsModule { }
