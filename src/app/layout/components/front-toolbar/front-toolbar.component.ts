import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/layout/components/dialogs/snackbar/snackbar.component';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; //EXTRA Changes
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { AuthService, AppConfig, ChatService } from 'app/_services';
import { User } from 'app/_models';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'front-toolbar',
  templateUrl: './front-toolbar.component.html',
  styleUrls: ['./front-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FrontToolbarComponent implements OnInit, OnDestroy
{
    senderArr: any[] = [];
    notificationArr: any[] = [];
    unreadnotifications: number = 0;
    unreadmsgs: number = 0;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    userStatusOptions: any[];
    loginUserInfo: any;
    roleId: number=0;
    _defaultNavAvatar: string = "";
    _localUserSettings:any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
        public _matSnackBar:MatSnackBar,
        private authenticationService: AuthService,
        private _appConfig:AppConfig,
        private _chatService: ChatService,
        private _accountService: AccountService,
        private router: Router
    )
    {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._defaultNavAvatar = AppConfig.Settings.url.defaultAvatar;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        //Subscribe to notification delete obervable
        this._accountService.onNotificationUpdates
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response=>{
            if(response==true){
                this.getUnreadCount();
            }
        })
        //Set USERINFO
        this.setUserInfo();
        //Unread notifications and messages
        this.getUnreadCount();
        // Start listening to pusher event onetoone chat
        this.listenPersonalChat();
        //listen for any group invite received
        this.listenGroupInviteReceived();
        //listen for group invite accept
        this.listenGroupInviteAccepted();        
        //listen for group chat sent
        this.listenGroupChat();

        //Update unreadcount when user open chat window for user
        this._chatService.onChatSelected
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                let sendermsgIndex = this.senderArr.findIndex(item=>{
                   return item.receiver_id === this.loginUserInfo.id && updatedChats.chatId === item.sender_id 
                });
                
                if(sendermsgIndex>=0){
                    this.senderArr[sendermsgIndex].unread = 0;
                    this.reduceUnreadMessageCount();
                }
            });
        
        //Update unreadcount when user open chat window for group
        this._chatService.onGroupSelected
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                if(updatedChats!==null){
                    let sendermsgIndex = this.senderArr.findIndex(item=>{
                        return item.group_id === updatedChats.groupId 
                     });
                     
                     if(sendermsgIndex>=0){
                         this.senderArr[sendermsgIndex].unread = 0;
                         this.reduceUnreadMessageCount();
                     }   
                }
            }); 
    }

    setUserInfo(){
        //Set User Info to display on navbar
        let UserInfo       = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
        this.loginUserInfo = new User().deserialize(UserInfo,'single');
        this.roleId        = this.loginUserInfo && this.loginUserInfo.user_roles ? this.loginUserInfo.user_roles.role_id : 0;     
        this._appConfig.onProfileInfoChanged.subscribe(ProfileInfo =>{
            if(ProfileInfo){
                this.loginUserInfo.avatar_file = ProfileInfo.avatar_file; 
                this.loginUserInfo.first_name = ProfileInfo.first_name; 
                this.loginUserInfo.last_name = ProfileInfo.last_name; 
            }  
        })
        
        this._localUserSettings  = this._appConfig._localStorage.value.settings || {};
        if(this._localUserSettings)
        {
            this._defaultNavAvatar  = this._localUserSettings.users_settings ? AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile : AppConfig.Settings.url.defaultAvatar; 
            //Update Default Avatar Runtime When Changed From Settings
            this._appConfig._localStorage.subscribe(LocalStorageSettings=>{
                if(LocalStorageSettings.settings.users_settings){
                    this._defaultNavAvatar = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultprofile;
                }
            });
        }
        if(localStorage.userInfo!==undefined && localStorage.userInfo!=='')
        {
            const loginLocalUser = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null;
            if(this.loginUserInfo && loginLocalUser){
                this.loginUserInfo.avatar_file = loginLocalUser.avatar_file;
                this.loginUserInfo.first_name  = loginLocalUser.first_name;
                this.loginUserInfo.last_name   = loginLocalUser.last_name;
            }
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
    }


    /**
     * Logout User
     */
    onLogout(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want To Logout ?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this.authenticationService.logout()
                    .pipe(first())
                    .subscribe(
                        data => {
                            this.router.navigate(['/authentication/login']);                            
                        });
                }
                this.confirmDialogRef = null;
            });
    }

    getUnreadCount(){
        if(this.loginUserInfo){
            this._chatService.getUnreadNotifications({user_id:this.loginUserInfo.id}).subscribe(response=>{
                if(response.status==200){
                    this.unreadmsgs          = response.unreadmessagecount || 0; 
                    this.unreadnotifications = response.unreadnotificationscount || 0; 
                }
            });
        }
    }
    /**Reduce Unread count */
    reduceUnreadMessageCount(){
        this.unreadmsgs = this.senderArr.reduce((totalunread,a)=>{
            return totalunread + a.unread;
        },0);
    }

    /**Reduce Unread notification */
    reduceUnreadNotificationCount(){
        this.unreadnotifications = this.notificationArr.reduce((totalunread,a)=>{
            return totalunread + a.unread;
        },0);
    }
    /** LISTEN FOR RECEIVING GROUP INVITES */
    listenGroupInviteReceived(){
        this._chatService
        .listen(environment.pusher.receive_invite_event,environment.pusher.privateuserchannel+this.loginUserInfo.id, (res) => {
            console.log(res);
            //when user receive notification for anyone accepting invite for group which is related to this user
            if(res.group_id>0 && res.user_id===this.loginUserInfo.id){
                this.notificationArr.push(res);
                this.reduceUnreadNotificationCount();
                this.openSnackBar(res);
            }
        });
    }

    /** LISTEN FOR ACCPETING GROUP INVITES BY OTHER USER */
    listenGroupInviteAccepted(){
        this._chatService
        .listen(environment.pusher.invite_event,environment.pusher.privateuserchannel+this.loginUserInfo.id, (res) => {
            //when user receive notification for anyone accepting invite for group which is related to this user
            if(res && res.user_id===this.loginUserInfo.id){
                this.notificationArr.push(res);
                this.reduceUnreadNotificationCount();
                this._chatService.onInviteAccepted.next(res);
                this.openSnackBar(res);
            }
        });
    }
    /**LISTEN GROUP CHAT */
    listenGroupChat(){
        this._chatService
        .listen(environment.pusher.groupchat_event,environment.pusher.privateuserchannel+this.loginUserInfo.id, (res) => {
            if(res.message && res.groupmembers){
                if(res && res.groupmembers.includes(this.loginUserInfo.id)){
                    this.senderArr.push(res);
                    this.reduceUnreadMessageCount();
                    this._chatService.onGroupChatStarted.next(res);
                }
            }
        });
    }
    /**LISTEN PERSONAL CHAT */
    listenPersonalChat(){
        this._chatService
        .listen(environment.pusher.message_event,environment.pusher.messagechannel, (res) => {
            if(res.message){
                //UPDATE COUNT OF UNREAD MESSAGES FOR LOGIN USER
                if(res.message.receiver_id===this.loginUserInfo.id){
                    this.senderArr.push(res.message);
                    this.reduceUnreadMessageCount();
                }
            }
        });
    }

    openSnackBar(notification:any) {
        this._matSnackBar.openFromComponent(SnackbarComponent, {
            duration: 500000,
            data:{notification:notification},
            panelClass:['primary-bg', 'fuse-white-fg']
        });
    }
}