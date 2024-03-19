import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { GalleryService, AuthService, CommonService, OptionsList, AppConfig } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Media } from 'app/_models';
import { ActivatedRoute } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
  animations: fuseAnimations
})
export class ImagesComponent implements OnInit {

  // Private
  public UserInfo: any = {};
  private _unsubscribeAll: Subject<any>;
  public noevents: boolean = false;
  _defaultAvatar = "";
  filterForm: FormGroup;
  PaginationOpt: any = {};
  filterParams: any = { 'page': '0', 'limit': '10', 'user_id': '' }
  medias: any = { data: [], total: '' };
  albumInfo: any = {};
  showEmptyMsg: boolean = false;
  public EventSettings: any = { event_list_display_settings: { event_display_location: 'Y', end_time_display: 'Y' } };
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  category_id: number = 0;
  _mediaArray = [];
  parent_id :any ;
  
  
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _galleryService: GalleryService,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private _lightbox: Lightbox
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit(): void {
    // get the parent id for the list 
    this.parent_id =localStorage.getItem('parent_id');
    // this.parent_id = id[0]
    if (this.route.params['value'].id) {
      this.category_id = this.route.params['value'].id;
      this.getAlbumInfo();
    }
    //GET USERINFO
    this.UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    // this._defaultAvatar = AppConfig.Settings.url.defaultAlbum;

    //DEFAULT PGINATION OTPIONS FROM OPTIONSLIST JSON
    this.PaginationOpt = OptionsList.Options.tables.pagination.options;
    //DEFINE FORM FOR CATEGORYLIST
    this.filterForm = this._formBuilder.group({
      categories: [[]]
    });
    //GET EVENTSLIST BY PAIGNATION AND CATEGORIES
    merge(this.paginator.page, this.filterForm.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(pageresponse => {
        //ScrollView TO TOP
        document.querySelector('.content-card').scrollIntoView();
        this.filterParams = CommonUtils.getFilterJson('', this.paginator, this.filterForm.value);
        this.getImagesList();
      });
  }
  ngAfterViewInit() {
    this.getImagesList();
  }
  //GET ALBUM INFO
  getAlbumInfo(albumId: number = 0) {
    this._galleryService.getAlbum(albumId).then(response => {
      if (response.status == 200 && response.albuminfo) {
        this.albumInfo = response.albuminfo;
        console.log(this.albumInfo);
      }
    })
  }
  //GET EVENTS LIST FROM SERVER
  getImagesList() {
    //Get Events From APi as per limit set in settings
    if (this.PaginationOpt.pageSize) {
      this.filterParams['limit'] = this.filterParams['limit'] ? this.filterParams['limit'] : this.PaginationOpt.pageSize;
    }
    this.filterParams['category_id'] = this.category_id;
    //this.filterParams['type']        = 'gallery';
    this._galleryService.getMedia(this.filterParams).then(response => {
      if (response.status == 200 && response.media) {
        this.medias = response.media;
        this.medias.data = this.medias.data.map(c => new Media().deserialize(c, 'gallerylist'));
        //NO GALLERY MESSAGE
        this.showEmptyMsg = this.medias.data.length == 0 ? true : false;
        this.setLightBox();
      }

    });
  }
  //Reset PageIndex On Form Changes
  resetPageIndex() {
    this.filterForm.valueChanges.subscribe(data => {
      this.paginator.pageIndex = 0;
    });
  }
  setLightBox(){
    if(this.medias && this.medias.data.length>0){
      
      this.medias.data.forEach((element,index) => {
        const src = element.image;
        let caption = element.title;
        caption     = element && element.description!=='' ? caption +'-'+element.description : caption;
        const thumb = element.thumb;
        const media = {
          src: src,
          caption: caption,
          thumb: thumb
        };
        this._mediaArray.push(media);
      });
    }
  }
  openLightBox(index: number): void {
    this._lightbox.open(this._mediaArray, index);
  }

}
