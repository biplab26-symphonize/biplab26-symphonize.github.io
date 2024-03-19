import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FuseSharedModule } from '@fuse/shared.module';

import { HomeComponent } from './home.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { SettingsService ,RolesService} from 'app/_services';
import { FuseMaterialColorPickerModule } from '@fuse/components';
import { EditorModule } from '@tinymce/tinymce-angular';



const routes = [
  { 
	path           : 'admin/settings/home', 
	component      : HomeComponent, 
	data           : { key : "home_settings"},
	resolve        : {
						Setting : SettingsService,
						Roles   : RolesService,
					  }
  }
];

@NgModule({
	declarations: [HomeComponent],
	imports: [
		RouterModule.forChild(routes),
		MatIconModule,
		MatTabsModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatRadioModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		EditorModule,
		FuseSharedModule,
		FuseMaterialColorPickerModule
	],
	exports: [
		HomeComponent
	],
	providers: [SettingsService , RolesService]   
})
export class HomeModule { }
