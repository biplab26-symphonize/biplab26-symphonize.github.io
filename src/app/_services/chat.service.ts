import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppConfig } from './app.config.service';

declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

	appConfig: any;
	contacts: any[];
	chats: any[];
	groups: any[];
    user: any;
    localUserInfo:any;
	onChatSelected: BehaviorSubject < any > ;
	onInviteAccepted: BehaviorSubject < any > ;
	onGroupSelected: BehaviorSubject < any > ;
	onGroupContactSelected: BehaviorSubject < any > ;
	onGroupChatStarted: BehaviorSubject < any > ;
	onReadMessages: BehaviorSubject < any > ;
	onDefaultAvatar: BehaviorSubject < string > ;
	onContactSelected: BehaviorSubject < any > ;
	onContactDeleted: BehaviorSubject < any > ;
	onGroupDeleted: BehaviorSubject < any > ;
	onresetChatView: BehaviorSubject < any > ;
	onPusherresetChatView: BehaviorSubject < any > ;
	onChatsUpdated: Subject < any > ;
	onChatsDeleted: Subject < any > ;
	onResidentSelected: BehaviorSubject < any > ;
	onChatWindowUpdated: Subject < any > ;
	onUserUpdated: Subject < any > ;
	onUserStatusChanged: Subject < any > ;
	onLeftSidenavViewChanged: Subject < any > ;
	onRightSidenavViewChanged: Subject < any > ;

	pusher: any;
	channel: any;
	constructor(
		private _httpClient: HttpClient) {

		this.appConfig 				= AppConfig.Settings;
		// Set the defaults
		this.onResidentSelected 	= new BehaviorSubject(null);
		this.onChatSelected 		= new BehaviorSubject(null);
		this.onGroupSelected 		= new BehaviorSubject(null);
		this.onGroupContactSelected = new BehaviorSubject(null);
		this.onInviteAccepted 		= new BehaviorSubject(null);
		this.onGroupChatStarted 	= new BehaviorSubject(null);
		this.onReadMessages 		= new BehaviorSubject(null);
		this.onDefaultAvatar 		= new BehaviorSubject(null);
		this.onContactSelected 		= new BehaviorSubject(null);
		this.onContactDeleted 		= new BehaviorSubject(null);
		this.onGroupDeleted 		= new BehaviorSubject(null);
		this.onresetChatView 		= new BehaviorSubject(null);
		this.onPusherresetChatView 	= new BehaviorSubject(null);
		this.onChatsUpdated 		= new Subject();
		this.onChatsDeleted 		= new Subject();
		this.onChatWindowUpdated 	= new Subject();
		this.onUserUpdated 				= new Subject();
		this.onUserStatusChanged 		= new Subject();
		this.onLeftSidenavViewChanged 	= new Subject();
		this.onRightSidenavViewChanged 	= new Subject();
		this.localUserInfo 				= localStorage ? JSON.parse(localStorage.getItem('token')) : null;
		const tokenstring 				= this.localUserInfo!==null && this.localUserInfo['token'] ? this.localUserInfo['token'] : null;
		this.pusher = new Pusher(
			environment.pusher.key, {
				cluster: environment.pusher.cluster,
				encrypted: true,
				authEndpoint: `${this.appConfig.url.chatUrl}broadcasting/auth`,
				auth: {
					headers: {
						Authorization: 'Bearer ' + tokenstring
					}
				}
			});
	}

	/**
	 * Resolver
	 *
	 * @param {ActivatedRouteSnapshot} route
	 * @param {RouterStateSnapshot} state
	 * @returns {Observable<any> | Promise<any> | any}
	 */
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < any > | Promise < any > | any {
		return new Promise((resolve, reject) => {
			this.localUserInfo = localStorage ? JSON.parse(localStorage.getItem('token')) : null;
			
			Promise.all([
				this.getContacts(),
				this.getUser(),
				this.getChats(),
				this.getGroups()
			]).then(
				([contacts,user,chats]) => {
					this.contacts   = contacts;
					this.user       = user;
					this.chats      = chats;
					resolve();
				},
				reject
			);
		});
	}

	listen(event, channel, callback) {
		
		this.channel = this.pusher.subscribe(channel);
		
		//WHEN EVENT CALLED FROM SERVER
		this.channel.bind(event, (res) => {
			callback(res);
		});

		//WHEN AUTH IS NOT VALID
		this.channel.bind('pusher:subscription_error', function (status) {
			console.log(status);
		});
	}

	/**
	 * Get chat
	 *
	 * @param contactId
	 * @returns {Promise<any>}
	 */
	getChat(contactId): Promise < any > {
		//Reset Chat Seto Null and load
		this.onresetChatView.next(null);
		this.onContactDeleted.next(null);		
		this.onGroupDeleted.next(null);		
		const chatItemIndex = this.user.chatList.findIndex((item) => {
			return item.contactId === contactId || item.id === contactId;
		});
		//reset to count 0
		if(chatItemIndex>=0 && this.user.chatList.length>0){
			this.user.chatList[chatItemIndex].unread = null;
		}

		return new Promise((resolve, reject) => {

			let crequest = {
                'sender_id'   	: this.localUserInfo['user_id'],
                'receiver_id'   : contactId,
                'column'		: 'chat_id',
			    'direction'		: 'asc'
            };
            this._httpClient.get(`${this.appConfig.url.apiUrl}broadcasting/list/chats`,{params:crequest})
				.subscribe((response: any) => {
					const chat = response.chats.data;

					const chatContact = this.contacts.find((contact) => {
						return contact.contact_id === contactId || contact.user_id === contactId;
					});

					const chatData = {
						chatId: contactId,
						dialog: chat,
						contact: chatContact
					};

					this.onChatSelected.next({ ...chatData});
					//remove group view
					this.onGroupSelected.next(null);

				}, reject);

		});

	}

	/**
	 * Select contact
	 *
	 * @param contact
	 */
	selectContact(contact): void {
		this.onContactSelected.next(contact);
	}
	/**
	 * Select group
	 *
	 * @param group
	 */
	selectGroup(group): void {
		this.onGroupContactSelected.next(group);
	}
	/**
	 * Set user status
	 *
	 * @param status
	 */
	setUserStatus(status): void {
		this.user.loginstatus = status;
		this.updateUserData(this.user);
	}

	/**
	 * Get online users when page load
	 *
	 * @returns {Promise<any>}
	 */
	getChats(): Promise < any > {
		return new Promise((resolve, reject) => {
            let crequest = {
                'sender_id' : this.localUserInfo['user_id'],
                'column'	: 'chat_id',
			    'direction'	: 'asc'
            };
            this._httpClient.get(`${this.appConfig.url.apiUrl}broadcasting/list/chats`,{params:crequest})
                .subscribe((response: any) => {
                    this.chats = response.chats.data || [];
					resolve(this.chats);
                }, reject);
        });
	}
	/**
	 * Get user
	 *
	 * @returns {Promise<any>}
	 */
	getUser(): Promise < any > {
		return new Promise((resolve, reject) => {
            let crequest = {
                'sender_id'   : this.localUserInfo['user_id'],
                'direction'	: 'asc'
            };
            this._httpClient.get(`${this.appConfig.url.apiUrl}broadcasting/view/userchat`,{params:crequest})
                .subscribe((response: any) => {
                    this.user = response;
					resolve(this.user);
                }, reject);
        });
	}

	/**
	 * Update user data
	 *
	 * @param userData
	 */
	updateUserData(userData): void {
		let statusinfo = {id:this.user.id,status:userData.loginstatus};
		this._httpClient.post(`${this.appConfig.url.apiUrl}broadcasting/update/userstatus`, statusinfo)
			.subscribe((response: any) => {
				this.user = userData;
				this.onUserUpdated.next(this.user);
			});
	}

	/**
	 * Update the chat dialog
	 *
	 * @param chatId
	 * @param dialog
	 * @returns {Promise<any>}
	 */
	updateDialog(message,chatListNode): Promise < any > {
		return new Promise((resolve, reject) => {
			this._httpClient.post(`${this.appConfig.url.apiUrl}broadcasting/create/chat`, message)
				.subscribe(updatedChat => {
					this.updateChatList(chatListNode);
					resolve(updatedChat);
				}, reject);
		});
    }
	/**create group chat */
	updateGroupDialog(message): Promise < any > {
		return new Promise((resolve, reject) => {
			this._httpClient.post(`${this.appConfig.url.apiUrl}broadcasting/create/groupchat`, message)
				.subscribe(updatedChat => {
					resolve(updatedChat);
				}, reject);
		});
    }
	/**
	 * Update chatList of user when user stars chat with other user
	 */
	updateChatList(chatListNode:any){
		const chatIndex = this.user.chatList.findIndex(chat=>{
			return (chat.id === chatListNode.contactId && chat.contactId===chatListNode.id) ||
			   (chat.contactId === chatListNode.contactId && chat.id===chatListNode.id);
		});
		if(chatIndex>=0 && this.user.chatList.length>0){
			this.user.chatList[chatIndex] = chatListNode;
		}
		else{
			this.user.chatList.push(chatListNode);
		}
	}
	
	/**
     * Get groups
     *
     * @returns {Promise<any>}
     */
    getGroups(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let crequest = {
                'created_by': this.localUserInfo['user_id'],
                'column'    : 'created_at',
                'direction' : 'asc'
            };
            this._httpClient.get(`${this.appConfig.url.apiUrl}broadcasting/list/groups`,{params:crequest})
                .subscribe((response: any) => {
                    this.groups = response.data || [];
					resolve(this.groups);
                }, reject);
        });
	}
	
    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let crequest = {
                'user_id'   : this.localUserInfo['user_id'],
                'column'    : 'id',
                'direction' : 'asc'
            };
            this._httpClient.get(`${this.appConfig.url.apiUrl}broadcasting/list/contact`,{params:crequest})
                .subscribe((response: any) => {
                    this.contacts = response.data || [];
					resolve(this.contacts);
                }, reject);
        });
	}
	
	createGroup(groupInfo:any): Observable<any>{
	return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/create/group`,groupInfo)
		.pipe(catchError(this.errorHandler));
	}

	sendInvite(inviteInfo:any): Observable<any>{
	return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/actions/groupinvite`,inviteInfo)
		.pipe(catchError(this.errorHandler));
	}

	/**
	 * Get group info and its chatdata 
	 *
	 * @param groupId
	 * @returns {Promise<any>}
	 */
	getGroup(groupId): Promise < any > {
		
		return new Promise((resolve, reject) => {

			let grequest = {
				'group_id'   	: groupId,
				'column'		: 'created_at',
				'direction'		: 'asc'
            };
            this._httpClient.get(`${this.appConfig.url.apiUrl}broadcasting/view/groupchat`,{params:grequest})
				.subscribe((response: any) => {
					const chat = response.chatList;
					const group = this.groups.find((group) => {
						return group.group_id === groupId;
					});
					const groupData = {
						groupId: groupId,
						dialog: chat,
						group: group
					};

					this.onGroupSelected.next({ ...groupData});
					//remove chat view
					this.onChatSelected.next(null);
				}, reject);

		});

	}
	/** CREATE CONTACT */
    createContact(contactInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/create/contact`,contactInfo)
                .pipe(catchError(this.errorHandler));
	}
	/** DELETE CONTACT */
    deleteContact(contactInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/delete/contact`,contactInfo)
                .pipe(catchError(this.errorHandler));
	}
	/** READ NOTIFICATIONS */
    processInvitation(inviteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/update/groupinvitestatus`,inviteInfo)
                .pipe(catchError(this.errorHandler));
	}
	/** READ NOTIFICATIONS */
    getUnreadNotifications(requestInfo:any): Observable<any>{
        return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}broadcasting/actions/getunreadmessagecount`,{params:requestInfo})
                .pipe(catchError(this.errorHandler));
	}
	/** DELETE  CHAT */
    deleteChat(chatInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/delete/chat`,chatInfo)
                .pipe(catchError(this.errorHandler));
	}
	/** DELETE GROUP */
	deleteGroup(groupInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/delete/group`,groupInfo)
                .pipe(catchError(this.errorHandler));
	}
	/** DELETE ALL CHAT */
	deleteAllChat(chatInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}broadcasting/delete/allchat`,chatInfo)
                .pipe(catchError(this.errorHandler));
	}
	updateUserChatList(contactId): void {
		console.log(this.user.chatList,contactId);
		const chatListIndex = this.user.chatList.findIndex(item=>{
			return ((item.contactId===contactId && item.id===this.user.id) || (item.id===contactId && item.contactId===this.user.id))
		});
		if(chatListIndex>=0){
			this.user.chatList.splice(chatListIndex,1);
			this.onUserUpdated.next(this.user);
		}
		this.onContactDeleted.next({user_id:this.user.id,contact_id:contactId});
	}
	/** HANDLE HTTP ERROR */
	errorHandler(error: HttpErrorResponse) {
		return Observable.throw(error.message);
	}
}