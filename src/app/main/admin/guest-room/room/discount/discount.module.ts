import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { GuestRoomService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { AddPackagesComponent } from './packages/add-packages/add-packages.component';
import { ListPackagesComponent } from './packages/list-packages/list-packages.component';
import { ListMorePriceComponent } from './more-prices/list-more-price/list-more-price.component';
import { AddMorePriceComponent } from './more-prices/add-more-price/add-more-price.component';
import { AddFreeNightComponent } from './free-night/add-free-night/add-free-night.component';
import { ListFreeNightComponent } from './free-night/list-free-night/list-free-night.component';
import { AddPromoCodeComponent } from './promo-code/add-promo-code/add-promo-code.component';
import { ListPromoCodeComponent } from './promo-code/list-promo-code/list-promo-code.component';


const Approutes = [
  {
    path: 'admin/guest-room/package/list',
    component: ListPackagesComponent,
    canActivate: [AuthGuard],
    resolve: { package: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/package/add',
    component: AddPackagesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/package/edit/:id',
    component: AddPackagesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/more-price/list/:id',
    component: ListMorePriceComponent,
    canActivate: [AuthGuard],
    resolve: { package: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/more-price/add/:package_id',
    component: AddMorePriceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/more-price/edit/:package_id/:id',
    component: AddMorePriceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/free-night/list',
    component: ListFreeNightComponent,
    canActivate: [AuthGuard],
    resolve: { package: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/free-night/add',
    component: AddFreeNightComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/free-night/edit/:id',
    component: AddFreeNightComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/promo-code/list',
    component: ListPromoCodeComponent,
    canActivate: [AuthGuard],
    resolve: { package: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/promo-code/add',
    component: AddPromoCodeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/promo-code/edit/:id',
    component: AddPromoCodeComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  declarations: [AddPackagesComponent, ListPackagesComponent, ListMorePriceComponent, AddMorePriceComponent, AddFreeNightComponent, ListFreeNightComponent, AddPromoCodeComponent, ListPromoCodeComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(Approutes),
    FuseSharedModule,
    MatSelectModule
  ],
  providers: [GuestRoomService]
})
export class DiscountModule { }
