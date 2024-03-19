import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RolesService, CommonService } from 'app/_services';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
	{
	   path           : 'admin/settings/event', 
	   component      : EventsComponent, 
	   data           : { },
	   resolve        : {  roles: RolesService}
	},
];

@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
  ],
  providers: [CommonService, RolesService,]
})
export class EventsModule { }
