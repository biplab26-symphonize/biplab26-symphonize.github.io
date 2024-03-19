import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItemNode } from 'app/_models/menuitem.node';
import { MenusService } from 'app/_services';
import { ActivatedRoute } from '@angular/router';
import { MenuItemFlatNode } from 'app/_models/menuitem.flatnode';
  
@Injectable()
export class MenusDatabase {
  filterParams: any={'position':'M'};  
  MenusList: any[];
  dataChange = new BehaviorSubject<MenuItemNode[]>([]);
  
  get data(): MenuItemNode[] { return this.dataChange.value; }

  constructor(
      private _menusService:MenusService,
      private route: ActivatedRoute,
  ) {
    this.initialize();
    //Get Filter Values and Call Menus Api to filter dataset of tree
    this._menusService.filterParams.subscribe(filterValues=>{
      if(Object.keys(filterValues).length>0){
        this.getfilteredMenuList(filterValues);
      }
    })
  }

  initialize() {
      this.MenusList = this.route.snapshot.data.menusList.data || [];
      this.dataChange.next(this.MenusList);       
  }
  
  getfilteredMenuList(filterValues:any={}) {
      this._menusService.getMenusList(filterValues)
      .subscribe(response=>{
        this.MenusList = response.data || [];
        this.dataChange.next(this.MenusList);
      });        
            
  }
  /** Add an item to to-do list */
  insertItem(parent: MenuItemNode, fromMenu: MenuItemNode): MenuItemNode {
    if (!parent.children) {
      parent.children = [];
    }
    const newItem = { ...fromMenu, menu_parent_id:parent.menu_id } as MenuItemNode;
    parent.children.push(newItem);
    if(parent.children.length>0){
      parent.children.forEach((childItem,index)=>{
        childItem.order = index;
      })
    }
    this.dataChange.next(this.data);
    
    return newItem;
  }

  insertItemAbove(node: MenuItemNode, fromMenu: MenuItemNode): MenuItemNode {
    const parentNode      = this.getParentFromNodes(node);
    const parent_menu_id  = parentNode ? parentNode.menu_id : 0;
    const newItem         = { ...fromMenu, menu_parent_id:parent_menu_id } as MenuItemFlatNode;
    
    if (parentNode != null) {
      parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
      //Set Order Of Child Menus
      if(parentNode.children.length>0){
        parentNode.children.forEach((childItem,index)=>{
          childItem.order = index;
        })
      }
    } else {
      this.data.splice(this.data.indexOf(node), 0, newItem);
    }
    this.dataChange.next(this.data);
    
    return newItem;
  }

  insertItemBelow(node: MenuItemNode, fromMenu: MenuItemNode): MenuItemNode {
    const parentNode      = this.getParentFromNodes(node);
    const parent_menu_id  = parentNode ? parentNode.menu_id : 0;
    const newItem         = { ...fromMenu, menu_parent_id:parent_menu_id } as MenuItemFlatNode;;
    if (parentNode != null) {
      parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
      //Set Order Of Child Menus
      if(parentNode.children.length>0){
        parentNode.children.forEach((childItem,index)=>{
          childItem.order = index;
        })
      }
    } else {
      this.data.splice(this.data.indexOf(node) + 1, 0, newItem);
    }
    this.dataChange.next(this.data);
    
    return newItem;
  }

  getParentFromNodes(node: MenuItemNode): MenuItemNode {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  getParent(currentRoot: MenuItemNode, node: MenuItemNode): MenuItemNode {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (let i = 0; i < currentRoot.children.length; ++i) {
        const child = currentRoot.children[i];
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

  deleteItem(node: MenuItemNode) {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
    
  }

  copyPasteItem(from: MenuItemNode, to: MenuItemNode): MenuItemNode {
          
    const newItem = this.insertItem(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemAbove(from: MenuItemNode, to: MenuItemNode): MenuItemNode {
    
    const newItem = this.insertItemAbove(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemBelow(from: MenuItemNode, to: MenuItemNode): MenuItemNode {
    
    const newItem = this.insertItemBelow(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  deleteNode(nodes: MenuItemNode[], nodeToDelete: MenuItemNode) {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }
}