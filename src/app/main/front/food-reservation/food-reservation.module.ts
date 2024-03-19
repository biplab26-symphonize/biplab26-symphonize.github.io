import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleGuard } from 'app/_guards';
import { OrderModule } from './order/order.module';
import { MyOrderModule } from './my-order/my-order.module';

const routes = [
  {
    path: 'to-go-order',
    name:'to-go-order',
    canActivate: [RoleGuard],
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
  },
  {
    path: 'my-order',
    name:'to-go-order',
    canActivate: [RoleGuard],
    loadChildren: () => import('./my-order/my-order.module').then(m => m.MyOrderModule)
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OrderModule,
    MyOrderModule
  ]
})
export class FoodReservationModule { }
