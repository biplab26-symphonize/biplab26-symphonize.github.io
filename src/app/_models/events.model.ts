import {Deserializable} from 'app/_models';
import { CommonUtils } from 'app/_helpers';

export class Event implements Deserializable {
    
    public event_id             : number;
    public parent_event_id      : number = 0;
    public event_title          : string;
    public event_start_date     : string;
    public event_start_time     : string;
    public registration_start   : string;
    public registration_status  : string;
    public attendee_limit       :string;
    public attendee_id;
	  public event_description    : string
    public display_description  : string;
    public event_location       : any;
    public is_all_day           : string;
    public event_end_date       : string;
    public event_end_time       : string;
    public disable_end_time     : string;
    public custom_event_end     : string;
    public custom_end_time      :string;
    public req_register         :string;
    public group_register       : string;
    public group_limit: number;
    public date_range: string;
    public register_type:string;
    public registration_end: string;
    public is_waitlist: string;
    public waitlist_limit: number;
    public is_recurring: string;
    public registration_date_formula:string;
    public recurring_type: string;
    public recurring_repeat_on: string;
    public recurring_every: string;
    public recurring_repeat_end: string;
    public recurring_occurrence: string;
    public recurrance_end_date: string;
    public on_the_num: string;
    public on_the_day: string;
    public monthly_on: string;
    public on_monthly_day: string;
    public week_day: string;
    public recurring_meta;
    public recurrences:[];
    public eventcategories: any[] =[];
    public eventsubcategories: any[]=[];
    public eventlocations: any[]=[];
    public eventaccess: any[] = [];
    public eventmeta: any[] = [];
    public recurring_rule : string;
    public categories: string;
    public subcategories: string;
    public roles: string;
    public status:string;
    public organizer_name :string;
    public organizer_email: string;
    public availablespace;
    public guestcount;
    public category_name;
    public registrationstatus;
    public special_event;
    public schedule: any;
    public reg_status: string;
    public calendar_id 
    deserialize(input: any,type : string=''): this {
    
      // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
      Object.assign(this, input);

      this.parent_event_id = input!=='' && input!==undefined && input.parent_event_id >= 0 ? input.parent_event_id : 0;
      if(type=='myeventlist' && input!=='' && input!==undefined){     
        this.event_title        = input.event.event_title;
        this.event_start_date   = input.event.event_start_date.replace(/-/g, '\/');
        this.event_start_time   = CommonUtils.getStringToDate(input.event.event_start_date+' '+input.event.event_start_time);
        this.reg_status         = this.getRegistrationStatus(input);
        this.getCategory(input);
      }
      else if(type=='adminlist' && input!=='' && input!==undefined){
        this.event_start_time   = CommonUtils.getStringToDate(input.event_start_date+' '+input.event_start_time);
        this.registration_start = input.registration_start!=null?CommonUtils.getStringToDate(input.registration_start):'';
        this.registration_end   = input.registration_end!=null?CommonUtils.getStringToDate(input.registration_end):'';
      }
      else if(type=='editevent' && input!=='' && input!==undefined){
        this.event_start_time = input.event_start_time;
        this.event_end_time   = input.event_end_time;
        this.registration_start = input.registration_start!=null?CommonUtils.getStringToDate(input.registration_start):'';
      }
      else if(input!==undefined){
        this.event_start_time   = CommonUtils.getStringToDate(input.event_start_date+' '+input.event_start_time);
        this.registration_start = input.registration_start!=null?CommonUtils.getStringToDate(input.registration_start):'';
      }
      //DS Info Bind In Schedule
      if(input && input.slides!==null && input.slides!==undefined){
        let SignageInfo = {
          start_datetime  :new Date(+input.slides.start_datetime),
          end_datetime    :new Date(+input.slides.end_datetime),
          schedule_type   :input.slides.schedule_type,
          schedule_days   :input.slides.schedule_days,
          layout_id       :input.slides.layout_id || 'template_one',
          layout_type       :input.slides.layout_type || 'horizontal',
          template_id     :input.slides.template_id || 'tmpl-event',
          playlist_id     :input.slides.playlist_id || [],
        };
        this.schedule = SignageInfo;
      }
      
      return this;
    }
    getRegistrationStatus(input){
      return CommonUtils.getRegistrationStatus({is_waiting:input.is_waiting,status:input.status});
    }
    getCategory(ele)
    {
        let categoryName:any;
        let name:any;
        let categoryname:any=[];
        let arr = ele.event.eventcategories.filter(function(name){
            return (name.categories && name.categories.category_name);
          });
          for(let i=0 ;i<arr.length;i++)
          {
            categoryName=arr[i].categories.category_name.toString().split(",")
             categoryname.push(categoryName);
          }
          if(categoryname.length)
          {
            name= categoryname;
          }

          //this.category_name = name;
    }
}