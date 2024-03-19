import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChatService } from 'app/_services';
import { User, ChatContact } from 'app/_models';

@Component({
    selector     : 'chat-contact-sidenav',
    templateUrl  : './contact.component.html',
    styleUrls    : ['./contact.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatContactSidenavComponent implements OnInit, OnDestroy
{
    contact: any;
    defaultAvatar: string = '';
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
        this._chatService.onContactSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contact => {
                this.contact = new ChatContact().deserialize(contact,'single');
            });
        //Users Default Avatar
        this._chatService.onDefaultAvatar
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(avatar => {
                this.defaultAvatar = avatar;
            })
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
