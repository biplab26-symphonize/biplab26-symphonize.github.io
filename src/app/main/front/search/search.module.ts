import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { AuthGuard } from 'app/_guards';
import { AnnouncementComponent } from './announcement/announcement.component';


const appRoutes = [
  {
      path      : 'search', 
      name      : 'Search',
      component : SearchComponent,
      canActivate: [AuthGuard]
  
  },
  {
    path      : 'view/announcement/:id', 
    name      : 'Announcement',
    component : AnnouncementComponent,
    canActivate: [AuthGuard]

},
]

@NgModule({
  declarations: [SearchComponent, AnnouncementComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(appRoutes),
    MaterialModule,
  ]
})
export class SearchModule { }
