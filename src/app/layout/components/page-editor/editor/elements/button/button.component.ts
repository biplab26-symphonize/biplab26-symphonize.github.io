import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'element-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input()  elementinfo:any;
  @Input()  elementindex:any;
  @Input()  columnindex:any;
  
  @Output() onCloneElement = new EventEmitter<any>(); //SEND EDIT DATA TO TMPL-ONE
  @Output() onEditElement = new EventEmitter<any>(); //SEND EDIT DATA TO TMPL-ONE
  @Output() onRemoveElement = new EventEmitter<any>(); //Remove Element

  constructor() { }

  ngOnInit() {
    this.applycssSettings(this.elementinfo)
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

  applycssSettings(element:any){
    if(element){
      document.documentElement.style.setProperty('(--texttransform)', element.texttransform);
      document.documentElement.style.setProperty('--buttontextcolor', element.buttontextcolor);
      document.documentElement.style.setProperty('--buttontexthover', element.buttontexthover);
      document.documentElement.style.setProperty('--gradienttop', element.gradienttop);
      document.documentElement.style.setProperty('--gradienttophover', element.gradienttophover);
      document.documentElement.style.setProperty('--gradientbottom', element.gradientbottom);
      document.documentElement.style.setProperty('--gradientbottomhover', element.gradientbottomhover);
    }
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void{
    this.onEditElement.emit(null);
  }

}
