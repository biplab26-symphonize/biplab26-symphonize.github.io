import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './rooms.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { CommonService } from 'app/_services';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';


const routes = [
  { 
    path      : 'meeting-room', 
    name      : 'view rooms',
    component : RoomsComponent
  },
];
@NgModule({
  declarations: [RoomsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule
  ],
  providers:[CommonService]
})
export class RoomsModule { }
