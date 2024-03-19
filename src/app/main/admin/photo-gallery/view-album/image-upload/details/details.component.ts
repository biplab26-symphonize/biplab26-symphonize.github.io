import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public fileInfo: any;
  public Categories: any[]=[];
  isSubmit: boolean=false;
  detailsForm: FormGroup;
  fileName: string="";
  fileExtension: string="image/*";
  title: string='';
  description: string="";
  /**
     * Constructor
     *
     * @param {MatDialogRef<DetailsComponent>} dialogRef
     */
    constructor(
      public dialogRef: MatDialogRef<DetailsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _formBuilder: FormBuilder,)
  {
    if(this.data){
      this.title         = this.data.fileInfo.title ? this.data.fileInfo.title : this.data.fileInfo.file && this.data.fileInfo.file.name ? this.data.fileInfo.file.name.split('.').slice(0, -1).join('.') :  this.data.fileInfo.value  && this.data.fileInfo.value.imagename ? this.data.fileInfo.value.imagename.split('.').slice(0, -1).join('.') : '';
      this.description   = this.data.fileInfo.description || "";      
    }
  }

  ngOnInit(){
    //Declare formFields
    this.detailsForm = this._formBuilder.group({
      title       : [this.title],
      description : [this.description]       
    });
  }

  //Send Updated Form Values With Name And Category
  sendFileInfo(){
    this.dialogRef.close(this.detailsForm.value);
  }

}
