import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';
import moment from 'moment';
import {CommonUtils} from 'app/_helpers';
export class Home  implements Deserializable{
    
    public content_id:number;
    public content_title:string;
    public content_desc:string;
    public last_post_ago:string; //required for forum
    public start_datetime:any;
    public end_datetime:string;
    public status:string;  
    public display_status:string;  
    public access: [];
    public content_alias: string;
    public content_type: string;
    public created_at: string;
    public created_by: number;
    public deleted_at: string;
    public forum_id: number;
    public category_name : string;
    public meta: [];
    public created :string;
    public order: number;
    public replies: [];
    public updated_at: string;
    public creator_name: string;
    public image;
  
    deserialize(input: any,type:string='listAnn'): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);    
    console.log('home ann');
    if(type=='listAnn'){ 
        this.getStatus(input.status);
        this.start_datetime            = input.start_datetime!=null?CommonUtils.getStringToDate(input.start_datetime):'';
        this.end_datetime              = input.end_datetime != null?CommonUtils.getStringToDate(input.end_datetime):'';
        this.created_at                = CommonUtils.getStringToDate(input.created_at);
    }
    if(type=='topiclist'){
        this.getStatus(input.status);
        this.replies            = input.replies_count?input.replies_count.count:0;
        this.category_name      = input.forum ? input.forum.category_name : '';
        this.creator_name       = input.creator!=='' && input.creator!==null && input.creator!==undefined ? input.creator.first_name + ' ' + input.creator.last_name : '';
        this.created            = CommonUtils.getStringToDate(input.created_at);
        this.last_post_ago      = this.getLastAgoTime(input);   
    }
    if(type=='single'){
        this.display_status = input.display_status!==undefined && input.display_status!==null && input.display_status!=='' ? input.display_status : 'pending';
    }
    return this;
    }

    //Change Status Text
    getStatus(status: string){
        this.status = OptionsList.Options.tables.status.users[status];
    }

    //time ago for forum last post list view
    getLastAgoTime(input){
        let timeAgo = '';
        if(input.last_post!==null){
            timeAgo = moment(input.created_at).fromNow();
        }
        return timeAgo;
    }
    
   
}
