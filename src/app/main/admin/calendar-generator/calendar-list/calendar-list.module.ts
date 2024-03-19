import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { CalendarListComponent } from './calendar-list.component';
import { MaterialModule } from 'app/main/material.module';
import { CalendarGeneratorService } from 'app/_services';
const routes = [
  { 
    path          : 'admin/calendar-list', 
    component     : CalendarListComponent, 
    canActivate   : [AuthGuard],
    resolve      : {calendarList: CalendarGeneratorService},
  },
];
@NgModule({
  declarations: [CalendarListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ]
})
export class CalendarListModule { }
