import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddComponent } from './extras/add/add.component';
import { ListComponent } from './extras/list/list.component';
import { AddRoomComponent } from './rooms/add-room/add-room.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { ChatService, GuestRoomService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { PriceListComponent } from './prices/price-list/price-list.component';
import { AddPriceComponent } from './prices/add-price/add-price.component';
import { SeasonalPricesComponent } from './prices/seasonal-prices/seasonal-prices.component';
import { AddUnavailableComponent } from './unavailable/add-unavailable/add-unavailable.component';
import { UnavailableListComponent } from './unavailable/unavailable-list/unavailable-list.component';
import { DiscountModule } from './discount/discount.module';
import { LimitModule } from './limit/limit.module';
import { BuildingComponent } from './building/building.component';
import { AddBuildingComponent } from './building/add-building/add-building.component';

const Approutes = [
  {
    path: 'admin/guest-room/room/extras/lists',
    component: ListComponent,
    canActivate: [AuthGuard],
    resolve: { extras: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/room/extras/add',
    component: AddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/room/extras/edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard],
    canDeactivate : [DeactivateGuard],
  },
  {
    path: 'admin/guest-room/list',
    component: RoomListComponent,
    canActivate: [AuthGuard],
    resolve: { room: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/list/trash',
    component: RoomListComponent,
    canActivate: [AuthGuard],
    resolve: { room: GuestRoomService },
    data: {
      trash: 1,
    }
  },
  {
    path: 'admin/guest-room/add',
    component: AddRoomComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/edit/:id',
    component: AddRoomComponent,
    canActivate: [AuthGuard],
    canDeactivate : [DeactivateGuard],
  },
  {
    path: 'admin/guest-room/add-price',
    component: AddPriceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/edit-price/:id',
    component: AddPriceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/unavailable/list',
    component: UnavailableListComponent,
    canActivate: [AuthGuard],
    resolve: { room: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/unavailable/add',
    component: AddUnavailableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/unavailable/edit/:id',
    component: AddUnavailableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'discount',
    loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule)
  },
  {
    path: 'admin/guest-room/building/list',
    component: BuildingComponent,
    canActivate: [AuthGuard],
    resolve: { room: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/building/add',
    component: AddBuildingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/building/edit/:id',
    component: AddBuildingComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  declarations: [AddComponent, ListComponent, AddRoomComponent, RoomListComponent, PriceListComponent, AddPriceComponent, SeasonalPricesComponent, AddUnavailableComponent, UnavailableListComponent, BuildingComponent, AddBuildingComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(Approutes),
    FuseSharedModule,
    MatSelectModule,
    DiscountModule
  ],
  providers: [GuestRoomService,DeactivateGuard]
})
export class RoomModule { }
