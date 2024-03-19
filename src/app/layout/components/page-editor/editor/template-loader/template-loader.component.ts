import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { PageOptionsList } from 'app/_services';
import { TmplOneComponent } from '../templates/tmpl-one/tmpl-one.component';

@Component({
  selector: 'template-loader',
  templateUrl: './template-loader.component.html',
  styleUrls: ['./template-loader.component.scss']
})
export class TemplateLoaderComponent implements OnInit {
  @Input() templateinfo;
  @Input() currentIndex;

  @ViewChildren(TmplOneComponent) tempLoaderChildren: QueryList<TmplOneComponent>;
  @Output() onColumnUpdated       = new EventEmitter<any>();
  columnDialogref: MatDialogRef<SettingsDialogComponent>;
  public pageOptionsArray:any;
  @Output() onAddColumn           = new EventEmitter<any>();
  @Output() onRemoveColumn        = new EventEmitter<any>();
  @Output() onTemplateUpdated     = new EventEmitter<any>();
  @Output() onSortedColumns       = new EventEmitter<any>();
  public columnArray:any[]        = [];
  constructor(
    public _matDialog: MatDialog,
    public _pageOptionsList:PageOptionsList
  ) {}

  ngOnInit() {

    this._pageOptionsList.getPageOptions().subscribe(pageInfo=>{
      this.pageOptionsArray = pageInfo; 
    });

    //ADD COLUMNS ARRAY
    if(this.templateinfo && this.templateinfo.row && this.templateinfo.row.columns){
      this.columnArray = [...this.templateinfo.row.columns];
      this.columnArray.forEach(column=>{
        column.columnwidth = column.columnwidth ? column.columnwidth.toString() : '';
      });
      this.sendColumnToContainerOnload();
    }
  }

  OpenColumnSettingsDialog(currentInd:number){
    this.columnDialogref = this._matDialog.open(SettingsDialogComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:{currentIndex:currentInd,pageOptions:this.pageOptionsArray,columnData:this.columnArray[currentInd],type:'column'}
    });
    this.columnDialogref.afterClosed()
    .subscribe(result => {
        if ( result && result.formData && result.index>=0){
          this.columnArray[currentInd] = {...this.columnArray[currentInd],...result.formData};
          this.sendColumnToContainer({column:this.columnArray[currentInd],columnIndex:currentInd});
        }
        this.columnDialogref = null;
    });
  }

  updateColumns(){
    //ADD COLUMNS ARRAY
    if(this.templateinfo && this.templateinfo.row && this.templateinfo.row.columns){
      this.columnArray = [...this.templateinfo.row.columns];
      this.columnArray.forEach(column=>{
        column.columnwidth = column.columnwidth.toString();
      });
    }
  }

  //CLONE Column
  cloneColumn(colIndex:number){
    var newColObject = JSON.parse(JSON.stringify(this.columnArray[colIndex]));
    this.columnArray.push(newColObject);
    this.onAddColumn.emit(this.columnArray);
  }
  //REMOVE Column
  removeColumn(colIndex:number){
    this.columnArray.splice(colIndex,1); 
    this.onRemoveColumn.emit(colIndex);
  }
  //SEND COLUMN INFO TO CONTAINER ON SETTINGS POPU CLOSED
  sendColumnToContainerOnload(){
    if(this.columnArray.length>0){
      this.onTemplateUpdated.emit({column:this.columnArray[this.columnArray.length-1],columnIndex:this.columnArray.length-1});    
    }
  }
  //SEND COLUMN INFO TO CONTAINER ON SETTINGS POPU CLOSED
  sendColumnToContainer(event:any){
    this.onTemplateUpdated.emit(event);
  }

  //UPDATE COLUMN ELEMENT ARRAY AND SEND OT TO CONTAINER
  setElementToColumn(element:any,colIndex:number){
    if(element!==null && element!=='' && element!==undefined && colIndex>=0){
      this.columnArray[colIndex].elements.push(element);
      this.sendColumnToContainer({column:this.columnArray[colIndex],columnIndex:colIndex});
    }
  }
  //UPDATE COLUMN ELEMENT ARRAY AND SEND OT TO CONTAINER
  updateElementToColumn(element:any,colIndex:number){
    if(element!==null && element!=='' && element!==undefined && element.elementInfo!==undefined  && element.elementIndex>=0 && colIndex>=0){
      this.columnArray[colIndex].elements[element.elementIndex]= element.elementInfo;
      this.sendColumnToContainer({column:this.columnArray[colIndex],columnIndex:colIndex});
    }
  }   
  //REMOVE ELEMENT FROM COLUMN AND UPDATE COLUMNARRAY
  removeElementFromColumn(elementindex:number,colIndex:number){
      this.columnArray[colIndex].elements.splice(elementindex,1);
      this.sendColumnToContainer({column:this.columnArray[colIndex],columnIndex:colIndex});
  }
  /** SORTING COLUMNS */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    //Update ColumnArray after sorting
    this.columnArray = [...event.container.data];
    this.columnArray.forEach(column=>{
      column.columnwidth = column.columnwidth.toString();
    });
    this.onSortedColumns.emit(this.columnArray);
  }
  /** UPDATE ELEMENTS ARRAY IN COLUMN AND SEND TO CONTAINER */
  updateColumnElements($event:any,colIndex:number){
    if($event && $event.elements.length>0 && colIndex>=0){
      this.columnArray[$event.colIndex].elements = [...$event.elements];
      this.sendColumnToContainer({column:this.columnArray[$event.colIndex],columnIndex:$event.colIndex});
    }
  }
  /**UPDATE COLUMN WIDTH FROM DROPDOWN AND SEND TO CONTAINER */
  updateColumnWidth(colIndex:number){
    this.sendColumnToContainer({column:this.columnArray[colIndex],columnIndex:colIndex});
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void{
  }

}
