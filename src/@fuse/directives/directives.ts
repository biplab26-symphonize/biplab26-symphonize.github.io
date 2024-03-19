import { NgModule } from '@angular/core';

import { FuseIfOnDomDirective } from '@fuse/directives/fuse-if-on-dom/fuse-if-on-dom.directive';
import { FuseInnerScrollDirective } from '@fuse/directives/fuse-inner-scroll/fuse-inner-scroll.directive';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseMatSidenavHelperDirective, FuseMatSidenavTogglerDirective } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.directive';
import { CapitalizeFirstDirective } from '@fuse/directives/capitalize-first/capitalize-first.directive';
import { HoverClassDirective } from '@fuse/directives/hover-class/hover-class.directive';
import { BackgroundImageLoadedDirective } from '@fuse/directives/bg-image-load/background-image-loaded.directive';
@NgModule({
    declarations: [
        FuseIfOnDomDirective,
        FuseInnerScrollDirective,
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FusePerfectScrollbarDirective,
        CapitalizeFirstDirective,
        HoverClassDirective,
        BackgroundImageLoadedDirective
    ],
    imports     : [],
    exports     : [
        FuseIfOnDomDirective,
        FuseInnerScrollDirective,
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FusePerfectScrollbarDirective,
        CapitalizeFirstDirective,
        HoverClassDirective,
        BackgroundImageLoadedDirective
    ]
})
export class FuseDirectivesModule
{
}
