import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuicklinksComponent } from './quicklinks.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/_guards';
import { MaterialModule } from 'app/main/material.module';
import { EventcategoryService, SettingsService } from 'app/_services';

import { FilterCategoriesModule } from 'app/layout/components/events/filter-categories/filter-categories.module';

import { RegisterButtonsModule } from 'app/layout/components/events/register-buttons/register-buttons.module';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
const routes = [
  { 
      path      : 'quicklinks/:name', 
      component : QuicklinksComponent, 
      canActivate: [ AuthGuard],
     
      
  },
];

@NgModule({
  declarations: [QuicklinksComponent],
  imports: [
    BreadcumbModule,
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    RegisterButtonsModule,
    FilterCategoriesModule,],
  providers:[AuthGuard]
})
export class QuicklinksModule { }
