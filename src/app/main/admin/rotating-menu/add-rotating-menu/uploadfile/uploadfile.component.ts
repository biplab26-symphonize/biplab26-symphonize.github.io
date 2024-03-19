import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RotatingMenuService, MenusService, SettingsService, CommonService, AppConfig } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class UploadfileComponent implements OnInit {
 

  public title 		       : string = '';
  public url_id 		     : any;
  public ShowpdfName     : boolean = false;
  public showuploadbutton :boolean =false;
  _appConfig             : any = AppConfig.Settings
  weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  public Savedata        : any [];
  public currentmenuid   : any;
  public DayName         : any;
  public showday         :boolean = false;
  public currentData            : any ;
  public weekno          :  any;
  public editFormData    : boolean = false;
  uploadpdf              : FormGroup; 
  fileUploaderSettings   : any = {};  
  uploadInfo: any={
    'avatar':{'type':'defaultprofile','media_id':0,'url':"",'apimediaUrl':'media/upload'},
  };

  private file        : File | null = null;
  filetype            : Boolean =  true;
  filename            :  any;
  url                 : string = '';
  logourl             : string = '';
  public inputAccpets : string = ".pdf,.pdfx";
  mediaInfo: any;


  constructor(
    private fb				: FormBuilder,
    private rotatingservices :RotatingMenuService,
    private _ActivatedRoute: ActivatedRoute,
    private _matSnackBar 	: MatSnackBar,
    public dialogRef: MatDialogRef<UploadfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
		private route 			  : ActivatedRoute,
  ) {
    
      this.route.params.subscribe( params => {
      this.url_id = params.id; });

    this.rotatingservices.viewRotatingmenu({'id':data.urlid}).subscribe(res=>{
      this.currentmenuid =res.rotatingmenuinfo.id
    });
     this.currentData = data;
    
     if(this.currentData.index != undefined)
     {
      for(let i =0;i<this.weekdays.length;i++)
      {
        if(i ==this.currentData.index)
        {
         this.DayName=this.weekdays[i];
         this.showday=true;
        }
      }

     }
    

     if(this.currentData.currentpdfurl != undefined && this.currentData.id != undefined)
     {
        this.ShowpdfName = true;
        this.filename = this._appConfig.url.mediaUrl+'api'+'/'+'download'+'/'+'rotatingmenupdf'+'/'+this.currentData.id+'/'+this.currentData.currentpdfurl;
        // this.uploadInfo.avatar.url= (this.currentData.currentpdfurl? AppConfig.Settings.url.mediaUrl + this.currentData.currentpdfurl:"");
        // this.filename =  this.uploadInfo.avatar.url;
        this.title = "Rotating Menu Replace  PDF";
     }else{
      this.title = "Rotating Menu Upload PDF";
     } 
	
   
  
   }

  ngOnInit() {

    this.uploadpdf = this.fb.group({ 
      pdf_url           : this.fb.control(''),
      Pdf_name          : this.fb.control(''),      
      });
      
    }
    
  /* Selected PDf */
  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.showuploadbutton =true;
      reader.onload = (event: any) => { // called once readAsDataURL is completed
       
      }
    }
   
  }

  onsaveuploadfile()
  {

    let formData = new FormData();
    formData.append('file',this.file)
    formData.append('menu_id', this.currentmenuid)
    formData.append('week_no',this.currentData.week === undefined?null:this.currentData.week,)
    formData.append( 'week_day',this.currentData.index === undefined?null:this.currentData.index,)
    formData.append('id',this.currentData.id === undefined?null:this.currentData.id)
    
     this.rotatingservices.UploadthePdf(formData).subscribe(Response =>{
        this.showSnackBar(Response.message,'CLOSE');
        this.ShowpdfName = true;
        this.filename = this._appConfig.url.mediaUrl+'api'+'/'+'download'+'/'+'rotatingmenupdf'+'/'+Response.rotatingmenuspdf.id+'/'+Response.rotatingmenuspdf.pdf_title;
        // this.uploadInfo.avatar.url= (Response.rotatingmenuspdf.rotation_pdf? AppConfig.Settings.url.mediaUrl + Response.rotatingmenuspdf.rotation_pdf:"");
        // this.filename =  this.uploadInfo.avatar.url;
        this.Savedata =  Response.rotatingmenuspdf;
     },

     error => {
     // Show the error message
       this.showSnackBar(error.message, 'Retry');
     });
  }
   
  Showpdf(URl)
  {
    window.open(URl);
  }

  onNoClick(): void {
    this.dialogRef.close(this.Savedata);
  }

      /** SHOW SNACK BAR */
      showSnackBar(message:string,buttonText:string){
        this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
        });
      }
 
}
