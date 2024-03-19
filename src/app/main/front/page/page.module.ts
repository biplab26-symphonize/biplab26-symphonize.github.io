import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ViewComponent } from './view/view.component';
import { AuthGuard } from 'app/_guards';
import { TemplatesModule } from 'app/layout/components/page-editor/editor/templates/templates.module';
import { ElementsLoaderComponent } from './view/elements-loader/elements-loader.component';
import { ContentBoxesComponent } from './view/elements-loader/content-boxes/content-boxes.component';
const appRoutes = [
  {
      path : 'pages/view/:page_alias',
      component : ViewComponent,
      canActivate : [AuthGuard]
  }
];

@NgModule({
  declarations: [ViewComponent, ElementsLoaderComponent, ContentBoxesComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    MaterialModule,
    RouterModule.forChild(appRoutes),
    TemplatesModule
  ],
  entryComponents:[
    ElementsLoaderComponent,
    ContentBoxesComponent
  ],
  exports:[
    ElementsLoaderComponent,
    ContentBoxesComponent
  ]
})
export class PageModule { }
