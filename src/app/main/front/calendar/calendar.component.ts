import { Component, OnInit, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { ComponentFactoryResolver, ApplicationRef } from '@angular/core';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EventcalendarService, LocationService, CommonService, SettingsService, FieldsService, AuthService, EventbehavioursubService } from 'app/_services';
import { CalendarEventModel } from './event.model';
import { CommonUtils } from 'app/_helpers';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
//FullCalendar Imports
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { GridEventComponent } from 'app/layout/components/events/grid-event/grid-event.component';
//Modal Event Compo
import { ModalEventComponent } from 'app/layout/components/events/modal-event/modal-event.component';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CalendarComponent implements OnInit {

    options: CalendarOptions;
    eventsModel: any;
    events: any[] = [];
    public displayView: string = '';
    public Startdate: string = '';
    public defaultView: string = 'dayGridWeek';
    public eventstype: string = 'all';
    @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
    private calendarApi;
    public myeventCalendar: boolean = false;
    public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
    public EventSettings: any = {};
    public RegbackgroundColor: string = '#000';
    public RegborderColor: string = '#fff';
    public localEventSettings: any;
    public UserInfo: any = {};
    public refresh: Subject<any> = new Subject();
    public locations: any = [];
    public filterForm: FormGroup;
    public MetaFilters: any[] = [];
    public calendarSlug: string = '';
    public displaySlug: string = '';
    // Private
    private _unsubscribeAll: Subject<any>;
    filterParams: Object = { month: moment().month() + 1, year: moment().year() };
    eventDetails: MatDialogRef<ModalEventComponent>; //EXTRA Changes  

    constructor(
        private route: ActivatedRoute,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected appRef: ApplicationRef,
        protected injector: Injector,
        public _matDialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthService,
        private _commonService: CommonService,
        private eventbehavioursub: EventbehavioursubService,
        private _locationService: LocationService,
        private _calendarService: EventcalendarService,
        private _settingService: SettingsService) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
        if (this.route.routeConfig.path == 'my-events/calendar' || this.route.routeConfig.path == 'my-event/calendar/:slug') {
            this.myeventCalendar = true;
            this.defaultView = 'listMonth';
            this.eventstype = 'userevents';
        }
        if (this.route.routeConfig.path == 'calendar/:slug' || this.route.routeConfig.path == 'my-event/calendar/:slug') {
            this.calendarSlug = this.route.params['value'].slug;
            this.displaySlug = this.calendarSlug.replace('-', ' ');
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {
        //EventSettings
        if (this.EventSettings && this.EventSettings.calender_settings) {
            this.EventSettings = this.EventSettings;
        }
        else {
            const eventsettings = this._settingService.setting;
            this.EventSettings = CommonUtils.getStringToJson(eventsettings.settingsinfo.meta_value);
            this.EventSettings = this.EventSettings.length > 0 ? this.EventSettings[0] : this.EventSettings;
        }
        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

        //Registration Required Colors
        this.RegbackgroundColor = this.EventSettings.calender_settings.registration_require_bgcolor || '#000000';
        this.RegborderColor = this.EventSettings.calender_settings.registration_require_bgcolor || '#ffffff';
        //GET USERINFO
        this.UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;

        // FullCalendar Settings
        this.options = {
            initialView: this.defaultView,
            initialEvents: this.events,
            editable: false,
            events: this.events,
            defaultAllDay: false,
            showNonCurrentDates: true,
            fixedWeekCount: false,
            displayEventTime: false,
            eventDisplay: 'block',
            eventTimeFormat: this.defaultDateTimeFormat.time_format,
            contentHeight: "auto",
            height: '100%',
            themeSystem: 'standard',
            //dayMaxEvents:5,
            noEventsContent: "",
            plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay,listMonth'
            },
            eventDidMount: this.showEventToolTip.bind(this),
            eventClick: this.showEventDetails.bind(this),
            datesSet: this.handleDatesRender.bind(this)
        };
        //GET LOCATIONS FILTER
        this._locationService.getLocation({ 'category_type': 'EL', 'status': 'A', 'slug': this.calendarSlug, 'column': 'category_name', 'direction': 'asc' }).then(locations => {
            this.locations = locations.data;
        });

        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey: [''],
            event_location: [''],
            event_start_date: [''],
            categories: [[]],
            subcategories: [[]],
            selectfields: [1],
            display: [''],
            print: ['0'],
            date: [''],
            special_event: [false],
            metafields: [''],
            month: [''],
            year: [''],
            eventstype: [this.eventstype]
        });

        //DETECT CHANGES IN FILTERS AND CALL EVENT LIST API
        merge(this.filterForm.valueChanges)
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(res => {
                let value = this.filterForm.value;
                this.filterParams = CommonUtils.getFilterJson('', '', this.filterForm.value);

                this.filterParams['user_id'] = this.UserInfo.id || '';
                this.filterParams['role_id'] = this.UserInfo && this.UserInfo.user_roles ? this.UserInfo.user_roles.role_id : 0;
                this.filterParams['front'] = 1; //To Diffrentiate api call

                this.filterParams['event_start_date'] = value.event_start_date ? this._commonService.getDateFormat(value.event_start_date) : '';
                this.filterParams['special_event'] = value.special_event == true ? 'Y' : ''
                this.filterParams['disp_req_register'] = 'N'; //get Only register required events
                if (this.calendarApi != null) {
                    this.Startdate = moment(this.calendarApi.view.currentStart).format('YYYY-MM-DD');
                    this.filterParams['date'] = this.Startdate;
                }

                this.setEvents(this.filterParams);
            });

        //call get events list function
        this.route.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(params => {
                this.calendarSlug = params && params['slug'] ? params['slug'] : '';
                this.displaySlug = this.calendarSlug.replace('-', ' ');
                this.setEvents(this.filterParams);
            });

    }

    ngAfterViewInit() {
        this.calendarApi = this.fullcalendar.getApi();
    }
    changeCalendarView() {
        this.calendarApi = this.fullcalendar.getApi();
        this.calendarApi.changeView(this.displayView, new Date(this.filterForm.get('event_start_date').value));
    }
    /**
     * get events
     */
    setEvents(filter): void {
        //Get  Events
        if (this.filterForm && this.filterForm.get('print').value == 0) {
            //set slug of calendar if present
            this.filterParams['slug'] = this.calendarSlug || '';

            this._calendarService.getEvents(filter).then(events => {
                if (events.data && events.data.length > 0) {
                    let regColors = { regBgColor: this.RegbackgroundColor, regBorderColor: this.RegborderColor };
                    this.events = events.data.map(item => {
                        return new CalendarEventModel(item, regColors);
                    });
                    this.calendarApi = this.fullcalendar.getApi();
                    if (this.calendarApi != null) {
                        this.setEventsArray(this.events);
                    }
                }
                else {
                    this.events = [];
                    this.calendarApi = this.fullcalendar.getApi();
                    if (this.calendarApi != null) {
                        this.setEventsArray(this.events);
                    }
                }
            });
        } //PRINT CALENDAR
        else if (this.filterForm && this.filterForm.get('print').value == '1') {
            //set slug of calendar if present
            filter['slug'] = this.calendarSlug || '';
            this._calendarService.printEventsCalendar(filter);
            this.filterForm.get('print').setValue('0');
        }
    }
    //SET EVENTS INTO CALENDAR OPTIONS
    setEventsArray(eventArray: any[] = []) {
        let calendarOptions = Object.assign({}, this.options);
        calendarOptions.events = [...eventArray];
        this.options = Object.assign({}, calendarOptions);;
    }
    //EVENT SHOW ON MODAL POPUP
    showEventToolTip($event: any) {
        if ($event.view.type == 'listMonth') {
            $event.el.querySelector('.fc-list-event-graphic span.fc-list-event-dot').remove();
            let eventTitle = $event.el.querySelector('.fc-list-event-title');
            //prpend event time
            if ($event.event.extendedProps.event_start_time) {
                const eventTime = moment($event.event.extendedProps.event_start_date).format(this.defaultDateTimeFormat.time_format) + ' - ';
                eventTitle.prepend(eventTime.toUpperCase());
            }
            //append event location
            if ($event.event.extendedProps.eventlocation && $event.event.extendedProps.eventlocation.category_name) {
                const location = '(' + $event.event.extendedProps.eventlocation.category_name + ')';
                eventTitle.append(location);
            }
            if ($event.event.extendedProps.status == 'C') {
                eventTitle.append('-CANCELLED');
            }
        }
        //If View Is List Return false
        //if($event.view.type=='listMonthDisabled'){
        if ($event.view.type !== 'listMonth') {
            $event.el.querySelector('.fc-event-title-container').remove();
            let myElementContainer = new DomPortalHost(
                $event.el.querySelector('.fc-event-main-frame'),
                this.componentFactoryResolver,
                this.appRef,
                this.injector);
            const componentRef = myElementContainer.attach(new ComponentPortal(GridEventComponent));
            componentRef.instance.eventInfo = $event;
            componentRef.instance.eventSettings = this.EventSettings;
            componentRef.changeDetectorRef.detectChanges();
        }
    }
    //SHOW EVENT MODAL WINDOW    
    showEventDetails($event: any) {
        this.eventDetails = this._matDialog.open(ModalEventComponent, {
            disableClose: false,
            panelClass: 'event-details-dialog'
        });
        this.eventDetails.componentInstance.eventInfo = $event;
        this.eventDetails.componentInstance.eventSettings = this.EventSettings;
        this.eventDetails.afterClosed()
            .subscribe(result => {
                if (result) {
                }
            });
    }
    //PRINT CALENDAR IN PDF FORMAT WITH FILTERS APPLIED
    printCalendar() {
        this.filterForm.get('print').setValue('1');
        this.filterForm.get('display').setValue(this.displayView);
        this.filterForm.get('date').setValue(this.Startdate);
        //Set Month And year
        this.filterForm.get('month').setValue(this.filterParams['month']);
        this.filterForm.get('year').setValue(this.filterParams['year']);


    }
    //RESET FILTERS
    resetform() {
        this.filterForm.reset();
        this.eventbehavioursub.clearMetaFields.next(1);
        this.ngOnInit();
        document.getElementById('resetcalendar').blur();
    }
    //Get Category Ids From Component
    setFormCategoryValues($event) {
        if ($event) {
            this.filterForm.get('categories').setValue($event);
        }
    }
    //Get Sub Category Ids From Component
    setFormSubCategoryValues($event) {
        if ($event) {
            this.filterForm.get('subcategories').setValue($event);
        }
    }
    //SET EXTRA META VALUES ON FILTERS
    setEventMetaFilter($event) {
        if ($event && $event.length > 0) {
            this.filterForm.get('metafields').setValue(JSON.stringify($event));
        }
    }
    //Get New Events Monthwise
    handleDatesRender($event) {
        this.calendarApi = this.fullcalendar.getApi();
        if (this.calendarApi.view.currentStart) {
            this.events = [];
            this.setEventsArray(this.events);
            this.displayView = this.calendarApi.view.type;
            this.Startdate = moment(this.calendarApi.view.currentStart).format('YYYY-MM-DD');

            this.filterParams['user_id'] = this.UserInfo.id || '';
            this.filterParams['eventstype'] = this.eventstype;
            this.filterParams['role_id'] = this.UserInfo && this.UserInfo.user_roles ? this.UserInfo.user_roles.role_id : 0;
            this.filterParams['front'] = 1; //To Diffrentiate api call
            this.filterParams['disp_req_register'] = 'N'; //get Only register required events

            this.filterParams['display'] = this.displayView;
            this.filterParams['date'] = this.Startdate;
            this.filterParams['event_start_date'] = this.filterForm.get('event_start_date').value !== '' ? this.filterForm.get('event_start_date').value : '';
            if (this.displayView == 'dayGridMonth' || this.displayView == 'listMonth') {
                this.filterParams['month'] = moment(this.calendarApi.view.currentStart).month() + 1;
                this.filterParams['year'] = moment(this.calendarApi.view.currentStart).year();
            }
            else {
                this.filterParams['month'] = '';
                this.filterParams['year'] = '';
            }
            this.setEvents(this.filterParams);
        }
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}


