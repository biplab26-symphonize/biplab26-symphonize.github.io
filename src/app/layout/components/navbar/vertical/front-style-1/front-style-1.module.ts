import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { NavbarFrontVerticalStyle1Component } from 'app/layout/components/navbar/vertical/front-style-1/front-style-1.component';

@NgModule({
    declarations: [
        NavbarFrontVerticalStyle1Component
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule
    ],
    exports     : [
        NavbarFrontVerticalStyle1Component
    ]
})
export class NavbarFrontVerticalStyle1Module
{
}
