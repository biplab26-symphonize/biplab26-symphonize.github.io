import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyreservationsComponent } from './myreservations.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { TabelReservationService,CommonService } from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';
import { ViewreservationsComponent } from './viewreservations/viewreservations.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';

const routes = [
  { 
    path      : 'my-reservations', 
    name      : 'My Reservations',
    component : MyreservationsComponent, 
    resolve  	: {
      myreservations : TabelReservationService
    },  
    data		   :  { id: 'id'} 
  },
  { 
    path      : 'restaurant-reservations/myreservations/viewreservations/:id', 
    name      : 'view reservations',
    component : ViewreservationsComponent, 
  }  
 
];

@NgModule({
  declarations: [MyreservationsComponent, ViewreservationsComponent],
  imports: [
    BreadcumbModule,
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgxMaskModule.forRoot()
  ],
   providers : [TabelReservationService,CommonService]
})
export class MyreservationsModule { }
