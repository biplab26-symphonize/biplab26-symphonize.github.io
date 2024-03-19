import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard} from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { UsersService } from 'app/_services';
import { NotificationsComponent } from './notifications.component';
import { AccountService } from 'app/layout/components/account/account.service';

const routes = [
  { 
      path      : 'profile/notifications', 
      component : NotificationsComponent,  
      canActivate: [AuthGuard],
      resolve  	    : {
        notifications : UsersService
      }
  }
];

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
  ],
  providers:[UsersService,AccountService]
})
export class NotificationsModule { }
