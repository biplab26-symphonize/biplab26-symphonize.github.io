import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormEntriesComponent } from './form-entries.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';//#AuthGuard For Routing
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from 'app/_services/dashboard.service';
import { FoodOrderService, FoodReservationService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';

@NgModule({
  declarations: [FormEntriesComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule, 
    MatIconModule,
    FuseSharedModule,
    MaterialModule,
    MatButtonModule
  ],
  providers: [
    DashboardService,
  ],
  entryComponents: [
    FormEntriesComponent
  ],
  exports: [
    FormEntriesComponent
  ],
})
export class FormEntriesModule { }
