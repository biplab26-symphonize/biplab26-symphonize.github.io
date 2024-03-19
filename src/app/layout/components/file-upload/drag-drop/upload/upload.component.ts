import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent
{
    public fileInfo: any;
    public Categories: any[]=[];
    isSubmit: boolean=false;
    uploadForm: FormGroup;
    fileName: string="";
    fileExtension: string="pdf";
    category: number=0;
    category_name: string="";
    /**
     * Constructor
     *
     * @param {MatDialogRef<UploadComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<UploadComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _categoryService: CategoryService,
        private _formBuilder: FormBuilder,
    )
    {
      if(this.data){
        this.category      = this.data.fileInfo.category || 0;
        this.category_name = this.data.fileInfo.category_name || "";
        this.fileName      = this.data.fileInfo.file_name || this.data.fileInfo.file.name;
        this.fileExtension = this.data.fileInfo.file.name.substr(this.data.fileInfo.file.name.lastIndexOf('.') + 1);
      }
    }
    ngOnInit(){
      this.Categories = this._categoryService.Categorys.data || [];
      //Declare formFields
      this.uploadForm = this._formBuilder.group({
        file_name     : [this.fileName,[Validators.required]],
        category      : [this.category],
        category_name : [this.category_name]       
      });
    }
    //Send Updated Form Values With Name And Category
    sendFileInfo(){
      if(this.uploadForm.get('category').value>0){
        
        const categoriesName = this.Categories.find(catItem=>{
          return catItem.id==this.uploadForm.get('category').value;
        });
        this.uploadForm.get('category_name').setValue(categoriesName.category_name || "");
      }

      this.dialogRef.close(this.uploadForm.value);
    }

}
