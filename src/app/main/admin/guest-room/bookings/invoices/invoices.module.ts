import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { GuestRoomService } from 'app/_services';
import { AuthGuard } from 'app/_guards';
import { InvoicesComponent } from './invoices.component';
import { EditComponent } from './edit/edit.component';
import { AddNewInvoiceComponent } from './add-new-invoice/add-new-invoice.component';
import { ViewinvoicesComponent } from './viewinvoices/viewinvoices.component';
import { NgxMaskModule } from 'ngx-mask';

const Approutes = [
  {
    path: 'admin/guest-room/room/invoices/lists',
    component: InvoicesComponent,
    canActivate: [AuthGuard],
    resolve: { extras: GuestRoomService },
    data: { id: 'id' }
  },
  {
    path: 'admin/guest-room/room/invoice/edit/:id',
    component: EditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/guest-room/room/invoice/view/:id',
    component: ViewinvoicesComponent,
    canActivate: [AuthGuard],
  },

]

@NgModule({
  declarations: [InvoicesComponent, EditComponent, AddNewInvoiceComponent, ViewinvoicesComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(Approutes),
    FuseSharedModule,
    MatSelectModule,
    NgxMaskModule.forRoot(),
  ]
})
export class InvoicesModule { }
