import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './home/home.module';
import { EventsModule } from './events/events.module';
import { ArchieveModule } from './archieve/archieve.module';
import { EditProfileModule } from './profile/edit-profile/edit-profile.module';
import { ForumModule } from './forum/forum.module';
import { EditOtherProfileModule } from './edit-other-profile/edit-other-profile.module';
import { NotificationsModule } from './profile/notifications/notifications.module';
import { DirectoriesModule } from './directories/directories.module';
import { CalendarModule } from './calendar/calendar.module';
import { FormsModule as UserFormsModule } from './forms/forms.module';
import { QuicklinksModule } from './quicklinks/quicklinks.module';
import { PageModule } from './page/page.module';
import { ChatModule } from './chat/chat.module';
import { DiningReservationModule } from './dining-reservation/dining-reservation.module';
import { FoodReservationModule } from './food-reservation/food-reservation.module';
import { AppointmentBookingModule } from './appointment-booking/appointment-booking.module';
import { TableReservationModule } from './table-reservation/table-reservation.module';
import { CartWatchModule } from './cart-watch/cart-watch.module';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { SearchModule } from './search/search.module';
import { GalleryModule } from './gallery/gallery.module';
import { GuestRoomModule } from './guest-room/guest-room.module';
import { FullCountModule } from './full-count/full-count.module';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'archive',
    loadChildren: () => import('./archieve/archieve.module').then(m => m.ArchieveModule)
  },
  {
    path: 'forums',
    loadChildren: () => import('./forum/forum.module').then(m => m.ForumModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/edit-profile/edit-profile.module').then(m => m.EditProfileModule)
  },
  {
    path: 'profile/notifications',
    loadChildren: () => import('./profile/notifications/notifications.module').then(m => m.NotificationsModule)
  },
  {
    path: 'edit-other-profile/:id',
    loadChildren: () => import('./edit-other-profile/edit-other-profile.module').then(m => m.EditOtherProfileModule)
  },
  {
    path: 'directory',
    loadChildren: () => import('./directories/directories.module').then(m => m.DirectoriesModule)
  },
  {
    path: 'archive/:slug',
    loadChildren: () => import('./archieve/archieve.module').then(m => m.ArchieveModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule as UserFormsModule)
  },
  {
    path: 'quicklinks/:name',
    loadChildren: () => import('./quicklinks/quicklinks.module').then(m => m.QuicklinksModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'my-order',
    loadChildren: () => import('./food-reservation/food-reservation.module').then(m => m.FoodReservationModule)
  },
  {
    path: 'to-go-order',
    loadChildren: () => import('./food-reservation/food-reservation.module').then(m => m.FoodReservationModule)
  },
  {
    path: 'appointment-booking',
    loadChildren: () => import('./appointment-booking/appointment-booking.module').then(m => m.AppointmentBookingModule)
  },
  {
    path: 'restaurant-reservations',
    loadChildren: () => import('./table-reservation/table-reservation.module').then(m => m.TableReservationModule)
  },
  {
    path: 'cart-watch',
    loadChildren: () => import('./cart-watch/cart-watch.module').then(m => m.CartWatchModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./page/page.module').then(m => m.PageModule)
  },
  {
    path: 'meeting-room-booking',
    loadChildren: () => import('./meeting-room/meeting-room.module').then(m => m.MeetingRoomModule)
  },
  {
    path: 'search-bar',
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'gallery',
    loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule)
  },
  {
    path: 'guest-room',
    loadChildren: () => import('./guest-room/guest-room.module').then(m => m.GuestRoomModule)
  },
  {
    path: 'account-summary',
    loadChildren: () => import('./full-count/full-count.module').then(m => m.FullCountModule)
  }


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    HomeModule,
    EventsModule,
    ArchieveModule,
    ForumModule,
    EditProfileModule,
    EditOtherProfileModule,
    NotificationsModule,
    DirectoriesModule,
    CalendarModule,
    UserFormsModule,
    QuicklinksModule,
    PageModule,
    ChatModule,
    DiningReservationModule,
    FoodReservationModule,
    AppointmentBookingModule,
    TableReservationModule,
    CartWatchModule,
    MeetingRoomModule,
    SearchModule,
    GalleryModule,
    GuestRoomModule,
    FullCountModule
  ]
})
export class FrontModule { }
