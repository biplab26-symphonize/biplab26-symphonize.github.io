import {Deserializable,Roles} from 'app/_models';
import { OptionsList, AppConfig } from 'app/_services';

export class User implements Deserializable {
    
    public id:number;
    public preffix:string='';
    public showpreffix:string='';
    public suffix:string='';
    public username:string='';
    public first_name:string='';
    public middle_name:string='';
    public last_name:string='';
    public birthdate:string='';
    public email:string='';
    public phone:number;
    public status:string;  
    public role_name:string;
    public usermeta:any[];
    public department:any = [];
    public designation:number;
    public userroles:Roles[];
    public letters:string;
    
    public show_profile_res_dir;
    public hide_email_res_dir;
    public hide_phone_res_dir;
    public message_notification_privacy:string='everyone';
    public recive_all_resident_email_notify;
    public biography;
    public staffmanager;
    
    public created_at:string;
    public deleted_at:string;
    public last_login:string;
    
    public login_location:string;
    public updated_at:string;
    //Media Params
    public roles:number;
    public usermedia:[];
    public avatar_media_id:number;
    public cover_media_id:number;
    public avatar_file:string;
    public thumb_file:string;
    public cover_file:string;
    public interests:any={label:"",values:""};
    public clubs:any={label:"",values:""};
    public loginstatus: string = 'online';

    public fc_id:any;
    public fc_name:string;

    deserialize(input: any, type:string='list'): this {
       
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);
        this.loginstatus = input && input.online ? input.online : 'online';
        //mapList
        if(input){
            if(type=='list'){
                this.getFullName(input)
                this.getRoleName(input.userroles); 
                this.getStatus(input.status); 
                this.getUsermedia(input.usermedia);
            }
            if(type=='stafflist'){
                this.getFullName(input)
                this.getStatus(input.status); 
                this.getUsermedia(input.usermedia);
                this.getDesignation(input);
            }
            if(type=='single'){
                this.getUsermedia(input.usermedia);
                this.getUserRoles(input.userrolesmany);
                this.getUserMeta(input.usermeta);
                this.showpreffix = input.preffix!=='' && input.preffix!==null && input.preffix!==undefined ? ' "' + input.preffix + '" ' :''; 

                this.message_notification_privacy = input.message_notification_privacy || 'everyone';
            }
            if(type == 'singlestaff'){
                this.getUsermedia(input.usermedia);
                this.getDepartment(input);
            }
            if(type == 'resident'){
                this.getUsermedia(input.usermedia);
                this.getResidentUserMeta(input.usermeta);
                this.getFullName(input);
                this.getDynamicMetaFields(input);
            }
        }
        
        return this;
    }
    //GET USERMETA FIELDS
    getUserMeta(usermeta:any){
        this.usermeta = usermeta || [];
    }
    //RD UserMeta
    getResidentUserMeta(usermeta:any[]=[]){
        if(usermeta.length>0){
            this.usermeta = usermeta.map(item=> {
                if(item.userfields && item.userfields.field_content){
                  item.userfields.field_content = JSON.parse(item.userfields.field_content);
                }
                return item;  
            });
        }
        else{
            this.usermeta=[];
        }
    }
    getDepartment(response){
        let dept:string = '';
        let deptArr = [];
        let subDeptArr = [];
        let mainArr = [];
        deptArr = response.department ? response.department.split(',') : deptArr.push(response.department);
        subDeptArr = response.subdepartment ? response.subdepartment.split(',') : subDeptArr.push(response.subdepartment);
        if(deptArr.length && subDeptArr.length){
          for(let i=0 ;i<deptArr.length; i++){
            dept = deptArr[i]+ ',' + subDeptArr[i];
            mainArr.push(dept.toString());
          }
        }
        else{
          dept = deptArr+ ',' + subDeptArr;
          mainArr.push(dept.toString());
        }

        this.department = mainArr;
        this.designation = +(response.designation);        
    }

    getDesignation(input){
        
       this.designation = (input.userdesignation!=null && input.userdesignation!='')?input.userdesignation.category_name:'';
    }

    getFullName(input) {
        let prefixName  = input.preffix!=='' && input.preffix!==null && input.preffix!==undefined ? ' "' + input.preffix + '" ' :''; 
        let middleName  = input.middle_name!=='' && input.middle_name!==null && input.middle_name!==undefined ?  input.middle_name :''; 

        this.first_name = input.first_name + prefixName +  middleName + ' ' + input.last_name;
    }
    
    //Change Status Text
    getStatus(status: string){
        this.status = OptionsList.Options.tables.status.users[status];
    }
    //Get Role Name
    getRoleName(rolesArray){
        if(rolesArray && rolesArray.roles){
            this.role_name = rolesArray.roles.role_name;
        }
    }
    //get media ID and urls
    getUsermedia(userMedia:any){
      
        if(userMedia!==undefined && userMedia.length>0){
            
            let avatarMedia = userMedia.find(item =>item.media ? item.media.type=='avatar' : null)
            let thumbMedia  = userMedia.find(item =>item.media ? item.media.type=='avatar' : null)

            let coverMedia  = userMedia.find(item =>item.media ? item.media.type=='cover' : null)
            
            this.avatar_media_id = avatarMedia!==undefined ? avatarMedia.media_id : 0;
            this.avatar_file     = avatarMedia!==undefined && avatarMedia.media.image ? AppConfig.Settings.url.mediaUrl+avatarMedia.media.image : "";
            this.thumb_file      = thumbMedia!==undefined && thumbMedia.media.thumb ? AppConfig.Settings.url.mediaUrl+thumbMedia.media.thumb : "";

            this.cover_media_id  = coverMedia!==undefined ? coverMedia.media_id : 0;
            //this.cover_file      = coverMedia!==undefined && coverMedia.media.image ? AppConfig.Settings.url.mediaUrl+coverMedia.media.image : "";
            this.cover_file      = coverMedia!==undefined && coverMedia.media.thumb ? AppConfig.Settings.url.mediaUrl+coverMedia.media.thumb : "";
        }
        else{
            this.avatar_file     = "";
            this.cover_file      = "";
        }
    }
    /** Get User Role On Edit Form */
    getUserRoles(userRoles:any=[]){
        if(userRoles!==null){
            let roleID = userRoles.map(item=>{return item.role_id});
            if(roleID.length>0){
                this.roles = +roleID[0];
            }
        }   
    }
    /** GET DYNAMIC FIELDS ARRAY COMMAs */
    getDynamicMetaFields(input){
        if(input.intrest && input.intrest.length>0){
            this.interests = {label:input.intrest[0].category_type,values:Array.prototype.map.call(input.intrest, s => s.category_name).toString()}
        }
        if(input.clubs && input.clubs.length>0){
            this.clubs = {label:input.clubs[0].category_type,values:Array.prototype.map.call(input.clubs, s => s.category_name).toString()}
        }
    }
}