import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendeeListComponent } from './attendee-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, RoleGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SettingsService } from 'app/_services';

const routes : Routes =[
  {
    path : 'events/attendee-list/:event_id',
    component : AttendeeListComponent,
    canActivate : [AuthGuard],
    resolve: {
      setting       : SettingsService
    },
    data           : { key : "event-settings"},
  }
];

@NgModule({
  declarations: [AttendeeListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,

    // material
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  providers:[AuthGuard]
})
export class AttendeeListModule { }
