import { OptionsList } from 'app/_services';
import {CommonUtils} from 'app/_helpers';
export class Reply {

    public content_id     : number;
    public content_title  : string;
    public title          : string;
    public reply_id       : number;
    public user_id        : number;
    public full_name      : string;
    public email          : string;
    public phone          : string;
    public message        : string;
    public rating         : string;
    public status         : string;
    public display_status : string;
    public category_name  : string;
    public created        : string;
    public author         : string;
    
    deserialize(input: any, type:string='list'): this {
        Object.assign(this, input);
        if(input){
            if(type=='list'){
                this.getStatus(input.status); 
                this.content_title = input.content ? input.content.content_title : '';
                this.created = CommonUtils.getStringToDate(input.created_at);
                this.category_name = input.content && input.content.forum ? input.content.forum.category_name : '';
                this.author = input.user ? input.user.first_name + ' ' + input.user.last_name : '';
            }
            if(type=='single'){
                this.display_status = input.display_status!==undefined && input.display_status!=='' ? input.display_status : 'approved';
            }
        }
        return this;
    }
    //Change Status Text
    getStatus(status: string){
        this.status = OptionsList.Options.tables.status.users[status];
    }
}