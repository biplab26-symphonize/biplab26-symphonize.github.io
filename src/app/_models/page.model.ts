import { OptionsList, AppConfig } from 'app/_services';
import {CommonUtils} from 'app/_helpers';
export class Page {
    public id:              number;
    public title:           string = '';
    public author:          string = '';           
    public status:          string = '';
    public publicaccess:    string = '';
    public updated_at:      string = '';
    public updated_by:      string = '';
    public page_alias:      string = '';
    public created_at:      string = '';
    public access:          string = '';
    public pagecontent:        any    = {};
    public settings:        any    = {};
    public editrestriction: boolean = false;
    deserialize(input: any,type: string): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
        this.getAccessRoles(input);
        if(type=='list'){

            this.getStatus(input.status); 
            this.getRestrictPage(input); 
            this.getAuthor(input); 
            this.created_at    = CommonUtils.getStringToDate(input.created_at);
        }
        return this;
    }
    getAccessRoles(input){
        if(input.access){
          this.access = input.access.toString().split(',').map(Number);
        }
    }
    //Change Status Text
    getStatus(status: string){
        this.status = OptionsList.Options.tables.status.users[status];
    }
    //Check Page Restricted
    getRestrictPage(input: any){
        this.editrestriction = input && input.editrestriction && input.editrestriction.id ? true : false;
    }
    //Get CreatdInfo
    getAuthor(input){
        if(input && input.createdby){
            this.author = input.createdby.first_name +' '+ input.createdby.last_name; 
        }
    }
}