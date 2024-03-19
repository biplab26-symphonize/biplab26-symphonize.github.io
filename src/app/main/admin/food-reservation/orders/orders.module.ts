import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { ChatService, FoodOrderService } from 'app/_services';
import { MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import { DateTimeAdapter } from '@busacca/ng-pick-datetime';
import { NgxMaskModule } from 'ngx-mask';



const routes = [
  { 
    path         : 'admin/food-reservation/orders/orders-list', 
    component    : OrdersListComponent, 
    canActivate  : [AuthGuard],
    resolve      : {orders: FoodOrderService},
    data         : {id:'id'}
  },
  { 
    path        : 'admin/food-reservation/orders/add', 
    component   : AddComponent, 
    canActivate : [AuthGuard],
  },
  { 
		path		    : 'admin/food-reservation/orders/edit/:id', 
		component	  : AddComponent, 
		canActivate	: [AuthGuard],
		canDeactivate: [DeactivateGuard],
		resolve  	  : {editorder : FoodOrderService, chat: ChatService} 
	}

];

@NgModule({
  declarations: [AddComponent, OrdersListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    NgxMaskModule.forRoot(),
  ]
})
export class OrdersModule { }
