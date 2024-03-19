import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { GalleryService, AuthService, CommonService, OptionsList, AppConfig } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Album, Media } from 'app/_models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
   animations : fuseAnimations
})
export class AlbumsComponent implements OnInit {

  public UserInfo: any ={};
  private _unsubscribeAll: Subject<any>;
  public categories : any = [];
  public noevents   : boolean = false;  
  _defaultAvatar = "";
  filterForm        : FormGroup;
  PaginationOpt     : any ={};
  filterParams      : any = {'page':'0','limit':'10','user_id':'' }  
  albums: any       = {data:[], total:''};
  showEmptyMsg: boolean = false;
  public medialist :any =[];
  public EventSettings: any = {event_list_display_settings:{event_display_location:'Y',end_time_display:'Y'}};
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  parent_id:any=0;
  constructor(
    private route		          : ActivatedRoute,
    private router                : Router,
    private _fuseConfigService: FuseConfigService,
    private _galleryService:GalleryService,
    private _formBuilder : FormBuilder,
    private authenticationService: AuthService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit(): void {
    if(this.route.params['value'].id){
      this.parent_id = this.route.params['value'].id;
      localStorage.setItem('parent_id',this.parent_id);
    }
    //GET USERINFO
    this.UserInfo       = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    // this._defaultAvatar = AppConfig.Settings.url.defaultAlbum; 

    //DEFAULT PGINATION OTPIONS FROM OPTIONSLIST JSON
    this.PaginationOpt        = OptionsList.Options.tables.pagination.options;
    //DEFINE FORM FOR CATEGORYLIST
    this.filterForm = this._formBuilder.group({
      categories  : [[]]
    });
    //GET EVENTSLIST BY PAIGNATION AND CATEGORIES
    merge(this.paginator.page,this.filterForm.valueChanges)
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
    )
    .subscribe(pageresponse=>{
        //ScrollView TO TOP
        document.querySelector('.content-card').scrollIntoView();
        this.filterParams = CommonUtils.getFilterJson('',this.paginator,this.filterForm.value);
        this.getAlbumsList();            
    });
  }
  ngAfterViewInit(){
    this.getAlbumsList();
  }
  //GET EVENTS LIST FROM SERVER
  getAlbumsList(){
      //Get Events From APi as per limit set in settings
      if(this.PaginationOpt.pageSize){
          this.filterParams['limit'] = this.filterParams['limit'] ? this.filterParams['limit'] : this.PaginationOpt.pageSize;
      }
      this.filterParams['parent_id']     = this.parent_id; 
      this.filterParams['category_type'] = 'G'; 
      this.filterParams['status'] = 'A';
      this._galleryService.getAlbums(this.filterParams).then(response=>{
          if(response.status==200){
              this.albums      = response;
              for(let i =0;i<response.data.length;i++){
                this.medialist[i] = response.data[i].medialist.map(c => new Media().deserialize(c, 'gallerylist'));;
               }
               console.log(this.medialist);
               
              this.albums.data = this.albums.data.map(c => new Album().deserialize(c,'list'));
              //NO GALLERY MESSAGE
              this.showEmptyMsg = this.albums.data.length==0 ? true : false;
          }
          
      });
  }
  //Reset PageIndex On Form Changes
  resetPageIndex(){
      this.filterForm.valueChanges.subscribe(data=>{
          this.paginator.pageIndex = 0;
      });
  }

}
