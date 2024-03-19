import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, delay, take } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { environment } from 'environments/environment';
import { AppConfig, CommonService, ChatService } from 'app/_services';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChatComponent implements OnInit {

  // Private
  private _unsubscribeAll: Subject<any>;

  selectedChat: any;
  selectedGroup: any={groupId:null};
  
  user: any;
  public messageText:string;
  public messages:any[]=[];
  constructor( 
    private _commonService: CommonService,
    private _chatService:ChatService,
    private _fuseConfigService: FuseConfigService
    ) { 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //CURRENT USER
    this.user = this._chatService.user;

    // get online Users
    this._chatService.listen(environment.pusher.online_event,environment.pusher.onlinechannel, (res) => {
      this._chatService.onUserStatusChanged.next(res);
    });
    // Start listening to pusher event onetoone chat
    this._chatService
    .listen(environment.pusher.message_event,environment.pusher.messagechannel, (res) => {
      this._chatService.onChatWindowUpdated.next(res.message);
      this._chatService.onChatsUpdated.next(res.message);
    });
    //listen chat delete event  
    this._chatService
    .listen(environment.pusher.delete_message_event,environment.pusher.messagechannel, (res) => {
      this._chatService.onChatsDeleted.next(res);
    });
    //On Chat Selected
    this._chatService.onChatSelected
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(chatData => {
          this.selectedChat = chatData;
      });
    //On Group Selected
    this._chatService.onGroupSelected
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(groupData => {
          this.selectedGroup = groupData;
      });
    //On Contact Delete Reset His Open Chat to null
    this._chatService.onPusherresetChatView
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(resetChat=>{
        console.log("resetChat>>>",resetChat);
        if(resetChat && resetChat.pusher=='Y'){
          this.clearPusherChatWindow(resetChat);
        }
        else if(resetChat && resetChat.pusher=='N'){
          this.clearCurrentChatWindow(resetChat);
        }
      });
      this.setUserAvatar();
  }
  setUserAvatar(){
    const userSettings = this._commonService.getLocalSettingsJson('users_settings')
    if(userSettings && userSettings['defaultprofile']){
      this._chatService.onDefaultAvatar.next(AppConfig.Settings.url.mediaUrl + userSettings['defaultprofile']);
    }
    else{
      this._chatService.onDefaultAvatar.next(AppConfig.Settings.url.defaultAvatar);
    }
  }
  //Clear Group/Personal window by pusher realtime
  clearPusherChatWindow(resetData){
    console.log("resetData",resetData);
    if(resetData && resetData.type=='group' && this.selectedGroup && this.selectedGroup.groupId===resetData.group_id){
      this._chatService.onGroupDeleted.next(resetData.group_id);
      this.selectedGroup = null;
    }
    if(this.selectedChat && this.selectedChat!==null){
      if(resetData && resetData.type=='personal' && this.selectedChat && ((this.selectedChat.chatId===resetData.contact_id && this.user.id===resetData.user_id) || (this.selectedChat.chatId===resetData.user_id && this.user.id===resetData.contact_id))){
        this._chatService.onContactDeleted.next(resetData);
        this.selectedChat = null;
      }
    }
  }
  //on cusrrent window when user delete group / personal chat
  clearCurrentChatWindow(resetChat){
    console.log("resetChat",resetChat);
    if(resetChat && resetChat.reset==true && resetChat.type=='personal'){
      this._chatService.onContactDeleted.next(resetChat);
      this.selectedChat = null
    }
    if(resetChat && resetChat.reset==true && resetChat.type=='group'){
      this._chatService.onGroupDeleted.next(resetChat.group_id);
      this.selectedGroup = null
    }
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this._chatService.onPusherresetChatView.next(null);
  }
}
