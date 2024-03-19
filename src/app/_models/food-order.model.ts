import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';

export class FoodOrdermodel implements Deserializable {
    
    public name:string;
    public date_time:string;
    public type:string;
    public status:string;
    
     
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
