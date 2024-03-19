import {Deserializable,Roles} from 'app/_models';
import { Form } from './form.model';

export class Approval implements Deserializable {

   public   id : number;
    public form_id : number;
    public first_name:string;
    public last_name : string;
    public status :string;
    public email : string;
    public form_title:string;
    public formtype:Form[];
    public created_at:string;
    public deleted_at:string;
    public last_login:string;
    public form_type:string;
    public login_location:string;
    public updated_at:string;
    

    deserialize(input: any, type:string='list'): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);
    //mapList
    if(input){
        if(type=='list'){
            this.getFullName(input)
          }
    
    return this;
    }
    }

    getFullName(input) {
      this.first_name = input.first_name + ' ' + input.last_name;
  }


}