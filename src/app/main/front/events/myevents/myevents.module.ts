import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard} from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { MyeventsComponent } from './myevents.component';
import { EventsService, EventcategoryService } from 'app/_services';
import { Events } from '@tinymce/tinymce-angular/editor/Events';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
import { FavouritesComponent } from './favourites/favourites.component';
const routes = [
  { 
      path      : 'my-events', 
      component : MyeventsComponent,  
      canActivate: [AuthGuard],
      resolve  	    : {
        myevent : EventsService,
        eventcategory : EventcategoryService
      },  
      data		     :  { eventid: 'event_id'}     
  },
  { 
      path      : 'my-event/:slug', 
      component : MyeventsComponent,  
      canActivate: [AuthGuard],
      resolve  	    : {
        myevent : EventsService,
        eventcategory : EventcategoryService
      },  
      data		     :  { eventid: 'event_id'}     
  }
];
@NgModule({
  declarations: [MyeventsComponent, FavouritesComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule
  ],
  exports:[FavouritesComponent],
  entryComponents:[FavouritesComponent],
  providers:[EventsService,EventcategoryService]
})
export class MyeventsModule { }
