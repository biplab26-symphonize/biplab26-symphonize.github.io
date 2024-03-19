import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ListComponent } from './list.component';
import { AttendeesService } from 'app/_services';
import { MailtoAttendeesModule } from '../mailtoattendees/mailtoattendees.module';

const routes = [
    {
        path: 'admin/attendees/list/:event_id',
        component: ListComponent,
        canActivate: [AuthGuard],
        resolve: { event: AttendeesService },
        data: { attendeeid: 'attendee_id' }
    },
    {
        path: 'admin/attendees/trash/:event_id',
        component: ListComponent,
        canActivate: [AuthGuard],
        resolve: { event: AttendeesService },
        data: { attendeeid: 'attendee_id', trash: 1 }
    }
];

@NgModule({
    declarations: [ListComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FuseSharedModule,
        MaterialModule,
        MailtoAttendeesModule
    ],
    providers: [AttendeesService]
})
export class ListModule { }
