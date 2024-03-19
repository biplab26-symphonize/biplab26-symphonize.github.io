import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService, CommonService, FilesService } from 'app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public fileInfo: any;
  public Categories: any[] = [];
  isSubmit: boolean = false;
  editFileInfo: any;
  changedFile: File;
  editDocumentForm: FormGroup;
  doc_id: number = 0;
  fileName: string = "";
  fileExtension: string = "pdf";
  category: any[] = [];
  category_name: string = "";
  /**
   * Constructor
   *
   * @param {MatDialogRef<EditComponent>} dialogRef
   */
  constructor(
    private _commonService: CommonService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _categoryService: CategoryService,
    private _formBuilder: FormBuilder,
    private _filesService: FilesService
  ) {
    if (this.data) {
      this.editFileInfo = this.data.fileInfo;
      this.doc_id = this.editFileInfo.doc_id;
      this.category = this.editFileInfo.documentscategories.map(catItem => { return catItem.category_id; }) || [];
      this.fileExtension = this.editFileInfo.doc_url.substr(this.editFileInfo.doc_url.lastIndexOf('.') + 1) || "";
      // this.fileName      = this.editFileInfo.doc_name+'.'+this.fileExtension || "";
      this.fileName = this.editFileInfo.doc_name || "";
    }
  }
  ngOnInit() {
    this.Categories = this._categoryService.Categorys.data || [];
    //Declare formFields
    this.editDocumentForm = this._formBuilder.group({
      doc_id: [this.doc_id, [Validators.required]],
      doc_name: [this.fileName, [Validators.required]],
      category: this.category,
      file: ['']
    });
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }
  //Get Uploaded File Object
  fileChangeEvent(event: any): void {
    this.changedFile = event && event.target.files[0] || null;
    this.editDocumentForm.get('file').setValue(this.changedFile);
    this.fileName = this.changedFile.name || "";
  }
  //Send Updated Form Values With Name And Category
  sendFileInfo() {
    let editformData = new FormData();
    editformData.append('doc_id', this.editDocumentForm.get('doc_id').value || "");
    editformData.append('doc_name', this.editDocumentForm.get('doc_name').value || "");
    editformData.append('category', this.editDocumentForm.get('category').value || 0);
    editformData.append('file', this.editDocumentForm.get('file').value || "");

    this._filesService.editSingleDocument(editformData)
      .subscribe(uploadResponse => {
        this.dialogRef.close(uploadResponse);
      },
        error => {
          this.dialogRef.close(error);
        });


  }

}

