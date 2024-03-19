import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatService, DiningReservationService } from 'app/_services';
import { DialogComponent } from './dialog/dialog.component';
const routes = [
  { 
    path         : 'admin/dining-reservation/services/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {services: DiningReservationService},
  },
  { 
		path		     : 'admin/dining-reservation/services/trash', 
		component	   : ListComponent, 
		canActivate	 : [AuthGuard],
		
	},
  { 
    path        : 'admin/dining-reservation/services/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/dining-reservation/services/edit/:id', 
		component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve: {
    chat: ChatService,
    }
  },
  { 
		path		    : 'admin/dining-reservation/services/list/trash', 
		component	  : ListComponent, 
    canActivate	: [AuthGuard],
    resolve     : {forms: DiningReservationService},
    data        : {
                    trash : 1,
                    formid: 'form_id' 
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
