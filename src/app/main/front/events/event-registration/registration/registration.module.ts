import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { AuthGuard } from 'app/_guards';
import { RegistrationComponent } from './registration.component';
import { AttendeesService, SettingsService, EventsService,LocationService } from 'app/_services';
import { GuestsModule } from 'app/main/admin/events/attendees/guests/guests.module';

const routes = [
  { 
    path          : 'events/register/:event_id',
    component     : RegistrationComponent,
    canActivate   : [AuthGuard],
    resolve       : { event : EventsService,
                      locations : LocationService,
                      setting   : SettingsService},
    data          : { key : "event-settings"},
  }
];

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    NgxMaskModule.forRoot(),
    GuestsModule
  ],
  exports:[RegistrationComponent],
  providers:[AttendeesService,SettingsService,EventsService,LocationService,AuthGuard]
})
export class RegistrationModule { }
