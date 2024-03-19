import {Deserializable} from 'app/_models';
import { OptionsList, AppConfig } from 'app/_services';
export class Roles {
    id:number;
    role_key:string;
    role_name:string;
    status:string;

    
    deserialize(input: any, type:string='list'): this {
        Object.assign(this, input);
        if(input){
            if(type=='list'){
            this.getStatus(input.status); 
            }
            if(type=='single'){
            }
        }
        return this;
    }
    //Change Status Text
    getStatus(status: string){
        this.status = OptionsList.Options.tables.status.users[status];
    }
}