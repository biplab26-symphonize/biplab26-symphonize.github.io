import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffDirectoryComponent } from './staff-directory.component';
import { AuthGuard, RoleGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewestStaffModule } from 'app/layout/components/widgets/newest-staff/newest-staff.module';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
      path      : 'staffs/:slug', 
      component : StaffDirectoryComponent, 
      canActivate: [AuthGuard],
  },
  { 
      path      : 'staffs', 
      component : StaffDirectoryComponent, 
      canActivate: [AuthGuard],
  },
  { 
      path      : 'new-staffs', 
      component : StaffDirectoryComponent, 
      canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [StaffDirectoryComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    // material module 
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    NewestStaffModule,
    BreadcumbModule
  ],
  providers:[AuthGuard]
})
export class StaffDirectoryModule { }
