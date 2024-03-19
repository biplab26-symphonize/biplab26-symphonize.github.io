import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { SettingsModule } from './settings/settings.module';
import { LocationModule } from './location/location.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { FoodReservationService } from 'app/_services';

const routes: Routes = [
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then(m => m.LocationModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  },{
    path: 'admin/food-reservation/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/food-reservation/orders/orders-list/:type',
    component: OrdersListComponent,
    canActivate: [AuthGuard],
    resolve: {
      order: FoodReservationService
    }
  },
  {
    path: 'admin/food-reservation/orders/orders-list/:typed',
    component: OrdersListComponent,
    canActivate: [AuthGuard],
    resolve: {
      order: FoodReservationService
    }
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    SettingsModule,
    LocationModule,
    MenuModule,
    OrdersModule
  ]
})
export class FoodReservationModule { }
