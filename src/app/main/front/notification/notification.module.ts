import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  { 
      path: 'notification', 
      component: NotificationComponent, 
      canActivate: [AuthGuard], 
      // data:{type : 'U'},
      //   resolve  : {
      //       Meta :CommonService
      //   } 
  }
];


@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseSidebarModule,
    // material module
    MatIconModule,
    MatFormFieldModule,
    NgxMaskModule.forRoot(),
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule
  ]
})
export class NotificationModule { }
