import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { GuestRoomService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { ReportComponent } from './report/report.component';

const Approutes = [
  {
    path: 'admin/guest-room/report',
    component: ReportComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(Approutes),
    FuseSharedModule,
    MatSelectModule,
  ],
  providers: [GuestRoomService]
})
export class ReportModule { }
