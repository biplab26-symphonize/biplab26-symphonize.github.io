import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';

export class CalendarGeneratormodel implements Deserializable {
    
    public id:number;
    public template_name:string;
     
    deserialize(input: any,type:string=''): this {
        console.log('type',type);
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
        console.log('calendarinput',input);
        //mapList
        if(type=='single'){
            // this.getUsermedia(input.usermedia);
        }
        return this;
    }  
}