import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';

export class GuestRoommodel implements Deserializable {
    
    public image:string;
    public type:string;
    public adults:string;
    public children:string;
    public room_count:string;
    public name:string;
    public price : string;
    public product_used_count : string; 
    public email : string; 
    public status : string; 
    public date_from : string; 
    public date_to : string; 
    
     
    deserialize(input: any,type:string=''): this {
        
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
        
        //mapList
        if(type=='single'){
            // this.getUsermedia(input.usermedia);
        }
        return this;
    }  

    
}