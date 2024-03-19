import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, RoleGuard } from 'app/_guards';
import { MaterialModule } from 'app/main/material.module';
import { EventcategoryService, SettingsService } from 'app/_services';
import { RegistrationModule } from './event-registration/registration/registration.module';
import { FilterCategoriesModule } from 'app/layout/components/events/filter-categories/filter-categories.module';
import { MyeventsModule } from './myevents/myevents.module';
import { CalendarModule } from '../calendar/calendar.module';
import { AttendeeListModule } from './attendee-list/attendee-list.module';
import { RegisterButtonsModule } from 'app/layout/components/events/register-buttons/register-buttons.module';

//ConfirmPages
import { EventRegisterModule } from 'app/layout/components/confirm-pages/event-register/event-register.module';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
      path      : 'events', 
      name      : 'Events',
      component : EventsComponent, 
      canActivate: [AuthGuard],
      resolve  	  : {
        eventcategory : EventcategoryService,
        setting       : SettingsService
      },
      data           : { key : "event-settings"},
      
  },
  { 
      path      : 'event/:slug', 
      name      : 'Events',
      component : EventsComponent, 
      canActivate: [AuthGuard],
      resolve  	  : {
        eventcategory : EventcategoryService,
        setting       : SettingsService
      },
      data           : { key : "event-settings"},
      
  },
  {
    path: 'register',
    loadChildren: () => import('./event-registration/registration/registration.module').then(m => m.RegistrationModule)
  },
  {
    path: 'my-events',
    loadChildren: () => import('./myevents/myevents.module').then(m => m.MyeventsModule)
  },
  {
    path: 'my-event/:slug',
    loadChildren: () => import('./myevents/myevents.module').then(m => m.MyeventsModule)
  },
  {
    path: 'my-events/calendar',
    loadChildren: () => import('app/main/front/calendar/calendar.module').then(m => m.CalendarModule)
  },
  {
    path : 'attendee-list',
    loadChildren: () => import('./attendee-list/attendee-list.module').then(m =>m.AttendeeListModule)
  },
  //Confirm Page After Register
  {
    path: 'confirmed/:id',
    loadChildren: () => import('app/layout/components/confirm-pages/event-register/event-register.module').then(m => m.EventRegisterModule)
  }
];

@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    RegisterButtonsModule,
    RegistrationModule,
    FilterCategoriesModule,
    MyeventsModule,
    CalendarModule,
    AttendeeListModule,
    EventRegisterModule,
    BreadcumbModule
  ],
  providers:[EventcategoryService,SettingsService,AuthGuard]
  
})
export class EventsModule { }
