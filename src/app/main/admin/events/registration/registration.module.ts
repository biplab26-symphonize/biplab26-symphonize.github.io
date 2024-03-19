import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { EventsService } from 'app/_services';
import { RegistrationComponent } from './registration.component';
import { AuthGuard } from 'app/_guards';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  { 
    path        : 'admin/events/registration/:event_id', 
    component   : RegistrationComponent, 
    canActivate : [AuthGuard],
    resolve : {event : EventsService}
     
  },

];
@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    NgxMaskModule
  ],
  exports:[RegistrationComponent],
})
export class RegistrationModule { 

}
