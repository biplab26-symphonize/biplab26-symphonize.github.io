import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookRoomComponent } from './book-room.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { CommonService } from 'app/_services';
import { RoomSetupComponent } from './room-setup/room-setup.component';
import { FoodDrinkListComponent } from './food-drink-list/food-drink-list.component';
import { RoomConfirmationComponent } from './room-confirmation/room-confirmation.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes = [
  { 
    path      : 'book-room/:id', 
    name      : 'view slot',
    component : BookRoomComponent
  },
  { 
    path      : 'room-setup', 
    name      : 'room setup',
    component : RoomSetupComponent
  },
    { 
    path      : 'amenities', 
    name      : 'amenities',
    component : FoodDrinkListComponent
  },
  { 
    path      : 'confirmation', 
    name      : 'confirmation',
    component : RoomConfirmationComponent
  },
  { 
    path      : 'loadCheckout', 
    name      : 'loadCheckout',
    component : CheckoutComponent
  },
];

@NgModule({
  declarations: [BookRoomComponent, RoomSetupComponent, FoodDrinkListComponent, RoomConfirmationComponent, CheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot()
  ],
  providers:[CommonService]
})
export class BookRoomModule { }
