import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FuseSharedModule } from '@fuse/shared.module';
import { SnackbarModule } from 'app/layout/components/dialogs/snackbar/snackbar.module'
import { AccountComponent } from 'app/layout/components/account/account.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        AccountComponent
    ],
    providers   : [],
    imports     : [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        MatTooltipModule,
        MatRippleModule,
        RouterModule, 
        FuseSharedModule,
        SnackbarModule
    ],
    exports     : [
        AccountComponent
    ]
})
export class AccountModule
{
}
