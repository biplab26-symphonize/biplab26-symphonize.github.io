import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';
import { AppConfig, OptionsList } from 'app/_services';
import { LoaderAuthInterceptor } from 'app/_helpers';

import { AppComponent } from 'app/app.component';
import { Error404Module } from './main/pages/errors/404/error-404.module';
import { LayoutModule } from 'app/layout/layout.module';
import { AnnouncementModule } from './main/admin/announcement/announcement.module';
import { SettingsModule } from './main/admin/settings/settings.module';
import { FieldsModule } from './main/admin/fields/fields.module';
import { MenusModule } from './main/admin/menus/menus.module';
import { MediaModule } from './main/admin/media/media.module';
import { EventsModule } from './main/admin/events/events.module';
import { UsersModule } from './main/admin/users/users.module';
import { FormsModule } from './main/admin/forms/forms.module';
import { StaffModule } from './main/admin/staff/staff.module';
import { FilesModule } from './main/admin/files/files.module';
import { DatePipe } from '@angular/common';
import { FrontModule } from './main/front/front.module';
import { ForumModule } from './main/admin/forum/forum.module';
//Welcome Popup Module
import { WelcomeModule } from './main/front/home/welcome/welcome.module';
import { CalendarGeneratorModule } from './main/admin/calendar-generator/calendar-generator.module';
import { DiningReservationModule } from './main/admin/dining-reservation/dining-reservation.module';
import { FoodReservationModule } from './main/admin/food-reservation/food-reservation.module';
import { RotatingMenuModule } from './main/admin/rotating-menu/rotating-menu.module';
import { PagesModule } from './main/admin/pages/pages.module'; //Page Builder
import { DashboardModule } from './main/admin/dashboard/dashboard.module';
import { AppointmentBookingModule } from './main/admin/appointment-booking/appointment-booking.module';
import { TableReservationModule } from './main/admin/table-reservation/table-reservation.module';
import { PostSmtpModule } from './main/admin/post-smtp/post-smtp.module';
import { MeetingRoomModule } from './main/admin/meeting-room/meeting-room.module';
import { ImportsModule } from './main/admin/imports/imports.module';
import { ActivityLogModule } from './main/admin/activity-log/activity-log.module';
import {GuestRoomModule} from './main/admin/guest-room/guest-room.module';
import { PhotoGalleryModule } from './main/admin/photo-gallery/photo-gallery.module';

const appRoutes: Routes = [
    {
        path: 'authentication',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.AuthenticationModule)
    },
    {
        path: '',
        loadChildren: () => import('./main/front/front.module').then(m => m.FrontModule)
    },
    {
        path: 'admin/dashboard',
        loadChildren: () => import('./main/admin/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'announcement',
        loadChildren: () => import('./main/admin/announcement/announcement.module').then(m => m.AnnouncementModule)
    },
    {
        path: 'events',
        loadChildren: () => import('./main/admin/events/events.module').then(m => m.EventsModule)
    },
    {
        path: 'forms',
        loadChildren: () => import('./main/admin/forms/forms.module').then(m => m.FormsModule)
    },
    {
        path: 'users',
        loadChildren: () => import('./main/admin/users/users.module').then(m => m.UsersModule)
    },
    {
        path: 'staff',
        loadChildren: () => import('./main/admin/staff/staff.module').then(m => m.StaffModule)
    },
    {
        path: 'fields',
        loadChildren: () => import('./main/admin/fields/fields.module').then(m => m.FieldsModule)
    },
    {
        path: 'media',
        loadChildren: () => import('./main/admin/media/media.module').then(m => m.MediaModule)
    },
    {
        path: 'files',
        loadChildren: () => import('./main/admin/files/files.module').then(m => m.FilesModule)
    },
    {
        path: 'menus',
        loadChildren: () => import('./main/admin/menus/menus.module').then(m => m.MenusModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./main/admin/settings/settings.module').then(m => m.SettingsModule)
    },
    {
        path: 'forum',
        loadChildren: () => import('./main/admin/forum/forum.module').then(m => m.ForumModule)
    },
    {
        path: 'calendar-generator',
        loadChildren: () => import('./main/admin/calendar-generator/calendar-generator.module').then(m => m.CalendarGeneratorModule)
    },
    {
        path: 'dining-reservation',
        loadChildren: () => import('./main/admin/dining-reservation/dining-reservation.module').then(m => m.DiningReservationModule)
    },
    {
        path: 'food-reservation',
        loadChildren: () => import('./main/admin/food-reservation/food-reservation.module').then(m => m.FoodReservationModule)
    },
    {
        path: 'rotating-menu',
        loadChildren: () => import('./main/admin/rotating-menu/rotating-menu.module').then(m => m.RotatingMenuModule)
    },
    {
        path: 'appointment-booking',
        loadChildren: () => import('./main/admin/appointment-booking/appointment-booking.module').then(m => m.AppointmentBookingModule)
    },
    {
        path: 'guest-room',
        loadChildren: () => import('./main/admin/guest-room/guest-room.module').then(m => m.GuestRoomModule)
    },
    {
        path: 'meeting-room',
        loadChildren: () => import('./main/admin/meeting-room/meeting-room.module').then(m => m.MeetingRoomModule)
    },
    {
        path: 'restaurant-reservations',
        loadChildren: () => import('./main/admin/table-reservation/table-reservation.module').then(m => m.TableReservationModule)
    },
    {
        path: 'post-SMTP',
        loadChildren: () => import('./main/admin/post-smtp/post-smtp.module').then(m => m.PostSmtpModule)
    },
    {
        path: 'import',
        loadChildren: () => import('./main/admin/imports/imports.module').then(m => m.ImportsModule)
    },
    {
        path: 'activity-log',
        loadChildren: () => import('./main/admin/activity-log/activity-log.module').then(m => m.ActivityLogModule)
    },
    {
        path: 'photo-gallery',
        loadChildren: () => import('./main/admin/photo-gallery/photo-gallery.module').then(m => m.PhotoGalleryModule)
    },
    /**
     * PAGE BUILDER MODULE
     */
    {
        path: 'admin/pages',
        loadChildren: () => import('./main/admin/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: '**',
        redirectTo: '/errors/error-404'
    }
];

//LOAD #CONFIG 
export function initConfig(appConfig: AppConfig) {
    return () => appConfig.load();
}
//LOAD #SETTINGS
export function get_settings(optionsList: OptionsList) {
    return () => optionsList.load();
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),
        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        ActivityLogModule,
        // App modules
        Error404Module,
        LayoutModule,
        DashboardModule,
        AnnouncementModule,
        SettingsModule,
        FieldsModule,
        MenusModule,
        MediaModule,
        EventsModule,
        UsersModule,
        FormsModule,
        RotatingMenuModule,
        StaffModule,
        FilesModule,
        FrontModule,
        ForumModule,
        //Welcome Popup
        WelcomeModule,
        CalendarGeneratorModule,
        DiningReservationModule,
        //Food Reservation Module
        FoodReservationModule,
        AppointmentBookingModule,
        TableReservationModule,
        PostSmtpModule,
        PhotoGalleryModule,
        //PB Module
        PagesModule,
        ImportsModule,
        MeetingRoomModule,
        GuestRoomModule,
        HammerModule
    ],
    providers: [
        OptionsList,
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: initConfig,
            deps: [AppConfig],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: get_settings,
            deps: [OptionsList],
            multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderAuthInterceptor, multi: true },
        DatePipe //EXTRA Changes
    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule {
}
