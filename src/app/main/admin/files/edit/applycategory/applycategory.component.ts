import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService, FilesService } from 'app/_services';

@Component({
  selector: 'apply-category',
  templateUrl: './applycategory.component.html',
  styleUrls: ['./applycategory.component.scss']
})

export class ApplyCategoryComponent
{
    public Categories: any[]=[];
    category: number=0;
    docIds: any[]=[];
    /**
     * Constructor
     *
     * @param {MatDialogRef<EditComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<ApplyCategoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _categoryService: CategoryService,
        private _filesService: FilesService
    )
    {
      if(this.data){
        this.docIds  = this.data.docIds;        
      }
    }
    ngOnInit(){
      this.Categories = this._categoryService.Categorys.data || [];
    }
    //Send Updated Form Values With Name And Category
    updateDocumentCategories(){
      let docInfo = {doc_id:this.docIds,category_id:this.category}
      this._filesService.applyCategory(docInfo)
        .subscribe(updateResponse=>{
          this.dialogRef.close(updateResponse);
      },
      error => {
        this.dialogRef.close(error);
      });
    }

}


