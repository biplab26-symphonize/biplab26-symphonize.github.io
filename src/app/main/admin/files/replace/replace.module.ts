import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ReplaceComponent } from './replace.component';
import { DragDropModule } from 'app/layout/components/file-upload/drag-drop/drag-drop.module';
import { MenuResolver } from 'app/_resolvers';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path: 'admin/files/replace/:id', 
    component: ReplaceComponent, 
    canActivate: [AuthGuard],
    resolve:{
      menu: MenuResolver
    }
  },
];

@NgModule({
declarations: [ReplaceComponent],
imports:[
            CommonModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MaterialModule,
            DragDropModule
        ]
})
export class ReplaceModule { }
