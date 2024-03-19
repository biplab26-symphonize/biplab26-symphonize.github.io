import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent, CustomDateAdapter } from './add/add.component';
import { ListComponent } from './list/list.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppointmentBookingService, ChatService } from 'app/_services';
import { DialogComponent } from './dialog/dialog.component';
import { DateAdapter } from '@angular/material/core';

const routes = [
  { 
    path         : 'admin/fitness-reservation/services/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve     : {appointemnt: AppointmentBookingService},
    data        : {
                    trash : '',
                  }
   
  },
  { 
		path		     : 'admin/fitness-reservation/services/trash', 
		component	   : ListComponent, 
		canActivate	 : [AuthGuard],
		
	},
  { 
    path        : 'admin/fitness-reservation/services/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/fitness-reservation/services/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve: {
    chat: ChatService,
    }
  },
  { 
		path		    : 'admin/fitness-reservation/services/list/trash', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
     resolve     : {appointemnt: AppointmentBookingService},
    data        : {
                    trash : 1,
                  }
	}
];


@NgModule({
  declarations: [ AddComponent, ListComponent, DialogComponent],
  entryComponents: [DialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
})
export class ServicesModule { }
