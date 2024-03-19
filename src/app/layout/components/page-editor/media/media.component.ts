import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService,CategoryService } from 'app/_services';
import { AppConfig } from 'app/_services';
@Component({
  selector: 'page-editor-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  @Output() assignMediaUrl    = new EventEmitter<any>();
  public inputAccpets : string = ".jpeg, .jpg, .png";
  private file: File | null = null;
  public uploadedResponse:any={};
  public categories: any[]=[];
  public category_id: string='';
  public selectedMediaInfo:any={}; 
  public enableSubmit:boolean=false;
  public previewImg:string='';
  public mediaUrl: string = AppConfig.Settings.url.mediaUrl;
  constructor(
    public dialogRef: MatDialogRef<MediaComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _matSnackBar : MatSnackBar,
    private _commonService: CommonService,
    private _categoryService: CategoryService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this._categoryService.getCategorys({category_type:'M'}).then(cateInfo=>{
        this.categories = cateInfo.data || [];
      });
    }, 0);
  }

  fileChangeEvent(event: any): void {
    const file = event && event.target.files[0] || null;
    this.file = file;    
     this.saveMediaUpload();
  }

  saveMediaUpload(){   
    let type:string = ''
    let imageExtension:any = ['jpeg','jpg','png'];
    let audioExtension:any = ["aif ","mid","mp3","mpa","ogg","wma","wpl"];
    let videoExtension:any = ["mp4","mpeg","avi","wmv","mov"];
    let documentExtension:any = ["ppt","pptx","pdf","docx"];
    let index = this.file.name.lastIndexOf(".")+1;
    let extFile = this.file.name.substr(index,this.file.size).toLocaleLowerCase();
    if(imageExtension.includes(extFile)){
      type = 'pageimage';
    }
    else if(audioExtension.includes(extFile)){
      type = 'audio';
    }
    else if(videoExtension.includes(extFile)){
      type = 'video';
    }
    else if(documentExtension.includes(extFile)){
      type = 'document';
    }
    else{
      this.showSnackBar("This type media is not supported", 'CLOSE', 2000);
    }
    //Define formdata
    let documentInfo = new FormData();
    documentInfo.append('type',type);
    documentInfo.append('image',this.file);
    documentInfo.append('category_id',this.category_id);
    this._commonService.saveMedia(documentInfo,'media/globalmediainsert')
      .subscribe(uploadResponse=>{
        if(uploadResponse.status==200){
          // Show the success message
          this.showSnackBar(uploadResponse.message, 'CLOSE', 2000);
          if(uploadResponse.media && uploadResponse.media.image){
            this.sendMediaUrl(this.mediaUrl+uploadResponse.media.image);
          }
        }
        else{
          // Show the error message
          this.showSnackBar(uploadResponse.message, 'Retry', 2000);
        }        
    },
    error => {
      // Show the error message
      this.showSnackBar(error.message, 'RETRY', 2000);
    });
  }
  sendMediaUrl($event){
    this.selectedMediaInfo = {...this.dialogData,...{url:$event}}
    this.enableSubmit = true;
    this.previewImg   = $event;
  }
  submitMediaValues(withValue:boolean=false){
    if(withValue==true){
      this.dialogRef.close(this.selectedMediaInfo);    
    }
    else{
      this.dialogRef.close({});    
    }
    
  }
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string,duration:number=2000){
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration        : duration
    });
  }

}
