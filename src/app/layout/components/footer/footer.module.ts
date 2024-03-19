import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';

import { FooterComponent } from 'app/layout/components/footer/footer.component';
import { TermConditionComponent } from './term-condition/term-condition.component';
import { MaterialModule } from 'app/main/material.module';

const routes = [
    {
        path     : 'term-condition',
        component: TermConditionComponent
    }
];
@NgModule({
    declarations: [
        FooterComponent,
        TermConditionComponent
    ],
    imports     : [
        RouterModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,

        FuseSharedModule,
        MaterialModule
    ],
    exports     : [
        FooterComponent,
        TermConditionComponent
    ],
    entryComponents: [
        TermConditionComponent
    ]
})
export class FooterModule
{
}
