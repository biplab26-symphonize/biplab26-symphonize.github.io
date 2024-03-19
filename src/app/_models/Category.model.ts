import { OptionsList } from 'app/_services';
import moment from 'moment';
import {CommonUtils} from 'app/_helpers';
export class Category
{
    creator_name: string;
    last_post_ago:string; //required for forum
    created_at: string;
    deleted_at: string;
    category_name:string;
    Category_type:string;
    created:string;
    status:string;
    id: string;
    parent_id:string;
    updated_at: string;
    topic_count: number;

    deserialize(input: any ,type:string='list'): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
       
         //mapList
        if(type=='list'){
            this.getStatus(input);
        }
        if(type=='forumlist'){
            this.getStatus(input);
            this.created        = CommonUtils.getStringToDate(input.created_at);
            this.topic_count    = input.topic_count ? input.topic_count.count : 0;
            this.creator_name   = input.creator!=='' && input.creator!==null && input.creator!==undefined ? input.creator.first_name + ' ' + input.creator.last_name : '';
            this.last_post_ago  = this.getLastAgoTime(input);
        }
        if(type=='single'){
        }
  
        return this;
    }
    
    // get form type
    getStatus(input) {
        this.status = OptionsList.Options.tables.status.users[input.status];
    }
    //time ago for forum last post list view
    getLastAgoTime(input){
        let timeAgo = '';
        if(input.last_post!==null && input.last_post!==undefined){
            let UtcDate = moment.utc(input.last_post.created_at).toDate();
            var local = moment(UtcDate).local().format('YYYY-MM-DD HH:mm:ss');
            timeAgo = moment(local).fromNow();
        }
        return timeAgo;
    }
}
