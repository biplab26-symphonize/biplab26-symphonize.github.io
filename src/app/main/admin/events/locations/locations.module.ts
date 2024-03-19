import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AddLocationComponent } from './add/add.component';
import { LocationService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { ListComponent } from './list/list.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const routes = [
  { 
    path        : 'admin/events/location/add', 
    component   : AddLocationComponent, 
    canActivate : [AuthGuard],
     
  },
  { 
		path		    : 'admin/events/location/edit/:id', 
		component	  : AddLocationComponent, 
		canActivate	: [AuthGuard],
		resolve  	  : {
						       editLocation : LocationService
					        } 
	},
  { 
    path        : 'admin/events/location/list', 
    component   : ListComponent, 
    canActivate : [AuthGuard] ,
    resolve  	  : {locations: LocationService}, 
  },
  { 
    path        : 'admin/events/location/trash', 
    component   : ListComponent, 
    canActivate : [AuthGuard] ,
    resolve  	  : {locations: LocationService}, 
    data		     : { 
      trash: 1 
    }
  },
];

@NgModule({
  declarations: [AddLocationComponent , ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule
  ],
  providers: 
        [LocationService,
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: [] },
        ],
})
export class LocationsModule { 
 
}
