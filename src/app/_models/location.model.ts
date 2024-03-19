import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';

export class Locationlist implements Deserializable {
    
    public id:number;
    public category_name:string;
    public abbreviation:string;
    public font_color:string;
    public bg_color:string;
    public status:string;  

    deserialize(input: any,type:string='list'): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);
    if(type=='list'){
        this.getLocationStatus(input.status)
    }
    if(type=='single'){
        // this.getUsermedia(input.usermedia);
    } 
    return this;
    }

    //Change Status Text
    getLocationStatus(status: string){
        this.status = OptionsList.Options.tables.status.users[status];
    }
   
}