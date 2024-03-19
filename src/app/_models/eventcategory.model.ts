import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';

export class Eventcategorymodel implements Deserializable {
    
    public id:number;
    public category_name:string;
    public category_type : string;
    public description:string;
    public font_color:string;
    public bg_color:string;
    public status:string;  
    public calendar_id:any;
    deserialize(input: any,type:string='list'): this {
     // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
     Object.assign(this, input);
     this.calendar_id = input && input.calendar_id!=='' ? parseInt(input.calendar_id) : null; 
     //mapList
     if(type=='list'){
        this.getCategoryStatus(input)
     }
     if(type=='single'){
        // this.getUsermedia(input.usermedia);
     }
     return this;
    }

    //Change Status Text
    getCategoryStatus(input){
        this.status = OptionsList.Options.tables.status.users[input.status];
    }
   
}