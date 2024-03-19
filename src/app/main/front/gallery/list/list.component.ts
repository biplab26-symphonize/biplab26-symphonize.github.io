import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { GalleryService, AuthService, CommonService, OptionsList } from 'app/_services';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfig } from 'app/_services';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations : fuseAnimations
})
export class ListComponent implements OnInit {

  // Private
  public UserInfo: any ={};
  private _unsubscribeAll: Subject<any>;
  public categories : any = [];
  public noevents   : boolean = false;  
  filterForm        : FormGroup;
  PaginationOpt     : any ={};
  filterParams      : any = {'page':'0','limit':'10','user_id':'' }  
  galleries: any       = {data:[], total:''};
  showEmptyMsg: boolean = false;
  public EventSettings: any = {event_list_display_settings:{event_display_location:'Y',end_time_display:'Y'}};
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public medialist : any =[];
  public dominName :any ;

  constructor(
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
    
    this.dominName =AppConfig.Settings.url.mediaUrl;
    //GET USERINFO
    this.UserInfo             = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
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
        this.getGalleryList();            
    });
  }
  ngAfterViewInit(){
    this.getGalleryList();
  }
  //GET EVENTS LIST FROM SERVER
  getGalleryList(){
      //Get Events From APi as per limit set in settings
      if(this.PaginationOpt.pageSize){
          this.filterParams['limit'] = this.filterParams['limit'] ? this.filterParams['limit'] : this.PaginationOpt.pageSize;
      }
      this.filterParams['parent_id']     = 0;
      this.filterParams['category_type'] = 'G';
      this.filterParams['status'] = 'A';
      this._galleryService.getGalleries(this.filterParams).then(response=>{
          if(response.status==200){
              this.galleries = response;
            
              //NO GALLERY MESSAGE
              this.showEmptyMsg = this.galleries.data.length==0 ? true : false;
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
