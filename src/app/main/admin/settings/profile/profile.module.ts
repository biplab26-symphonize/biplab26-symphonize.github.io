import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from 'app/_guards';//#AuthGuard For Routing
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { ProfileComponent } from './profile.component';
import { DatePipe } from '@angular/common';
import { ImagesCropperModule } from 'app/layout/components/image-cropper/image-cropper.module';
import { MaterialModule } from 'app/main/material.module';
import { NgxMaskModule } from 'ngx-mask';
import { UsersService, AppConfig, AuthService, SettingsService, CommonService } from 'app/_services';
import { UsermetaModule } from '../../users/usermeta/usermeta.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { BirthdateModule } from 'app/layout/components/birthdate/birthdate.module';
import { EditorModule } from '@tinymce/tinymce-angular';


const routes = [
    { 
		path: 'admin/settings/profile', 
		component: ProfileComponent,
		canActivate: [AuthGuard]
	 },
];


@NgModule({
  	declarations: [ProfileComponent],
	imports: [
		RouterModule.forChild(routes),
		MaterialModule,

		FuseSharedModule,
		FuseSidebarModule,
		NgxMaskModule.forRoot(),

		ImagesCropperModule,
		UsermetaModule,
		FieldsComponentModule,
		BirthdateModule,
		EditorModule
	],
	exports: [
		ProfileComponent
	],
	providers: [
		DatePipe,
		AuthService, AppConfig ,SettingsService, CommonService, UsersService
	]
})
export class ProfileModule { }
