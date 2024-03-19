import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { ProfileAboutComponent } from './tabs/about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  { 
      path: 'profile', 
      component: UserProfileComponent, 
      canActivate: [AuthGuard], 
  }
];
@NgModule({
  declarations: [
    UserProfileComponent,
    ProfileAboutComponent
  ],
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
  ],
  providers:[AuthGuard]
})
export class UserProfileModule { }
