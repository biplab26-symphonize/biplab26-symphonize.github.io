import { NgModule } from '@angular/core';
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
import { GeneralComponent } from './general.component';
import { DateTimeFormatList , SettingsService,RolesService} from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
	{
	   path           : 'admin/settings/general', 
	   component      : GeneralComponent, 
	   data           : { key : "general_settings"},
	   resolve        : {
							data: SettingsService,RolesService
						}
	},
];

@NgModule({
	declarations: [GeneralComponent],
	imports: [
		RouterModule.forChild(routes),
		NgxMaskModule.forRoot(),

		MatIconModule,
		MatTabsModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatTooltipModule,
		MatSlideToggleModule,

		FuseSharedModule,
		EditorModule
	],
	exports: [
		GeneralComponent
	],
	providers: [DateTimeFormatList,SettingsService,RolesService]   
})
export class GeneralModule {
	constructor(_dateTimeList: DateTimeFormatList) {
        _dateTimeList.load();
    }
 }
