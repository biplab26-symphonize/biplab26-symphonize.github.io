import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { AuthGuard } from 'app/_guards';
import { GuestRoomService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';

const Approutes = [
  {
    path: 'admin/guest-room/booking/list',
    component: ListComponent,
    canActivate: [AuthGuard],
    resolve: { booking: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/booking/list/:status',
    component: ListComponent,
    canActivate: [AuthGuard],
    resolve: { booking: GuestRoomService },
    data: { status: 'status' }
  },
];

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(Approutes),
    FuseSharedModule,
    MatSelectModule
  ],
  providers: [GuestRoomService]
})
export class ListModule { }
