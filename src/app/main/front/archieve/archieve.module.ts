import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchieveComponent } from './archieve.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { AuthGuard } from 'app/_guards';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
const routes = [
  { 
      path      : 'archive/:slug', 
      name      : 'Archieve Page',
      component :  ArchieveComponent, 
      canActivate:  [AuthGuard],
  }
];

@NgModule({
  declarations: [ArchieveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    BreadcumbModule
  ],
  providers:[AuthGuard]
})
export class ArchieveModule { }
