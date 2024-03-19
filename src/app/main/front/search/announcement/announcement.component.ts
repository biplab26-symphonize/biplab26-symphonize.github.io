import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
  animations : fuseAnimations
})
export class AnnouncementComponent implements OnInit {

  editHomeAnnId : any ;
  AnnouncementData :any ;
  constructor(
    private _fuseConfigService : FuseConfigService,
    private route 		         : ActivatedRoute,
    private announcemnet       : AnnouncementService
  ) { 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
    if(this.route.routeConfig.path =='view/announcement/:id' && this.route.params['value'].id>0){
			this.editHomeAnnId    = this.route.params['value'].id;
     }   

     this.announcemnet.getContent(this.editHomeAnnId).then(res=>{
       this.AnnouncementData =res; 
     })
  }

}
