import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FormsService } from 'app/_services';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ImportComponent implements OnInit {
  public title: string;
  public isSubmit: boolean = false;
  public selectedFile: any;
  public isError: boolean = false;
  public FieldImportForm:FormGroup;
  public currentUser : any;
  public isSelected: boolean = false;
  public fileName:string = '';
  constructor(
      private fb:FormBuilder,
      private _formService : FormsService,
      private _matSnackBar : MatSnackBar) 
        {
            this.title= "Import form file";
        }

  ngOnInit() 
  {
    this.FieldImportForm=this.fb.group({
      file: this.fb.control('',Validators.required),
    });
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
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }
  uploadFile(event: Event) 
  {
      event.preventDefault();
			event.stopPropagation();  
				if (this.FieldImportForm)
				{
					  this.isSubmit = true;
            this.currentUser = JSON.parse(localStorage.getItem('token'));
            let formData = new FormData();
            formData.append('type', 'forms');
            formData.append('file', this.selectedFile),
            formData.append('created_by', this.currentUser.user_id); 

            this._formService.importFile('import/forms',formData)
            .subscribe(response =>
              {
                  this.isSubmit = false;
                  this.showSnackBar(response.message, 'CLOSE');
              },
              error => {
                // Show the error message
                this.showSnackBar(error.message, 'RETRY');
              });
        }
        else 
				{
					this.validateAllFormFields(this.FieldImportForm);
				}
  }
  validateAllFormFields(formGroup: FormGroup) 
	{
		Object.keys(formGroup.controls).forEach(field => {
		const control = formGroup.get(field);
		control.markAsTouched({ onlySelf: true });
		});
	}
}