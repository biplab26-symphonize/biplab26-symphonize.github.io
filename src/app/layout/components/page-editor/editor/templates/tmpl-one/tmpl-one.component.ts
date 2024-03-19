import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ElementsComponent } from '../../elements/elements.component';
import { PageOptionsList } from 'app/_services';
import { TextSettingsComponent } from '../../settings-dialog/text-settings/text-settings.component';
import { VideoSettingsComponent } from '../../settings-dialog/video-settings/video-settings.component';
import { ButtonSettingsComponent } from '../../settings-dialog/button-settings/button-settings.component';
import { ContentBoxesSettingsComponent } from '../../settings-dialog/content-boxes-settings/content-boxes-settings.component';
import { ImageSettingsComponent } from '../../settings-dialog/image-settings/image-settings.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'page-tmpl-one',
  templateUrl: './tmpl-one.component.html',
  styleUrls: ['./tmpl-one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TmplOneComponent implements OnInit {
  @Input() column;
  @Input() currentIndex;

  readonly elementMapper = {
    text      : TextSettingsComponent,
    media     : VideoSettingsComponent,
    button    : ButtonSettingsComponent,
    quicklinks: ContentBoxesSettingsComponent,
    image     : ImageSettingsComponent,
  };

  pageOptions: any[]=[];
  @Output() onElementAdded        = new EventEmitter<any>();
  @Output() onElementEdit         = new EventEmitter<any>();
  @Output() onElementRemove       = new EventEmitter<any>();
  @Output() onSortedElements      = new EventEmitter<any>();
  elementsDialogref: MatDialogRef<any>;
  constructor(
    public _matDialog: MatDialog,
    public _pageOptionsList:PageOptionsList
  ) { }

  ngOnInit() {
    this._pageOptionsList.getPageOptions().subscribe(pageInfo=>{
      this.pageOptions = pageInfo;
    });
  }  
  OpenElementsDialog(currentInd:number){
    this.elementsDialogref = this._matDialog.open(ElementsComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:{currentIndex:currentInd,columnData:this.column}
    });
    this.elementsDialogref.afterClosed()
    .subscribe(result => {
      this.elementsDialogref = null;
      if(result!==''){
        this.OpenElementSettingsDialog(result);
      }
    });
  }
  //OPEN ELEMENT SETTINGS DIALOG
  OpenElementSettingsDialog(elementId:number){
    this.elementsDialogref = this._matDialog.open(this.elementMapper[elementId], {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:{elementId:elementId,columnData:this.column,pageOptions:this.pageOptions}
    });
    this.elementsDialogref.afterClosed()
    .subscribe(elementData => {
      if(elementData){
        this.onElementAdded.emit(elementData);
      }  
      this.elementsDialogref = null;
    });
  }

  //OPEN ELEMENT EDIT DIALOG 
  openEditElementDialog($event:any=null){
    if($event!==null){
      this.elementsDialogref = this._matDialog.open(this.elementMapper[$event.elementId], {
        disableClose: false,
        panelClass: 'full-screen-dialog',
        data:{elementId:$event.elementId,elementData:this.column.elements[$event.elementindex],pageOptions:this.pageOptions}
      });
      this.elementsDialogref.afterClosed()
      .subscribe(elementData => {
        if(elementData){
          // this.onElementAdded.emit(elementData);
          this.column.elements[$event.elementindex] = {...elementData};
          let editeleData = {elementInfo:this.column.elements[$event.elementindex],elementIndex:$event.elementindex};
          this.onElementEdit.emit(editeleData);
        }  
        this.elementsDialogref = null;
      });
    }
  }

  cloneElement($event){
    if($event!==null){
      var newEleObject = JSON.parse(JSON.stringify(this.column.elements[$event.elementindex]));
      this.onElementAdded.emit(newEleObject);
    }
  }

  removeElement($event){
    if($event!==null){
      this.onElementRemove.emit($event.elementindex);  
    }
  }

  /** SORTING COLUMNS */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    //Update ColumnArray after sorting
    this.column.elements = [...event.container.data];
    this.onSortedElements.emit({elements:this.column.elements,colIndex:this.currentIndex});
  }
  
  /**
   * On destroy
   */
  ngOnDestroy(): void{
  }
}
