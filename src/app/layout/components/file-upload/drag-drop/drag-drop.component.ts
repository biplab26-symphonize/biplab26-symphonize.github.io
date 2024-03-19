import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileHandle } from './drag-drop.directive';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, FilesService } from 'app/_services';
import { UploadComponent } from './upload/upload.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit {
 
  @Input() menu: Object;
  @Input() allowMultiple: boolean=false;
  @Input() fileLimit: number=2;
  @Output() onfilesUploaded=new EventEmitter<object>();
  //Edit uploaded file info like name / category
  UploadDialogref: MatDialogRef<UploadComponent>; //EXTRA Changes  
  uploadInProgress: boolean=false;
  inputAccpets: string=".pdf";
  userInfo: any = {};
  constructor(
    private router: Router,
    public _matDialog: MatDialog,
    private _authService:AuthService,
    private _filesService:FilesService,
    private _matSnackBar:MatSnackBar
    ) { }

  ngOnInit() {
    this.userInfo = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : {};
    }

  files: any = [];

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }
  filesUploaded(event: any):void{    
    if(event.target.files.length>0){
      if(this.allowMultiple==true){
        for (let i = 0; i < event.target.files.length; i++) {
          const file = event.target.files[i];
          const fileSize = file.size;
          let maxfileSize = 1024 * (this.fileLimit * 1024);
          if(fileSize<=maxfileSize){
            this.files.push({ file });
            this.showSnackBar("File added sucessfully !", 'CLOSE');
          }
          else{
            this.showSnackBar('Allowed file size is '+this.fileLimit+' MB','Retry');
          }          
        }
      }
      else{
          this.files = [];
          const file = event.target.files[0];
          const fileSize = file.size;
          let maxfileSize = 1024 * (this.fileLimit * 1024);
          if(fileSize<=maxfileSize){
            this.files.push({ file });
          }
          else{
            this.showSnackBar('Allowed file size is '+this.fileLimit+' MB','Retry');
          }
      }
    }
  }
  //Snackbar for invalid file
  invalidFiles(event:any){
    this.showSnackBar(event.message,event.buttonText);
  }

  removeDocument(index:any){
    this.files.splice(index, 1);
  }
  //Single File Upload For Menu_source_type = URL
  singleDocumentUpload(){
   
    if(this.menu && this.files){
      this.uploadInProgress = true;
      let uploadInfo = new FormData();
      uploadInfo.append('menu_info',JSON.stringify(this.menu));
      uploadInfo.append("file", this.files[0]['file']);
      uploadInfo.append("created_by", this.userInfo.id || 0);
      this._filesService.saveSingleDocument(uploadInfo)
        .subscribe(uploadResponse=>{
          // Show the success message
          this.showSnackBar(uploadResponse.message, 'CLOSE');
          this.files = [];
          if(uploadResponse.status==200){
            this.onfilesUploaded.emit(uploadResponse.documentinfo || {});
            //this.router.navigate(['admin/files/library']);
          }
          this.uploadInProgress = false;
          
      },
      error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY');
          this.uploadInProgress = false;
      });
    }
  }
  //Upload multiple documents
  multipleDocumentUpload(){
    if(this.menu && this.files){
      this.uploadInProgress = true;
      let uploadInfo = new FormData();
     
      uploadInfo.append('menu_info',JSON.stringify(this.menu));
      for (var i = 0; i < this.files.length; i++) {
        let fileName = this.files[i].file_name ? this.files[i].file_name.replace(".pdf", "") : this.files[i]['file']['name'] ? this.files[i]['file']['name'].replace(".pdf", "") : '';
        uploadInfo.append("file[]", this.files[i]['file']);
        uploadInfo.append("filename[]", fileName);
        uploadInfo.append("category[]", this.files[i].category || 0);
      } 
      
      uploadInfo.append("created_by", this.userInfo.id || 0);
      this._filesService.saveMultipleDocument(uploadInfo)
        .subscribe(uploadResponse=>{
         
          if(uploadResponse.status==200){
          
            // Show the success message
            this.showSnackBar(uploadResponse.message, 'CLOSE');
            this.files = [];
            this.onfilesUploaded.emit(uploadResponse.status);
          }
          else{
            // Show the error message
            this.showSnackBar(uploadResponse.message, 'CLOSE');
          }
          this.uploadInProgress = false;
      },
      error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY');
      });
    }
  }
  /** Edit Uploaded File Name or Category */
  editUploadedFileInfo(fileIndex: any){
    
    this.UploadDialogref = this._matDialog.open(UploadComponent, {
      disableClose: false,
      data: {
        fileInfo: this.files[fileIndex]
      }
    });        
    this.UploadDialogref.afterClosed()
        .subscribe(result => {
            if ( result ) {
              let fileName                        = result.file_name ? result.file_name.replace(".pdf", "") : '';
              this.files[fileIndex].file_name     = fileName;
              this.files[fileIndex].category      = result.category;
              this.files[fileIndex].category_name = result.category_name;
            }
            this.UploadDialogref = null;
        });
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }

}
