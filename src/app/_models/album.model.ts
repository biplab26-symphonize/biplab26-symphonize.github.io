import {Deserializable} from 'app/_models';
import { OptionsList, AppConfig } from 'app/_services';

export class Album implements Deserializable {
    
    public id:number;
    public category_type:string;
    public category_name:string;
    public status:string;  
    public parent_id:string;  
    public description:string;  
    public bg_image:string;
    public created_at:string;  
    public gallery_name:string;
    public media_id : string ;

    deserialize(input: any,type:string='list'): this {
        Object.assign(this, input);
        if(type=='list'){
            this.getStatus(input.status); 
            this.getMedia(input); 
            this.getGallery(input); 
        }
        if(type=='single'){
            this.getMedia(input); 
        }
        return this;
    }
    //Change Status Text
    getStatus(status: string){
        this.status = OptionsList.Options.tables.status.users[status];
    }
    //Get Media of Album
    getMedia(input:any){
        if(input && input.media && input.media.image)
        this.bg_image = AppConfig.Settings.url.mediaUrl+input.media.image;
    }
    //gallery details
    getGallery(input){
        if(input && input.categories)
        this.gallery_name = input.categories.category_name;
    }
}