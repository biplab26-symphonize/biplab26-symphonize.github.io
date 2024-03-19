import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { AnnouncementService } from 'app/_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-scroll-announcement',
  templateUrl: './scroll-announcement.component.html',
  styleUrls: ['./scroll-announcement.component.scss'],
  animations   	: fuseAnimations,
})
export class ScrollAnnouncementComponent implements OnInit {

  fuseConfig: any;
  showannouncement :boolean = true;
  announcementSettings: any;
  scrollAnnouncments: string="";
  private _unsubscribeAll: Subject<any>;
   _scrollList : [] ;

  constructor(
    private _fuseConfigService:FuseConfigService,
    private _announcementService:AnnouncementService
  ) { 

    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
     
      //Load fuseConfig to show breadcumb menuwise
    this._fuseConfigService.config
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(
        (config) => {
            this.fuseConfig = config;
        }
    );
       
    this._announcementService.getLists({'front':1,'content_type':'scroll-announcement','status':'A' ,
    'column':'order', 'direction':'asc'}).then(response=>{
      if(response.status==200 && response.data.length>0){
        this._scrollList = response.data.map(scroll=>{
          return scroll.content_desc;
        })
        this.scrollAnnouncments = this._scrollList.join(' ').replace(/(<([^>]+)>)/ig,"");          
      }else{
            this.showannouncement = false;
      }
    })

    
  }

}
