import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { FieldsService } from 'app/_services';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ImportComponent implements OnInit {

  public title: string;
  public fileName:string = '';
  public isSubmit: boolean = false;
  public isSelected: boolean = false;
  public selectedFile: any;
  
  public FieldImportForm: FormGroup;

  constructor(
    private _formBuilder:FormBuilder,
    private _fieldService:FieldsService,
    private _matSnackBar:MatSnackBar
  ){}

  ngOnInit() {
    this.FieldImportForm = this._formBuilder.group({
      file: this._formBuilder.control('',Validators.required),
    })
  }

  onFileChanged(event) 
  {
    if (event.target.files.length) {
      this.selectedFile = event.target.files[0];
      let reader = new FileReader;
      reader.readAsText(this.selectedFile);
      this.isSelected = true;
      this.fileName = this.selectedFile.name;
      let index = this.selectedFile.name.lastIndexOf(".")+1;
      let extFile = this.selectedFile.name.substr(index,this.selectedFile.size).toLocaleLowerCase();
      if( extFile != "json" )
      {
        this.isSelected = false;
        this.selectedFile = "";
        this.FieldImportForm.controls['file'].setValue(this.selectedFile);
        this._matSnackBar.open('Only json files allowed !', 'Error', { verticalPosition: 'top',duration : 2000});
      }
    }
  }

  removeFile(){
    this.selectedFile = "";
    this.isSelected = false;
    this.FieldImportForm.controls['file'].setValue(this.selectedFile);
  }

  uploadFile(event: Event) 
  {
    event.preventDefault();
    event.stopPropagation(); 
    if (this.FieldImportForm.valid)
    {
        this.isSubmit = true;
        let formData = new FormData();
        formData.append('type', 'fields');
        formData.append('file', this.selectedFile)
      
        this._fieldService.importFile(formData)
        .subscribe(response =>
        {
            this.isSubmit = false;
            if(response.status == 200 && response.message=="success")
            {
              this.isSubmit = false;
              if(response.message=="success" && response.status==200)
              {   
                this._matSnackBar.open('Fields imported successfully  !', 'Success', { verticalPosition: 'top',duration : 2000});
              }
            }
            else
            {
              this._matSnackBar.open(response.message, 'Error', { verticalPosition: 'top',duration : 2000});
            }
        })
    }
    else 
    {
      CommonUtils.validateAllFormFields(this.FieldImportForm)
    }
  }
}
