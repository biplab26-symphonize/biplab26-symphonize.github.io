import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/_guards';
import { MatIconModule } from '@angular/material/icon';
import { BannerModule } from 'app/layout/components/banner/banner.module';
import { DatetimeModule } from 'app/layout/components/widgets/datetime/datetime.module';
import { HomeAnnouncementModule } from 'app/layout/components/widgets/home-announcement/home-announcement.module';
import { DiningAnnouncementModule } from 'app/layout/components/widgets/dining-announcement/dining-announcement.module';
import { EventAnnouncementModule } from 'app/layout/components/widgets/event-announcement/event-announcement.module';
import { TodaysEventsModule } from 'app/layout/components/widgets/todays-events/todays-events.module';
import { WeatherModule } from 'app/layout/components/widgets/weather/weather.module';
import { BulletinsModule } from 'app/layout/components/widgets/bulletins/bulletins.module';
import { FrontQuickPanelModule } from 'app/layout/components/front-quick-panel/front-quick-panel.module';
import { MyEventsModule } from 'app/layout/components/widgets/my-events/my-events.module';
import { MyFormsModule } from 'app/layout/components/widgets/my-forms/my-forms.module';
import { MyDiningModule } from 'app/layout/components/widgets/my-dining/my-dining.module';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { ScrollAnnouncementModule } from 'app/layout/components/widgets/scroll-announcement/scroll-announcement.module';
import { MyBookingModule } from 'app/layout/components/widgets/my-booking/my-booking.module';
import { MyAppointmentsModule } from 'app/layout/components/widgets/my-appointments/my-appointments.module';
import { TableReservationModule } from 'app/layout/components/widgets/table-reservation/table-reservation.module';
import { NewestNeighborsModule } from 'app/layout/components/widgets/newest-neighbors/newest-neighbors.module';
import { NewestStaffModule } from 'app/layout/components/widgets/newest-staff/newest-staff.module';
import { MeetingRoomModule } from 'app/layout/components/widgets/meeting-room/meeting-room.module';
import { MyGuestRoomsModule } from 'app/layout/components/widgets/my-guest-room/my-guest-rooms.module';
import { FavoriteEventModule } from 'app/layout/components/widgets/favorite-event/favorite-event.module';


const routes = [
  { 
      path: '', 
      data: {
        breadcrumb: '',
        class:'home'
      },
      component: HomeComponent, 
      canActivate: [AuthGuard], 
  }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatIconModule,
    BannerModule,
    DatetimeModule,
    HomeAnnouncementModule,
    DiningAnnouncementModule,
    ScrollAnnouncementModule,
    EventAnnouncementModule,
    TodaysEventsModule,
    FrontFooterModule,
    WeatherModule,
    BulletinsModule,
    FrontQuickPanelModule,
    MyEventsModule,
    MyFormsModule,
    MyDiningModule,
    MyBookingModule,
    MyAppointmentsModule,
    TableReservationModule,
    NewestNeighborsModule,
    NewestStaffModule,
    MeetingRoomModule,
    MyGuestRoomsModule,
    FavoriteEventModule
  ]
})
export class HomeModule { }