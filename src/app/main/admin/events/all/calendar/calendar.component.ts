import { Component, OnInit, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { ComponentFactoryResolver, ApplicationRef } from '@angular/core';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import * as moment from 'moment';  

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Subject, merge } from 'rxjs';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';
import { EventcalendarService, LocationService, CommonService, SettingsService, FieldsService, AuthService,OptionsList,EventcategoryService,EventsService} from 'app/_services';
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
import { filter } from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AdminCalendarComponent implements OnInit {

    options: CalendarOptions;
    ShowMetaFilters: string ='N';
    eventsModel: any;
    public defaultView: string = 'dayGridWeek';
    events: any[] = [];
    public displayView: string = '';
    public Startdate: string = '';
    //getting the calendar api
    private calendarApi;;
    @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
    public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};

    public EventSettings       : any = {};
    public RegbackgroundColor  : string = '#000';
    public RegborderColor      : string = '#fff';
    public localEventSettings  : any;
    public UserInfo            : any ={};
    public refresh             : Subject<any> = new Subject();
    public locations           : any = [];
    public filterForm          : FormGroup;
    public MetaFilters         : any[]=[]; 
    pauseForm                  : boolean = true;
    StatusList                 : any;
    public months              : any = {}
    YearsList                  : any[]=[];
    EventMetaFields            : any[]=[];
    public categories          : any[] = [];
    public subcategories          : any[] = [];
    public Category_Calendar_list          : any[] = [];
    calendarSlug               : string =''; 
    displaySlug                : string =''; 
    // Private
    private _unsubscribeAll: Subject<any>;
    filterParams: Object={month:moment().month()+1,year:moment().year()};
    eventDetails: MatDialogRef<ModalEventComponent>; //EXTRA Changes  

    constructor(
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected appRef                : ApplicationRef,
        protected injector              : Injector,
        public _matDialog               : MatDialog,
        private _formBuilder            : FormBuilder,
        private authenticationService   : AuthService,
        private _commonService          : CommonService,
        private _eventService           : EventsService,
        private _locationService        : LocationService,
        private _calendarService        : EventcalendarService,
        private _eventCategoryService   : EventcategoryService,
        private _settingService         : SettingsService,
        private route                   : ActivatedRoute){

         // Set the private defaults
        this._unsubscribeAll = new Subject();   
        this.calendarSlug =  this.route.params && this.route.params['value'].slug ? this.route.params['value'].slug : '';
        this.displaySlug  =  this.calendarSlug!=='' ? this.calendarSlug.replace('-',' ') :'';  
        //call get events list function
        this.route.params
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(params => {
            this.calendarSlug  = params && params['slug'] ? params['slug'] : '';
            if(this.calendarSlug!==''){
                this.displaySlug    = this.calendarSlug.replace('-',' ');
            }
        });  
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit()
    {
        console.log("slug",this.calendarSlug);
        //EventSettings
        const eventsettings         = this._settingService.setting;
        this.EventSettings          = CommonUtils.getStringToJson(eventsettings.settingsinfo.meta_value);
        this.EventSettings          = this.EventSettings.length>0 ? this.EventSettings[0] : {};
        //Registration Required Colors
        this.RegbackgroundColor = this.EventSettings.calender_settings.registration_require_bgcolor || '#000000';
        this.RegborderColor     = this.EventSettings.calender_settings.registration_require_bgcolor || '#ffffff';
  
        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        
        
        // console.log("EventSetting",this.EventSettings.calender_settings.special_event)
        // this.localEventSettings = this._commonService.getLocalSettingsJson('event-settings');
        
        //GET USERINFO
        this.UserInfo             = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
        this.StatusList           = OptionsList.Options.tables.status.eventstatus;
        this.months               = OptionsList.Options.months;
        this.YearsList            = CommonUtils.getSelectYears(5,true);

        this._eventCategoryService.getCategory({'category_type':'ECL','column':'category_name','status':'A','direction':'asc'}).then(res=>{
            this.Category_Calendar_list = res.data;
        })
       
        // FullCalendar Settings
        this.options = {
            initialView:this.defaultView,
            initialEvents:this.events,
            editable: false,
            events:this.events,
            defaultAllDay: false,
            showNonCurrentDates:true,
            fixedWeekCount:false,
            displayEventTime: false,
            eventDisplay: 'block',
            eventTimeFormat:this.defaultDateTimeFormat.time_format,
            contentHeight:"auto",
            handleWindowResize : true,
            stickyFooterScrollbar : true,
            height:'100%', 
            themeSystem: 'standard',
            //dayMaxEvents:5,
            noEventsContent: "",
            plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
            headerToolbar: {
                left:   'prev,next today',
                center: 'title',
                right:  'dayGridMonth,dayGridWeek,dayGridDay,listMonth'
            },
            eventDidMount: this.showEventToolTip.bind(this),
            eventClick: this.showEventDetails.bind(this),
            datesSet: this.handleDatesRender.bind(this)
        };
        
        //GET CATEGORIES FOR FILTERING
        this._eventCategoryService.getCategory({'category_type':'C','status':'A','slug':this.calendarSlug}).then(response=>{
            if(response.data.length>0){
                this.categories = response.data;
            }
        });
        this._eventCategoryService.getCommonCategory({'category_type':'C','status':'A'}).then(response=>{
            if(response.data.length>0){
                this.subcategories = response.data;
            }
        });
        
        
        //Declare Filter Form
        this.filterForm = this._formBuilder.group({
            searchKey              : [''],
            //event_location         : [''],
           // event_start_date       : [''],
            calendar_id            : [''],
            categories             : [''],
            subcategories          : [''], 
            selectfields           : [1],
            display                : [''],
            print                  : ['0'],
            status                 : [''],
            date                   : [''],
            month                  : [''],
            year                   : [''],
            special_event          : [''],
            metafields             : [[]]
        });

        //Get Event MetaFields
        this._eventService.getEventMetaFields({field_form_type:'E'}).subscribe(metaInfo=>{
            this.EventMetaFields  = metaInfo.data || [];
            //IF MetaFields Not Empty Then add it To FormGroup
            if(this.EventMetaFields.length>0){
                //Convert string content to Array
                this.EventMetaFields.map(metafield=>{
                    if(metafield.field_content){
                        metafield['field_content'] = JSON.parse(metafield.field_content);
                    }
                    return metafield;
                });
                this.createMetaFormFields();
            }
            else{
                this.pauseForm = false;
            }
        });
       
        //DETECT CHANGES IN FILTERS AND CALL EVENT LIST API
        merge(this.filterForm.valueChanges)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{
            let value = this.filterForm.value;
            this.filterParams = CommonUtils.getFilterJson('','',this.filterForm.value);
            
            this.filterParams['user_id'] = this.UserInfo.id || '';
            this.filterParams['role_id'] = this.UserInfo && this.UserInfo.user_roles ? this.UserInfo.user_roles.role_id : 0;
            this.filterParams['front']   = 1; //To Diffrentiate api call
            
            this.filterParams['event_start_date'] = value.event_start_date ? this._commonService.getDateFormat(value.event_start_date) : '';
            this.filterParams['special_event']    = value.special_event;
            this.filterParams['disp_req_register']   = 'N'; //get Only register required events
            this.filterParams['slug']               = this.calendarSlug || '';
            this.setEvents(this.filterParams);
                
        });
    }
    ngAfterViewChecked() {
        this.calendarApi = this.fullcalendar.getApi();
    }

     //Declare Form Group
    createMetaFormFields(){
        if(this.filterForm){
            this.EventMetaFields.forEach(metaField=>{
                this.filterForm.addControl(metaField.id,new FormControl('',[]));
            });
            this.pauseForm = false;
        }
    } 
    /**
     * get events
     */
    setEvents(filter): void
    {
        //Get  Events
        if(this.filterForm && this.filterForm.get('print').value==0){
            this._calendarService.getEvents(filter).then(events =>{
                if(events.data && events.data.length>0){
                    let regColors = {regBgColor:this.RegbackgroundColor,regBorderColor:this.RegborderColor};
                    this.events = events.data.map(item => {
                        return new CalendarEventModel(item,regColors);
                    });
                    this.calendarApi = this.fullcalendar.getApi();
                    if(this.calendarApi!=null){
                        this.setEventsArray(this.events);        
                    }
                }
                else{
                    this.events = [];
                    this.calendarApi = this.fullcalendar.getApi();
                    if(this.calendarApi!=null){
                        this.setEventsArray(this.events);        
                    }
                }
            });
        } //PRINT CALENDAR
        else if(this.filterForm && this.filterForm.get('print').value=='1'){ 
            filter['slug'] = this.calendarSlug || '';
            this._calendarService.printEventsCalendar(filter);
            this.filterForm.get('print').setValue('0');
        }
        
    }
    //SET EVENTS INTO CALENDAR OPTIONS
    setEventsArray(eventArray:any[]=[]){
        let calendarOptions = Object.assign({}, this.options);
        calendarOptions.events = [...eventArray];
        this.options = Object.assign({}, calendarOptions);;
    }
    //EVENT SHOW ON MODAL POPUP
    showEventToolTip($event:any){
        if($event.view.type=='listMonth'){
            $event.el.querySelector('.fc-list-event-graphic span.fc-list-event-dot').remove();
            let eventTitle =  $event.el.querySelector('.fc-list-event-title');
            //prpend event time
            if($event.event.extendedProps.event_start_time){
                const eventTime = moment($event.event.extendedProps.event_start_date).format(this.defaultDateTimeFormat.time_format)+' - ';
                eventTitle.prepend(eventTime.toUpperCase());
            }
            //append event location
            if($event.event.extendedProps.eventlocation && $event.event.extendedProps.eventlocation.category_name){
                const location = '('+$event.event.extendedProps.eventlocation.category_name+')';
                eventTitle.append(location);
            }
            if ($event.event.extendedProps.status=='C') {
                eventTitle.append('-CANCELLED');
            }
        }
        //If View Is List Return false
        //if($event.view.type=='listMonthDisabled'){
        if($event.view.type!=='listMonth'){
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
    showEventDetails($event:any){
    this.eventDetails = this._matDialog.open(ModalEventComponent, {
        disableClose: false,
        panelClass: 'event-details-dialog'
    });
    this.eventDetails.componentInstance.eventInfo = $event;
    this.eventDetails.componentInstance.eventSettings = this.EventSettings;
    this.eventDetails.afterClosed()
        .subscribe(result => {
            if ( result ){
            }
        });
    }
    //PRINT CALENDAR IN PDF FORMAT WITH FILTERS APPLIED
    printCalendar(){
        this.filterForm.get('print').setValue('1');
        this.filterForm.get('display').setValue(this.displayView);
        this.filterForm.get('date').setValue(this.Startdate);
    }
    //RESET FILTERS
    resetform(){
        this.filterForm.reset();
        this._commonService.clearMetaFields(1);
        this.ngOnInit();
    }
    //Get Category Ids From Component
    setFormCategoryValues($event){
        if($event){
            this.filterForm.get('categories').setValue($event);
        }
    }
    //SET EXTRA META VALUES ON FILTERS
    setEventMetaFilter($event){
        if($event && $event.length>0){
            this.filterForm.get('metafields').setValue(JSON.stringify($event));
        }
    }
    //Get New Events Monthwise
    handleDatesRender($event){
        this.calendarApi = this.fullcalendar.getApi();
        if(this.calendarApi.view.currentStart){
            this.events = [];
            this.setEventsArray(this.events);
            this.displayView = this.calendarApi.view.type;
            this.Startdate = moment(this.calendarApi.view.currentStart).format('YYYY-MM-DD');

            this.filterParams['user_id'] = this.UserInfo.id || '';
            this.filterParams['role_id'] = this.UserInfo && this.UserInfo.user_roles ? this.UserInfo.user_roles.role_id : 0;
            this.filterParams['front']   = 1; //To Diffrentiate api call
            this.filterParams['disp_req_register']   = 'N'; //get Only register required events
            
            this.filterParams['display'] = this.displayView;
            this.filterParams['date']    = this.Startdate;
            if(this.displayView=='dayGridMonth' || this.displayView=='listMonth'){
                this.filterParams['month']   = moment(this.calendarApi.view.currentStart).month()+1;
                this.filterParams['year']    = moment(this.calendarApi.view.currentStart).year();
            }
            else{
                this.filterParams['month']   = '';
                this.filterParams['year']    = '';
            }
            this.filterParams['slug']               = this.calendarSlug || '';
            this.setEvents(this.filterParams);   
        }
    }
    gotoMonth(){
        if((this.filterForm.get('month').value!=='' && this.filterForm.get('month').value!==undefined) && (this.filterForm.get('year').value!=='' && this.filterForm.get('year').value!==undefined)){
            var formattedMonth = moment(this.filterForm.get('month').value, 'MM').format('MM');
            var formattedYear = moment(this.filterForm.get('year').value, 'YYYY').format('YYYY');
            var formattedDay = moment('01', 'DD').format('DD');
            const gotoDate = moment(formattedYear+'-'+formattedMonth+'-'+formattedDay).format('YYYY-MM-DD');
            this.calendarApi.gotoDate(gotoDate);
        }
        if((this.filterForm.get('month').value!=='' && this.filterForm.get('month').value!==undefined) && (this.filterForm.get('year').value=='' || this.filterForm.get('year').value==undefined)){
            var formattedMonth = moment(this.filterForm.get('month').value, 'MM').format('MM');
            var formattedYear = moment().format('YYYY');
            var formattedDay = moment('01', 'DD').format('DD');
            const gotoDate = moment(formattedYear+'-'+formattedMonth+'-'+formattedDay).format('YYYY-MM-DD');
            this.calendarApi.gotoDate(gotoDate);
        }
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    public returnZero(){
        return 0;
    }
    
}


//this.calendarApi.gotoDate