import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { PagesComponent } from './pages.component';
import { MaterialModule } from 'app/main/material.module';
import { AddModule }  from './add/add.module';
import { PagebuilderService } from 'app/_services';
import { PreviewComponent } from './preview/preview.component';
import { ElementsLoaderComponent } from './preview/elements-loader/elements-loader.component';
import { ContentBoxesComponent } from './preview/elements-loader/content-boxes/content-boxes.component';

const routes = [
  { 
    path          : 'admin/pages/list', 
    component     : PagesComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      pages: PagebuilderService
    },
    children      : [{
        path        : 'admin/pages/add',
        loadChildren: () => import('./add/add.module').then(m => m.AddModule)
    }]
  },
  {
    path          : 'admin/pages/trash', 
    component     : PagesComponent, 
    canActivate   : [AuthGuard],
    data: {trash: 1},
    resolve  : {
      pages: PagebuilderService
    }
  }
];

@NgModule({
  declarations: [PagesComponent, PreviewComponent, ElementsLoaderComponent, ContentBoxesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    AddModule
  ],
  entryComponents:[
    PreviewComponent,
    ElementsLoaderComponent,
    ContentBoxesComponent
  ],
  exports:[
    PreviewComponent,
    ElementsLoaderComponent,
    ContentBoxesComponent
  ]
})
export class PagesModule { }
