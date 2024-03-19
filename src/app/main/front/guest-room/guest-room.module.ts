import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { CommonService } from 'app/_services';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
import { AddComponent } from './add/add.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ExtrasComponent } from './extras/extras.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PreviewComponent } from './preview/preview.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { MyGuestRoomModule } from './my-guest-room/my-guest-room.module';
import { AuthGuard } from 'app/_guards';


const approutes = [
  { 
    path      : 'guest-room', 
    name      : 'guest rooms',
    component : AddComponent
  },
  { 
    path      : 'guest-room/rooms', 
    name      : 'rooms',
    component : RoomsComponent
  },
  { 
    path      : 'guest-room/extras', 
    name      : 'extras',
    component : ExtrasComponent
  },
  { 
    path      : 'guest-room/preview', 
    name      : 'preview',
    component : PreviewComponent
  },
  { 
    path      : 'guest-room/confirm/:id', 
    name      : 'confirm',
    component : ConfirmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-guest-room',
    loadChildren: () => import('./my-guest-room/my-guest-room.module').then(m => m.MyGuestRoomModule)
  },
  { 
    path      : 'guest-room/checkout', 
    name      : 'checkout',
    component : CheckoutComponent
  }
];
@NgModule({
  declarations: [AddComponent, RoomsComponent, ExtrasComponent, CheckoutComponent, PreviewComponent, ConfirmComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(approutes),
    FuseSharedModule,
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule,
    MyGuestRoomModule,
  ],
  providers:[CommonService]
})
export class GuestRoomModule { }
