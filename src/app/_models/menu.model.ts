import {Deserializable} from 'app/_models';
export class Menus implements Deserializable {
    public menu_id: number
    public menu_title: string
    public menu_type: string
    public menu_url: string
    public menu_alias: string
    public menu_class: string
    public menu_desc: string
    public menu_icon: string
    public menu_parent_id: number
    public menu_show_type: string
    public menu_source: string
    public menu_source_type: string
    public menu_status: string
    public menu_target: string
    public menuroles: any
    public media: any;
    public order: string
    public position: string
    public updated_at: string
    public created_at: string
    public created_by: string
    public deleted_at: string
    public menu_role: any;
    deserialize(input: any, type:string='list'): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);
        //mapList
        if(input){
            if(type=='single'){
                this.getMenuRoles(input.menuroles);
            }
        }
        
        return this;
    }
    
    /** Get User Role On Edit Form */
    getMenuRoles(menuRoles:any){
        if(menuRoles!==null){
            let roleID = menuRoles.map(item=>{return item.role_id});
            if(roleID.length>0){
                this.menu_role = roleID;
            }
        }
    }
}