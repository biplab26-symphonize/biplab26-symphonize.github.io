import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminRoleGuard, AuthGuard } from 'app/_guards';//#AuthGuard For Routing
import { FuseSharedModule } from '@fuse/shared.module';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { DashboardService } from 'app/_services/dashboard.service';
import { FoodOrderService } from 'app/_services';
import { OrdersListComponent } from '../food-reservation/orders/orders-list/orders-list.component';
import { MaterialModule } from 'app/main/material.module';
import { TodaysEventModule } from './todays-event/todays-event.module';
import { FormEntriesModule } from './form-entries/form-entries.module';
import { EventAttendeesModule } from './event-attendees/event-attendees.module';
import { FormsListModule } from './forms-list/forms-list.module';
import { UserupdateModule } from './userupdate/userupdate.module';
import { DocumentsListModule } from './documents-list/documents-list.module';

const routes = [
    {
        path: 'admin/dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard,AdminRoleGuard],        
    },
    {
        path: 'admin/food-reservation/orders/orders-list/:type',
        component: OrdersListComponent,
        canActivate: [AuthGuard,AdminRoleGuard],
        resolve: {
            order: FoodOrderService
        }
    },
    {
        path: 'admin/food-reservation/orders/orders-list/:typed',
        component: OrdersListComponent,
        canActivate: [AuthGuard,AdminRoleGuard],
        resolve: {
            order: FoodOrderService
        }
    }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    providers: [
        DashboardService,
    ],
    imports: [
        RouterModule.forChild(routes),

        FuseSharedModule,
        CommonModule,
        MaterialModule,
        FuseSharedModule,
        MatIconModule,
        MatButtonModule,
        TodaysEventModule,
        FormEntriesModule,
        EventAttendeesModule,
        FormsListModule,
        UserupdateModule,
        DocumentsListModule
    ],
    exports: [
        DashboardComponent
    ]
})
export class DashboardModule { }
