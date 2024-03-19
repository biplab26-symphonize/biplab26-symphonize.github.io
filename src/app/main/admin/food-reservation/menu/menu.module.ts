import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { ChatService, FoodReservationService } from 'app/_services';
import { AddComponent } from './extras/add/add.component';
import { ListComponent } from './extras/list/list.component';
import { AddCategoriesComponent } from './categories/add-categories/add-categories.component';
import { ListCategoriesComponent } from './categories/list-categories/list-categories.component';
import { AddSidedishComponent } from './sidedish/add-sidedish/add-sidedish.component';
import { ListSidedishComponent } from './sidedish/list-sidedish/list-sidedish.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { MatSelectModule } from '@angular/material/select';

const routes = [
  { 
    path         : 'admin/food-reservation/menu/extras/list', 
    component    : ListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {extras: FoodReservationService},
    data         : {id:'id'}
  },
  { 
    path         : 'admin/food-reservation/menu/extras/add', 
    component    : AddComponent, 
    canActivate  : [AuthGuard],    
  },
  { 
		path		    : 'admin/food-reservation/extras/edit/:id', 
    component	  : AddComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve  	  : {chat: ChatService} 
  },
  { 
    path         : 'admin/food-reservation/menu/categories/list', 
    component    : ListCategoriesComponent, 
    canActivate  : [AuthGuard],
    resolve      : {extras: FoodReservationService},
    data         : {id:'id'}
  },
  { 
    path         : 'admin/food-reservation/menu/categories/add', 
    component    : AddCategoriesComponent, 
    canActivate  : [AuthGuard],    
  },
  { 
		path		    : 'admin/food-reservation/categories/edit/:id', 
		component	  : AddCategoriesComponent, 
		canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve  	  : {chat: ChatService} 
	},
  { 
    path         : 'admin/food-reservation/menu/sidedish/list', 
    component    : ListSidedishComponent, 
    canActivate  : [AuthGuard],
    resolve      : {extras: FoodReservationService},
    data         : {id:'id'}
  },
  { 
    path         : 'admin/food-reservation/menu/sidedish/add', 
    component    : AddSidedishComponent, 
    canActivate  : [AuthGuard],    
  },
  { 
		path		    : 'admin/food-reservation/sidedish/edit/:id', 
		component	  : AddSidedishComponent, 
		canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve  	  : {chat: ChatService} 
  },
  { 
    path         : 'admin/food-reservation/menu/product/list', 
    component    : ListProductComponent, 
    canActivate  : [AuthGuard],
    resolve      : {extras: FoodReservationService},
    data         : {id:'id'}
  },
  { 
    path         : 'admin/food-reservation/menu/product/add', 
    component    : AddProductComponent, 
    canActivate  : [AuthGuard],    
  },
  { 
		path		    : 'admin/food-reservation/product/edit/:id', 
		component	  : AddProductComponent, 
    canActivate	: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve : { 
      chat: ChatService }
	}
  
];

@NgModule({
  declarations: [AddComponent, ListComponent, AddCategoriesComponent, ListCategoriesComponent, AddSidedishComponent, ListSidedishComponent, AddProductComponent, ListProductComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatSelectModule, 
  ],
  providers : [FoodReservationService]
})
export class MenuModule { }
