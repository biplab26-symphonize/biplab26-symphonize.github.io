import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { EventcategoryService, EventsService } from 'app/_services';
import { AllComponent } from './all.component';
import { AttendeesModule } from '../attendees/attendees.module';
import { RegistrationModule } from '../registration/registration.module';
import { RegisterButtonsModule } from 'app/layout/components/events/register-buttons/register-buttons.module';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path          : 'admin/events/all', 
    component     : AllComponent, 
    canActivate   : [AuthGuard],
    resolve  	    : {
                      event : EventsService,
                      eventcategory : EventcategoryService
                    },
    data		     :  { eventid: 'event_id'}  
  },
  { 
    path          : 'admin/event/:slug', 
    component     : AllComponent, 
    canActivate   : [AuthGuard],
    resolve  	    : {
                      event : EventsService,
                      eventcategory : EventcategoryService
                    },
    data		     :  { eventid: 'event_id'}  
  },
  { 
    path          : 'admin/events/trash', 
    component     : AllComponent, 
    canActivate   : [AuthGuard],
    resolve  	    : {
                      event : EventsService,
                      eventcategory : EventcategoryService
                    },
    data		      : { 
                      trash: 1,
                      eventid: 'event_id' 
                    }                
  },
  { 
    path          : 'admin/event/trash/:slug', 
    component     : AllComponent, 
    canActivate   : [AuthGuard],
    resolve  	    : {
                      event : EventsService,
                      eventcategory : EventcategoryService
                    },
    data		      : { 
                      trash: 1,
                      eventid: 'event_id' 
                    }                
  },
];

@NgModule({
  declarations: [AllComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    AttendeesModule,
    RegistrationModule,
    RegisterButtonsModule
  ],
  providers: [EventsService,EventcategoryService],
})
export class AllModule { 
}
