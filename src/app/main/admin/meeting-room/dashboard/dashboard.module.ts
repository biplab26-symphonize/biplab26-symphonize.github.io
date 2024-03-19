import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FoodReservationService, MeetingRoomService } from 'app/_services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes = [  
  { 
		path		    : 'admin/meeting-room/dashboard', 
		component	  : DashboardComponent,
    canActivate	: [AuthGuard]
  },
];
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    BrowserAnimationsModule,
  ]
})
export class DashboardModule { }
