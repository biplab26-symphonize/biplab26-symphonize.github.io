import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseSharedModule } from '@fuse/shared.module';

import { SettingsComponent } from './settings.component';
import { ImportModule } from './import/import.module';
import { DirectoryModule } from './directory/directory.module';
import { ExportModule } from './export/export.module';
import { GeneralModule } from './general/general.module';
import { RolesService } from 'app/_services';
import { UserSettingsResolver } from 'app/_resolvers/usersettings.resolver';


const routes = [
  { 
    path: 'admin/users/settings', 
    component: SettingsComponent, 
    canActivate: [AuthGuard],
    data: {meta_key: 'users_settings',exportype:'users',apiendpoint:'export/fields'},
    resolve  : {
        usersettings: UserSettingsResolver,
        roles:RolesService
    }
  },
];

@NgModule({
  declarations: [SettingsComponent],
  imports:[
            CommonModule,
            RouterModule.forChild(routes),
            MatIconModule,
            MatTabsModule,
            MatInputModule,
            MatButtonModule,
            MatSelectModule,
            MatTooltipModule,
            MatSlideToggleModule,

            FuseSharedModule,
            ImportModule,
            DirectoryModule,
            ExportModule,
            GeneralModule,
          ],
  providers: [UserSettingsResolver]
})
export class SettingsModule { }
