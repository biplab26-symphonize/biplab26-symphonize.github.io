import { Component, OnInit, Input, Output, EventEmitter, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { CommonService, PageOptionsList } from 'app/_services';
import { TemplatesComponent } from '../templates/templates.component';
import { TemplateLoaderComponent } from '../template-loader/template-loader.component';

@Component({
  selector: 'page-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  @Input() containerData:any;
  @Input() editEntry:boolean=false;
  @Output() onEmptyContainer=new EventEmitter<boolean>();
  @Output() onUpdateContainer=new EventEmitter<any>();
  @ViewChildren(TemplateLoaderComponent) tempLoaderChildren: QueryList<TemplateLoaderComponent>;


  containerDefaultInfo: any[]=[];
  pageOptionsArray: any[]=[];
  containerDialogref: MatDialogRef<SettingsDialogComponent>;
  templateDialogref: MatDialogRef<TemplatesComponent>;
  public containerInputJson : any[]=[];
  public button: any;
  constructor(
    private _commonService: CommonService,
    public _matDialog: MatDialog,
    public _pageOptionsList:PageOptionsList,
  ) {
  }

  ngOnInit() {
    //If containerData has templateId
    if(this.containerData && this.editEntry==false){
      this.setContainerDefaultInfo();
    }
    //If Edit Entry then assign data from service
    if(this.containerData && this.editEntry==true){
      this.setContainerEditInfo();
    }
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
        let currentData = JSON.parse(themeData);
        themeData = currentData[0];
    }
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };    
  }

  OpenContainerSettingsDialog(contIndex: number=0){
    this.containerDialogref = this._matDialog.open(SettingsDialogComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:{currentIndex:contIndex,pageOptions:this.pageOptionsArray,containerData:this.containerData,editEntry:this.editEntry}
  });
  this.containerDialogref.afterClosed()
      .subscribe(result => {
        if ( result && result.formData && result.index>=0){
          //this.containerInputJson[result.index] = {...this.containerInputJson[result.index],...result.formData};
          if(result.formData.general){
            this.containerInputJson[result.index].general = result.formData.general;
          }
          if(result.formData.design){
            this.containerInputJson[result.index].design = result.formData.design;
          }
          if(result.formData.background){
            this.containerInputJson[result.index].background = result.formData.background;
          }
          this.onUpdateContainer.emit(this.containerInputJson); 
        }
        this.containerDialogref = null;
      });
  }

  //Container DefaultInfo by json
  setContainerDefaultInfo(){
    this._pageOptionsList.getPageOptions().subscribe(pageInfo=>{
      this.pageOptionsArray = pageInfo; 
      if(pageInfo.containerJson){
        //Add Template Info if user select template else blank container
        if(this.containerData.template==true){
          pageInfo.containerJson.isrow = 'Y';          

          //Copy columns by size and column nos
          var columns     = [...Array(parseInt(this.containerData.columns)).keys()];
          var sizes       = this.containerData.size.split("-");           
          var columnArray = [];
          
          columns.forEach((item,index)=>{
            this.containerData.columnwidth = sizes[index].toString();
            columnArray.push({...this.containerData});
          });
          
          pageInfo.containerJson.row.columns = JSON.parse(JSON.stringify(columnArray));
        }
        this.containerInputJson.push(pageInfo.containerJson);
      }
    });
  }
  //Container Edit Info bind 
  setContainerEditInfo(){
    this._pageOptionsList.getPageOptions().subscribe(pageInfo=>{
      this.pageOptionsArray = pageInfo; 
      if(this.containerData){
        if(Array.isArray(this.containerData) && pageInfo.containerJson){
          let editJsonArr = JSON.parse(JSON.stringify(this.containerData));
          this.containerInputJson = editJsonArr;
        }
        else{
          //Add Template Info if user select template else blank container
          if(this.containerData.template==true){
            pageInfo.containerJson.isrow = 'Y';
            //Copy columns by size and column nos
            var columns     = [...Array(parseInt(this.containerData.columns)).keys()];
            var sizes       = this.containerData.size.split("-");           
            var columnArray = [];            
            columns.forEach((item,index)=>{
              this.containerData.columnwidth = sizes[index].toString();
              columnArray.push({...this.containerData});
            });            
            pageInfo.containerJson.row.columns = JSON.parse(JSON.stringify(columnArray));
          }
          this.containerInputJson.push(pageInfo.containerJson);
        }
        
      }
    });
  }
  //CLONE CONTAINER
  cloneContainer(containerIndex:number){
    var newContObject = JSON.parse(JSON.stringify(this.containerInputJson[containerIndex]));
    this.containerInputJson.push(newContObject);
    this.onUpdateContainer.emit(this.containerInputJson); 
  }
  //REMOVE CONTAINER
  removeContainer(containerIndex:number){
    this.containerInputJson.splice(containerIndex,1);
    this.onUpdateContainer.emit(this.containerInputJson); 
    if(this.containerInputJson.length==0){
      this.onEmptyContainer.emit(true);
    }
  }
  //PUSH COLUMN ARRAY TO CONTAINER
  copiedColumn(copiedColArray:any,contIndex:number){
    if(copiedColArray && copiedColArray.length>0){
      this.containerInputJson[contIndex].row.columns = [];
      this.containerInputJson[contIndex].row.columns = [...copiedColArray];
      this.updateActiveLoader();
    }
  }
  //REMOVE COLUMN FROM TEMPLATE LOADER
  removeColumnFromContainer(colIndex:number,contIndex:number){
    if(this.containerInputJson.length>0 && colIndex>=0){
      this.containerInputJson[contIndex].row.columns.splice(colIndex,1);
      if(this.containerInputJson[contIndex].row.columns.length==0){
        this.containerInputJson[contIndex].isrow='N';
      }
      this.updateActiveLoader();
      this.onUpdateContainer.emit(this.containerInputJson);
    }
  }
  //ADD COLUMN INTO EXSITING CONTAINER
  OpenTemplatesDialog(currentIndex:number){
    this.templateDialogref = this._matDialog.open(TemplatesComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:{blank:false,type:'container'}
    });
    this.templateDialogref.afterClosed()
      .subscribe(result => {
          if ( result ){
            this.containerInputJson[currentIndex].isrow='Y';

            //Copy columns by size and column nos
            var columns     = [...Array(parseInt(result.columns)).keys()];
            var sizes       = result.size.split("-");           
            var columnArray = [];
            
            columns.forEach((item,index)=>{
              result.columnwidth = sizes[index].toString();
              columnArray.push({...result});
            });
            let existingColumns = [...this.containerInputJson[currentIndex].row.columns];
            let newlyAdded      = [...JSON.parse(JSON.stringify(columnArray))];
            this.containerInputJson[currentIndex].row.columns = [ ...existingColumns, ...newlyAdded];
            //this.containerInputJson[currentIndex].row.columns.push({result});
            this.updateActiveLoader();
          }
          this.templateDialogref = null;
    });
  } 
  //GET ACTIVE LOADER COMPONENT BY VIEWCHILDREN
  updateActiveLoader(){
    if(this.tempLoaderChildren!==undefined){
      let childActiveIndex = this.tempLoaderChildren.toArray();
      childActiveIndex.forEach((child) => { 
        child.updateColumns();
      });
    }
  }
  //SET COLUMN INFO
  setColumnInfo($event:any,containerIndex:number){
    
    if($event && $event.column && this.containerInputJson[containerIndex].row){
      this.containerInputJson[containerIndex].row.columns[$event.columnIndex] = {...$event.column};
      this.updateActiveLoader();
      console.log(this.containerInputJson);
      this.onUpdateContainer.emit(this.containerInputJson);  
    }
  }
  //Update Sorting Of Columns
  updatesortColumns($event:any,containerIndex:number){
    if($event && $event.length>0 && this.containerInputJson[containerIndex].row){
      this.containerInputJson[containerIndex].row.columns = [...$event];
      this.updateActiveLoader();
      console.log(">>>>",this.containerInputJson);
      this.onUpdateContainer.emit(this.containerInputJson);  
    }
  }
}
