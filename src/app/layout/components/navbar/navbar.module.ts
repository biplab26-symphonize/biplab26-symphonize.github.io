import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { NavbarComponent } from 'app/layout/components/navbar/navbar.component';
import { NavbarHorizontalStyle1Module } from 'app/layout/components/navbar/horizontal/style-1/style-1.module';
import { NavbarVerticalStyle1Module } from 'app/layout/components/navbar/vertical/style-1/style-1.module';
//front vertial
import { NavbarFrontVerticalStyle1Module } from 'app/layout/components/navbar/vertical/front-style-1/front-style-1.module';
import { NavbarVerticalStyle2Module } from 'app/layout/components/navbar/vertical/style-2/style-2.module';
import { NavbarFrontHorizontalStyle1Module } from './horizontal/front-style-1/style-1.module';
import { NavbarFrontHorizontalStyle2Module } from './horizontal/front-style-2/style-2.module';

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports     : [
        FuseSharedModule,

        NavbarHorizontalStyle1Module,
        NavbarVerticalStyle1Module,
        NavbarFrontVerticalStyle1Module, //front vertical
        NavbarVerticalStyle2Module,
        NavbarFrontHorizontalStyle1Module,
        NavbarFrontHorizontalStyle2Module
    ],
    exports     : [
        NavbarComponent
    ]
})
export class NavbarModule
{
}
