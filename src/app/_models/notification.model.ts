import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';
import {CommonUtils} from 'app/_helpers';

export class Notification implements Deserializable {
    
    public id:number;
    public sender_id:number;
    public group_id:number;
    public sender_name:string;
    public user_id:number;
    public notification_type:string;
    public message:string;
    public status:string;  
    public added_at:string;  
    public edited_at:string;
    public created_at : string;

    deserialize(input: any,type:string='list'): this {
        
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input); 
        this.getStatus(input.status);
        this.senderInfo(input);
        this.created_at = CommonUtils.getStringToDate(input.created_at);
        return this;
    }   
    getStatus(status: string){
        this.status = OptionsList.Options.tables.status.notifications[status];
    }
    //senderInfo
    senderInfo(input){
        if(input && input.senderinfo){
            this.sender_name = input.senderinfo.first_name+' '+input.senderinfo.last_name;
        }
    }
}