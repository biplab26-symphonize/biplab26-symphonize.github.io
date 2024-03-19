import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';

export class Dashboardnmodel implements Deserializable {
    
   
    public form_id:number;
    public status:string;
    public created_at:string;
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