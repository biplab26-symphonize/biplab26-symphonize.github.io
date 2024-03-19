import { Component, OnInit, Inject } from '@angular/core';
import { OptionsList,PageOptionsList } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  pageOptions: any = {columns:[]};
  constructor(
    public _pageOptionsList:PageOptionsList,
    public dialogRef: MatDialogRef<TemplatesComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this._pageOptionsList.getPageOptions().subscribe(pageInfo=>{
      this.pageOptions = pageInfo;
      if(this.pageOptions.columns){
        let updatedColumns = this.pageOptions.columns.map(column=>{
          column = {...column,...this.pageOptions.columnJson}
          return column;
        });
        this.pageOptions.columns = [...updatedColumns];
      }
    });
  }

  ngOnInit() {
  }

  selectTemplate(template){
    this.dialogRef.close(template);
  }

  //Disable json sort
  disableSort(){
    return 0;
  }

}
