import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { DocumentsResolver,MenuResolver } from 'app/_resolvers';
import { AddComponent } from './add.component';
import { DragDropModule } from 'app/layout/components/file-upload/drag-drop/drag-drop.module';
import { CategoryService } from 'app/_services';
import { EditModule } from 'app/main/admin/files/edit/edit.module';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path: 'admin/files/add/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data:{menu_type:'page',type:'D','status':'A'},
    resolve:{
      menu: MenuResolver,
      documents: DocumentsResolver,
      categories: CategoryService
    }
  },
  { 
    path: 'admin/files/trash/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    data:{menu_type:'page',type:'D',trash:'1','status':'A'},
    resolve:{
      menu: MenuResolver,
      documents: DocumentsResolver,
      categories: CategoryService
    }
  },
];

@NgModule({
declarations: [AddComponent],
imports:[
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    DragDropModule,
    EditModule
],
providers: [MenuResolver,DocumentsResolver]
})
export class AddModule { }
