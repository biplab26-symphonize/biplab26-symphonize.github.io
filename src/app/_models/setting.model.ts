import { AppConfig } from 'app/_services';

export class Settings {

    // STAFF SETTING DATA
    public defaultroleid         : string;
    public showemptydepartment   : string;
    public printPDFView          : string;
    public defaultprofile        : string;
    public showprofile           : string;
    public newest_staff          : string;
    public staff_name_sorting; 
    public show_manager;
    public show_biography;        

    // HOME SETTING DATA
    public datetimeformat        : any; 
    public default_layout        : string;
    public datetime              : any;
    public sidebar_set           : any ;
    public navbar_set           : any 
    
    public featured_image        : any;
    public featured_image_url    : string;
    public scroll_ann            : any;
    public home_ann              : any;
    public dining_ann            : any ;
    public event_ann             : any; 
    public weather_set           : any;
    public title                 : string;
    public city_id               : string;
    public app_id                : string;
    public city_name             : string;
    public unit                  : string;
    public show_icon             : string;
    public size                  : string;
    public forecast              : string;
    public bg_color              : string;
    public text_color            : string;
    public hide_current_stats    : any;
    public hide_weather_attribution : any;
    public link_to_extended      : any;
    public todays_event           : any;
    public todays_event_limit    : number;
    public event_datetime        : string;
    public event_decription      : string;
    public event_location        : string
    public my_events             : any;
    public event_limit           : number;
    public event_see_more_url    : string;
    public my_favorite_events    : any;
    public favorite_event_see_more_url : any ;
    public favorite_event_limit  : any ;
    public my_forms              : any;
    public my_dining             : any;
    public my_tablereservation   : any ;
    public my_foodreservation    : any ;
    public foodreservation_limit : any;
    public food_see_more_url : any;  
    public my_appointment        : any;
    public form_limit            : number;
    public tablereservation_limit       : number
    public dining_limit          : number;
    public form_see_more_url     : string;
    public dining_see_more_url   : string;
    public is_newest_neighbors   : any;
    public neighbors_limit       : number;
    public is_newest_staff       : any;
    public staff_limit           : number;
    public is_bulletin           : any;
    public bulletin_limit        : string;    
    public bulletin_date         : string ;
    public bulletin_replies      : string;
    public bulletin_author       : string;
    public footer_set            : any;
    public quicklink_set         : any ;

    // general setting data
    public site_name             : string
    public large_logo            : string
    public small_logo            : string
    public fevicon_logo          : string
    public fevicon_large_logo    : string
    public portal_logo           : string
    iPhone_iPad_Icon_logo        : string;
    iPhone_max_Icon_logo        : string;
    iPhone_40_Icon_logo        : string;
    iPhone_32_Icon_logo        : string;
    iPhone_57_Icon_logo        : string;
    iPhone_72_Icon_logo        : string;
    iPhone_114_Icon_logo        : string;
    iPhone_144_Icon_logo        : string;
    iPhone_Retina_logo           : string
    Faviconlarge_logo            : string
    iPhone_Icon_logo             : string
    public url                   : string
    public APP_TIMEZONE          : string
    public date_format           : string
    public time_format           : string
    public week_starts_on        : string
    public admin_email           : string
    public is_contact_info       : any
    public contact_address       : string
    public contact_number        : string
    public is_follow_us          : any
    public masking               : any
    public pastdays              : string
    public content_follow_name_facebook : string
    public content_follow_url_facebook : string
    public content_follow_name_twitter : string
    public content_follow_url_twitter : string
    public content_follow_name_instagram : string
    public content_follow_url_instagram : string
    public is_facebook_checked : any
    public is_twitter_checked : any
    public is_instagram_checked :  any
    public copyright_content : any
    public kiosk_user : any ;
    public my_guest              : any;
    public guest_limit           : string;
    public guest_see_more_url     : string;

    // permission setting
    public role_id               : any = [];
    public permission            : any = [];

    // Smtp Settings
    public driver     :any    
    public host     :any  
    public email     :any       
    public security   :any     
    public authentication :any  
    public port       :any      
    public username      :any  
    public  password   :any      
    public reply_to   :any      
    public  cc      :any         
    public bcc      :any        
    public recipient    :any   
    public  enable_logging :any  
    public maximum_transcript_size :any  
    public max_log_entries :any  
    public custom_headers :any  
    public meeting_room :any ;
    public meetingroom_limit :any;
    public meetingroom_see_more_url :any; 

        

    deserialize(input: any,type: string): this {
        // console.log("input",input);
        // console.log("type",type)
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        if(type == 'staff'){
            Object.assign(this, input);
        }
        if(type == 'homeSettings'){
            Object.assign(this, input);
            this.getHomeSettings(input);
        }
        if(type == 'generalSettings'){
            Object.assign(this, input);
            this.getGeneralSettings(input);  
        }
        if(type=='permission'){
            this.setPermission(input);   
        }
        if(type=='SMTP_Settings'){
            Object.assign(this, input);
            this.setSmtpsettings(input);   
        }
        
        return this;
    }   

    getHomeSettings(input){
        
        // set value toggle button
        this.datetime         = input.datetime == 'Y' ? true : false;
        this.home_ann         = input.home_ann == 'Y' ? true : false;
        this.dining_ann       = input.dining_ann == 'Y' ? true : false; 
        this.event_ann        = input.event_ann == 'Y' ? true :false;
        this.scroll_ann       = input.scroll_ann == 'Y' ? true : false;
        this.featured_image   = input.featured_image == 'Y' ? true : false;
        this.my_appointment   = input.my_appointment == 'Y' ? true : false;
        this.my_dining        = input.my_dining == 'Y' ? true : false;
        this.my_tablereservation =  input.my_tablereservation == 'Y' ? true : false;
        this.my_foodreservation =  input.my_foodreservation == 'Y' ? true : false;
        this.weather_set      = input.weather_set == 'Y' ? true : false;
        this.my_events        = input.my_events == 'Y' ? true : false;
        this.my_forms         = input.my_forms == 'Y' ? true : false;
        this.my_guest         = input.my_guest == 'Y' ? true : false;
        this.todays_event      = input.todays_event == 'Y' ? true : false;
        this.is_newest_neighbors  = input.is_newest_neighbors == 'Y' ? true : false;
        this.is_newest_staff  = input.is_newest_staff == 'Y' ? true : false;
        this.is_bulletin      = input.is_bulletin == 'Y' ? true : false;
        this.footer_set       = input.footer_set == 'Y' ? true : false;
        this.quicklink_set    = input.quicklink_set == 'Y'? true:false;
        this.meeting_room     =  input.meeting_room == 'Y'? true:false;
        this.navbar_set       =  input.navbar_set == 'Y'? true:false;
        this.sidebar_set      =  input.sidebar_set == 'Y'? true :false;
        
        // set value of checkbox
        this.hide_current_stats = input.hide_current_stats == 'Y' ? true : false;
        this.hide_weather_attribution = input.hide_weather_attribution == 'Y' ? true : false;
        this.link_to_extended = input.link_to_extended == 'Y' ? true : false; 
    }

    getGeneralSettings(input){
     
        this.is_follow_us = input.is_follow_us == 'Y' ? true : false;
		this.is_contact_info = input.is_contact_info == 'Y' ? true : false;
        this.masking = input.masking == 'Y' ? true : false;		
        this.is_facebook_checked = input.is_facebook_checked == 'Y' ? true : false;		
        this.is_twitter_checked = input.is_twitter_checked == 'Y' ? true : false;		
        this.is_instagram_checked = input.is_instagram_checked == 'Y' ? true : false;		
    }

    
  // set permission role wise 
  setPermission(assignedrolesList){
    let role = "";
    let permissionname = [];

    assignedrolesList.forEach(element => {
      role = element.role_id;
      permissionname.push(element.uri+','+element.permissionname);
    });

    // role = role.map(item => item)
    //     .filter((value, index, self) => self.indexOf(value) === index)

    permissionname = permissionname.map(item => item)
    .filter((value, index, self) => self.indexOf(value) === index)

    this.role_id = role;
    this.permission = permissionname;
   
  }
  setSmtpsettings(input){

  }

}