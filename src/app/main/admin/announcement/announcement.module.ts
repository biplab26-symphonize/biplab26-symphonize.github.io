import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'app/_guards';//#AuthGuard For Routing
import { FuseSharedModule } from '@fuse/shared.module';

import { ScrollComponent } from './scroll/scroll.component';
import { HomeComponent } from './home/home.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@busacca/ng-pick-datetime';
import { AddComponent } from './home/add/add.component';
import { AddScrollAnnComponent} from './scroll/add/add.component';
import { MaterialModule } from 'app/main/material.module';
import { AnnouncementService, ChatService } from 'app/_services';
import { FieldsModule } from '../fields/fields.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { CommonComponent } from './common/common.component';
import { AddCommonComponent } from './common/add/add.component';
import { EditorGalleryModule } from 'app/layout/components/dialogs/editor-gallery/editor-gallery.module';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
const routes = [
	{ 
		path		: 'admin/announcement/scrolling', 
		component	: ScrollComponent, 
		canActivate	: [AuthGuard] ,
		resolve  	: {home: AnnouncementService},
		data		: { contentid: 'content_id' }
	},
	{ 
		path		: 'admin/announcement/scrolling/trash', 
		component	: ScrollComponent, 
		canActivate	: [AuthGuard],
		resolve  	: {home: AnnouncementService},
		data		: { 
						trash: 1 ,
						contentid: 'content_id'
					  }
	},
	{ 
		path		: 'admin/announcement/scrolling/add', 
		component	: AddScrollAnnComponent, 
		canActivate	: [AuthGuard],
	},
	{ 
		path		: 'admin/announcement/scrolling/edit/:id', 
		component	: AddScrollAnnComponent, 
		canActivate	: [AuthGuard],
		canDeactivate: [DeactivateGuard],
		resolve  	: {
						edithome : AnnouncementService, 
						chat: ChatService
					  }  
	},
	{ 
		path		: 'admin/announcement/home', 
		component	: HomeComponent, 
		canActivate	: [AuthGuard],
		resolve  	: {home: AnnouncementService},
		data		: { contentid: 'content_id' } 
	},
	{ 
		path		: 'admin/announcement/home/trash', 
		component	: HomeComponent, 
		canActivate	: [AuthGuard],
		resolve  	: {home: AnnouncementService},
		data		: { 
						trash: 1 ,
						contentid: 'content_id'
					  }
	},
	{ 
		path		: 'admin/announcement/home/add', 
		component	: AddComponent, 
		canActivate	: [AuthGuard] 
	},
	{ 
		path		: 'admin/announcement/home/edit/:id', 
		component	: AddComponent, 
		canActivate	: [AuthGuard],
		canDeactivate: [DeactivateGuard],
		resolve  	: {
						edithome : AnnouncementService, 
						chat: ChatService
					  }  
	},
	{ 
		path		: 'admin/announcement/event', 
		component	: CommonComponent, 
		canActivate	: [AuthGuard],
		resolve  	: {event: AnnouncementService},
		data		: { contentid: 'content_id' } 
	},
	{ 
		path		: 'admin/announcement/event/trash', 
		component	: CommonComponent, 
		canActivate	: [AuthGuard],
		resolve  	: {event: AnnouncementService},
		data		: { 
						trash: 1 ,
						contentid: 'content_id'
					  }
	},
	{ 
		path		: 'admin/announcement/event/add', 
		component	: AddCommonComponent, 
		canActivate	: [AuthGuard] 
	},
	{ 
		path		: 'admin/announcement/event/edit/:id', 
		component	: AddCommonComponent, 
		canActivate	: [AuthGuard],
		canDeactivate: [DeactivateGuard],
		resolve  	: {
						editevent : AnnouncementService,
						chat: ChatService
					  }  
	},
	{ 
		path		: 'admin/announcement/dining', 
		component	: CommonComponent, 
		canActivate	: [AuthGuard],
		resolve  	: {dining: AnnouncementService},
		data		: { contentid: 'content_id' } 
	},
	{ 
		path		: 'admin/announcement/dining/trash', 
		component	: CommonComponent, 
		canActivate	: [AuthGuard],
		resolve  	: {dining: AnnouncementService},
		data		: { 
						trash: 1 ,
						contentid: 'content_id'
					  }
	},
	{ 
		path		: 'admin/announcement/dining/add', 
		component	: AddCommonComponent, 
		canActivate	: [AuthGuard] 
	},
	{ 
		path		: 'admin/announcement/dining/edit/:id', 
		component	: AddCommonComponent, 
		canActivate	: [AuthGuard],
		canDeactivate: [DeactivateGuard],
		resolve  	: {
						editdining : AnnouncementService,
						chat: ChatService
					  }  
	},

];


@NgModule({
	declarations: [ScrollComponent, HomeComponent, AddScrollAnnComponent,AddComponent, CommonComponent,AddCommonComponent],
	imports: [
		RouterModule.forChild(routes),
		FuseSharedModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		MaterialModule,
		FieldsModule,
		FieldsComponentModule,
		EditorGalleryModule,
		FusePipesModule
		
	],
	providers: [AnnouncementService],
	exports: [ScrollComponent, HomeComponent,CommonComponent]
})
export class AnnouncementModule {}
