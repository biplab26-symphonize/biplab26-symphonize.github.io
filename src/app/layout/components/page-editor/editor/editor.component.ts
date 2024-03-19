import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'app/_services';
import { TemplatesComponent } from './templates/templates.component';

@Component({
  selector: 'page-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EditorComponent implements OnInit {
  @Input() editpageInfo:any;
  @Input() editEntry:boolean=false;
  @Output() onPageUpdate=new EventEmitter<any>();
  templateDialogref: MatDialogRef<TemplatesComponent>;
  containerData:any;
  constructor(
    public _matDialog: MatDialog,
    private _matSnackBar : MatSnackBar,
    private _commonService: CommonService
  ) { }

  ngOnInit() {
    
  }
  ngOnChanges(){
    if(this.editpageInfo){
      this.containerData = this.editpageInfo;
    }
  }
  //OPEN LIST OF TEMPLATES TO CHOOSE 
  OpenTemplatesDialog(){
    this.templateDialogref = this._matDialog.open(TemplatesComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:{blank:true}
    });
    this.templateDialogref.afterClosed()
      .subscribe(result => {
          if ( result ){
            console.log("result>>>",result);
            this.createContainer(result);
          }
          this.templateDialogref = null;
    });
  }
  //CREATE CONTAINER WITH TEMPLATE ID RECEIVED FROM POPUP
  createContainer(dialogData:any){
    this.containerData = dialogData;
  }  
  //SHOW ADD CONTAINER BUTTON ON REMOVE ALL CONTAINERS
  showEmptyMessage(event:any){
    if(event==true){
      this.containerData = null;
    }
  }
  submitContainerInfo($event){
    this.onPageUpdate.emit($event);
  }

}
