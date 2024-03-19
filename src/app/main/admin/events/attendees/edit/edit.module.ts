import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { SettingsService, AttendeesService } from 'app/_services';
import { EditComponent } from './edit.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { GuestsModule } from '../guests/guests.module';
const routes = [
  { 
    path          : 'admin/attendees/edit/:id', 
    component     : EditComponent,
    canActivate   : [AuthGuard], 
    resolve  	    : { setting : SettingsService,
                      editAttendee : AttendeesService},
    data          : { key : "event-settings"},
  }
];


@NgModule({
  declarations: [EditComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    GuestsModule,
    NgxMaskModule.forRoot() 
  ],
  exports:[EditComponent],
  providers: [AttendeesService,SettingsService],
})
export class EditModule { }
