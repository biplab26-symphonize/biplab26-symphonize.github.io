import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewformModule } from './viewform/viewform.module';
import { RouterModule } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from 'app/_helpers/customDateAdapter';
import { RoleGuard } from 'app/_guards';
import { EntriesModule } from './entries/entries.module';


const routes = [
  {
    path: 'view',
    name:'Form',
   
    loadChildren: () => import('./viewform/viewform.module').then(m => m.ViewformModule)
  },
 
  {
    path: 'entries',
    name:'entries',
    canActivate: [RoleGuard],
    loadChildren: () => import('./entries/entries.module').then(m => m.EntriesModule)
  }
];

@NgModule({
  providers:
  [
    CustomDateAdapter, // so we could inject services to 'CustomDateAdapter'
    { provide: DateAdapter, useClass: CustomDateAdapter }, // Parse MatDatePicker Format
  ],
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ViewformModule,
    EntriesModule
   
  ],
  
 
})
export class FormsModule { }
