import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { LogoModule } from 'app/layout/components/front-toolbar/logo/logo.module';
import { NavbarFrontHorizontalStyle1Component } from './style-1.component';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        NavbarFrontHorizontalStyle1Component
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MaterialModule,
        RouterModule,
        FuseSharedModule,
        FuseNavigationModule,
        LogoModule
    ],
    exports     : [
        NavbarFrontHorizontalStyle1Component
    ]
})
export class NavbarFrontHorizontalStyle1Module
{
}
