import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { DialogComponent } from './dialog/dialog.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatService, TabelReservationService } from 'app/_services';
import { AuthGuard, DeactivateGuard } from 'app/_guards';

const routes = [
  { 
    path         : 'admin/restaurant-reservations/services/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve     : {tablereservation : TabelReservationService},
    data        : {
                    trash : '',
                  }
   
  },
  { 
		path		     : 'admin/restaurant-reservations/services/trash', 
		component	   : ListComponent, 
		canActivate	 : [AuthGuard],
		
	},
  { 
    path        : 'admin/restaurant-reservations/services/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/restaurant-reservations/services/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve  : {
      chat: ChatService,
    }
  },
  { 
		path		    : 'admin/restaurant-reservations/services/list/trash', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
     resolve     : {tablereservation : TabelReservationService},
    data        : {
                    trash : 1,
                  }
	}
];


@NgModule({
  declarations: [AddComponent, ListComponent, DialogComponent],
  entryComponents: [DialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    BrowserAnimationsModule,
  ]
})
export class ServicesModule { }
