import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthGuard } from 'app/_guards';//#AuthGuard For Routing
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { PasswordComponent } from './password.component';

const routes = [
    { 
	   path: 'admin/settings/password', 
	   component: PasswordComponent, 
	   canActivate: [AuthGuard]
	},
];

@NgModule({
  	declarations: [PasswordComponent],
	imports: [
		RouterModule.forChild(routes),

		MatIconModule,
		MatListModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatFormFieldModule,

		FuseSharedModule,
		FuseSidebarModule
	],
	exports: [
		PasswordComponent
	]
})
export class PasswordModule { }
