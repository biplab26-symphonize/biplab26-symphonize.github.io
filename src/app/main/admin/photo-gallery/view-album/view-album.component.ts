import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { DataSource,SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, UsersService, GalleryService, AppConfig } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { Media } from 'app/_models';
import { Lightbox } from 'ngx-lightbox';
import { DetailsComponent } from './image-upload/details/details.component';
import { FuseConfigService } from '@fuse/services/config.service';


@Component({
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ViewAlbumComponent implements OnInit {

  _localUserSettings: any;
  isTrashView:boolean=false;
  deleteMediaArray: any[]=[];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  UploadDialogref: MatDialogRef<DetailsComponent>; 
  filterForm: FormGroup;
  filterParams: any={};
  PaginationOpt: {'pageSize':'',pageSizeOptions:[]}; //pagination size,page options
  Columns: [];  
  mediaUrl:string = AppConfig.Settings.url.mediaUrl;
  StatusList: any;
  displayedColumns: string[];
  dataSource: FilesDataSource | null;
  selection = new SelectionModel<any>(true, []);
  _defaultAvatar = "";
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  userId: number = null;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  @ViewChild('filter', {static: true})
  filter: ElementRef;
  trashUrl:string='/admin/albums/trash';
  viewUrl:string='/admin/album/list';
  albumId:number=0;
  albumInfo:any={};
  _mediaArray = [];
  existingMedialist:any[]=[];
  galleryName:string='';
  files: any = [];
  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _appConfig: AppConfig,    
    private _commonService:CommonService,
    private _galleryService:GalleryService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _lightbox: Lightbox
    )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this._fuseConfigService.config = CommonUtils.setVerticalLayout();
      this._fuseConfigService.defaultConfig = CommonUtils.setVerticalLayout();
      
      if(this.route.routeConfig.path=='admin/view/album/:id' && this.route.params['value'].id>0){
        this.albumId = this.route.params['value'].id;
      }
  }

  ngOnInit(): void {
    this.userId             = JSON.parse(localStorage.getItem('token')).user_id;
    this.albumInfo          = this._galleryService.album;
    this.setLightBox();
    //get Existing Media List to show on media upload tab
    
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    
    //Load Users Settings From Localstorage
    this._localUserSettings = this._appConfig._localStorage.value.settings;
    this._defaultAvatar     = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar; 
    //Pagination Options
    this.PaginationOpt      = OptionsList.Options.tables.pagination.options;

    this.StatusList         = OptionsList.Options.tables.status.users;
    this.Columns            = OptionsList.Options.tables.list.medialist;
    this.displayedColumns   = OptionsList.Options.tables.list.medialist.map(col => col.columnDef);
    this.dataSource         = new FilesDataSource(this._galleryService, this.paginator, this.sort);
    //Declare Filter Form
    this.filterForm = this._formBuilder.group({
      searchKey   : [''],
      status      : [''],
      trash       : [''],
      category_id : [this.albumId] 
    });
    //Show Buttons Of permenat Delete and restore on trash view
    this.isTrashView = (this.route.routeConfig.path=='admin/albums/trash' || this.route.routeConfig.path=='admin/trash/gallery/:id') ? true : this.isTrashView;
    this.route.data['value'].trash ? this.filterForm.get('trash').setValue(this.route.data['value'].trash) : "";
    this.resetPageIndex(); //#Reset PageIndex of form if search changes
    this.getExistingMedialist();
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
    )
    .subscribe(res=>{
        this.selection.clear();
        this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
        this.filterParams['column'] = 'media_id';
        this.filterParams['category_id'] = this.albumId;
        this.dataSource.getFilteredMedia(this.filterParams);
    });
  }

  //Reset PageIndex On Form Changes
  resetPageIndex(){
    this.filterForm.valueChanges.subscribe(data=>{
        this.paginator.pageIndex = 0;
    });
  }

  isAllSelected() {
    const numSelected   = this.selection.selected.length;
    const numRows       = this.dataSource.filteredData.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.filteredData.data.forEach(row => this.selection.select(row.media_id));
  }
  /** SOFT OR PERMENENT DELETE USER */
  deleteMedia(mediaId: number=0){
    if(mediaId>0){
        this.selection.selected.push(mediaId);
    }
    //RemoveCurrent User From Array
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected media?';
    this.confirmDialogRef.afterClosed()
    .subscribe(result => {
        if ( result )
        {
          this._galleryService.deleteMedia({'media_id':this.selection.selected})
          .subscribe(deleteResponse=>{
              this.selection.clear();
              //Set Page Index to 0
              this.paginator.pageIndex = 0;
              //send filters params again to maintain page limit search .....
              this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
              this.filterParams['column'] = 'media_id';
              this.filterParams['category_id'] = this.albumId;
              this.dataSource.getFilteredMedia(this.filterParams);
              // Show the success message
              this.showSnackBar(deleteResponse.message, 'CLOSE');
          },
          error => {
              // Show the error message
              this.showSnackBar(error.message, 'RETRY');
          });
        }
        else
        {
            this.selection.clear();
        }
        this.confirmDialogRef = null;
    });
  }

   /** Edit Uploaded File Name or Category */
   editUploadedFileInfo(fileIndex: any){    
     let media_id = fileIndex.media_id;
    this.UploadDialogref = this._matDialog.open(DetailsComponent, {
      disableClose: false,
      data: {
        fileInfo: fileIndex
      }
    });        
    this.UploadDialogref.afterClosed()
    .subscribe(result => {
        if ( result ) {
         let savedata ={
          media_id                 : media_id,
          title                    : result.title ? result.title : '',
          description              : result.description ? result.description:''
          }
        
          this._galleryService.editviewalbum(savedata).subscribe(res=>{
             if(res.status == 200){
              this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
              this.filterParams['column'] = 'media_id';
              this.filterParams['category_id'] = this.albumId;
              this.dataSource.getFilteredMedia(this.filterParams);
             }
          })
  
        }
        this.UploadDialogref = null;
    });
  }
  setLightBox(){
    if(this.albumInfo && this.albumInfo.medialist.length>0){
      
      this.albumInfo.medialist.forEach((element,index) => {
        const src = this.mediaUrl+element.image;
        const caption = element.title;
        const media_id = element.media_id;
        const thumb = this.mediaUrl+element.image;
        const media = {
          src: src,
          caption: caption,
          thumb: thumb,
          media_id:media_id
        };
        this._mediaArray.push(media);
      });
    }
  }
  openLightBox(mediaId: any): void {
    let MediaIndex = this._mediaArray.findIndex(x => x.media_id === mediaId);
    console.log("MediaIndex",MediaIndex);
    this._lightbox.open(this._mediaArray, MediaIndex);
  }

  closeLightBox(): void {
    this._lightbox.close();
  }
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }
  //refreshList after media upload done
  refreshMediaList($event:any){
    this.refreshAlbumInfo();
    this.filterParams = CommonUtils.getFilterJson(this.sort,this.paginator,this.filterForm.value);
    this.filterParams['column'] = 'media_id';
    this.filterParams['category_id'] = this.albumId;
    this.dataSource.getFilteredMedia(this.filterParams);
  }
  getExistingMedialist(){
    this._galleryService.getGlobelMedia({type:'globalmedia'}).then(response=>{
      if(response.media && response.media.data && response.media.data.length>0){
        this.existingMedialist = response.media.data.map(c => new Media().deserialize(c,'medialist'));
      }
    })
  }
  refreshAlbumInfo(){
    this._galleryService.getAlbum(this.albumId).then(response=>{
      console.log(response);
      if(response.status==200 && response.albuminfo && response.albuminfo.medialist && response.albuminfo.medialist.length>0){
        this.albumInfo = response.albuminfo;
        
        this.setLightBox();
      }      
    })
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
export class FilesDataSource extends DataSource<any>
{
    private _filterChange       = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');
    /**
     * Constructor
     *
     * @param {GalleryService} _galleryService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _galleryService: GalleryService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._galleryService.medias;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<Media[]>}
     */
    connect(): Observable<Media[]>
    {
        const displayDataChanges = [
            this._galleryService.onMediasChanged
        ];
        return merge(...displayDataChanges)
            .pipe(
            map(() => {
                    let data          = this._galleryService.medias;
                    this.filteredData = data;
                    data              = this.filterData(data);
                    return data;
                }
            ));
    }

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }
    
    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(gallerydata): any
    {
      if(gallerydata && gallerydata.data){
        return gallerydata.data.map(c => new Media().deserialize(c,'list'));
      }
      return [];
    }
    /**
     * Get Filtered Users
     * 
     */
    getFilteredMedia(params:any){
        return this._galleryService.getMedia(params).then(Response=>{
            return Response;
        });
    }
    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
