import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { GuestRoomService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { DashboardComponent } from './dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { NgxMaskModule } from 'ngx-mask';

const Approutes = [
  {
    path: 'admin/guest-room/reservation',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(Approutes),
    FuseSharedModule,
    MatSelectModule,
    ChartsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [GuestRoomService]
})
export class DashboardModule { }
