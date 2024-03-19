import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; //EXTRA Changes
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { SnackbarComponent } from 'app/layout/components/dialogs/snackbar/snackbar.component';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { environment } from 'environments/environment';
import { AuthService, AppConfig, ChatService } from 'app/_services';
import { User } from 'app/_models';
import { AccountService } from './account.service';

@Component({
    selector: 'account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {
    senderArr: any[] = [];
    notificationArr: any[] = [];
    unreadnotifications: number = 0;
    unreadmsgs: number = 0;
    sidebarFolded: boolean;
    user: any;
    userStatusOptions: any[];
    durationInSeconds = 5;
    loginUserInfo: any;
    _enableChat: string = 'N';
    _defaultNavAvatar: string = "";
    _localUserSettings: any;
    roleId: number = 0;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes
    @ViewChildren(FusePerfectScrollbarDirective)
    private _fusePerfectScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatPanelService} _chatPanelService
     * @param {HttpClient} _httpClient
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _matSnackBar: MatSnackBar,
        private authenticationService: AuthService,
        private _accountService: AccountService,
        private route: ActivatedRoute,
        private _chatService: ChatService,
        private _appConfig: AppConfig,
        public _matDialog: MatDialog,
        private router: Router
    ) {
        // Set the defaults
        this.sidebarFolded = true;

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
    ngOnInit(): void {
        // Subscribe to the foldedChanged observable


        this._fuseSidebarService.getSidebar('account').foldedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((folded) => {
                this.sidebarFolded = folded;
            });
        //Subscribe to notification delete obervable
        this._accountService.onNotificationUpdates
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                if (response == true) {
                    this.getUnreadCount();
                }
            });
        //SubScribe For Logout Variable When Click On Menu Link	
        this._accountService.onlogoutClick	
            .pipe(takeUntil(this._unsubscribeAll))	
            .subscribe(response => {	
                if (response == true) {	
                    this.onLogout();	
                }	
            });
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
        //listend personal/group chat delete
        this.resetChatView();

        //listen global notificatio   
        this.listenGlobalNotification();

        //Update unreadcount when user open chat window for user
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                let sendermsgIndex = this.senderArr.findIndex(item => {
                    return item.receiver_id === this.loginUserInfo.id && updatedChats.chatId === item.sender_id
                });

                if (sendermsgIndex >= 0) {
                    this.senderArr[sendermsgIndex].unread = 0;
                    this.reduceUnreadMessageCount();
                }
            });

        //Update unreadcount when user open chat window for group
        this._chatService.onGroupSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                if (updatedChats !== null) {
                    let sendermsgIndex = this.senderArr.findIndex(item => {
                        return item.group_id === updatedChats.groupId
                    });

                    if (sendermsgIndex >= 0) {
                        this.senderArr[sendermsgIndex].unread = 0;
                        this.reduceUnreadMessageCount();
                    }
                }
            });
    }

    setUserInfo() {
        //Set User Info to display on navbar
        let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
        this.loginUserInfo = new User().deserialize(UserInfo, 'single');
        this.roleId = this.loginUserInfo && this.loginUserInfo.user_roles ? this.loginUserInfo.user_roles.role_id : 0;
        this._appConfig.onProfileInfoChanged.subscribe(ProfileInfo => {
            if (ProfileInfo) {
                // this.loginUserInfo.avatar_file = ProfileInfo.avatar_file;
                if(ProfileInfo && ProfileInfo.thumb_file!=='' && ProfileInfo.thumb_file!==undefined){
                    this.loginUserInfo.thumb_file = ProfileInfo.thumb_file;
                }
                
                this.loginUserInfo.first_name = ProfileInfo.first_name;
                this.loginUserInfo.last_name = ProfileInfo.last_name;
            }
        })

        this._localUserSettings = this._appConfig._localStorage.value.settings || {};
        if (this._localUserSettings) {
            this._defaultNavAvatar = this._localUserSettings.users_settings ? AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile : AppConfig.Settings.url.defaultAvatar;
            //Update Default Avatar Runtime When Changed From Settings
            this._appConfig._localStorage.subscribe(LocalStorageSettings => {
                if (LocalStorageSettings.settings.users_settings) {
                    this._defaultNavAvatar = AppConfig.Settings.url.mediaUrl + LocalStorageSettings.settings.users_settings.defaultprofile;
                }
            });
            //ENABLE OR DISABLE CHAT MODULE
            this._enableChat = this._localUserSettings.users_settings ? this._localUserSettings.users_settings.allow_chat : 'N';
        }
        if (localStorage.userInfo !== undefined && localStorage.userInfo !== '') {
            this.route.paramMap.subscribe(params => {
                var id = params.get('admin');
                console.log(id);
                const loginLocalUser = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : null;
                if (this.loginUserInfo && loginLocalUser) {
                    this.loginUserInfo.avatar_file = loginLocalUser.avatar_file;
                    this.loginUserInfo.first_name = loginLocalUser.first_name;
                    this.loginUserInfo.last_name = loginLocalUser.last_name;
                }
            });
        }
    }

    getUnreadCount() {
        if (this.loginUserInfo) {
            this._chatService.getUnreadNotifications({ user_id: this.loginUserInfo.id }).subscribe(response => {
                if (response.status == 200) {
                    this.unreadmsgs = response.unreadmessagecount || 0;
                    this.unreadnotifications = response.unreadnotificationscount || 0;
                }
            });
        }
    }
    /**Reduce Unread count */
    reduceUnreadMessageCount() {
        this.unreadmsgs = this.senderArr.reduce((totalunread, a) => {
            return totalunread + a.unread;
        }, 0);
    }

    /**Reduce Unread notification */
    reduceUnreadNotificationCount() {
        this.unreadnotifications = this.notificationArr.reduce((totalunread, a) => {
            return totalunread + a.unread;
        }, 0);
    }
    /** LISTEN FOR RECEIVING GROUP INVITES */
    listenGroupInviteReceived() {
        this._chatService
            .listen(environment.pusher.receive_invite_event, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
                //when user receive notification for anyone accepting invite for group which is related to this user
                if (res.group_id > 0 && res.user_id === this.loginUserInfo.id) {
                    this.notificationArr.push(res);
                    this.reduceUnreadNotificationCount();
                    this.openSnackBar(res);
                }
            });
    }

    /** LISTEN FOR ACCPETING GROUP INVITES BY OTHER USER */
    listenGroupInviteAccepted() {
        this._chatService
            .listen(environment.pusher.invite_event, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
                //when user receive notification for anyone accepting invite for group which is related to this user
                if (res && res.user_id === this.loginUserInfo.id) {
                    this.notificationArr.push(res);
                    this.reduceUnreadNotificationCount();
                    this._chatService.onInviteAccepted.next(res);
                    this.openSnackBar(res);
                }
            });
    }
    /**LISTEN GROUP CHAT */
    listenGroupChat() {
        this._chatService
            .listen(environment.pusher.groupchat_event, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
                console.log("res>>>>", res);
                if (res.message && res.groupmembers) {
                    if (res && res.groupmembers.includes(this.loginUserInfo.id)) {
                        this.senderArr.push(res);
                        this.reduceUnreadMessageCount();
                        this._chatService.onGroupChatStarted.next(res);
                    }
                }
            });
    }
    /**LISTEN PERSONAL CHAT */
    listenPersonalChat() {
        this._chatService
            .listen(environment.pusher.message_event, environment.pusher.messagechannel, (res) => {
                if (res.message) {
                    //UPDATE COUNT OF UNREAD MESSAGES FOR LOGIN USER
                    if (res.message.receiver_id === this.loginUserInfo.id) {
                        this.senderArr.push(res.message);
                        this.reduceUnreadMessageCount();
                    }
                }
            });
    }
    //DELETE GROUP OR PERSONAL CHAT WHEN CONTACT OR GROUP DELETED
    resetChatView() {
        this._chatService
            .listen(environment.pusher.delete_chatevent, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
                if (res) {

                    this._chatService.onPusherresetChatView.next(res);
                }
            });
    }

    // get global  notification count 
    listenGlobalNotification() {

        this._chatService.listen(environment.pusher.global_notification, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
            this.unreadnotifications++;
            if (res.user_id === JSON.parse(localStorage.getItem('token')).user_id) {
                this.openSnackBar(res);
            }

        });
    }

    openSnackBar(notification: any) {
        this._matSnackBar.openFromComponent(SnackbarComponent, {
            horizontalPosition: "right",
            data: { notification: notification },
            panelClass: ['primary-bg', 'fuse-white-fg'],
            duration: this.durationInSeconds * 13000,
        });
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Logout User
     */
    onLogout(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are You Sure You Want To Logout ?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.authenticationService.logout()
                        .pipe(first())
                        .subscribe(
                            data => {
                                this._accountService.onlogoutClick.next(null);
                                this.router.navigate(['/authentication/login']);
                            });
                }
                this.confirmDialogRef = null;
            });
        localStorage.removeItem("pickupTime");
        localStorage.removeItem("locationName");
        localStorage.removeItem("categoryId");
        localStorage.removeItem("lunch");
        localStorage.removeItem("side_number");
        localStorage.removeItem("phone");
        localStorage.removeItem("notes");
        localStorage.removeItem("product_name");
        localStorage.removeItem("building");
        localStorage.removeItem("extrasId ");
        localStorage.removeItem("dinner");
        localStorage.removeItem("delivery_date");
        localStorage.removeItem("quantity");
        localStorage.removeItem("location");
        localStorage.removeItem("sideDish");
        localStorage.removeItem("type");
        localStorage.removeItem("orderDataArr");
        localStorage.removeItem("numberOfSideAndExtras");
        localStorage.removeItem("sideDishId");
        localStorage.removeItem("extras");
        localStorage.removeItem("forntNotesArr");
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fold the temporarily unfolded sidebar back
     */
    foldSidebarTemporarily(): void {
        this._fuseSidebarService.getSidebar('account').foldTemporarily();
    }
    setDefaultPic(){
        this.loginUserInfo.thumb_file=this._defaultNavAvatar;
    }
    /**
     * Unfold the sidebar temporarily
     */
    unfoldSidebarTemporarily(): void {
        this._fuseSidebarService.getSidebar('account').unfoldTemporarily();
    }

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpen(): void {
        this._fuseSidebarService.getSidebar('account').toggleOpen();
    }
}
