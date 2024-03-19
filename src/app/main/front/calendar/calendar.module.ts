import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { AuthGuard, RoleGuard } from 'app/_guards';
import { EventcalendarService, EventsService,LocationService, SettingsService } from 'app/_services';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { FilterCategoriesModule,MetaFiltersModule } from 'app/layout';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { FuseConfirmDialogModule } from '@fuse/components';
const routes = [
  { 
      path      : 'calendars', 
      component : CalendarComponent, 
      canActivate: [AuthGuard],
      resolve  	  : {
        setting       : SettingsService
      },
      data           : { key : "event-settings"},
  },
  { 
    path      : 'calendar/:slug', 
    component : CalendarComponent, 
    canActivate: [AuthGuard],
    resolve  	  : {
      setting       : SettingsService
    },
    data           : { key : "event-settings"},
  },
  { 
    path      : 'my-events/calendar', 
    component : CalendarComponent, 
    canActivate: [AuthGuard],
    resolve  	  : {
      setting       : SettingsService
    },
    data           : { key : "event-settings", type:'userevents'},
  },
  { 
    path      : 'my-event/calendar/:slug', 
    component : CalendarComponent, 
    canActivate: [AuthGuard],
    resolve  	  : {
      setting       : SettingsService
    },
    data           : { key : "event-settings", type:'userevents'},
  }
]

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    MatMomentDateModule,
    ColorPickerModule,
    FullCalendarModule,
    NgxMaskModule.forRoot(),
    FuseConfirmDialogModule,
    FilterCategoriesModule, //EVENT FILTER CATEGORIES CHECKBOXES
    MetaFiltersModule, //EVENT META FIELDS FILETER
    BreadcumbModule
  ],
  providers:[EventcalendarService,EventsService,DatePipe,LocationService,AuthGuard],
  entryComponents: [
]
})
export class CalendarModule { }
