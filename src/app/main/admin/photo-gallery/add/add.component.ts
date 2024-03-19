import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, first, debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList,AppConfig, GalleryService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { Album } from 'app/_models';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations   : fuseAnimations
})
export class AddComponent implements OnInit {

  AlbumInfo    : any;
  isSubmit: boolean=false;
  isSearching: boolean=false;
  addform: FormGroup;

  editForm: boolean=false;
  editId:number=null;
  StatusList: any;
  AlbumsList: any[]=[];
  characterLimit:number=5000;
  public tinyMceSettings  = {};
  disableFields:boolean=false;
  viewName:string='Album';
  galleryId:number=0;
  viewUrl:string='/admin/album/list';
  returntogallery :boolean = false;
  gallery_id : any = 0;
  showAddAlbumButton : boolean = false;
  add_albumid :any ;
  add_imageid :any;
  showAddImageButton : boolean = false;

  uploadInfo: any={'type':'gallery','media_id':0,'formControlName':'media_id','url':"",'apimediaUrl':'media/upload'};  
  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private el: ElementRef,
    private router: Router,
    private _galleryService:GalleryService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _appConfig:AppConfig    
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this._fuseConfigService.config = CommonUtils.setVerticalLayout();
    this._fuseConfigService.defaultConfig = CommonUtils.setVerticalLayout();

     if(this.route.routeConfig.path=='admin/gallery/add' || this.route.routeConfig.path=='admin/gallery/edit/:id'){
        this.returntogallery = true;
     }
     if(this.route.routeConfig.path=='admin/albums/add/:galleryid' || this.route.routeConfig.path=='admin/albums/edit/:galleryid/:id'){
    
        if( this.route.routeConfig.path=='admin/albums/add/:galleryid'){
          this.gallery_id    = this.route.params['value'].galleryid;
        
        }
        if(this.route.routeConfig.path=='admin/albums/edit/:galleryid/:id'){
          this.gallery_id = this.route.params['value'].galleryid;
          this.showAddImageButton = true;
          this.add_imageid = this.route.params['value'].id;
        }  
      this.returntogallery = false;
     }

    this.tinyMceSettings = CommonUtils.getTinymceSetting('user',this.characterLimit);
    if(this.route.params['value'].galleryid){
      this.galleryId = this.route.params['value'].galleryid;
      this.viewUrl  = '/admin/view/gallery/'+this.galleryId;
    }
    if((this.route.routeConfig.path=='admin/gallery/edit/:id' || this.route.routeConfig.path=='admin/albums/edit/:galleryid/:id') && this.route.params['value'].id>0){
      this.editId    = this.route.params['value'].id;
      this.editForm  = true;
    }
    if(this.route.routeConfig.path=='admin/gallery/add' || this.route.routeConfig.path=='admin/gallery/edit/:id'){
      this.disableFields = true;
      this.viewName = 'Gallery';
      this.viewUrl  = '/admin/galleries/list';
    }
  }

  ngOnInit(): void {

    if(this.route.routeConfig.path=='admin/gallery/edit/:id'){
      this.showAddAlbumButton = true;
      this.add_albumid = this.route.params['value'].id;
    }
    this.StatusList       = OptionsList.Options.tables.status.users;
    if(this.disableFields==false){
      this._galleryService.getAlbums({category_type:'G','status':'A',parent_id:0}).then(response=>{
        if(response.status==200 && response.data){
          this.AlbumsList = response.data;
        }
      });
    }
    //Form Group
    this.setFormControls();
  }
  /** define form group controls */
  setFormControls(){
    //Declare For fields
    this.addform = this._formBuilder.group({
      id            : [this.editId],
      category_name : ['',[Validators.required]],
      category_type : ['G',[Validators.required]],
      description   : [''],
      media_id      : ['',],
      status        : ['A',[Validators.required]],
      parent_id     : [this.galleryId,[Validators.required]]
      
    });
    //Load Edit Form Values
    if(this.route.routeConfig.path=='admin/albums/edit/:galleryid/:id' || this.route.routeConfig.path=='admin/gallery/edit/:id'){
      this.fillFormValues();
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues(){
    if(this.route.routeConfig.path=='admin/gallery/edit/:id'){
      var viewData = new Album().deserialize(this._galleryService.gallery,'single');
    }
    else
    {
      var viewData = new Album().deserialize(this._galleryService.album,'single');
      this.uploadInfo = {'type':'gallery','media_id': viewData.media_id ,'formControlName':'media_id','url':"",'apimediaUrl':'media/upload'}; 
    }
    this.AlbumInfo = viewData;
    this.addform.patchValue(viewData);
    if(this.AlbumInfo.parent_id>0){
      this.gallery_id = this.AlbumInfo.parent_id || 0;
    }
  }
  /** SET MEDIA FIELD VALUE FROM EXTERNAL CPMNT */
  setMediaFieldValue($event: any){
    if($event.uploadResponse && $event.uploadResponse.media && $event.uploadResponse.media.id>0){
      this.addform.get($event.formControlName).setValue($event.uploadResponse.media.id || 0);
    }else{
      if($event.uploadResponse && $event.uploadResponse.delete == true){
           this.AlbumInfo.bg_image='';
      }
    }
  }

  /**SAVE FORM DATA */
  onSubmit(event: any){
    event.preventDefault();
    event.stopPropagation();
    
    if(this.addform.valid){
      this.isSubmit = true;
      //modify Post Values Before Send to Http
      this._galleryService.saveAlbum(this.addform.value,this.editForm)
        .pipe(first(),takeUntil(this._unsubscribeAll))
        .subscribe(
            data => {
                if(data.status==200){
                  this.showSnackBar(data.message,'CLOSE');
                  this.router.navigate([this.viewUrl]);
                }
                else{
                  this.showSnackBar(data.message,'CLOSE');
                }
            },
            
            error => {
                // Show the error message
                this._matSnackBar.open(error.message, 'Retry', {
                    verticalPosition: 'top',
                    duration        : 2000
            });
        });
    }
    else{
      CommonUtils.validateAllFormFields(this.addform);
      CommonUtils.scrollToFirstInvalidControl(this.el);
    }
  }
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
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

