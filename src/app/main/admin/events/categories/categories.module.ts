import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { EventcategoryService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';


const routes = [
  { 
    path         : 'admin/events/categories/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve  	   : {
                    eventcategory : EventcategoryService,
                   },
    data		     : { categoryid: 'id' }              
  },
  { 
    path         : 'admin/event/category/:slug', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve  	   : {
                    eventcategory : EventcategoryService,
                   },
    data		     : { categoryid: 'id' }              
  },
  { 
		path		     : 'admin/events/categories/trash', 
		component	   : ListComponent, 
		canActivate	 : [AuthGuard],
		resolve  	   : {eventcategory: EventcategoryService},
		data		     : { 
                      trash: 1 ,
                      categoryid : 'id'
					         }
	},
  { 
		path		     : 'admin/event/category/trash/:slug', 
		component	   : ListComponent, 
		canActivate	 : [AuthGuard],
		resolve  	   : {eventcategory: EventcategoryService},
		data		     : { 
                      trash: 1 ,
                      categoryid : 'id'
					         }
	},
  { 
    path        : 'admin/events/categories/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
    path        : 'admin/event/category/add/:slug', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/events/categories/edit/:id', 
		component	  : AddComponent, 
		canActivate	: [AuthGuard],
		resolve  	  : {
                    editeventcategory : EventcategoryService
					        } 
	},
];

@NgModule({
  declarations: [AddComponent , ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule
  ],
  providers: [EventcategoryService],
})
export class CategoriesModule {
  
 }
