import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { OptionsList, MenusService, RolesService, FormsService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { MenusResolver,MenuResolver } from 'app/_resolvers';
import { UIIconsModule } from 'app/layout/components/icons/icons.module';
import { MatOptionSelectAllModule } from 'app/layout/components/mat-option-select-all/mat-option-select-all.module';
import { AllroutesService } from 'app/_services/allroutes.service';
const routes = [
  { 
    path: 'admin/menus/list', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    resolve:{
      menusList:MenusResolver  
    },
    data:{position:'F'},
  },
  { 
    path: 'admin/menus/trash', 
    component: ListComponent, 
    canActivate: [AuthGuard],
    data: {trash: 1},
    resolve:{
      menusList:MenusResolver  
    }
  },
  { 
    path: 'admin/menus/add', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data:{position:'M',menu_status:'A'},
    resolve:{
      menusList:MenusResolver,
      forms:FormsService,
      roles:RolesService  ,
      quicklinkList:AllroutesService
    }
  },
  { 
    path: 'admin/menus/edit/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data:{position:'M',menu_status:'A'},
    resolve:{
      menusList:MenusResolver,
      menu:MenuResolver,
      forms:FormsService,
      roles:RolesService  
    }
  },
];

@NgModule({
  declarations: [ListComponent, AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FileUploadModule,
    UIIconsModule,
    MatOptionSelectAllModule
  ],
  providers: [OptionsList, MenusService, MenusResolver, MenuResolver,AllroutesService]      
})
export class MenusModule { }
