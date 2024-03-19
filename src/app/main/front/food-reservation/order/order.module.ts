import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { CommonService } from 'app/_services';
import { PickupDeliveryComponent } from './pickup-delivery/pickup-delivery.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ViewPersonalDetailsComponent } from './view-personal-details/view-personal-details.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
    path      : 'to-go-order', 
    name      : 'view food reservation',
    component : AddComponent
  },
  { 
    path      : 'to-go-order-load-types', 
    name      : 'view types',
    component : PickupDeliveryComponent
  },
  { 
    path      : 'to-go-order-load-checkout', 
    name      : 'view personal details',
    component : PersonalDetailsComponent
  },
  { 
    path      : 'to-go-order-load-preview', 
    name      : 'view personal details',
    component : ViewPersonalDetailsComponent
  }
];

@NgModule({
  declarations: [AddComponent, PickupDeliveryComponent, PersonalDetailsComponent, ViewPersonalDetailsComponent],
  imports: [
    BreadcumbModule,
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot()
  ],
  providers:[CommonService]
})
export class OrderModule { }
