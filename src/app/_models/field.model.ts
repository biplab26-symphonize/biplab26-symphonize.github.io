import { OptionsList } from 'app/_services';

export class Fields
{
    public created_at: string;
    public deleted_at: string;
    public field_content: string;
    public field_form_type: string;
    public field_label: string;
    public field_name: string;
    public field_pregmatch: string;
    public field_required: string;
    public field_type: string;
    public field_validation: string;
    public id: number;
    public error_msg:string;
    public updated_at: string;
    public extra_field_content:[];
    public defaultValue : string;
    public maximum_size :number;
    public allow_multiple : string;
    public col_class : string; 
    public inpdf:string;
    public uncheckedcolor:string;
    public checkedcolor:string;
    public isMail:string;   
    public readonly : string;
    public class : string;
    public event : string;
    public event_name : string;
    public event_fn : string;
    public show_as : string;


    deserialize(input: any ,type:string='list'): this {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, input);
       
         //mapList
         if(type=='list'){
            this.getName(input)
        }
        if(type=='single'){
            this.getExtraContent(input);
        }
        return this;
    }
    
    // get form type
    getName(input) {
        this.field_form_type = OptionsList.Options.tables.formtype.fields[input.field_form_type];
    }
    getExtraContent(input){
        if(input){
            let field_contentData = JSON.parse(input.field_content);  
            this.error_msg = field_contentData.extra_field_content.error_msg;
        }
    }
}
