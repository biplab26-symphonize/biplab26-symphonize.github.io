import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRotatingMenuComponent } from './add-rotating-menu.component';
import { AuthGuard } from 'app/_guards';
import { RotatingMenuService, MenusService } from 'app/_services';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { DragDropModule } from 'app/layout/components/file-upload/drag-drop/drag-drop.module';
import { UploadfileComponent } from './uploadfile/uploadfile.component';


const routes = [
  { 
    path        : 'admin/rotating-menu/add/:id', 
    component   : AddRotatingMenuComponent, 
    canActivate : [AuthGuard],
    resolve     : {rotatingmenu: RotatingMenuService},
    data        : {
                
                         menu_source: 'RDM' 
                  }
  },
  { 
    path        : 'admin/rotating-menu/add/uploadfile/:id/:week', 
    component   : UploadfileComponent, 
    canActivate : [AuthGuard],
   
  },
  { 
    path        : 'admin/rotating-menu/replace/uploadfile/:id/:week', 
    component   : UploadfileComponent, 
    canActivate : [AuthGuard],
  },
];

@NgModule({
  declarations: [AddRotatingMenuComponent, UploadfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    DragDropModule,
  ],
  providers:[MenusService,RotatingMenuService]
})
export class AddRotatingMenuModule { }
