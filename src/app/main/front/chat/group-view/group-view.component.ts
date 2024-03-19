import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, delay, take } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService, AppConfig } from 'app/_services';
import { User, Group } from 'app/_models';
import { FuseUtils } from '@fuse/utils';

@Component({
    selector     : 'group-view',
    templateUrl  : './group-view.component.html',
    styleUrls    : ['./group-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GroupViewComponent implements OnInit, OnDestroy, AfterViewInit
{
    defaultAvatar: string = '';
    mediaUrl: string = AppConfig.Settings.url.mediaUrl;
    user: any;
    group: any;
    dialog: any;
    contact: any;
    replyInput: any;
    selectedGroup: any;
    groupMembers: string = '';
    //contextMenu for delete Chat
    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;

    contextMenuPosition = { x: '0px', y: '0px' };

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    @ViewChildren('replyInput')
    replyInputField;

    @ViewChild('replyForm')
    replyForm: NgForm;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _chatService: ChatService,
        private _matSnackBar:MatSnackBar
    )
    {
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
        this.user = new User().deserialize(this._chatService.user,'single');
        this._chatService.onGroupSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(groupData => {
                if ( groupData )
                {   
                    this.group         = new Group().deserialize(groupData.group,'single'); 
                    this.selectedGroup = groupData;
                    this.dialog        = groupData.dialog;
                    this.readyToReply();
                    //extract group members
                    this.groupMembers = this.group.memberinfo.map(item=>{return item.first_name+' '+item.last_name}).join(',');
                    
                }
            });
        //Users Default Avatar
        this._chatService.onDefaultAvatar
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(avatar => {
            this.defaultAvatar = avatar;
        });
        
        this._chatService
        .listen(environment.pusher.groupchat_event,environment.pusher.groupchannel+this.selectedGroup.groupId, (res) => {
            //check current chat between users
            if(res!=='' && res.group_id===this.group.group_id  && res.sender_id!==this.user.id){
                const chatgroup = this.dialog.filter(item=>{
                    return (item.group_id===res.group_id);
                });
                if(chatgroup && chatgroup.length>0){
                    this.dialog.push(res);
                }
                else{
                    this.dialog.push(res);
                }
            }
        });

        //on chat Deleted
        this._chatService.onChatsDeleted
            .pipe(
                takeUntil(this._unsubscribeAll),
                delay(1000),
                take(1)
            )
            .subscribe(deletedChats => {
                if(deletedChats.gchat_id>0){
                    const deleteIndex = this.dialog.indexOf(this.dialog.find(row => row.gchat_id === deletedChats.gchat_id && row.group_id == deletedChats.group_id));
                    if(deleteIndex>=0){
                        this.dialog.splice(deleteIndex, 1);
                    }
                }

            });
        //On Group Deleted
        this._chatService.onGroupDeleted
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(deleteGroup=>{
            if(deleteGroup===this.group.group_id){
                this.group = {};
                this.dialog  = []; 
                this._chatService.onresetChatView.next({reset:true,type:'group',pusher:'N'});
            }
        });
        
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        this.replyInput = this.replyInputField.first.nativeElement;
        this.readyToReply(); 
    }

    
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._chatService.onGroupSelected.next(null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    shouldShowContactAvatar(message, i): boolean
    {
        return (message.sender_id !== this.user.id);
    }

    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isFirstMessageOfGroup(message, i): boolean
    {
        return (i === 0 || this.dialog[i - 1] && this.dialog[i - 1].sender_id !== message.sender_id);
    }

    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isLastMessageOfGroup(message, i): boolean
    {
        return (i === this.dialog.length - 1 || this.dialog[i + 1] && this.dialog[i + 1].sender_id !== message.sender_id);
    }

    /**
     * Select contact
     */
    selectGroup(): void
    {
        this._chatService.onGroupContactSelected.next(this.group);
        this._chatService.onRightSidenavViewChanged.next('group');
    }

    /**
     * Ready to reply
     */
    readyToReply(): void
    {
        setTimeout(() => {
            if(this.replyForm.form.get('message')){
                this.replyForm.form.get('message').setValue('');
            }
            this.focusReplyInput();
            this.scrollToBottom();
        });
    }

    /**
     * Focus to the reply input
     */
    focusReplyInput(): void
    {
        setTimeout(() => {
            this.replyInput.focus();
        });
    }

    /**
     * Scroll to the bottom
     *
     * @param {number} speed
     */
    scrollToBottom(speed?: number): void
    {
        speed = speed || 400;
        if ( this.directiveScroll )
        {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }

    /**
     * Reply
     */
    reply(event): void
    {
        event.preventDefault();

        if ( !this.replyForm.form.value.message )
        {
            return;
        }

        const chatId = FuseUtils.generateGUID();

        // Message
        const message = {
            gchat_id   : chatId, 
            group_id   : this.group.group_id,
            sender_id  : this.user.id,
            message    : this.replyForm.form.value.message,
            created_at : new Date().toISOString(),
            sendermeta : this.getSenderMeta(),  
            status     : 'U'
        };

        // Add the message to the chat
        this.dialog.push(message);
        console.log(this.dialog);
        //store message
        const storemessage = {
            group_id   : this.group.group_id,
            sender_id  : this.user.id,
            message    : this.replyForm.form.value.message,
            created_at : new Date().toISOString(),
            status     : 'U'
        };

        // Reset the reply form
        this.replyForm.reset();

        // Update the server
        this._chatService.updateGroupDialog(storemessage).then(response => {
            if(response.status==200 && response.groupchatinfo.gchat_id){
                this.dialog.map(chat=>{
                    if(chat.gchat_id==chatId){
                        chat.gchat_id = response.groupchatinfo.gchat_id;
                    }
                    return chat;
                });
                console.log(this.dialog);                
            }
            this.readyToReply();
        });
    }
    /**SENDER META OF USER */
    getSenderMeta(){
        let sendermeta:any={};
        if(this.user){
            sendermeta['id']         = this.user.id;
            sendermeta['first_name'] = this.user.first_name;
            sendermeta['last_name']  = this.user.last_name;
            sendermeta['email']      = this.user.email;
            sendermeta['online']     = this.user.online;
            sendermeta['avatar']     = this.user.avatar;
        }
        return sendermeta;
    }

    onContextMenu(event: MouseEvent, item: Item) {
        
        event.preventDefault();
        if(item.sender_id===this.user.id){
            this.contextMenuPosition.x = event.clientX + 'px';
            this.contextMenuPosition.y = event.clientY + 'px';
            this.contextMenu.menuData = { 'item': item };
            this.contextMenu.menu.focusFirstItem('mouse');
            this.contextMenu.openMenu();      
        }
    }

    deleteChat(chat: Item) {
        let inviteData = {chat_id:chat.gchat_id,user_id:this.user.id,group_id:chat.group_id}
        this._chatService.deleteChat(inviteData)
                .subscribe(response=>{
                if(response.status==200){
                    this.showSnackBar(response.message,'OK');
                }
                },
                error => {
                    // Show the error message
                    this.showSnackBar(error.message, 'Retry');
                });
    }

    /** SHOW SNACK BAR */
    showSnackBar(message:string,buttonText:string){
        this._matSnackBar.open(message, buttonText, {
            verticalPosition: 'top',
            duration        : 2000
        });
    } 
}

//ChatItem
export interface Item {
    gchat_id: number;
    sender_id: number;
    group_id: number;
}

