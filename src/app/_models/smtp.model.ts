import {Deserializable} from 'app/_models';
import {CommonUtils} from 'app/_helpers';
export class SmtpPost implements Deserializable {
    
    public id:number;
    public first_name:string;
    public subject : string;
    public  to :string;
    public status :string;
    public delivery_time : string;
    public date : string;
  
   

    deserialize(input: any, type:string = ''): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input); 
    this.getemaillogData(input); 
    this.date    = CommonUtils.getStringToDate(input.date);
    
    return this;
    }
    
    getemaillogData(input)
    {  
    }
    
    } 