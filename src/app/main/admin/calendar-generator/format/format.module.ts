import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
//import { RouterModule } from '@angular/router';
/*const routes = [
  { 
    path          : 'admin/calendar-generator/:id', 
    component     : CalendarGeneratorComponent, 
    canActivate   : [AuthGuard],
    resolve      : {calendarList: CalendarGeneratorService},
  },
];*/
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule
    //RouterModule.forChild(routes)
  ]
})
export class FormatModule { }
