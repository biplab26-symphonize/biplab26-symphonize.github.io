import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule} from '@angular/material-moment-adapter';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { GuestRoomCalendarComponent } from './guest-room-calendar.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';

const Approutes = [
  {
    path: 'admin/guest-room/booking/guest-room-calendar',
    component: GuestRoomCalendarComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [GuestRoomCalendarComponent],
  imports: [
    CommonModule,
    MatMomentDateModule,
    ColorPickerModule,
    FullCalendarModule,
    RouterModule.forChild(Approutes),
    MaterialModule,
    FuseSharedModule,
    MatMomentDateModule,
  ]
})
export class GuestRoomCalendarModule { }
