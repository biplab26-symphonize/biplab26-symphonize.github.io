import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ContentModule } from 'app/layout/components/content/content.module';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { NavbarModule } from 'app/layout/components/navbar/navbar.module';
import { AccountModule } from 'app/layout/components/account/account.module';

import { FrontToolbarModule } from 'app/layout/components/front-toolbar/front-toolbar.module';

import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
import { FrontHorizontalLayout1Component } from './front-layout-1.component';


@NgModule({
  declarations: [FrontHorizontalLayout1Component
],
imports     : [
    MatSidenavModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,

    ContentModule,
    FrontFooterModule,
    NavbarModule,
    BreadcumbModule,
    AccountModule,
    
    FrontToolbarModule
],
exports     : [
  FrontHorizontalLayout1Component
]
})
export class FrontHorizontalLayout1Module { }
