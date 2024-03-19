import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CommonUtils } from 'app/_helpers';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService, AppConfig } from 'app/_services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations : fuseAnimations
})
export class SearchComponent implements OnInit {

  ShowEvents : boolean = false;
  ShowStaff : boolean = false;
  ShowPages : boolean = false;
  ShowAnnouncement : boolean = false;
  ShowResident : boolean = false;
  ShowDocuments : boolean = false;
  ShowForums : boolean = false;
  ShowEventstable : boolean = false;
  ShowStafftable : boolean = false;
  ShowPagestable : boolean = false;
  ShowAnnouncementtable : boolean = false;
  ShowResidenttable : boolean = false;
  ShowDocumentstable : boolean = false;
  ShowForumstable : boolean = false;
  
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  filterForm : FormGroup;
  AllListData :any =[];
  listArray  = [{key:'events',value:'Event'},
    {key:'residents',value:'Resident'},{key:'staff',value:'Staff'},
    {key:'announcement',value:'Announcement'}, {key:'pages',value:'page'},{key:'documents',value:'Documents'}]
  constructor(
    private _fuseConfigService : FuseConfigService,
    private _formBuilder : FormBuilder,
    private _commonServices : CommonService
  ) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
   }


  ngOnInit() {
       this.defaultDateTimeFormat = this._commonServices.getDefaultDateTimeFormat;
      this._commonServices.GetSerachdata({searchKey : '',limit:10,front:1,status:'A',type:''}).then(Response =>{

        this.AllListData = Response;
        if(this.AllListData.events.data.length >0 ){
          this.ShowEvents = true;
          this.ShowEventstable  = true;
        }
        if(this.AllListData.staff.data.length >0 ){
          this.ShowStaff = true;
          this.ShowStafftable = true;
        }
        if(this.AllListData.pages.data.length >0 ){
          this.ShowPages = true;
          this.ShowPagestable = true;
        }
        if(this.AllListData.announcement.data.length >0 ){
          this.ShowAnnouncement = true;
          this.ShowAnnouncementtable = true;
        }
        
        if(this.AllListData.residents.data.length >0 ){
          this.ShowResident = true;
          this.ShowResidenttable = true;
        }
        if(this.AllListData.documents.data.length >0 ){
          this.ShowDocuments = true;
          this.ShowDocumentstable = true;
        }
        if(this.AllListData.forums.data.length >0 ){
          this.ShowForums = true;
          this.ShowForumstable = true;
        }
      })

      this.filterForm = this._formBuilder.group({
        searchKey   : [''],
        type        : [''],
        limit       : ['10'],
        front       : ['1'],
        status      : ['A']
      
    });

  }

  Search($event){
    this.ShowEvents  = false;
    this.ShowStaff  = false;
    this.ShowPages  = false;
    this.ShowAnnouncement  = false;
    this.ShowResident  = false;
    this.ShowDocuments  = false;
    this.ShowForums = false;
    this.ShowEventstable = false;
    this.ShowStafftable  = false;
    this.ShowPagestable  = false;
    this.ShowAnnouncementtable = false;
    this.ShowResidenttable  = false;
    this.ShowDocumentstable  = false;
    this.ShowForumstable  = false;
    this.AllListData =[];
    console.log('hiii');
    this._commonServices.GetSerachdata(this.filterForm.value).then(Response =>{
      this.AllListData = Response;
      if(this.AllListData.events && this.AllListData.events.data.length >0 ){
        this.ShowEvents = true;
        this.ShowEventstable  = true;
      }
      if( this.AllListData.staff && this.AllListData.staff.data.length >0 ){
        this.ShowStaff = true;
        this.ShowStafftable = true;
      }
      if(this.AllListData.pages && this.AllListData.pages.data.length >0 ){
        this.ShowPages = true;
        this.ShowPagestable = true;
      }
      if(this.AllListData.announcement && this.AllListData.announcement.data.length >0 ){
        this.ShowAnnouncement = true;
        this.ShowAnnouncementtable = true;
      }
      if(this.AllListData.residents && this.AllListData.residents.data.length >0 ){
        this.ShowResident = true;
        this.ShowResidenttable = true;
      }
      if(this.AllListData.documents && this.AllListData.documents.data.length >0 ){
        this.ShowDocuments = true;
        this.ShowDocumentstable = true;
      }
      if(this.AllListData.forums && this.AllListData.forums.data.length >0 ){
        this.ShowForums = true;
        this.ShowForumstable = true;
      }
    })

  }

  PageView(alias){
     let url = '/'+'pages'+'/'+'view'+'/'+alias
       window.open(url);
  }
  ViewDocumenet(doc_name,token){
    let url =  AppConfig.Settings.url.mediaUrl+'api'+'/'+'download'+'/'+'documents'+'/'+token+'/'+doc_name;
    window.open(url);
  }

}
