import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, delay, take } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ChatService } from 'app/_services';
import { User, ChatContact } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

@Component({
    selector     : 'chat-view',
    templateUrl  : './chat-view.component.html',
    styleUrls    : ['./chat-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations

})
export class ChatViewComponent implements OnInit, OnDestroy, AfterViewInit
{
    defaultAvatar: string = '';
    user: any;
    chat: any;
    dialog: any[]=[];
    contact: any;
    replyInput: any;
    selectedChat: any;

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
        this.user = this._chatService.user;
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                if ( chatData )
                {
                    this.selectedChat = chatData;
                    this.contact = new ChatContact().deserialize(chatData.contact,'single');
                    this.dialog = chatData.dialog;
                    this.readyToReply();
                }
            });
        //Users Default Avatar
        this._chatService.onDefaultAvatar
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(avatar => {
            this.defaultAvatar = avatar;
        });

        //Update ChatList Node When Any User Send Chat and that user NotIn ChatWindow    
        this._chatService.onChatWindowUpdated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(updatedChats => {
                //check current chat between users
                if(updatedChats!=='' && updatedChats.sender_id!==this.user.id){
                    const chatuser = this.dialog.filter(item=>{
                        //return ((item.receiver_id===updatedChats.sender_id && item.sender_id===updatedChats.receiver_id) || (item.sender_id===updatedChats.receiver_id && item.receiver_id===updatedChats.sender_id)) 
                        return ((item.receiver_id===updatedChats.sender_id || item.sender_id===updatedChats.sender_id));
                    });
                    if(chatuser.length>0){
                        this.dialog.push(updatedChats);
                        //Update lastMessaage in chatList of User
                        const chatListNode = {
                            contactId: updatedChats.receiver_id,
                            id: updatedChats.sender_id,
                            lastMessage: updatedChats.chat_text,
                            lastMessageTime: updatedChats.created_at,
                            name: this.contact.contactinfo.name
                        }
                        this._chatService.updateChatList(chatListNode);
                    }
                    else{
                        this._chatService.onChatsUpdated.next(updatedChats); 
                    }
                }
            });
        //on chat Deleted
        this._chatService.onChatsDeleted
            .pipe(
                takeUntil(this._unsubscribeAll),
                delay(1000),
                take(1))
            .subscribe(deletedChats => {
                if(deletedChats.chat_id>0){
                    const deleteIndex = this.dialog.indexOf(this.dialog.find(row => row.chat_id === deletedChats.chat_id));
                    if(deleteIndex>=0){
                        this.dialog.splice(deleteIndex, 1);
                    }
                }
            });
        //On Contact/Chat Deleted Reset the Chat View
        this._chatService.onContactDeleted
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(deleteContact=>{
            if(deleteContact && this.contact && this.contact.contactinfo && ((this.contact.contactinfo.contact_id===deleteContact.contact_id && this.user.id===deleteContact.user_id) || (this.contact.contactinfo.contact_id===deleteContact.user_id && this.user.id===deleteContact.contact_id))){
               this.contact = {};
               this.dialog  = []; 
               this._chatService.onresetChatView.next({reset:true,type:'personal',pusher:'N'});
            }
        })
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
        return (this.contact.contactinfo && 
            message.sender_id === this.contact.contactinfo.contact_id &&
            ((this.dialog[i + 1] && this.dialog[i + 1].sender_id !== this.contact.contactinfo.contact_id) || !this.dialog[i + 1])
        );
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
        return (i === this.dialog.length - 1 || this.dialog[i + 1] && this.dialog[i + 1].receiver_id !== message.receiver_id);
    }

    /**
     * Select contact
     */
    selectContact(): void
    {
        this._chatService.selectContact(this.contact);
    }

    /**
     * Ready to reply
     */
    readyToReply(): void
    {
        setTimeout(() => {
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
        console.log("chatId>>",chatId);
        // Message
        const message = {
            chat_id      : chatId,   
            sender_id    : this.user.id,
            receiver_id  : this.contact.contactinfo.contact_id,
            chat_text    : this.replyForm.form.value.message,
            created_at   : new Date().toISOString(),
            status       : 'U'
        };
        
        // Add the message to the chat
        this.dialog.push(message);

        //add user to chatList of current user
        const chatListNode = {
            contactId: this.contact.contactinfo.contact_id,
            id: this.user.id,
            lastMessage: message.chat_text,
            lastMessageTime: message.created_at,
            name: this.contact.contactinfo.name,
            unread: 0
        }

        // Reset the reply form
        this.replyForm.reset();

        // Update the server
        this._chatService.updateDialog(message,chatListNode).then(response => {
            if(response.status==200 && response.userchatinfo.chat_id){
                this.dialog.map(chat=>{
                    if(chat.chat_id==chatId){
                        chat.chat_id = response.userchatinfo.chat_id;
                    }
                    return chat;
                });
            }
            this.readyToReply();
        });
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
        let deleteData = {chat_id:chat.chat_id,user_id:this.user.id}
        this._chatService.deleteChat(deleteData)
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
    chat_id: number;
    sender_id: number;
}
