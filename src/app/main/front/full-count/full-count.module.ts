import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { CommonService, UsersService } from 'app/_services';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
import { ChargeAccountDetailsComponent } from './charge-account-details/charge-account-details.component';
import { PlanAccountDetailsComponent } from './plan-account-details/plan-account-details.component';

const approutes = [
  {
    path: 'account-summary',
    name: 'account summary',
    component: AccountSummaryComponent
  }, {
    path: 'customer-charge-account-details/:acid/:cstid',
    name: 'customer charge account details',
    component: ChargeAccountDetailsComponent,
    resolve  	: {
      bookingList : UsersService
    },
    data: {
      acid: 'acid',
    }
  }, {
    path: 'customer-plan-account-details/:cstid/:acid',
    name: 'customer plan account details',
    component: PlanAccountDetailsComponent,
    resolve  	: {
      bookingList : UsersService
    },
    data: {
      acid: 'acid',
    }
  },
];

@NgModule({
  declarations: [AccountSummaryComponent, ChargeAccountDetailsComponent, PlanAccountDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(approutes),
    FuseSharedModule,
    MaterialModule,
    FrontFooterModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule,
  ],
  providers: [CommonService]
})
export class FullCountModule { }
