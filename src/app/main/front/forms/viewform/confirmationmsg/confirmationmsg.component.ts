import { Component, OnInit, Input } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import {  FormentriesService, AppConfig } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
  

@Component({
  selector: 'app-confirmationmsg',
  templateUrl: './confirmationmsg.component.html',
  styleUrls: ['./confirmationmsg.component.scss'],
  animations : fuseAnimations
})
export class ConfirmationmsgComponent implements OnInit {


 public  url_id :any
 public url:any;
 public forms_settings
 public Message :any;
 uploadInfo: any={
  'avatar':{'type':'defaultprofile','media_id':0,'url':"",'apimediaUrl':'media/upload'},
};

  constructor(
    private _fuseConfigService    : FuseConfigService,
    private _formEntryService     : FormentriesService,
    private route                 : ActivatedRoute,
   
  ) { 

    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.route.params.subscribe( params => {
      this.url_id = params.id;
    });
    
  }

  ngOnInit() {
 
    
    this._formEntryService.getEntries(this.url_id)
    .subscribe(response =>
      {    
        this.url=response.entryinfo.url;
     this.forms_settings=JSON.parse(response.entryinfo.formmeta.form_settings)
      if(this.forms_settings.formsettings.confirmation.confirmation_type == 'text')
      {
           this.Message =this.forms_settings.formsettings.confirmation.message
      }
    }); 
  }


   viewenrty()
     {
       
       
       this.uploadInfo.avatar.url= (this.url? AppConfig.Settings.url.mediaUrl + this.url:"");
       window.open(this.uploadInfo.avatar.url);
     }
   

}
