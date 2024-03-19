import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { OptionsList, EventsService, EventcategoryService, SettingsService, AuthService, CommonService } from 'app/_services';
import { first, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({  
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  animations : fuseAnimations
})
export class EventsComponent implements OnInit {

     // Private
    public UserInfo: any ={};
    private _unsubscribeAll: Subject<any>;
    public categories : any = [];
    public noevents   : boolean = false;  
    filterForm        : FormGroup;
    PaginationOpt     : any ={};
    filterParams      : any = {'page':'0','limit':'10','user_id':'' }  
    events: any       = {data:[], meta:{total:''}};
    calendarSlug      : string = '';  
    showEmptyMsg: boolean = false;
    public EventSettings: any = {event_list_display_settings:{event_display_location:'Y',end_time_display:'Y'}};
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
    public displaySlug: string = 'Event Registrations';

    constructor(
        private route: ActivatedRoute,
        private _fuseConfigService: FuseConfigService,
        private _eventsService:EventsService,
        private _eventCategoryService:EventcategoryService,
        private _formBuilder : FormBuilder,
        private authenticationService: AuthService,
        private _settingService   : SettingsService,
        private _commonService : CommonService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        // Configure the layout
        this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
        if(this.route.routeConfig.path=='event/:slug'){
            this.calendarSlug = this.route.params['value'].slug;
            this.displaySlug  = this.calendarSlug.replace('-',' ');
        }
        if(this.route.routeConfig.path=='events'){
            this.displaySlug  = 'Event Registrations';
        }
    }

    ngOnInit() {
        //call get events list function
        this.route.params
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(params => {
            this.calendarSlug  = params && params['slug'] ? params['slug'] : 'Event Registrations';
            this.displaySlug  = this.calendarSlug.replace('-',' ');
            this.getEventsList();
        });
        //EventSettings
        const eventsettings = this._settingService.setting;
        this.EventSettings  = CommonUtils.getStringToJson(eventsettings.settingsinfo.meta_value);
        this.EventSettings  = this.EventSettings.length>0 ? this.EventSettings[0] : {};
        
        //Deault DateTime Formats
        this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        
        //GET USERINFO
        this.UserInfo             = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
        
        
        //DEFAULT PGINATION OTPIONS FROM OPTIONSLIST JSON
        this.PaginationOpt        = OptionsList.Options.tables.pagination.options;
        //Override Limit Option From Event Settings
        if(this.EventSettings.event_list_display_settings){
            this.PaginationOpt.pageSize = this.EventSettings.event_list_display_settings.events_to_display;
            this.filterParams.limit     = this.EventSettings.event_list_display_settings.events_to_display || this.filterParams.limit;
        }
        //GET CATEGORIES FOR FILTERING
        this.categories = this._eventCategoryService.eventcategory.data;

        //DEFINE FORM FOR CATEGORYLIST
        this.filterForm = this._formBuilder.group({
            categories  : [[]],
            subcategories  : [[]]
        });

        //GET EVENTSLIST BY PAIGNATION AND CATEGORIES
        merge(this.paginator.page,this.filterForm.valueChanges)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(pageresponse=>{
            //ScrollView TO TOP
            document.querySelector('.content-card').scrollIntoView();
            this.filterParams = CommonUtils.getFilterJson('',this.paginator,this.filterForm.value);
            this.getEventsList();            
        });
    }
    ngAfterViewInit(){
        this.getEventsList();
    }
    //GET EVENTS LIST FROM SERVER
    getEventsList(){
        //Get Events From APi as per limit set in settings
        if(this.PaginationOpt.pageSize){
            this.filterParams['limit'] = this.filterParams['limit'] ? this.filterParams['limit'] : this.PaginationOpt.pageSize;
        }
        this.filterParams['disp_req_register']   = 'Y'; //get Only register required events
        this.filterParams['user_id']             = this.UserInfo.id || '';
        this.filterParams['role_id']             = this.UserInfo && this.UserInfo.user_roles ? this.UserInfo.user_roles.role_id : 0;
        this.filterParams['front']               = 1; //To Diffrentiate api call
        this.filterParams['slug']                = this.calendarSlug; //To Diffrentiate api call

        this._eventsService.getEvents(this.filterParams).then(response=>{
            if(response.status==200){
                 response.data.forEach(item=>{                    
                    item.locationColor = {bg_color:'',font_color:''};
                    if(item.eventlocation && item.eventlocation.categories){
                        item.locationColor = {bg_color:item.eventlocation.categories.bg_color,font_color:item.eventlocation.categories.font_color};
                    }
                    //update event start date
                    item.event_check_in = '';
                    if(item.event_start_date && item.event_start_time){
                        item.event_check_in = CommonUtils.getStringToDate(item.event_start_date+' '+item.event_start_time);
                    }
                    //update event start date
                    item.event_check_out = '';
                    if(item.event_end_date && item.event_end_time){
                        item.event_check_out = CommonUtils.getStringToDate(item.event_end_date+' '+item.event_end_time);
                    }
                    //registration_start
                    if(item.registration_start){
                        item.registration_start = CommonUtils.getStringToDate(item.registration_start);
                    }
                    //update event start date
                    if(item.registration_end){
                        item.registration_end = CommonUtils.getStringToDate(item.registration_end);
                    }
                    //multiple locations alter
                    if(item && item.eventlocations && item.eventlocations.length>0 ){
                        let locationsString = item.eventlocations.map(item=>{
                            return item.eventlocation.category_name;
                        });
                        item.eventlocation.category_name = locationsString!=='' && locationsString!==undefined ? locationsString.join(', ') : '';
                    }
                    
                    //return item;
                });
                this.events = response;
                //NO EVENTS MESSAGE
                this.showEmptyMsg = this.events.data.length==0 ? true : false;
            }
            
        });
    }
    //Reset PageIndex On Form Changes
    resetPageIndex(){
        this.filterForm.valueChanges.subscribe(data=>{
            this.paginator.pageIndex = 0;
        });
    }

    //Get Category Ids From Component
    setFormCategoryValues($event){
        if($event){
            this.filterForm.get('categories').setValue($event);
        }
    }

    //Get Sub Category Ids From Component
    setFormSubCategoryValues($event){
        if($event){
            this.filterForm.get('subcategories').setValue($event);
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
}
