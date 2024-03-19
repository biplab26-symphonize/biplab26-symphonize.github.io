import {Deserializable} from 'app/_models';
import { AppConfig } from 'app/_services';

export interface Creator{
    id          : number;
    first_name  : string;
    last_name   : string;
    middle_name : string;
    online      : string;
    biography   : string;
    email       : string;
    usermedia   : [];
}

export class Group implements Deserializable {

    public currentUserId: number;
    public group_id    : number;
    public group_name  : string;
    public created_at  : string;
    public created_by  : string;
    public creator     : string;
    public membercount : number;
    public memberinfo  : Creator[]=[];

    deserialize(input: any, type:string='list'): this {
        let currentUser     = JSON.parse(localStorage.getItem('token'));
        this.currentUserId  = currentUser['user_id'];
        Object.assign(this, input);
        this.getMemberInfo(input);
        return this;
    }
    getMemberInfo(input){
        //push creator into memberinfo
        let groupowner = input.memberinfo.find(item=>{return item.usermeta.id===input.creator.id});
        if(!groupowner){
            input.memberinfo.push({usermeta:input.creator});
        }
        if(input.memberinfo.length>0){
            input.memberinfo.map(item=>{
                if(item && item.usermeta){
                    item.biography    = item.usermeta.biography;
                    item.email        = item.usermeta.email; 
                    item.first_name   = item.usermeta.first_name;
                    item.id           = item.usermeta.id;
                    item.last_name    = item.usermeta.last_name;
                    item.middle_name  = item.usermeta.middle_name;
                    item.online       = item.usermeta.online;  
                
                    if(item.usermeta.usermedia.length>0 && item.usermeta.usermedia[0].media.image){
                        item.avatar = item.usermeta.usermedia[0].media.image;
                    }
                }
                
                return item;
            });
        }
        this.memberinfo  = [...input.memberinfo];
        this.membercount = input.memberinfo.length || 0;
    }
    
}