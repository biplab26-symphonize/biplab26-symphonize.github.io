import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllModule } from './all/all.module';
import { AddModule } from './add/add.module';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { SettingsModule } from './settings/settings.module';
import { AttendeesModule } from './attendees/attendees.module';
import { CalendarModule } from './all/calendar/calendar.module';
import { CategoryCalendarModule } from './category-calendar/category-calendar.module';


const routes: Routes = [
  {
      path: 'all',
      loadChildren: () => import('./all/all.module').then(m => m.AllModule)
  },
  {
    path: 'all/calendar',
    loadChildren: () => import('./all/calendar/calendar.module').then(m => m.CalendarModule)
  },
  {
      path: 'add',
      loadChildren: () => import('./add/add.module').then(m => m.AddModule)
  },
  {
    path: 'attendees',
    loadChildren: () => import('./attendees/attendees.module').then(m => m.AttendeesModule)
  },
  {
      path: 'categories',
      loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: 'categories calendar',
    loadChildren: () => import('./category-calendar/category-calendar.module').then(m => m.CategoryCalendarModule)
  },
  {
      path: 'location',
      loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule)
  },
  {
      path: 'settings',
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AllModule,
    CalendarModule,
    AddModule,
    CategoriesModule,
    LocationsModule,
    SettingsModule,
    AttendeesModule,
    CategoryCalendarModule
  ]
})
export class EventsModule { }
