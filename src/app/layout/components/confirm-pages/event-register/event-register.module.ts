import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, RoleGuard } from 'app/_guards';
import { EventRegisterComponent } from './event-register.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';


const routes : Routes =[
  {
    path : 'events/confirmed/:id',
    component : EventRegisterComponent,
    canActivate : [AuthGuard]
  }
];

@NgModule({
  declarations: [EventRegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule
  ],
  entryComponents: [
    EventRegisterComponent
  ],
  exports:[
    EventRegisterComponent
  ]
})
export class EventRegisterModule { }
