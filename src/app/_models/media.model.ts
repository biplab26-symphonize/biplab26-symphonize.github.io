import { AppConfig } from 'app/_services';

export class Media {

    public category_id: number;
    public created_at: string;
    public image: string;
    public media_id: number;
    public thumb: string;
    public id : number;
    public audio :string;
    public video : string;
    public document :string;5
    public imagename : string;
    public type: string
    public updated_at: string;
    public title: string;
    public description: string;

    deserialize(input: any,type: string): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);

        if(type == 'medialist'){
            this.getMedia(input);
        }
        if(type == 'pagemedialist'){
            this.getPageMedia(input);
        }
        if(type == 'singlemedia'){
            this.getMedia(input);
        }
        //gallerymedialist
        if(type == 'gallerylist'){
            this.getGalleryMedia(input);
        }
        return this;
    }   

    getMedia(input){
        if(input!==undefined){
            let date = new Date(input.created_at);
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            this.imagename = input.image;
            //Global Media URL
            let MediaUrl = AppConfig.Settings.url.globalmediaUrl;
            //  file urls
            if(input.type == 'image')
            {
                this.image = MediaUrl + input.type+'/' + year + '/' + month +'/'+ input.image;
            }
            else if(input.type == 'globalmedia')
            {
                this.image = MediaUrl + input.type+'/' + year + '/' + month +'/'+ input.image;
            }
            else if(input.type == 'audio'){
                this.image = 'assets/images/media/audio.png' || "";
                this.audio = MediaUrl + input.type+'/' + year + '/' + month +'/'+ input.image;
            }
            else if(input.type == 'video'){
                this.image = 'assets/images/media/video.png' || "";
                this.video = MediaUrl + input.type+'/' + year + '/' + month +'/'+ input.image;
            }
            else if(input.type == 'document'){
                this.image = 'assets/images/media/document.png' || "";
                this.document = MediaUrl + input.type+'/' + year + '/' + month +'/'+ input.image;
            }
        }
    }
    //Get Media For Page Builder
    getPageMedia(input){
        if(input!==undefined){
            let date = new Date(input.created_at);
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            var filename = input.image.split('/').pop()
            this.imagename = filename;
            //Global Media URL
            if(input.type == 'image'){
                let MediaUrl = AppConfig.Settings.url.globalmediaUrl;
                this.image = MediaUrl + input.type+'/' + year + '/' + month +'/'+ input.image;
            }
            else if(input.type == 'pageimage'){
                let MediaUrl = AppConfig.Settings.url.mediaUrl;
                this.image = MediaUrl + input.image;
            }
            
        }
    }
    //GalleryMedia
    getGalleryMedia(input){
        if(input && input.image){
            this.image = AppConfig.Settings.url.mediaUrl+input.image; 
        }
        if(input && input.thumb){
            this.thumb = AppConfig.Settings.url.mediaUrl+input.thumb; 
        }
    }
}