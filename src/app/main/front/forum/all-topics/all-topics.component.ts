import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes

import { OptionsList, CategoryService,CommonService, AnnouncementService } from 'app/_services';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-all-topics',
  templateUrl: './all-topics.component.html',
  styleUrls: ['./all-topics.component.scss'],
  animations   : fuseAnimations,
})
export class AllTopicsComponent implements OnInit {
  topicsList: any;
  public userId:number=0;
  public id: number = 0;
  public ForumSettings     : any; 
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  

  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};


  constructor(
    private _fuseConfigService: FuseConfigService,
    private _categorService : CategoryService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _announceService: AnnouncementService,
    private _commonService: CommonService,
    private route : ActivatedRoute) { 
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.id = this.route.params['value'].id;
    
 }

  ngOnInit() {
      this.ForumSettings      = OptionsList.Options.forumsettings;
      //currentUser delete and edit access
      this.userId = JSON.parse(localStorage.getItem('token')).user_id || 0;
     //Deault DateTime Formats
     this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
     this.getTopics();
  }
  //Get Topiclist
  getTopics(){
    //get Topiclist from Api     
    this._categorService.getTopics({category_alias:this.id,status:'A',displaystatus:'approved'}).subscribe(response=>{   
      this.topicsList = response.data;
    });
  }
  //Delete Topic By Owner Only
  deleteTopic(contentId:number=0){
    if(contentId>0){
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this topic?';
      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result){
            this._announceService.deleteField('delete/content',{content_id:[contentId],'type':'topic'}).subscribe(deleteResponse=>{
              // Show the success message
              this.showSnackBar(this.ForumSettings.delete_topic, 'CLOSE');
              this.getTopics();
            })
          }
      });
    }
  }
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }

}
