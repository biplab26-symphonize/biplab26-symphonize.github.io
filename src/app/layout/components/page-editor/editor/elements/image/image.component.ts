import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'element-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input()  elementinfo:any;
  @Input()  elementindex:any;
  @Input()  columnindex:any;
  @Output() onEditElement = new EventEmitter<any>(); //SEND EDIT DATA TO TMPL-ONE
  @Output() onCloneElement = new EventEmitter<any>(); //SEND EDIT DATA TO TMPL-ONE
  @Output() onRemoveElement = new EventEmitter<any>(); //Remove Element

  constructor() { }

  ngOnInit() {
  }

  openEditElementDialog(){
    this.onEditElement.emit({elementindex:this.elementindex,columnindex:this.columnindex,elementId:this.elementinfo.type});
  }
  cloneElement(){
    this.onCloneElement.emit({elementindex:this.elementindex});
  }
  removeElement(){
    this.onRemoveElement.emit({elementindex:this.elementindex});
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void{
    this.onEditElement.emit(null);
  }

}
