import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrderComponent } from './my-order.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { CommonService, FoodReservationService } from 'app/_services';
import { ViewMyOrderComponent } from './view-my-order/view-my-order.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
const routes = [
  { 
    path      : 'my-order', 
    name      : 'view order',
    component : MyOrderComponent, 
    resolve  	: {
      mydining : FoodReservationService
    },  
    data		   :  { id: 'id'} 
  },
  { 
    path      : 'my-order-past-entry', 
    name      : 'view past entry',
    component : MyOrderComponent, 
    resolve  	: {
      mydining : FoodReservationService
    },  
    data		   :  { id: 'id'} 
  },
  { 
    path      : 'dining-reservation/myorder/vieworder/:id', 
    name      : 'view form',
    component : ViewMyOrderComponent, 
  }  
];

@NgModule({
  declarations: [MyOrderComponent, ViewMyOrderComponent],
  imports: [
    BreadcumbModule,
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot()
  ],
  exports:[ViewMyOrderComponent],
  providers:[CommonService]
})
export class MyOrderModule { }
