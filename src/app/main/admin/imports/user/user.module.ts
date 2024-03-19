import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonService, RolesService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';

const routes = [
	{
	   path           : 'admin/imports/user', 
	   component      : UserComponent, 
	   data           : { },
	   resolve        : {  roles: RolesService}
	},
];

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule, 
    MatDatepickerModule,
    MatNativeDateModule,
		MatIconModule,
    MatTabsModule,
    FileUploadModule
  ],
  providers: [CommonService, RolesService,]
})
export class UserModule { }
