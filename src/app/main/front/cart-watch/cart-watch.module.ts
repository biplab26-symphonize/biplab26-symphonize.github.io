import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { AuthGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { CycledMenusComponent } from './cycled-menus/cycled-menus.component';
import { ViewMenuComponent } from './view-menu/view-menu.component';

const appRoutes = [
  {
      path      : 'account-balance', 
      name      : 'Account Balance',
      component : AccountBalanceComponent,
      canActivate: [AuthGuard]
  
  },
  {
    path      : 'transaction-details', 
    name      : 'Transaction Details',
    component : TransactionDetailsComponent,
    canActivate: [AuthGuard]

},
{
  path      : 'cycled-menus-for-seven-days', 
  name      : 'Cycled Menus For Seven Days',
  component : CycledMenusComponent,
  canActivate: [AuthGuard]

},
{
  path      : 'view-menu/:id', 
  name      : 'View Menu',
  component : ViewMenuComponent,
  canActivate: [AuthGuard]

},
]

@NgModule({
  declarations: [AccountBalanceComponent, TransactionDetailsComponent, CycledMenusComponent, ViewMenuComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(appRoutes),
    MaterialModule,
    FieldsComponentModule,
    FileUploadModule
  ]
})
export class CartWatchModule { }
