import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { GuestRoomService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AddComponent } from './add.component';
import { NgxMaskModule } from 'ngx-mask';

const Approutes = [
  {
    path: 'admin/guest-room/booking/add-guest-room',
    component: AddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/booking/edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard],
    canDeactivate : [DeactivateGuard],
  },
];

@NgModule({
  declarations: [AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(Approutes),
    MaterialModule,
    FuseSharedModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [GuestRoomService,DeactivateGuard]
})
export class AddModule { }
