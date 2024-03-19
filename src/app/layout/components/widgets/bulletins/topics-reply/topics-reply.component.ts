import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementService, AuthService, ReplyService } from 'app/_services';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { first, takeUntil } from 'rxjs/operators';
import { OptionsList, AppConfig } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-topics-reply',
  templateUrl: './topics-reply.component.html',
  styleUrls: ['./topics-reply.component.scss'],
  animations:fuseAnimations
})
export class TopicsReplyComponent implements OnInit {
  
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  

  public tinyMceSettings  = {};
  public ForumSettings     : any; 
  public replyform: FormGroup;
  public content_id:number = 0;
  public StatusList      : any;
  public topicsList      : any = [];
  public editForm        : boolean = false;
  public currentUser     : any;
  public file;
  public url;
  public selectedFile;
  public  filetype :boolean =true;
  public appConfig: any;
  public imgurl;
  // Private
  private _unsubscribeAll: Subject<any>;
  public inputAccpets;
  _defaultAvatar = "";
  public topicInfo : any = {};
  public repliesList : any = [];
  _localUserSettings:any;
  uploadInfo: any={
    'avatar':{'type':'avatar','media_id':0,'formControlName':'avatar_media_id','url':"",'apimediaUrl':'media/userupload'},
  };  
  
  constructor(
    private _fuseConfigService: FuseConfigService,
    public _matDialog: MatDialog,
    private route : ActivatedRoute,
    private _appConfig: AppConfig,
    private _topicService : AnnouncementService,
    private fb : FormBuilder, 
    private _matSnackBar           : MatSnackBar,
    private _authenticationService : AuthService,
    private _replyService          : ReplyService) { 
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
      
    // Set the private defaults
    this._unsubscribeAll = new Subject();  
    this.tinyMceSettings = CommonUtils.getTinymceSetting('replies');
    this.content_id = this.route.params['value'].content_id;
    this.appConfig          = AppConfig.Settings;
    this.imgurl =this.appConfig.url.mediaUrl;
    // git current user information
    this.currentUser        = this._authenticationService.currentUserValue.token.user;
  }
  ngOnInit(){
    this.inputAccpets       = ".jpg , .jpeg ,.png ";  
    this.ForumSettings      = OptionsList.Options.forumsettings;
    //SET DEFAULT AVATAR FROM SETTINGS
    this._localUserSettings  = this._appConfig._localStorage.value.settings || {};
    if(this._localUserSettings){
      this._defaultAvatar  = this._localUserSettings.users_settings ? AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile : AppConfig.Settings.url.defaultAvatar; 
    }
    
    this.replyform = this.fb.group({
      reply_id       : this.fb.control(null),
      content_id     : this.fb.control(this.content_id),
      title          : this.fb.control('',[Validators.required]),
      user_id        : this.fb.control(this.currentUser.id),
      full_name      : this.fb.control(this.currentUser.first_name),
      email          : this.fb.control(this.currentUser.email),
      phone          : this.fb.control(this.currentUser.phone),
      message        : this.fb.control('',[Validators.required]),
      rating         : this.fb.control(''),
      status         : this.fb.control('A',[Validators.required]),
      display_status : this.fb.control('approved')
    });
    this.getReplies(this.content_id);
  }
  getReplies(contentId){
    this._topicService.getContent(contentId).then(response =>{
      if(response.contentinfo){
        //Extract Creater UserInfo In Parent Node
        this.topicInfo   = response.contentinfo;
        if(response.contentinfo.replies && response.contentinfo.replies.length>0){
          this.repliesList = response.contentinfo.replies.map(reply=>{
            if(reply.creator){
              reply['creator']['media'] = reply.creator && reply.creator.usermedia.length>0 ? reply.creator.usermedia[0].media  : {};
            }
            return reply;
          });
        }
      }
      else{
        this.repliesList = [];
      }
      
       
    });
  }
  onSubmit(event){
    event.preventDefault();
    event.stopPropagation();
    if(this.replyform.valid){
      //modify Post Values Before Send to Http
      this._replyService.saveReply(this.replyform.value,this.editForm)
          .pipe(first(),takeUntil(this._unsubscribeAll))
          .subscribe(
              data => {
                  if(data.status==200){
                    this.showSnackBar("Reply added Successfully",'CLOSE');
                    this.replyform.controls['title'].reset();
                    this.replyform.controls['message'].reset();
                    this.getReplies(this.content_id);                  
                  }
                  else{
                    this.showSnackBar(data.message,'CLOSE');
                  }
              },
              error => {
                  // Show the error message
                  this._matSnackBar.open(error.message, 'Retry', {
                      verticalPosition: 'top',
                      duration        : 2000
              });
          });        
    }
    else{
      CommonUtils.validateAllFormFields(this.replyform);
    }
  }
  editReply(replyInfo:any){
    
    this.editForm = true;
    document.getElementById("replyform").scrollIntoView();
    if(replyInfo.reply_id){
      this.replyform.get('reply_id').setValue(replyInfo.reply_id);
    }
    if(replyInfo.title){
      this.replyform.get('title').setValue(replyInfo.title);
    }
    if(replyInfo.message){
      this.replyform.get('message').setValue(replyInfo.message);
    }
    if(replyInfo.message){
      this.replyform.get('message').setValue(replyInfo.message);
    }
    if (replyInfo.display_status) {
      this.replyform.get('display_status').setValue(replyInfo.display_status);
    }
  }
  //Delete Reply By Owner Only
  deleteReply(contentId:number=0){
    if(contentId>0){
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this reply?';
      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result){
            this._replyService.deleteReply({reply_id:contentId,user_id:this.currentUser.id,'type':'reply'}).subscribe(deleteResponse=>{
              // Show the success message
              this.showSnackBar(deleteResponse.message, 'CLOSE');
              this.getReplies(this.content_id);
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