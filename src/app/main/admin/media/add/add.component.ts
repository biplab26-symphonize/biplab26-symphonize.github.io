import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { CategoryService, MediaService, CommonService, AppConfig } from 'app/_services';
import { Media } from 'app/_models';
import { ActivatedRoute } from '@angular/router';
import { NativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCropperComponents } from './image-cropper/image-cropper.component';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations   : fuseAnimations
})
export class AddComponent implements OnInit {

  public category_id:number;
  public categoryId: any;
  public image: any;
  public title:string = 'Upload new media';
  uploadInfo: any={};
  mediaData:any;
  public imageCropUrl : any;
  editform:boolean = false;
  showeditedImg : boolean = false;
  private file: File | null = null;
  croppedImage: string ="";
  hiddencroppedImage: boolean=false;
  public uploadedResponse:any={};
  editImgName:any ;
  image_name :any ;
  editmedia_id

	// Private
	private _unsubscribeAll: Subject<any>;

	/**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(  public _matSnackBar:MatSnackBar,
        public _commonService:CommonService,
        private _categoryService : CategoryService,
         private _dialog: MatDialog,
        private route : ActivatedRoute,
        private _mediaService : MediaService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
         

        this.category_id = this._categoryService.Categorys.data.length>0 ? this._categoryService.Categorys.data[0].id : null;
        this.uploadInfo ={
          'media':{'type':'mediaUpload','category_id':this.category_id,'media_id':0,'formControlName':'mediaupload','url':"",'apimediaUrl':'media/globalmediainsert'}
        };

      //Load Edit Form Values
      if(this.route.routeConfig.path=='admin/media/edit/:id'){
        this.title = 'Edit media';
        this.editform = true;
        this.fillFormValues();
      }
    }

    /**
     * On init
     */
	ngOnInit(){
    this.categoryId = this.category_id;
  }

  fillFormValues(){
    this. mediaData = new Media().deserialize(this._mediaService.singlemedia,'singlemedia');
    //send file urls and mediaId to file-upload compoenent
    this.showeditedImg = false;
    this.editImgName = this.mediaData.imagename;
    this.uploadInfo['media'].media_id = this.mediaData.media_id || 0;
    //file urls
    this.uploadInfo['media'].url = this.mediaData.image || "";
  }

  setUploadMediaValue($event){
    if($event.uploadResponse){
  
      let mediaInfo = new Media().deserialize($event.uploadResponse.media,'singlemedia');
      this.mediaData = mediaInfo;
    
      //send file urls and mediaId to file-upload compoenent
      this.uploadInfo['media'].media_id = mediaInfo.id || 0;
      //file urls
      this.uploadInfo['media'].url = this.mediaData.image || "";
    }
  } 

  // view documnet or play audio
  viewUrl(url){
    // open url in new tab
    window.open(url);
  }

  DisplayDialogue(imageUrl,id,name){ 
    this.editImgName =name ;
    this.editmedia_id =id 
    const dialogRef = this._dialog.open(ImageCropperComponents, {
      disableClose: true,
      width: '50%',
      data: { type: 'get_img',image_url:imageUrl}
    });
    dialogRef.afterClosed().subscribe(result => {        
      if(result){
        this.saveMedia(result)
      }
    });  
  }

    /** SAVE MEDIA WITH ORG IMAGE AND CROPPED IMAGE AND MEDIA ID */
    saveMedia(result){
      //Define formdata
      let mediaInfo = new FormData();
      mediaInfo.append('media_id', this.editmedia_id);
      mediaInfo.append('image',this.editImgName);
      mediaInfo.append('base64',result);
      mediaInfo.append('type','globalmedia');
      mediaInfo.append('category_id',this.categoryId);
      mediaInfo.append('title','test');
      this.uploadInfo['media'].url = ''
      this._commonService.uploadMedia(mediaInfo)
        .subscribe(uploadResponse=>{
          // Show the successuploadResponse message   
          let mediaInfo = new Media().deserialize(uploadResponse.media,'singlemedia');
            this.mediaData = mediaInfo;
    
      //send file urls and mediaId to file-upload compoenent
      this.uploadInfo['media'].media_id = mediaInfo.id || 0;
      //file urls
      this.uploadInfo['media'].url = this.mediaData.image || ""; 
          // this.showeditedImg = true;             
          this.showSnackBar(uploadResponse.message, 'CLOSE', 2000);
          // this.croppedImage = result;
          // this.uploadedResponse.media_id = uploadResponse.media || 0;
          // this.imageUploaded.emit({'uploadResponse':uploadResponse,'formControlName':this.uploadInfo.formControlName});
      },
      error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY', 2000);
      });
    }

      /** SHOW SNACK BAR */
      showSnackBar(message:string,buttonText:string,duration:number=2000){
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration        : duration
        });
    }
  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}