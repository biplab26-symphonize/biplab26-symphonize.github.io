import {Deserializable,Roles} from 'app/_models';
import { Form } from './form.model';

export class Activitylog implements Deserializable {
    

    public Date :any;
    public Author: any;	
    public IP : any;
    public Type : any; 
    public Label : any;	
    public Action :any;	
    public Description :any ;
    

    deserialize(input: any, type:string = ''): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input); 
    this.getlogData(input);   
    return this;
    }
    
    getlogData(input)
    {   
        this.Date = input.Date;
    }
    
    } 

