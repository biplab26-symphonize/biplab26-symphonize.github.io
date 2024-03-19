import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, MenusService, CommonService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { MenuItemNode } from 'app/_models/menuitem.node';
import { MenuItemFlatNode } from 'app/_models/menuitem.flatnode';

import { ActivatedRoute } from '@angular/router';
import { Subject, merge } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MenusDatabase } from './menu.database';
import { CommonUtils } from 'app/_helpers';
import { takeUntil, first, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [MenusDatabase]
})
export class ListComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  _localUserSettings: any;
  isTrashView: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
  selection = new SelectionModel<any>(true, []);
  filterForm: FormGroup;
  filterParams: any = {};
  Columns: [];
  StatusList: any;
  PositionsList: any;
  MenusList: any[];
  _selectedMenuids: any;
  /** DRAG DROP SECTION VARIABLES */


  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<MenuItemFlatNode, MenuItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<MenuItemNode, MenuItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: MenuItemFlatNode | null = null;

  treeControl: FlatTreeControl<MenuItemFlatNode>;

  treeFlattener: MatTreeFlattener<MenuItemNode, MenuItemFlatNode>;

  dataSource: MatTreeFlatDataSource<MenuItemNode, MenuItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<MenuItemFlatNode>(true /* multiple */);

  /* Drag and drop */
  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: string;
  @ViewChild('emptyItem', { static: true }) emptyItem: ElementRef;

  getLevel = (node: MenuItemFlatNode) => node.level;

  isExpandable = (node: MenuItemFlatNode) => node.expandable;

  getChildren = (node: MenuItemNode): MenuItemNode[] => node.children;

  hasChild = (_: number, _nodeData: MenuItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: MenuItemFlatNode) => _nodeData.menu_title === '';

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private route: ActivatedRoute,
    public _matDialog: MatDialog,
    private _menusService: MenusService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private database: MenusDatabase
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<MenuItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.PositionsList = OptionsList.Options.menus.positions;
    this.StatusList = OptionsList.Options.tables.status.users;


    //Show Buttons Of permenat Delete and restore on trash view
    if (this.route.routeConfig.path == 'admin/menus/trash') {
      this.isTrashView = true;
    }

    //Declare Filter Form
    this.filterForm = this._formBuilder.group({
      menu_status: [''],
      position: [''],
      trash: [this.isTrashView == true ? 1 : '']

    });


    merge(this.filterForm.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.filterForm['position'] = 'M'
        this.database.getfilteredMenuList(this.filterForm.value);
      });

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };

    let checkelement = Array.from(document.getElementsByClassName('mat-paginator-icon') as HTMLCollectionOf<HTMLElement>);
    checkelement.forEach((element) => {
      element.style.backgroundColor = themeData.table_header_background_color;
      element.style.color = themeData.table_font_color;
      element.style.width = '24px';
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  updateMenusOrder() {
    if (this.dataSource.data) {
      let MenusArray = this.dataSource.data;
      MenusArray.forEach((item, index) => {
        item.order = index + 1;

      });

      let Menuslist = CommonUtils.getFlatArrayJson(MenusArray);
      //Call Update Order And Parent Menu Id Api
      this._menusService.updateMenuorder(Menuslist)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              this.showSnackBar(data.message, 'CLOSE');
            }
            else {
              this.showSnackBar(data.message, 'CLOSE');
            }
          },
          error => {
            // Show the error message
            this.showSnackBar(error.message, 'Retry');
          });
    }
  }

  /** SOFT OR PERMENENT DELETE USER */
  deleteMenus(menuId: number = 0) {
    if (menuId > 0) {
      this.selection.selected.push(menuId);
      this._selectedMenuids = this.selection.selected;
    }
    else {
      this._selectedMenuids = this.checklistSelection.selected.map(item => { return item.menu_id });
    }

    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected user?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this._menusService.deleteMenus({ 'menu_id': this._selectedMenuids })
            .subscribe(deleteResponse => {
              this.checklistSelection.clear();
              this.database.getfilteredMenuList(this.filterForm.value);
              // Show the success message
              this.showSnackBar(deleteResponse.message, 'CLOSE');
            },
              error => {
                // Show the error message
                this.showSnackBar(error.message, 'RETRY');
              });
        }
        else {
          this.checklistSelection.clear();
        }
        this.confirmDialogRef = null;
      });
  }
  changeStatus(type: string = "A") {

    this._selectedMenuids = this.checklistSelection.selected.map(item => { return item.menu_id });
    this._commonService.changeStatus({ 'id': this._selectedMenuids, 'status': type, 'type': 'Menus' })
      .subscribe(statusResponse => {
        this.checklistSelection.clear();
        this.database.getfilteredMenuList(this.filterForm.value);
        // Show the success message
        this.showSnackBar(statusResponse.message, 'CLOSE');
      },
        error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY');
        });
  }
  /**RESTORE USER */
  restoreOrDeleteMenus(menuId: number = 0, permenent: boolean = false) {
    if (menuId > 0) {
      this.selection.selected.push(menuId);
      this._selectedMenuids = this.selection.selected;
    }
    else {
      this._selectedMenuids = this.checklistSelection.selected.map(item => { return item.menu_id });
    }
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    let confirmMessage = 'Are you sure you want to restore selected menus?';
    let apiEndPoint = 'menurestore';
    //set ApiEndPoint as per flag
    if (permenent == true) {
      confirmMessage = 'Are you sure you want to delete selected menus? menus cannot be restored';
      apiEndPoint = 'menupermanentdelete';
    }

    this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this._commonService.restoreItems({ 'menu_id': this._selectedMenuids, 'endPoint': apiEndPoint })
            .subscribe(restoreResponse => {
              this.checklistSelection.clear();
              this.database.getfilteredMenuList(this.filterForm.value);
              // Show the success message
              this.showSnackBar(restoreResponse.message, 'CLOSE');
            },
              error => {
                // Show the error message
                this.showSnackBar(error.message, 'RETRY');
              });
        }
        else {
          this.checklistSelection.clear();
        }
        this.confirmDialogRef = null;
      });
  }
  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }



  /**########################
   * ###### MENU TREE FUNCTIONS ###########
   * ########################
   */

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: MenuItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.menu_id === node.menu_id
      ? existingNode
      : new MenuItemFlatNode();
    flatNode.menu_id = node.menu_id;
    flatNode.menu_title = node.menu_title;
    flatNode.menu_parent_id = node.menu_parent_id;
    flatNode.order = node.order;
    flatNode.menu_status = node.menu_status;

    flatNode.level = level;
    flatNode.expandable = (node.children && node.children.length > 0);

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: MenuItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: MenuItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: MenuItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  handleDragStart(event, node) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();

    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    const percentageX = event.offsetX / event.target.clientWidth;
    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event, node) {
    event.preventDefault();
    if (node !== this.dragNode) {
      let newItem: MenuItemNode;
      if (this.dragNodeExpandOverArea === 'above') {
        newItem = this.database.copyPasteItemAbove(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else if (this.dragNodeExpandOverArea === 'below') {
        newItem = this.database.copyPasteItemBelow(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else {
        newItem = this.database.copyPasteItem(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      }
      this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
      this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
    //Call Update order function
    this.updateMenusOrder();
  }

  handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

}


