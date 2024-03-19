// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr       : false,
    pusher: {
        key: '86377202b5e5e593de9d',
        cluster: 'ap2',
        onlinechannel: 'presence-online',
        messagechannel: 'message',
        accesschannel: 'private-restrictaccess',
        privateuserchannel: 'private-users.',
        groupchannel: 'private-groups.',
        global_notification :'App\\Events\\GlobalNotificationEvent',
        form_edit :'App\\Events\\EditRestrictionUpdateEvent',
        ann_edit :'App\\Events\\EditRestrictionUpdateEvent',
        forum_edit :'App\\Events\\EditRestrictionUpdateEvent',
        attendee_edit :'App\\Events\\EditRestrictionUpdateEvent',
        table_serv_edit :'App\\Events\\EditRestrictionUpdateEvent',
        table_booking_edit :'App\\Events\\EditRestrictionUpdateEvent',
        dining_serv_edit :'App\\Events\\EditRestrictionUpdateEvent',
        dining_booking_edit :'App\\Events\\EditRestrictionUpdateEvent',
        app_serv_edit :'App\\Events\\EditRestrictionUpdateEvent',
        app_booking_edit :'App\\Events\\EditRestrictionUpdateEvent',
        staff_edit :'App\\Events\\EditRestrictionUpdateEvent',
        food_product_edit :'App\\Events\\EditRestrictionUpdateEvent',
        food_order_edit :'App\\Events\\EditRestrictionUpdateEvent',
        food_drink :'App\\Events\\EditRestrictionUpdateEvent',
        rooms :'App\\Events\\EditRestrictionUpdateEvent',
        room_layout :'App\\Events\\EditRestrictionUpdateEvent',
        side_dish :'App\\Events\\EditRestrictionUpdateEvent',
        extras :'App\\Events\\EditRestrictionUpdateEvent',
        location :'App\\Events\\EditRestrictionUpdateEvent',
        categroies :'App\\Events\\EditRestrictionUpdateEvent',
        guestroom :'App\\Events\\EditRestrictionUpdateEvent',
        field :'App\\Events\\EditRestrictionUpdateEvent',
        message_event:'App\\Events\\ChatEvents\\MessageSentEvent',
        delete_message_event:'App\\Events\\ChatEvents\\MessageDeleteEvent',
        online_event:'App\\Events\\ChatEvents\\UserOnlineEvent',
        receive_invite_event:'App\\Events\\ChatEvents\\GroupInvite',
        invite_event:'App\\Events\\ChatEvents\\GroupInviteAccept',
        groupchat_event:'App\\Events\\ChatEvents\\GroupMessageSentEvent',
        delete_chatevent:'App\\Events\\ChatEvents\\DeleteChatEvent',
        restrict_event:'App\\Events\\EditRestrictionEvent',
    },
    defaultheader:'/assets/images/backgrounds/default-header.jpg'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
