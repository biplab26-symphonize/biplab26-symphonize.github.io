import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';
import moment from 'moment-timezone';

export class DiningReservationmodel implements Deserializable {
    
    public service_name:number;
    public name:string;
    public status:string;
    public created_at:string;
    public deleted_at:string;
    public booking_start_date;
    public booking_start_time; 
    public datetime;   
    public currentTime;
    public currentDate;
    public generalSettings  : any = {};

     
    deserialize(input: any,type:string=''): this {
        
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
        
        //mapList
        if(type=='single'){
            this.DateTime(input.booking_start_date,input.booking_start_time);
        }
        return this;
    }  
    DateTime(booking_start_date,booking_start_time){
        this.currentTime      =  moment().tz(this.generalSettings.APP_TIMEZONE || "America/New_York").format('HH:mm:ss');
        this.currentDate      =  moment().tz(this.generalSettings.APP_TIMEZONE || "America/New_York").format('MM/DD/YYYY'); 
    
         if(new Date(booking_start_date)  <= this.currentDate  && new Date(booking_start_time ) < this.currentTime){
             console.log(this.datetime);
            this.datetime = true;
         }else{
            this.datetime = false;
         }
         return this;
    }
}