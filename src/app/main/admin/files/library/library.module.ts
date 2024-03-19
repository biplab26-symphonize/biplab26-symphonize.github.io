import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { LibraryComponent } from './library.component';
import { FieldsService } from 'app/_services';
import { MenusResolver } from 'app/_resolvers';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path         : 'admin/files/library',
    component    : LibraryComponent,
    canActivate  : [AuthGuard],
    data         : {menu_source:'D',menu_source_type:'url,page',menu_status:'A',type:'list'}, 
    resolve      : { menusList: MenusResolver }
  }
];

@NgModule({
declarations: [LibraryComponent],
imports:[
            CommonModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MaterialModule
        ],
providers:[
  FieldsService
]
})
export class LibraryModule { }
