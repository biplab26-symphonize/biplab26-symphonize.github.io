import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService, RolesService, SettingsService, EventsService, CategoryService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import moment from 'moment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
  public addEventSetting : FormGroup;
  public papersize: any = [];
  public EventMetaFields: any[] = [];
  public CategorysList: any[] = [];
  public orientation :any = [];
  public RoleList: any=[];
  public event_List:any = [5,10,15,20,25,30,35,40,45,50];
  public EventSettingsData:any = [];
  public EventAttendeeFields:any = [];

  public tinyMceSettings = {
    base_url: '/tinymce', // Root for resources
    suffix: '.min',
    plugins: 'link insertdatetime paste code',
    menubar:false,
    statusbar: false,
    paste_as_text:true,
    fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
    toolbar:'fontsizeselect | fontselect | formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | pastetext undo redo code',
    font_formats: 'Roboto=Roboto,sans-serif;Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Book Antiqua=book antiqua,palatino,serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,palatino,serif;Helvetica=helvetica,arial,sans-serif;Impact=impact,sans-serif;sans-serif=sans-serif,sans-serif',
    content_css: [
      
    ],
    setup : function(ed) {
      ed.on('init', function (ed) {
        //ed.target.editorCommands.execCommand("fontName", false, "");
      });
    }
    };

    readonly EDITOR_TAB = 4;
    activeTabIndex: number;
  constructor(
      private fb : FormBuilder,
      private _commonService : CommonService,
      private _categoryService: CategoryService,
      private _eventService  : EventsService, 
      private _matSnackBar : MatSnackBar,
      private _rolesService : RolesService,
      private _settingService : SettingsService
  ) 
  { 
  }

  ngOnInit() {
    //Get Event MetaFields to show on list filters
    this.getEventMetaFields();
    //GET CATEGORIES LIST 
    this.getCategories();
    this.setControls();
    this.getPrintOptionsCommonList();
    let response = this._settingService.setting;
    this.getEventSettingData(response);
    //this.addEventSetting.patchValue(response);
  }

  isEditorTab() {
    return this.activeTabIndex === this.EDITOR_TAB;
  }

  handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
  }
  setControls()
  {
    this.RoleList         = this._rolesService.roles.data; 

    this.addEventSetting = this.fb.group({	

      //event_id                    : this.fb.control(null),
      default_datetime_format     : this.fb.control(''),
      allday_start_time           : this.fb.control(''),
      allday_end_time             : this.fb.control(''),
      notifyadmin                 : this.fb.control(''),
      adminroles                  : this.fb.control(''),
      defaultemail                : this.fb.control(''),
      defaultname                 : this.fb.control(''),
      exportattendeefields        : this.fb.control(''),
      event_delete_notification    : this.fb.control('Y'),

      // Event Category Settings
      category_description_when_listing : this.fb.control(''),
      display_on_registration           : this.fb.control(''),
      display_on_calender               : this.fb.control(''),
      event_background_color            : this.fb.control(''),
      text_color                        : this.fb.control(''),

      // Contact Information 
      community_name          : this.fb.control(''),  
      organizer_email         : this.fb.control('',[Validators.email,Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),  
      organization_address    : this.fb.control(''),
      organization_city       : this.fb.control(''),
      organization_state      : this.fb.control(''),
      organization_zip        : this.fb.control(''),
      organization_country    : this.fb.control(''),
      event_admin_email       : this.fb.control(''),

      // Add/Edit Event
      event_organizer_field   : this.fb.control(''),
      add_location            : this.fb.control(''),

      // Waitlist Settings
      add_members_by          : this.fb.control(''),
      guest_attendee          : this.fb.control(''),
      attendee_limit          : this.fb.control(18),
      reg_success_msg         : this.fb.control(''),

       // Events List Display Settings
      show_categories_on_top  : this.fb.control(''),
      events_to_display       : this.fb.control(''),
      event_display_location  : this.fb.control(''),
      end_time_display        : this.fb.control(''),
      show_closed_events      : this.fb.control('N'),
      price_display           : this.fb.control(''),
      show_only_registration_events: this.fb.control(''),

      // Event Registration Settings
      show_ticket_dropdown    : this.fb.control(''),
      show_guest_details_on_tickets: this.fb.control(''),
      required_guest_fields: this.fb.control([]),
      restrict_registration_only_once: this.fb.control(''),

      // My Event Print PDF Options
      eventpapersize          : this.fb.control(''),
      eventorientation        : this.fb.control(''),
      eventfontcolor          : this.fb.control(''),
      event_apply_header_footer :this.fb.control(''),

      // Event Calendar Display Settings
      registration_require_bgcolor : this.fb.control(''),
      registration_require_textcolor : this.fb.control(''),
      category_filter         : this.fb.control('N'),
      show_start_time         : this.fb.control('Y'),
      truncate_limit          : this.fb.control('N'),
      show_cell_location      : this.fb.control('N'),
      show_modal_on           : this.fb.control('click'),
      show_floor              : this.fb.control('N'),
      show_room               : this.fb.control('N'),
      show_team               : this.fb.control('N'),
      special_event           : this.fb.control('N'),

      // Attendee List Print PDF Options
      attendeepapersize       : this.fb.control(''),
      attendeeorientation     : this.fb.control(''),
      attendeefontcolor       : this.fb.control(''),
      attendee_apply_header_footer : this.fb.control(''),

      // Email Settings
      admin_reg_subject       : this.fb.control(''),
      admin_reg_mail_body     : this.fb.control(''),
      admin_cancel_subject    : this.fb.control(''),
      admin_cancel_mail_body  : this.fb.control(''),
      event_reg_subject       : this.fb.control(''),
      event_reg_mail_body     : this.fb.control(''),
      event_cancel_subject    : this.fb.control(''),
      event_cancel_mail_body  : this.fb.control(''),
      attendee_reg_subject    : this.fb.control(''),
      attendee_reg_mail_body  : this.fb.control(''),
      attendee_cancel_subject : this.fb.control(''),
      attendee_cancel_mail_body: this.fb.control(''),

      event_delete_subject    : this.fb.control(''),
      event_delete_mail_body  : this.fb.control(''),

      guest_reg_subject       : this.fb.control(''),
      guest_reg_mail_body     : this.fb.control(''),
      guest_cancel_subject    : this.fb.control(''),
      guest_cancel_mail_body  : this.fb.control(''),
      waitlist_reg_subject    : this.fb.control(''),
      waitlist_reg_mail_body  : this.fb.control(''),
      waitlist_cancel_subject : this.fb.control(''),
      waitlist_cancel_mail_body: this.fb.control(''),
      //Admin Events Settings
      show_meta_filters       : this.fb.control('Y'),
      meta_fields             : this.fb.control([]),
      add_event_default_role     : this.fb.control([]),
      add_event_default_category : this.fb.control([])
    });
  }

  getPrintOptionsCommonList() 
	{
		let params = [];
			params.push(
		{
		'type': 'P'
		},
		{
		'name': 'printoptions'
		});
		this._commonService.getCommonLists(params)
		.subscribe(response =>
		{
			if(response.message === 'success' && response.status == 200) {
			if(response.data.length)
			{
				let printoptions = JSON.parse(response.data[0].value);
				this.papersize = (printoptions.papersize).split(',');
				this.orientation = (printoptions.orientation).split(',');
			}
			}
		},
		error => {
			// Show the error message
			this._matSnackBar.open(error.message, 'Retry', {
					verticalPosition: 'top',
					duration        : 2000
			});
		});
  }
  getEventSettingData(response)
  {
    this.EventSettingsData = JSON.parse(response.settingsinfo.meta_value);
          this.EventSettingsData = this.EventSettingsData[0];
          if(this.EventSettingsData){
            
            let preValues =this.EventSettingsData.exportattendeefields.split(',');
            let  exportEventAttendeePreValues = this.compareFields(this.EventAttendeeFields,preValues, 'exportAttendee')
            this.addEventSetting = this.fb.group({
              // Time Format
              default_datetime_format         : this.fb.control(this.EventSettingsData.default_datetime_format),
              allday_start_time               : this.fb.control(this.EventSettingsData.allday_start_time),
              allday_end_time                 : this.fb.control(this.EventSettingsData.allday_end_time),
              notifyadmin                     : this.fb.control(this.EventSettingsData.notifyadmin),
              adminroles                      : this.fb.control(this.EventSettingsData.adminroles),
              defaultemail                    : this.fb.control(this.EventSettingsData.defaultemail),
              defaultname                     : this.fb.control(this.EventSettingsData.defaultname),
              exportattendeefields            : this.fb.control(exportEventAttendeePreValues),
              event_delete_notification        : this.fb.control(this.EventSettingsData.event_delete_notification),
               // Event Category Settings
              category_description_when_listing : this.fb.control(this.EventSettingsData.category_settings.category_description_when_listing),
              display_on_registration           : this.fb.control(this.EventSettingsData.category_settings.display_on_registration),
              display_on_calender               : this.fb.control(this.EventSettingsData.category_settings.display_on_calender),
              event_background_color            : this.fb.control(this.EventSettingsData.category_settings.event_background_color),
              text_color                        : this.fb.control(this.EventSettingsData.category_settings.text_color),

              // Contact Information
              community_name                    : this.fb.control(this.EventSettingsData.contact_information.community_name),  
              organizer_email                   : this.fb.control(this.EventSettingsData.contact_information.organizer_email,[Validators.email,Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),  
              organization_address              : this.fb.control(this.EventSettingsData.contact_information.organization_address),
              organization_city                 : this.fb.control(this.EventSettingsData.contact_information.organization_city),
              organization_state                : this.fb.control(this.EventSettingsData.contact_information.organization_state),
              organization_zip                  : this.fb.control(this.EventSettingsData.contact_information.organization_zip),
              organization_country              : this.fb.control(this.EventSettingsData.contact_information.organization_country),
              event_admin_email                 : this.fb.control(this.EventSettingsData.contact_information.event_admin_email),

                // Add/Edit Event
              event_organizer_field             : this.fb.control(this.EventSettingsData.add_edit_events.event_organizer_field),
              add_location                      : this.fb.control(this.EventSettingsData.add_edit_events.add_location),
              

               // Waitlist Settings
              guest_attendee                    : this.fb.control(this.EventSettingsData.waitlist_settings.guest_attendee),
              add_members_by                    : this.fb.control(this.EventSettingsData.waitlist_settings.add_members_by),
              attendee_limit                    : this.fb.control(this.EventSettingsData.waitlist_settings.attendee_limit),
              
              // Events List Display Settings
              show_categories_on_top            : this.fb.control(this.EventSettingsData.event_list_display_settings.show_categories_on_top),
              events_to_display                 : this.fb.control(this.EventSettingsData.event_list_display_settings.events_to_display),
              event_display_location            : this.fb.control(this.EventSettingsData.event_list_display_settings.event_display_location),
              end_time_display                  : this.fb.control(this.EventSettingsData.event_list_display_settings.end_time_display),
              show_closed_events                : this.fb.control(this.EventSettingsData.event_list_display_settings.show_closed_events),
              price_display                     : this.fb.control(this.EventSettingsData.event_list_display_settings.price_display),
              show_only_registration_events     : this.fb.control(this.EventSettingsData.event_list_display_settings.show_only_registration_events),

              // Event Registration Settings
              show_ticket_dropdown              : this.fb.control(this.EventSettingsData.event_registration_settings.show_ticket_dropdown),
              show_guest_details_on_tickets     : this.fb.control(this.EventSettingsData.event_registration_settings.show_guest_details_on_tickets),
              required_guest_fields             : this.fb.control(this.EventSettingsData.event_registration_settings.required_guest_fields),
              restrict_registration_only_once   : this.fb.control(this.EventSettingsData.event_registration_settings.restrict_registration_only_once),
              reg_success_msg                   : this.fb.control(this.EventSettingsData.event_registration_settings.reg_success_msg),
              
              // My Event Print PDF Options
              eventpapersize                    : this.fb.control(this.EventSettingsData.myevent_pdfoptions.papersize),
              eventorientation                  : this.fb.control(this.EventSettingsData.myevent_pdfoptions.layout),
              eventfontcolor                    : this.fb.control(this.EventSettingsData.myevent_pdfoptions.color),
              event_apply_header_footer         : this.fb.control(this.EventSettingsData.myevent_pdfoptions.apply_header_footer),

              // Event Calendar Display Settings
              registration_require_bgcolor      :this.fb.control(this.EventSettingsData.calender_settings.registration_require_bgcolor),
              registration_require_textcolor    :this.fb.control(this.EventSettingsData.calender_settings.registration_require_textcolor),
              category_filter                   :this.fb.control(this.EventSettingsData.calender_settings.category_filter),
              show_start_time                   :this.fb.control(this.EventSettingsData.calender_settings.show_start_time),
              truncate_limit                    :this.fb.control(this.EventSettingsData.calender_settings.truncate_limit),
              show_cell_location                :this.fb.control(this.EventSettingsData.calender_settings.show_cell_location),
              show_modal_on                     :this.fb.control(this.EventSettingsData.calender_settings.show_modal_on),
              show_floor                        :this.fb.control(this.EventSettingsData.calender_settings.show_floor),
              show_room                         :this.fb.control(this.EventSettingsData.calender_settings.show_room),
              show_team                         :this.fb.control(this.EventSettingsData.calender_settings.show_team),
              special_event                     :this.fb.control(this.EventSettingsData.calender_settings.special_event),

              // Attendee List Print PDF Options
              attendeepapersize                 : this.fb.control(this.EventSettingsData.attendeelist_pdfoptions.papersize),
              attendeeorientation               : this.fb.control(this.EventSettingsData.attendeelist_pdfoptions.layout),
              attendeefontcolor                 : this.fb.control(this.EventSettingsData.attendeelist_pdfoptions.color),
              attendee_apply_header_footer      : this.fb.control(this.EventSettingsData.attendeelist_pdfoptions.apply_header_footer),

              // Email Settings
              admin_reg_subject                 : this.fb.control(this.EventSettingsData.event_registration_to_admin.subject),
              admin_reg_mail_body               : this.fb.control(this.EventSettingsData.event_registration_to_admin.mail_body),
              admin_cancel_subject              : this.fb.control(this.EventSettingsData.event_cancellation_to_admin.subject),
              admin_cancel_mail_body            : this.fb.control(this.EventSettingsData.event_cancellation_to_admin.mail_body),
              event_reg_subject                 : this.fb.control(this.EventSettingsData.event_registration_to_organizer.subject),
              event_reg_mail_body               : this.fb.control(this.EventSettingsData.event_registration_to_organizer.mail_body),
              event_cancel_subject              : this.fb.control(this.EventSettingsData.event_cancellation_to_organizer.subject),
              event_cancel_mail_body            : this.fb.control(this.EventSettingsData.event_cancellation_to_organizer.mail_body),
              attendee_reg_subject              : this.fb.control(this.EventSettingsData.attendee_event_registration.subject),
              attendee_reg_mail_body            : this.fb.control(this.EventSettingsData.attendee_event_registration.mail_body),
              attendee_cancel_subject           : this.fb.control(this.EventSettingsData.attendee_event_cancellation.subject),
              attendee_cancel_mail_body         : this.fb.control(this.EventSettingsData.attendee_event_cancellation.mail_body),
              
              event_delete_subject              : this.fb.control(this.EventSettingsData.event_delete_to_attendee.subject),
              event_delete_mail_body            : this.fb.control(this.EventSettingsData.event_delete_to_attendee.mail_body),

              guest_reg_subject                 : this.fb.control(this.EventSettingsData.guest_event_invitation.subject),
              guest_reg_mail_body               : this.fb.control(this.EventSettingsData.guest_event_invitation.mail_body),
              guest_cancel_subject              : this.fb.control(this.EventSettingsData.guest_event_cancellation.subject),
              guest_cancel_mail_body            : this.fb.control(this.EventSettingsData.guest_event_cancellation.mail_body),
              waitlist_reg_subject              : this.fb.control(this.EventSettingsData.attendee_registration_approval.subject),
              waitlist_reg_mail_body            : this.fb.control(this.EventSettingsData.attendee_registration_approval.mail_body),
              waitlist_cancel_subject           : this.fb.control(this.EventSettingsData.event_approval_to_admin.subject),
              waitlist_cancel_mail_body         : this.fb.control(this.EventSettingsData.event_approval_to_admin.mail_body),
              //Admin site Event Settings
              show_meta_filters                 : this.fb.control(this.EventSettingsData.event_list_display_settings.show_meta_filters),
              meta_fields                       : this.fb.control(this.EventSettingsData.event_list_display_settings.meta_fields),

              add_event_default_role            : this.fb.control(this.EventSettingsData.event_list_display_settings.add_event_default_role),
              add_event_default_category        : this.fb.control(this.EventSettingsData.event_list_display_settings.add_event_default_category)
  });
}}
loadedMCE(){
  setTimeout(() => {
  }, 1000);
}
  compareFields(coreArr,metaArr,type){
    const finalarray =[];
    coreArr.forEach((core)=>
      metaArr.forEach((meta)=>{
        if(type == 'exportAttendee' && core === meta){
          finalarray.push(core);
        }
      }));
    return finalarray;
  }

  saveFormValue(){
    let value = this.addEventSetting.value;
    
    let data:any = [];
    data.push({
      "default_datetime_format": value.default_datetime_format,
      "allday_start_time": moment(value.allday_start_time).format('YYYY-MM-DD HH:mm:ss'),
      "allday_end_time": moment(value.allday_end_time).format('YYYY-MM-DD HH:mm:ss'),
      "notifyadmin": value.notifyadmin,
      "adminroles": value.adminroles,
      "defaultemail": value.defaultemail,
      "defaultname": value.defaultname,
      "exportattendeefields":value.exportattendeefields.toString(),
      "event_delete_notification":value.event_delete_notification,

      "category_settings": {
        "category_description_when_listing": value.category_description_when_listing,
        "display_on_registration": value.display_on_registration,
        "display_on_calender": value.display_on_calender,
        "event_background_color": value.event_background_color,
        "text_color": value.text_color
      },
      "contact_information": {
        "community_name": value.community_name,
        "organizer_email": value.organizer_email,
        "organization_address": value.organization_address,
        "organization_city": value.organization_city,
        "organization_state": value.organization_state,
        "organization_zip": value.organization_zip,
        "organization_country": value.organization_country,
        "event_admin_email": value.event_admin_email
      },
      "add_edit_events": {
        "event_organizer_field": value.event_organizer_field,
        "add_location": value.add_location
      },
      "waitlist_settings": {
        "add_members_by": value.add_members_by,
        "guest_attendee": value.guest_attendee,
        "attendee_limit": value.attendee_limit,
      },
      "event_list_display_settings": {
        "show_categories_on_top": value.show_categories_on_top,
        "events_to_display": value.events_to_display,
        "event_display_location": value.event_display_location,
        "end_time_display": value.end_time_display,
        "show_closed_events": value.show_closed_events,
        "price_display": value.price_display,
        "show_only_registration_events": value.show_only_registration_events,
        "show_meta_filters": value.show_meta_filters,
        "meta_fields": value.meta_fields,
        "add_event_default_role": value.add_event_default_role,
        "add_event_default_category": value.add_event_default_category
        
      },
      "event_registration_settings": {
        "show_ticket_dropdown": value.show_ticket_dropdown,
        "show_guest_details_on_tickets": value.show_guest_details_on_tickets,
        "required_guest_fields": value.required_guest_fields,
        "restrict_registration_only_once": value.restrict_registration_only_once,
        "reg_success_msg": value.reg_success_msg,
      },
      "calender_settings": {
        "registration_require_bgcolor":value.registration_require_bgcolor,
        "registration_require_textcolor":value.registration_require_textcolor,
        "category_filter":value.category_filter,
        "show_start_time":value.show_start_time,
        "truncate_limit":value.truncate_limit,
        "show_cell_location":value.show_cell_location,
        "show_modal_on":value.show_modal_on,
        "show_room":value.show_room,
        "show_floor":value.show_floor,
        "show_team":value.show_team,
        "special_event":value.special_event,
      },
      "myevent_pdfoptions": {
        "layout": value.eventorientation,
        "color": value.eventfontcolor,
        "papersize": value.eventpapersize,
        "apply_header_footer": value.event_apply_header_footer
      },
      "attendeelist_pdfoptions": {
        "layout":value.attendeeorientation,
        "color": value.attendeefontcolor,
        "papersize": value.attendeepapersize,
        "apply_header_footer": value.attendee_apply_header_footer
      },
      "event_registration_to_admin": {
        "subject": value.admin_reg_subject,
        "mail_body": value.admin_reg_mail_body
      },
      "event_cancellation_to_admin": {
        "subject": value.admin_cancel_subject,
        "mail_body": value.admin_cancel_mail_body
      },
      "event_registration_to_organizer": {
        "subject": value.event_reg_subject,
        "mail_body": value.event_reg_mail_body
      },
      "event_cancellation_to_organizer": {
        "subject": value.event_cancel_subject,
        "mail_body": value.event_cancel_mail_body
      },
      "attendee_event_registration": {
        "subject": value.attendee_reg_subject,
        "mail_body": value.attendee_reg_mail_body
      },
      "attendee_event_cancellation": {
        "subject": value.attendee_cancel_subject,
        "mail_body": value.attendee_cancel_mail_body
      },
      "event_delete_to_attendee":{
        "subject": value.event_delete_subject,
        "mail_body": value.event_delete_mail_body
      },
      "guest_event_invitation": {
        "subject": value.guest_reg_subject,
        "mail_body": value.guest_reg_mail_body
      },
      "guest_event_cancellation": {
        "subject": value.guest_cancel_subject,
        "mail_body": value.guest_cancel_mail_body
      },
      "attendee_registration_approval": {
        "subject": value.waitlist_reg_subject,
        "mail_body": value.waitlist_reg_mail_body
      },
      "event_approval_to_admin": {
        "subject": value.waitlist_cancel_subject,
        "mail_body": value.waitlist_cancel_mail_body
      }
    });
    return data;
  }

  onClickSave(){
    let settingData = this.saveFormValue();
    let saveData = {
      meta_type: 'E',
      meta_key: 'event-settings',
      meta_value : JSON.stringify(settingData)
    };      
    this._commonService.updateLocalStorageSettings('event-settings',settingData);
    this._settingService.createSetting(saveData)
    .then(response =>
        {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration        : 2000
        });
        },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
                  verticalPosition: 'top',
                  duration        : 2000
          });
      });
  }

  //Get Meta Fields For Filter at event list
  getEventMetaFields(){
    //Get Event MetaFields
      this._eventService.getEventMetaFields({field_form_type:'E'}).subscribe(metaInfo=>{
        this.EventMetaFields  = metaInfo.data || [];
      });
  }
  //GET CATEGORIES
  getCategories(){
    this._categoryService.getCategorys({category_type:'C',status:'A'}).then(catList=>{
      if(catList.status==200){
        this.CategorysList = catList.data || [];
      }      
    });
  }


}
