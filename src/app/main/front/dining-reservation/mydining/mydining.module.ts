import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MydiningComponent } from './mydining.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { DiningReservationService,CommonService } from 'app/_services';
import { ViewdiningComponent } from './viewdining/viewdining.component';
import { NgxMaskModule } from 'ngx-mask';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
const routes = [
  { 
    path      : 'my-dining', 
    name      : 'My Dining Reservations',
    component : MydiningComponent, 
    resolve  	: {
      mydining : DiningReservationService
    },  
    data		   :  { id: 'id'} 
  },
  { 
    path      : 'dining-reservation/mydining/viewdining/:id', 
    name      : 'view form',
    component : ViewdiningComponent, 
  }  
];

@NgModule({
  declarations: [MydiningComponent, ViewdiningComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule
  ],
  providers : [DiningReservationService,CommonService]
})
export class MydiningModule { }
