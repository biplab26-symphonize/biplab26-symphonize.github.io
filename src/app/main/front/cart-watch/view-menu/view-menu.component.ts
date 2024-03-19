import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'app/_services';

@Component({
  selector: 'app-view-menu',
  templateUrl: './view-menu.component.html',
  styleUrls: ['./view-menu.component.scss'],
  animations : fuseAnimations
})
export class ViewMenuComponent implements OnInit {

  public url_id
  public ImgUrl ;
  public name;


  constructor(  private _fuseConfigService : FuseConfigService,
    private route           : ActivatedRoute,
    private userServices  : UsersService,
    public router 			: Router,) { 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.route.params.subscribe( params => {
      this.url_id = params.id;
     console.log(this.url_id);
  
    }); 
  }

  ngOnInit() {
     this.userServices.viewImg({'itemId': this.url_id}).subscribe(res=>{
        console.log(res);
        this.ImgUrl =res.image;
        this.name = res.pluItemName;
      })
  }

}
