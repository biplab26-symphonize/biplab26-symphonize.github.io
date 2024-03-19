import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { AuthGuard } from 'app/_guards';
import { SettingsService, AttendeesService } from 'app/_services';
import { AddComponent } from './add.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { GuestsModule } from '../guests/guests.module';
const routes = [
  { 
    path          : 'admin/attendees/add/:event_id',
    component     : AddComponent,
    canActivate   : [AuthGuard]
  }
];


@NgModule({
  declarations: [AddComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    GuestsModule,
    NgxMaskModule.forRoot()
  ],
  exports:[AddComponent],
  providers: [AttendeesService,SettingsService],
})
export class AddModule { }
