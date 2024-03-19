import { Component, OnInit, Inject } from '@angular/core';
import { PageOptionsList } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent implements OnInit {

  pageOptions: any = {columns:[]};
  constructor(
    public _pageOptionsList:PageOptionsList,
    public dialogRef: MatDialogRef<ElementsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  ngOnInit() {
    this._pageOptionsList.getPageOptions().subscribe(pageInfo=>{
      this.pageOptions = pageInfo;
    });
  }

  chooseElement(element){
    this.dialogRef.close(element);
  }

}
