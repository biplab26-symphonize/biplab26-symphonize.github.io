import { MenuItemNode } from './menuitem.node'; 

/** Flat to-do item node with expandable and level information */
export class MenuItemFlatNode {
    children: MenuItemNode[];
    menu_id:number;
    menu_alias:string;
    menu_class:string;
    menu_desc:string;
    menu_icon:string;
    menu_parent_id:number;
    menu_show_type:string;
    menu_source:string;
    menu_source_type:string;
    menu_status:string;
    menu_target:string;
    menu_title:string;
    menu_type:string;
    menu_url:string;
    menuroles:[];
    order:number;
    position:string;
    created_at:string;
    created_by:string;
    deleted_at:string;
    updated_at:string;
    level: number;
    expandable: boolean;
  }
  