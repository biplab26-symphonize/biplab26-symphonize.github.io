import { NgModule } from '@angular/core';

import { VerticalLayout1Module } from 'app/layout/vertical/layout-1/layout-1.module';
import { VerticalLayout2Module } from 'app/layout/vertical/layout-2/layout-2.module';
import { VerticalLayout3Module } from 'app/layout/vertical/layout-3/layout-3.module';

import { HorizontalLayout1Module } from 'app/layout/horizontal/layout-1/layout-1.module';
import { ImagesCropperModule } from './components/image-cropper/image-cropper.module';
import { ExportModule } from 'app/layout/components/export/export.module';
import { StaffBiographyModule } from 'app/layout/components/dialogs/staff-biography/staff-biography.module';
import { FieldsComponentModule } from './fields-component/fields-component.module';
import { FormfieldModule } from 'app/layout/components/form-fields/formfield.module';
import { FrontHorizontalLayout1Module } from './horizontal/front-layout-1/front-layout-1.module';
//calendar
import { GridEventModule } from './components/events/grid-event/grid-event.module';
import { ModalEventModule } from './components/events/modal-event/modal-event.module';
//confirm-pages
import { EventRegisterModule } from 'app/layout/components/confirm-pages/event-register/event-register.module'; 
import { MeetingRoomModule } from './components/widgets/meeting-room/meeting-room.module';
@NgModule({

    imports: [
        VerticalLayout1Module,
        VerticalLayout2Module,
        VerticalLayout3Module,

        HorizontalLayout1Module,
        ImagesCropperModule,
        ExportModule,
        StaffBiographyModule,
        FieldsComponentModule,
        FormfieldModule,

        // front layout module
        FrontHorizontalLayout1Module,
        //CALENDAR 
        GridEventModule,
        ModalEventModule,
        //ConfirmPages
        EventRegisterModule
        
    ],
    exports: [
        VerticalLayout1Module,
        VerticalLayout2Module,
        VerticalLayout3Module,

        HorizontalLayout1Module,
        ExportModule,
        ImagesCropperModule,
        ExportModule,
        FieldsComponentModule,
        FormfieldModule,
        
        // front layout module
        FrontHorizontalLayout1Module,
        //CALENDAR 
        GridEventModule,
        ModalEventModule,
        //ConfirmPages
        EventRegisterModule,
        MeetingRoomModule
    ],
    declarations: []
})
export class LayoutModule
{
}
