import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ChatService,AppConfig } from 'app/_services'; 
import { User } from 'app/_models';

@Component({
    selector     : 'chat-user-sidenav',
    templateUrl  : './user.component.html',
    styleUrls    : ['./user.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatUserSidenavComponent implements OnInit, OnDestroy
{
    user: any;
    userForm: FormGroup;
    defaultAvatar:string="";
    mediaUrl: string = AppConfig.Settings.url.mediaUrl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     */
    constructor(
        private _chatService: ChatService
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
        this.userForm = new FormGroup({
            id    :  new FormControl(this.user.id),
            loginstatus: new FormControl(this.user.loginstatus)
        });

        //Users Default Avatar
        this._chatService.onDefaultAvatar
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(avatar => {
                this.defaultAvatar = avatar;
            });

        this.userForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(data => {
                this.user.loginstatus = data.loginstatus;
                this._chatService.updateUserData(this.user);
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
     * Change left sidenav view
     *
     * @param view
     */
    changeLeftSidenavView(view): void
    {
        this._chatService.onLeftSidenavViewChanged.next(view);
    }

}
