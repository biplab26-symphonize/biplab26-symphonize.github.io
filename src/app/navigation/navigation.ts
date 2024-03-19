import { FuseNavigation } from '@fuse/types';
import { OptionsList } from 'app/_services';
export const navigation: FuseNavigation[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: 'dashboard',
        url: '/admin/dashboard',
        roles: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        id: 'feeds',
        title: 'Feeds',
        type: 'group',
        children: [
            {
                id: 'announcement',
                title: 'Announcements',
                type: 'collapsable',
                icon: 'rate_review',
                children: [
                    {
                        id: 'scroll-announcement',
                        title: 'Scrolling Announcement',
                        type: 'item',
                        url: '/admin/announcement/scrolling',
                        roles: [1, 2]
                    }, {
                        id: 'home-announcement',
                        title: 'Homepage Announcement',
                        type: 'item',
                        url: '/admin/announcement/home',
                        roles: [1, 2]
                    }
                    // ,{
                    //     id       : 'event-announcement',
                    //     title    : 'Event Announcement',
                    //     type     : 'item',
                    //     url      : '/admin/announcement/event',
                    //     roles    : [1,2,7]   
                    // },{
                    //     id       : 'dining-announcement',
                    //     title    : 'Dining Announcement',
                    //     type     : 'item',
                    //     url      : '/admin/announcement/dining',
                    //     roles    : [1,2,4,7]   
                    // }
                ],
                roles: [1, 2]
            },
            {
                id: 'events',
                title: 'Event Settings',
                type: 'collapsable',
                icon: 'event',
                children: [
                    {
                        id: 'event-categories-calendar',
                        title: 'Calendars',
                        type: 'item',
                        url: '/admin/events/category_Calendar/list',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'event-categories',
                        title: 'Common Categories',
                        type: 'item',
                        url: '/admin/events/categories/list',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'event-locations',
                        title: 'Locations',
                        type: 'item',
                        url: '/admin/events/location/list',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'event-settings',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/events/settings',
                        roles: [1]
                    }
                ],
                roles: [1, 2, 3, 7]
            },
            {
                id: 'independent-living',
                title: 'Independent Living Events',
                type: 'collapsable',
                icon: 'event',
                children: [
                    {
                        id: 'independent-living-events',
                        title: 'All Independent Living Events',
                        type: 'item',
                        url: '/admin/event/independent-living',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'add-event',
                        title: 'Add Independent Living Event',
                        type: 'item',
                        url: '/admin/event/add/independent-living',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'independent-living-categories',
                        title: 'Independent Living Categories',
                        type: 'item',
                        url: '/admin/event/category/independent-living',
                        roles: [1, 2, 3, 7]
                    },
                ],
                roles: [1, 2, 3, 7]
            },
            {
                id: 'fitness',
                title: 'Fitness Events',
                type: 'collapsable',
                icon: 'event',
                children: [
                    {
                        id: 'fitness-events',
                        title: 'All Fitness Events',
                        type: 'item',
                        url: '/admin/event/fitness',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'add-event',
                        title: 'Add Fitness Event',
                        type: 'item',
                        url: '/admin/event/add/fitness',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'fitness-categories',
                        title: 'Fitness Categories',
                        type: 'item',
                        url: '/admin/event/category/fitness',
                        roles: [1, 2, 3, 7]
                    },
                ],
                roles: [1, 2, 3, 7]
            },
            {
                id: 'lodges',
                title: 'The Lodges Events',
                type: 'collapsable',
                icon: 'event',
                children: [
                    {
                        id: 'lodges-events',
                        title: 'All The Lodges Events',
                        type: 'item',
                        url: '/admin/event/the-lodges',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'add-event',
                        title: 'Add Lodges Event',
                        type: 'item',
                        url: '/admin/event/add/the-lodges',
                        roles: [1, 2, 3, 7]
                    },
                    {
                        id: 'lodges-categories',
                        title: 'Lodges Categories',
                        type: 'item',
                        url: '/admin/event/category/the-lodges',
                        roles: [1, 2, 3, 7]
                    },
                ],
                roles: [1, 2, 3, 7]
            },
            {
                id: 'gallery',
                title: 'Photo Gallery',
                type: 'collapsable',
                icon: 'perm_media',
                children: [
                    {
                        id: 'galleries',
                        title: 'Gallery',
                        type: 'item',
                        url: '/admin/galleries/list',
                        roles: [1, 2, 6]
                    },
                    {
                        id: 'albums',
                        title: 'Albums',
                        type: 'item',
                        url: '/admin/album/list',
                        roles: [1, 2, 6]
                    },
                    {
                        id: 'gallery-settings',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/gallery-settings',
                        roles: [1, 2, 6]
                    }
                ],
                roles: [1, 2, 6]
            },
            {
                id: 'forms',
                title: 'Forms',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'all-forms',
                        title: 'Forms',
                        type: 'item',
                        url: '/admin/forms/all',
                        roles: [1, 2, 4, 5]
                    }, {
                        id: 'add-form',
                        title: 'New Form',
                        type: 'item',
                        url: '/admin/forms/add',
                        roles: [1, 2, 4, 5]
                    }, {
                        id: 'form-entries',
                        title: 'Entries',
                        type: 'item',
                        url: '/admin/forms/entries',
                        roles: [1, 2, 4, 5]
                    },
                    {
                        id: 'export',
                        title: 'Export',
                        type: 'item',
                        url: '/admin/forms/export',
                        roles: [1, 2, 4, 5]
                    },
                    {
                        id: 'settings',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/forms/settings',
                        roles: [1]
                    }
                ],
                roles: [1, 2, 4, 5]
            }, {
                id: 'fields',
                title: 'Fields',
                type: 'collapsable',
                icon: 'edit_attributes',
                children: [
                    {
                        id: 'all-fields',
                        title: 'All Fields',
                        type: 'item',
                        url: '/admin/fields/list'
                    }, {
                        id: 'add-fields',
                        title: 'Add Fields',
                        type: 'item',
                        url: '/admin/fields/add'
                    }, {
                        id: 'fields-import',
                        title: 'Import',
                        type: 'item',
                        url: '/admin/fields/import'
                    }
                ],
                roles: [1]
            },
            {
                id       : 'calendar_generator',
                title    : 'Calendar Generator',
                type     : 'collapsable',
                icon     : 'edit_attributes',
                children :[
                    {
                        id       : 'calendar-generator',
                        title    : 'Calendar Generator',
                        type     : 'item',
                        url      : '/admin/calendar-generator',
                        roles    : [1,2,3]
                    },{
                        id       : 'calendar-list',
                        title    : 'Calendar Generator List',
                        type     : 'item',
                        url      : '/admin/calendar-list',
                        roles    : [1,2,3]
                    },{
                        id       : 'calendar-settings',
                        title    : 'Settings',
                        type     : 'item',
                        url      : '/admin/calendar_generator/settings',
                        roles    : [1]
                    }
                ],
                roles    : [1,2,3]
            },
            {
                id: 'digital-signage',
                title: 'Digital Signage',
                type: 'item',
                icon: 'tv',
                url: '/digisign',
                openInNewTab: true,
                roles: [1, 2, 3, 16]
            }, {
                id: 'dining-reservation',
                title: 'Dining Reservation',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'dining-reservation-services',
                        title: 'Services',
                        type: 'item',
                        url: '/admin/dining-reservation/services/list'
                    },
                    {
                        id: 'dining-reservation-bookings',
                        title: 'Bookings',
                        type: 'item',
                        url: '/admin/dining-reservation/bookings/list'
                    },
                    {
                        id: 'dining-reservation-dashboard',
                        title: 'Reservations',
                        type: 'item',
                        url: '/admin/dining-reservation/dashboard'
                    },
                    {
                        id: 'dining-reservation-setting',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/dining-reservation/settings'
                    }
                ],
                // roles    : [1,2,4] 
                roles: [0]
            }, {
                id: 'fitness-reservation',
                title: 'Fitness Reservation',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'appointment-booking-dashboard',
                        title: 'Dashboard',
                        type: 'item',
                        url: '/admin/fitness-reservation/dashbord'
                    },

                    {
                        id: 'appointment-booking-services',
                        title: 'Services',
                        type: 'item',
                        url: '/admin/fitness-reservation/services/list'
                    },
                    {
                        id: 'appointemnt-booking-bookings',
                        title: 'Bookings',
                        type: 'item',
                        url: '/admin/fitness-reservation/bookings/list'
                    },
                    {
                        id: 'appointment-booking-setting',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/fitness-reservation/settings'
                    },
                ],
                roles: [45, 1, 2]
            },
            {
                id: 'restaurant-reservations',
                title: 'Restaurant Reservations',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'restaurant-reservations-bookings',
                        title: 'Reservations',
                        type: 'item',
                        url: '/admin/restaurant-reservations/dashboard'
                    },
                    {
                        id: 'restaurant-reservations-services',
                        title: 'Services',
                        type: 'item',
                        url: '/admin/restaurant-reservations/services/list'
                    },
                    {
                        id: 'restaurant-reservations-bookings',
                        title: 'Bookings',
                        type: 'item',
                        url: '/admin/restaurant-reservations/bookings/list'
                    },
                    {
                        id: 'restaurant-reservations',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/restaurant-reservations/settings'
                    }
                ],
                //roles    : [45,1,2,4]
                roles: [0]
            },
            {
                id: 'meeting-room',
                title: 'Meeting Room',
                type: 'collapsable',
                icon: 'description',
                children: [


                    {
                        id: 'amenities',
                        title: 'Amenities',
                        type: 'item',
                        url: '/admin/meeting-room/amenities/list'
                    },
                    {
                        id: 'room-layout',
                        title: 'Room Layout',
                        type: 'item',
                        url: '/admin/meeting-room/room-layout/list'
                    },
                    {
                        id: 'meeting-room-rooms',
                        title: 'Rooms',
                        type: 'item',
                        url: '/admin/meeting-room/rooms/list'
                    },
                    {
                        id: 'services',
                        title: 'Services',
                        type: 'item',
                        url: '/admin/meeting-room/services/list'
                    },
                    {
                        id: 'dashboard',
                        title: 'Dashboard',
                        type: 'item',
                        url: '/admin/meeting-room/dashboard'
                    },
                    {
                        id: 'meeting-room-booking',
                        title: 'Booking',
                        type: 'item',
                        url: '/admin/meeting-room/booking/list'
                    },
                    {
                        id: 'meeting-room-setting',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/meeting-room/settings'
                    }
                ],
                //roles    : [45,1,2,4]
                roles: [0]
            },
            {
                id: 'post-SMTP',
                title: 'Post SMTP',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'smtp-settings',
                        title: 'SMTP Settings',
                        type: 'item',
                        url: '/admin/settings/smtp'
                    },
                    {
                        id: 'email-log',
                        title: 'Email Log',
                        type: 'item',
                        url: '/admin/email-log/list'
                    },
                ],
                roles: [45, 1]
            }, {
                id: 'guest-room',
                title: 'Guest Room Reservations',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'guest-room-reservation',
                        title: 'Reservation',
                        type: 'item',
                        url: '/admin/guest-room/reservation'
                    },
                    {
                        id: 'guest-room-setting',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/guest-room/settings'
                    },
                    {
                        id: 'booking',
                        title: 'Bookings',
                        type: 'collapsable',
                        icon: 'description',
                        children: [
                            {
                                id: 'booking list',
                                title: 'Bookings List',
                                type: 'item',
                                url: '/admin/guest-room/booking/list'
                            },
                            {
                                id: 'calendar',
                                title: 'Calendar',
                                type: 'item',
                                url: '/admin/guest-room/booking/guest-room-calendar'

                            },
                            {
                                id: 'invoices',
                                title: 'Invoices',
                                type: 'item',
                                url: 'admin/guest-room/room/invoices/lists'

                            },

                        ]

                    },
                    {
                        id: 'report',
                        title: 'Report',
                        type: 'item',
                        url: '/admin/guest-room/report'

                    },

                    {
                        id: 'guest-room-room',
                        title: 'Room',
                        type: 'collapsable',
                        icon: 'description',
                        children: [
                            {
                                id: 'guest-room-building',
                                title: 'Building',
                                type: 'item',
                                url: '/admin/guest-room/building/list'
                            },
                            {
                                id: 'guest-room-list',
                                title: 'Rooms',
                                type: 'item',
                                url: '/admin/guest-room/list'
                            }, {
                                id: 'guest-room-extras',
                                title: 'Extras',
                                type: 'item',
                                url: '/admin/guest-room/room/extras/lists'
                            },
                            {
                                id: 'guest-room-unavailable',
                                title: 'Unavailable',
                                type: 'item',
                                url: '/admin/guest-room/unavailable/list'
                            },
                            {
                                id: 'guest-room-price',
                                title: 'Prices',
                                type: 'item',
                                url: '/admin/guest-room/add-price'
                            },
                            {
                                id: 'guest-room-limit',
                                title: 'Limits',
                                type: 'item',
                                url: 'admin/guest-room/room/limit/lists'
                            },


                        ],
                    },
                    {
                        id: 'guest-room-discount',
                        title: 'Discount',
                        type: 'collapsable',
                        icon: 'description',
                        children: [
                            {
                                id: 'guest-room-discount',
                                title: 'Package',
                                type: 'item',
                                url: '/admin/guest-room/package/list'
                            },
                            {
                                id: 'guest-room-free-night',
                                title: 'Free Night',
                                type: 'item',
                                url: '/admin/guest-room/free-night/list'
                            },
                            {
                                id: 'guest-room-promo-code',
                                title: 'Promo Code',
                                type: 'item',
                                url: '/admin/guest-room/promo-code/list'
                            },

                        ],
                    },
                ],
                roles: [45, 1, 2,5]
            },
            // {
            //     id       : 'food-reservation',
            //     title    : 'To Go Orders',
            //     type     : 'collapsable',
            //     icon     : 'description',
            //     children :[
            //         {
            //             id       : 'food-reservation-location',
            //             title    : 'Location',
            //             type     : 'item',
            //             url      : '/admin/food-reservation/location/list'
            //         },
            //         {
            //             id       : 'food-reservation-menu',
            //             title    : 'Menu',
            //             type     : 'collapsable',
            //             icon     : 'description',
            //             children :[
            //                 {
            //                     id       : 'food-reservation-extras',
            //                     title    : 'Extras',
            //                     type     : 'item',
            //                     url      : '/admin/food-reservation/menu/extras/list'
            //                 },
            //                 {
            //                     id       : 'food-reservation-categories',
            //                     title    : 'Categories',
            //                     type     : 'item',
            //                     url      : '/admin/food-reservation/menu/categories/list'
            //                 },
            //                 {
            //                     id       : 'food-reservation-sidedish',
            //                     title    : 'Side Dish',
            //                     type     : 'item',
            //                     url      : '/admin/food-reservation/menu/sidedish/list'
            //                 },
            //                 {
            //                     id       : 'food-reservation-product',
            //                     title    : 'Product',
            //                     type     : 'item',
            //                     url      : '/admin/food-reservation/menu/product/list'
            //                 },
            //             ],
            //         }, 
            //         {
            //             id       : 'food-reservation-setting',
            //             title    : 'Settings',
            //             type     : 'item',
            //             url      : '/admin/food-reservation/settings'
            //         },
            //         {
            //             id       : 'food-reservation-setting',
            //             title    : 'Orders',
            //             type     : 'item',
            //             url      : '/admin/food-reservation/orders/orders-list'
            //         },
            //         {
            //             id       : 'food-reservation-dashboard',
            //             title    : 'Dashboard',
            //             type     : 'item',
            //             url      : '/admin/food-reservation/dashboard'
            //         }

            //     ],
            //     roles    : [1,2,4]
            // },
            {
                id: 'rotating-menu',
                title: 'Rotating Menu',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'all-rotating-menu',
                        title: 'All Rotating Menu',
                        type: 'item',
                        url: '/admin/all-rotating-menu/list'
                    },
                    {
                        id: 'rotating-menu-settings',
                        title: 'Rotating Menu Settings',
                        type: 'item',
                        url: '/admin/rotating-menu/setting'
                    },

                ],
                roles: [0]
            },
            {
                id: 'activity-log',
                title: 'Activity Log',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'log-list',
                        title: 'All Log',
                        type: 'item',
                        url: '/admin/activity-log/list'
                    },
                    {
                        id: 'settings',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/activity-log/settings'
                    },

                ],
                roles: [1,2]
            },
            {
                id: 'page-builder',
                title: 'Pages',
                type: 'collapsable',
                icon: 'description',
                children: [
                    {
                        id: 'all-pages',
                        title: 'All Pages',
                        type: 'item',
                        url: '/admin/pages/list'
                    },
                    {
                        id: 'add-page',
                        title: 'Add New',
                        type: 'item',
                        url: '/admin/pages/add'
                    }
                ],
                roles: [1, 2, 7]
            }
        ],
        roles: [1, 2, 3, 4, 7, 5]
    }, {
        id: 'resources',
        title: 'Resources',
        type: 'group',
        children: [
            {
                id: 'users',
                title: 'Users',
                type: 'collapsable',
                icon: 'person',
                children: [
                    {
                        id: 'all-users',
                        title: 'All Users',
                        type: 'item',
                        url: '/admin/users/list',
                        roles: [1, 2, 6]
                    },
                    {
                        id: 'add-user',
                        title: 'Add User',
                        type: 'item',
                        url: '/admin/users/add',
                        roles: [1, 2, 6]
                    },
                    {
                        id: 'users-roles',
                        title: 'Roles',
                        type: 'item',
                        url: '/admin/roles/list',
                        roles: [1]
                    },
                    {
                        id: 'users-interests',
                        title: 'Interests',
                        type: 'item',
                        url: '/admin/users/interests/list',
                        roles: [1]
                    },
                    {
                        id: 'users-commitee',
                        title: 'Commitees',
                        type: 'item',
                        url: '/admin/users/commitees/list',
                        roles: [1]
                    },
                    {
                        id: 'users-settings',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/users/settings',
                        roles: [1]
                    }
                ],
                roles: [1, 2, 6]
            },
            {
                id: 'staff',
                title: 'Staff',
                type: 'collapsable',
                icon: 'person_pin',
                children: [
                    {
                        id: 'all-staffs',
                        title: 'All Staff',
                        type: 'item',
                        url: '/admin/staff/list'
                    },
                    {
                        id: 'add-staff',
                        title: 'Add Staff',
                        type: 'item',
                        url: '/admin/staff/add',
                        roles: [1, 2, 6]
                    }, {
                        id: 'departments',
                        title: 'Departments',
                        type: 'item',
                        url: '/admin/departments/list',
                        roles: [1, 2, 6]
                    }, {
                        id: 'title',
                        title: 'Title',
                        type: 'item',
                        url: '/admin/title/list',
                        roles: [1, 2, 6]
                    }, {
                        id: 'staff-settings',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/staff/settings',
                        roles: [1]
                    }
                ],
                roles: [1, 2, 6]
            }
        ],
        roles: [1, 2, 6]

    }, {
        id: 'uploads',
        title: 'Uploads',
        type: 'group',
        children: [
            {
                id: 'media',
                title: 'Media',
                type: 'collapsable',
                icon: 'perm_media',
                children: [
                    {
                        id: 'media-library',
                        title: 'Media Library',
                        type: 'item',
                        url: '/admin/media/library',
                        roles: [1, 2]
                    }, {
                        id: 'add-media',
                        title: 'Add Media',
                        type: 'item',
                        url: '/admin/media/add',
                        roles: [1, 2]
                    }
                ],
                roles: [1, 2]
            },
            {
                id: 'file-uploader',
                title: 'File Uploader',
                type: 'collapsable',
                icon: 'cloud_upload',
                children: [
                    {
                        id: 'files-library',
                        title: 'Files Library',
                        type: 'item',
                        url: '/admin/files/library',
                        roles: [1, 2, 3, 4, 7]
                    }, {
                        id: 'add-doc-categories',
                        title: 'Add Categories',
                        type: 'item',
                        url: '/admin/files/categories/list',
                        roles: [1, 2, 3, 4, 7]
                    }, {
                        id: 'doc-settings',
                        title: 'Settings',
                        type: 'item',
                        url: '/admin/files/settings',
                        roles: [1]
                    }
                ],
                roles: [1, 2, 3, 4, 7]
            }
        ],
        roles: [1, 2, 3, 4, 7]
    },
    {
        id: 'appearance',
        title: 'Site Appearance',
        type: 'group',
        children: [
            {
                id: 'menus',
                title: 'Menus',
                type: 'collapsable',
                icon: 'calendar_view_day',
                children: [
                    {
                        id: 'menu-list',
                        title: 'Menu List',
                        type: 'item',
                        url: '/admin/menus/list',
                        roles: [1]
                    }, {
                        id: 'add-menus',
                        title: 'Add Menus',
                        type: 'item',
                        url: '/admin/menus/add',
                        roles: [1]
                    }
                ],
                roles: [1]
            },
            {
                id: 'site-settings',
                title: 'Settings',
                type: 'collapsable',
                icon: 'perm_data_setting',
                children: [
                    {
                        id: 'general-settings',
                        title: 'General Settings',
                        type: 'item',
                        url: '/admin/settings/general',
                        roles: [1]
                    }, {
                        id: 'home-settings',
                        title: 'Home Settings',
                        type: 'item',
                        url: '/admin/settings/home',
                        roles: [1]
                    }, {
                        id: 'export-settings',
                        title: 'Export Settings',
                        type: 'item',
                        url: '/admin/settings/export',
                        roles: [1]
                    },
                    {
                        id: 'theme-settings',
                        title: 'Theme Settings',
                        type: 'item',
                        url: '/admin/settings/theme',
                        roles: [1]
                    }
                    //{
                    //     id       : 'permissions-settings',
                    //     title    : 'Permissions Settings',
                    //     type     : 'item',
                    //     url      : '/admin/settings/permissions',
                    //     roles    : [1]
                    // }
                ],
                roles: [1]
            }, {
                id: 'bulletin-board',
                title: 'Forums',
                type: 'collapsable',
                icon: 'message',
                children: [
                    {
                        id: 'all-forums',
                        title: 'All Forums',
                        type: 'item',
                        url: '/admin/forums/all',
                        roles: [1, 2, 7]
                    },
                    {
                        id: 'new-forum',
                        title: 'New Forum',
                        type: 'item',
                        url: '/admin/forums/add',
                        roles: [1, 2, 7]
                    },
                    {
                        id: 'all-topics',
                        title: 'All Topics',
                        type: 'item',
                        url: '/admin/forums/topics/all',
                        roles: [1, 2, 7]
                    },
                    {
                        id: 'new-topic',
                        title: 'New Topic',
                        type: 'item',
                        url: '/admin/forums/topics/add',
                        roles: [1, 2, 7]
                    },
                    {
                        id: 'all-replies',
                        title: 'All Replies',
                        type: 'item',
                        url: '/admin/forums/replies/all',
                        roles: [1, 2, 7]
                    },
                    {
                        id: 'new-reply',
                        title: 'New Reply',
                        type: 'item',
                        url: '/admin/forums/replies/add',
                        roles: [1, 2, 7]
                    }
                ],
                roles: [1, 2, 7]
            },
            {
                id: 'import',
                title: 'Imports',
                type: 'collapsable',
                icon: 'import_export',
                children: [
                    {
                        id: 'user-import',
                        title: 'User Import',
                        type: 'item',
                        url: '/admin/imports/user',
                        roles: [1]
                    }, {
                        id: 'staff-import',
                        title: 'Staff Import',
                        type: 'item',
                        url: '/admin/imports/staff',
                        roles: [1]
                    },
                    {
                        id: 'event-import',
                        title: 'Event Import',
                        type: 'item',
                        url: '/admin/settings/event',
                        roles: [1]
                    }
                ],
                roles: [1]
            },
        ],
        roles: [1, 2, 7]
    },

];