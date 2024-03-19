import {Deserializable} from 'app/_models';

export class Guests  implements Deserializable{
    
    first_name          : string;
    email               : string;
    phone               : number;
    last_name           : string;
    user_id?            : number;
    attendee_id?        : number;
    event_id?           : number;
    attendee_type?      : string;  
  
    deserialize(input: any): this {
    Object.assign(this, input);
    return this;
    }
}
