import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthGuard } from 'app/_guards';//#AuthGuard For Routing
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { PrivacyComponent } from './privacy.component';
const routes = [
  { 
   path: 'admin/settings/privacy', 
   component: PrivacyComponent, 
   canActivate: [AuthGuard]
},
];


@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

		MatIconModule,
		MatListModule,
		MatInputModule,
    MatButtonModule,
    MatRadioModule,
		MatSelectModule,
		MatFormFieldModule,

		FuseSharedModule,
		FuseSidebarModule
  ],
  exports: [
		PrivacyComponent
	]
})
export class PrivacyModule { }
