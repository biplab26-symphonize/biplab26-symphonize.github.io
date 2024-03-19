import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { LogoModule } from 'app/layout/components/front-toolbar/logo/logo.module';
import { NavbarFrontHorizontalStyle2Component } from './style-2.component';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        NavbarFrontHorizontalStyle2Component
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
        NavbarFrontHorizontalStyle2Component
    ]
})
export class NavbarFrontHorizontalStyle2Module
{
}
