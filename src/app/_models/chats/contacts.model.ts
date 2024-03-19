import {Deserializable} from 'app/_models';
import { AppConfig } from 'app/_services';

export interface Contact{
    contact_id  : number;
    name        : string;
    avatar      : string;
    biography   : string;
    online      : string;
    email       : string;
}

export class ChatContact implements Deserializable {

    public currentUserId: number;
    public   id         : number;
    public user_id      : number;
    public contact_id   : number;
    public online       : string;
    public status       : string;
    public created_at   : any;
    public updated_at   : any;
    public contactinfo  : Contact={
        contact_id  : null,
        name        : "",
        avatar      : "",
        biography   : "",
        online      : "",
        email       : ""
    };

    deserialize(input: any, type:string='list'): this {
        let currentUser     = JSON.parse(localStorage.getItem('token'));
        this.currentUserId  = currentUser['user_id'];
        Object.assign(this, input);
        //Get ContactInfo
        this.getContact(input);
        return this;
    }
    //Contact Info
    getContact(input){
        if(input){
            if(this.currentUserId==input.user_id && input.contactmeta && input.contactmeta!==null && input.contactmeta!==''){
                this.contactinfo['contact_id'] = input.contactmeta.id;
                this.contactinfo['name']       = input.contactmeta.first_name +' '+ input.contactmeta.last_name;
                this.contactinfo['online']     = input.contactmeta.online;
                this.contactinfo['avatar']     = this.getContactMedia(input.contactmeta.usermedia);
                this.contactinfo['biography']  = input.contactmeta.biography;
                this.contactinfo['email']      = input.contactmeta.email;
            }

            if(this.currentUserId==input.contact_id && input.usermeta && input.usermeta!==null && input.usermeta!==''){
                this.contactinfo['contact_id'] = input.usermeta.id;
                this.contactinfo['name']       = input.usermeta.first_name +' '+ input.usermeta.last_name;
                this.contactinfo['online']     = input.usermeta.online;
                this.contactinfo['avatar']     = this.getContactMedia(input.usermeta.usermedia);
                this.contactinfo['biography']  = input.usermeta.biography;
                this.contactinfo['email']      = input.usermeta.email;
            }
        }
    }
    //media
    getContactMedia(media:any){
        let mediaArr = "";
        if(media && media.length>0 ){
            mediaArr = media && media[0].media ? media[0].media.image : '' ;
            return AppConfig.Settings.url.mediaUrl+mediaArr;
        }
        return mediaArr;
    }
}