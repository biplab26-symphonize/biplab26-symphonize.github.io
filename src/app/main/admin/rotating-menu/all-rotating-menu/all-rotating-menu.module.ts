import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllRotatingMenuComponent } from './all-rotating-menu.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { RotatingMenuService } from 'app/_services';
import { ViewRotatingMenuComponent } from './view-rotating-menu/view-rotating-menu.component';

const routes = [
  { 
    path        : 'admin/all-rotating-menu/list', 
    component   : AllRotatingMenuComponent, 
    canActivate : [AuthGuard],
    resolve     : {rotatingmenu: RotatingMenuService},
    data        : {
                
                         menu_source: 'RDM',
                         type       : 'display' 
                  }
  },
  { 
    path        : 'admin/all-rotating-menu/view/:id', 
    component   : ViewRotatingMenuComponent, 
    canActivate : [AuthGuard],
    resolve     : {rotatingmenu: RotatingMenuService},
    data        : {
                
                         menu_source: 'RDM' 
                  }
  },
];

@NgModule({
  declarations: [AllRotatingMenuComponent, ViewRotatingMenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
  ]
})
export class AllRotatingMenuModule { }
