import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CategoryService, CommonService, StaffService } from 'app/_services';
import { AddStaffResolver } from 'app/_resolvers/addStaff.resolver';
import { CommonUtils } from 'app/_helpers';

const routes = [
	{
	   path           : 'admin/imports/staff', 
	   component      : StaffComponent, 
	   data           : { },
	   resolve        : {Categorys: AddStaffResolver,}
	},
];

@NgModule({
  declarations: [StaffComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule, 
    MatDatepickerModule,
    MatNativeDateModule,
  	MatIconModule,
		MatTabsModule,
  ],providers:[CategoryService,CommonService,CommonUtils ,AddStaffResolver ,StaffService]
})
export class StaffModule { }
