import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitComponent } from './limit.component';
import { AddComponent } from './add/add.component';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { GuestRoomService } from 'app/_services';
import { AuthGuard } from 'app/_guards';

const Approutes = [
  {
    path: 'admin/guest-room/room/limit/lists',
    component: LimitComponent,
    canActivate: [AuthGuard],
    resolve: { extras: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/room/limit/add',
    component: AddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/room/limit/edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [LimitComponent, AddComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(Approutes),
    FuseSharedModule,
    MatSelectModule,
  ]
})
export class LimitModule { }
