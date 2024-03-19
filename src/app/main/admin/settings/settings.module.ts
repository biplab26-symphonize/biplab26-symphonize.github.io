import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GeneralModule } from './general/general.module';
import { HomeModule } from './home/home.module';
import {ExportsModule} from './export/exports.module';
import { ThemeModule } from './theme/theme.module';
import { ProfileModule } from './profile/profile.module';
import { PasswordModule } from './password/password.module';
import { PrivacyModule } from './privacy/privacy.module';
//permissions settings page 
import { PermissionsModule } from './permissions/permissions.module';



const appRoutes: Routes = [
  {
      path: 'general',
      loadChildren: () => import('./general/general.module').then(m => m.GeneralModule)
  },
  {
      path: 'home',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
      path: 'export',
      loadChildren: () => import('./export/exports.module').then(m => m.ExportsModule)
  },
  {
      path: 'theme',
      loadChildren: () => import('./theme/theme.module').then(m => m.ThemeModule)
  },
  {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
      path: 'password',
      loadChildren: () => import('./password/password.module').then(m => m.PasswordModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule)
  },
  {
    path: 'permissions',
    loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule)
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    GeneralModule,
    HomeModule,
    ExportsModule,
    ThemeModule,
    ProfileModule,
    PasswordModule,
    PermissionsModule,
    PrivacyModule,
  ]
})
export class SettingsModule { }
