import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsListComponent } from './documents-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { AnnouncementService } from 'app/_services';
import { DashboardService } from 'app/_services/dashboard.service';



@NgModule({
  declarations: [DocumentsListComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MaterialModule,
  ],
  entryComponents: [
    DocumentsListComponent
  ],
  exports: [
    DocumentsListComponent
  ],
  providers:[DashboardService]
})
export class DocumentsListModule { }
