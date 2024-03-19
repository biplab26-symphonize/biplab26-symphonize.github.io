import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EventcategoryService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path         : 'admin/events/category_Calendar/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve  	   : {
                    eventcategory : EventcategoryService,
                   },
    data		     : { categoryid: 'id' }              
  },
  { 
		path		     : 'admin/events/category_Calendar/trash', 
		component	   : ListComponent, 
		canActivate	 : [AuthGuard],
		resolve  	   : {eventcategory: EventcategoryService},
		data		     : { 
                      trash: 1 ,
                      categoryid : 'id'
					         }
	},
  { 
    path        : 'admin/events/category_Calendar/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/events/category_Calendar/edit/:id', 
		component	  : AddComponent, 
		canActivate	: [AuthGuard],
		resolve  	  : {
                    editeventcategory : EventcategoryService
					        } 
	},
];


@NgModule({
  declarations: [ListComponent, AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule
  ]
})

export class CategoryCalendarModule { }
