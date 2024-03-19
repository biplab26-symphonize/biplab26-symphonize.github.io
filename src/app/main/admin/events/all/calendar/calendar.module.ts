import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdminCalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/_guards';
import { EventcalendarService, EventsService,LocationService, SettingsService } from 'app/_services';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MetaFiltersModule } from 'app/layout';

import { ColorPickerModule } from 'ngx-color-picker';
import { FuseConfirmDialogModule } from '@fuse/components';
const routes = [
  { 
      path      : 'admin/events/all/calendar', 
      component : AdminCalendarComponent, 
      canActivate: [AuthGuard],
      resolve  	  : {
        setting       : SettingsService
      },
      data           : { key : "event-settings"},
  },
  { 
    path      : 'admin/event/calendar/:slug', 
    component : AdminCalendarComponent, 
    canActivate: [AuthGuard],
    resolve  	  : {
      setting       : SettingsService
    },
    data           : { key : "event-settings"},
  }
]

@NgModule({
  declarations: [AdminCalendarComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    MatMomentDateModule,
    ColorPickerModule,
    FullCalendarModule,
    FuseConfirmDialogModule,    
    MetaFiltersModule //EVENT META FIELDS FILETER
  ],
  providers:[EventcalendarService,EventsService,DatePipe,LocationService,AuthGuard],
  entryComponents: []
})
export class CalendarModule { }
