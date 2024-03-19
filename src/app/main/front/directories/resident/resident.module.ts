import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidentComponent } from './resident.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';
import { NgxMaskModule } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FuseSharedModule } from '@fuse/shared.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { SettingsService, UsersService } from 'app/_services';
import { MetaFilterModule } from 'app/layout/components/users/meta-filter/meta-filter.module';
import { BirthdateModule } from 'app/layout/components/birthdate/birthdate.module';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
import { NewestNeighborsModule } from 'app/layout/components/widgets/newest-neighbors/newest-neighbors.module';
const routes = [
  { 
      path      : 'resident-directory', 
      name      : 'Resident directory',
      component : ResidentComponent, 
      canActivate: [AuthGuard],
      resolve  	  : {
        userservices : UsersService,
        setting       : SettingsService
      },
  },
  { 
    path      : 'new-residents', 
    name      : 'New Residents',
    component : ResidentComponent, 
    canActivate: [AuthGuard],
    resolve  	  : {
      userservices : UsersService,
      setting       : SettingsService
    },
  }
];

@NgModule({
  declarations: [ResidentComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    NgxMaskModule.forRoot(),
    // material module 
    MatProgressSpinnerModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MetaFilterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FieldsComponentModule,
    
    // FilterCategoriesModule,
    BirthdateModule,
    BreadcumbModule,
    NewestNeighborsModule
  ],
  providers:[AuthGuard,SettingsService,UsersService]
})

export class ResidentModule { }
