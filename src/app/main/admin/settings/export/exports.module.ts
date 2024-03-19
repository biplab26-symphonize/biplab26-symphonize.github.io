import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportsComponent } from './exports.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingsService,RolesService,OptionsList,CommonService,UsersService} from 'app/_services';
import { MaterialModule } from 'app/main/material.module';

const routes = [
	{
	   path           : 'admin/settings/export', 
	   component      : ExportsComponent, 
	   data           : {},
	   resolve        : {data: SettingsService,RolesService}
	},
];

@NgModule({
  declarations: [ExportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
		MatIconModule,
		MatTabsModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatTooltipModule,
		MatSlideToggleModule,
		FuseSharedModule,
		EditorModule,
		MaterialModule
  ],
  exports: [
		ExportsComponent
	],
  providers: [SettingsService,RolesService,OptionsList,CommonService,UsersService]
})
export class ExportsModule { }
