import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { fuseAnimations } from '@fuse/animations';
import { FuseMatSidenavHelperService } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ChatService,AppConfig } from 'app/_services';
import { User, ChatContact, Group } from 'app/_models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupComponent } from 'app/layout/components/dialogs/create-group/create-group.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector     : 'chat-chats-sidenav',
    templateUrl  : './chats.component.html',
    styleUrls    : ['./chats.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ChatChatsSidenavComponent implements OnInit, OnDestroy
{
    localSettings:any;
    defaultAvatar:string="";
    mediaUrl: string = AppConfig.Settings.url.mediaUrl;
    groups: any[]=[];
    confirmDialogRef    : MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
    creategroupDialogRef    : MatDialogRef<CreateGroupComponent>; //EXTRA Changes  
    chats: any[]=[];
    chatSearch: any;
    contacts: any=[];
    searchText: string;
    user: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     * @param {FuseMatSidenavHelperService} _fuseMatSidenavHelperService
     * @param {MediaObserver} _mediaObserver
     */
    constructor(
        public _matDialog       : MatDialog,
        private _matSnackBar    : MatSnackBar,
        private _chatService    : ChatService,
        private _fuseMatSidenavHelperService: FuseMatSidenavHelperService,
        public _mediaObserver: MediaObserver
    )
    {
        // Set the defaults
        this.chatSearch = {
            name: ''
        };
        this.searchText = '';
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        //user
        this.user           = new User().deserialize(this._chatService.user,'single');
        //Groups
        this.groups         = this._chatService.groups.map(c => new Group().deserialize(c,'list')) || [];
        //chats
        this.chats          = this._chatService.chats.map(c => new User().deserialize(c,'list')) || [];
        //contacts
        this.contacts       = this._chatService.contacts.map(c => new ChatContact().deserialize(c)) || [];
        
        //on user comes online
        this._chatService.onUserStatusChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                if(response!==null && response.user){
                    if(response && response.user){
                        //Update Contacts Online Status
                        let contactIndex = this.contacts.findIndex(item=>{return item.contact_id===response.user.id});
                        if(contactIndex>=0){
                            this.contacts[contactIndex].contactinfo.online = response.user.online ? response.user.online : this.contacts[contactIndex].contactinfo.online;
                            this.showSnackBar(this.contacts[contactIndex].contactinfo.name+' is online','OK');  
                        }
                    }
                }
            });

        //on resident selected on directory 
        this._chatService.onResidentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(residentId => {
                if(residentId>0){
                    this.getChat(residentId);
                }
            });
        //Users Default Avatar
        this._chatService.onDefaultAvatar
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(avatar => {
                this.defaultAvatar = avatar;
            });
        //Update ChatList Node When Any User Send Chat and that user NotIn ChatWindow    
        this._chatService.onChatsUpdated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                if(updatedChats!==''){
                    const chatListNode = {
                        contactId: updatedChats.receiver_id,
                        id: updatedChats.sender_id,
                        lastMessage: updatedChats.chat_text,
                        lastMessageTime: updatedChats.created_at,
                        name: this.user.first_name+' '+this.user.last_name,
                        unread: updatedChats.unread
                    }
                    this._chatService.updateChatList(chatListNode);
                    //Open chat Window
                    this.getChatList(chatListNode);
                }
            });

        this._chatService.onUserUpdated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedUser => {
                this.user = new User().deserialize(updatedUser,'single');
                console.log(this.user);
            });
        //On Group Started by Any User
        this._chatService.onGroupChatStarted
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(groupchat => {
                if(groupchat!==null && groupchat.group_id && groupchat.sender_id!==this.user.id){
                    const chatgroup = this.groups.find(item=>{
                        return (item.group_id===groupchat.group_id);
                    });
                    this.getGroupChatlist(chatgroup)
                }
            });   
        //On Invite Accepted
        this._chatService.onInviteAccepted
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
            if(response && response.group_id>0){
                this.reloadGroups();
            }
        });

        //On Group Deleted
        this._chatService.onGroupDeleted
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(deleteGroup=>{
            const groupIndex = this.groups.findIndex(item=>{ return item.group_id===deleteGroup});
            if(deleteGroup && groupIndex>=0){
                this.groups.splice(groupIndex,1);
            }
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get chat
     *
     * @param contact
     */
    getChat(contact): void
    {
        this._chatService.getChat(contact);

        if ( !this._mediaObserver.isActive('gt-md') )
        {
            this._fuseMatSidenavHelperService.getSidenav('chat-left-sidenav').toggle();
        }
    }

    /**GET CHATLIST */
    getChatList(contact): void
    {
        let contactId = this.user.id===contact.contactId ? contact.id : contact.contactId ;
        this._chatService.getChat(contactId);

        if ( !this._mediaObserver.isActive('gt-md') )
        {
            this._fuseMatSidenavHelperService.getSidenav('chat-left-sidenav').toggle();
        }
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void
    {
        this._chatService.setUserStatus(status);
    }

    /**
     * Change left sidenav view
     *
     * @param view
     */
    changeLeftSidenavView(view): void
    {
        this._chatService.onLeftSidenavViewChanged.next(view);
    }
    /** CREATE GROUP MODAL */
    createGroup(group:any=null){
        this.creategroupDialogRef = this._matDialog.open(CreateGroupComponent, {
            disableClose: false,
            maxWidth:undefined,
            width:'400px',
            data:{
                type:'create',
                created_by:this.user.id,
                group: group
            }
        });
        //afterclose
        this.creategroupDialogRef.afterClosed()
            .subscribe(result => {
              if(result =='create'){
                this._chatService.getGroups().then(group=>{
                    this.groups = group;
                });
              }
            });
    }
    /*** SEND INVITE TO USER */
    sendGroupinvite(group:any){
        this.creategroupDialogRef = this._matDialog.open(CreateGroupComponent, {
            disableClose: false,
            width:'400px',
            data:{
                type:'invite',
                created_by:this.user.id,
                group: group
            }
        });
    }
    /**get groups chats list */
    getGroupChatlist(group:any){
        this._chatService.getGroup(group.group_id);

        if ( !this._mediaObserver.isActive('gt-md') )
        {
            this._fuseMatSidenavHelperService.getSidenav('chat-left-sidenav').toggle();
        }
    }
    /**DELETE CONTACT */
    deleteContact(contact){
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected contact?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._chatService.deleteContact({id:contact.id})
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(response => {
                        if(response.status==200){
                            //Update UsersChatList when delete contact
                            this._chatService.updateUserChatList(contact.contactinfo.contact_id);
                            //Update localStorage Contacts
                            let localUserInfo = JSON.parse(localStorage.getItem('token'));
                            if(localUserInfo.user_contacts.length>0){
                                localUserInfo.user_contacts.splice(localUserInfo.user_contacts.indexOf(contact.contactinfo.contact_id), 1);
                                localStorage.setItem('token',JSON.stringify(localUserInfo));
                            }
                            this.getContacts();
                        }
                    });
                }
            });
    }
    /**GetContacts */
    getContacts(){
        this._chatService.getContacts().then(response=>{
            this.contacts  = response.map(c => new ChatContact().deserialize(c)) || [];
        })
    }
    /**delete group */
    deleteGroup(group){
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
  
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected group?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._chatService.deleteGroup({group_id:group.group_id,user_id:group.created_by})
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(response=>{
                            if(response.status==200){
                                this.showSnackBar(response.message,'OK');  
                                this.reloadGroups();          
                            }
                        })
                }
            });
        
    }
    //Delete all chat of contact
    deleteAllChat(chat,index){
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected contact chat history?';
        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    let contact_id = this.user.id===chat.contactId ? chat.id : chat.contactId; 
                    this._chatService.deleteAllChat({user_id:this.user.id,contact_id:contact_id})
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(response => {
                        if(response.status==200){
                            this.user.chatList.splice(index,1);
                            this._chatService.onContactDeleted.next({user_id:this.user.id,contact_id:contact_id});
                        }
                    });
                }
            });
    }
    //Reload Groups API
    reloadGroups(){
        this._chatService.getGroups().then(groups=>{
            this.groups = groups.map(c => new Group().deserialize(c,'list')) || [];;
        });
    }
    /** SHOW SNACK BAR */
    showSnackBar(message:string,buttonText:string){
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration        : 2000
        });
    }
    /**
     * Logout
     */
    logout(): void
    {
        console.log('logout triggered');
    }
}
