import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { ListComponent } from './list.component';
import { GalleryService } from 'app/_services';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';


const routes = [
  { 
    path      : 'gallery/list', 
    name      : 'Gallery List',
    component : ListComponent      
  }  
]

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    BreadcumbModule
  ],
  providers : [GalleryService]
})
export class ListModule { }
