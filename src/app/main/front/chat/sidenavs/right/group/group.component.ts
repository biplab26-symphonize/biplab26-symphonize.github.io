import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService, AppConfig } from 'app/_services';
import { Group } from 'app/_models';

@Component({
  selector: 'chat-group-sidenav',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GroupContactSidenavComponent implements OnInit {
    group: any;
    defaultAvatar: string = '';
    mediaUrl:string = AppConfig.Settings.url.mediaUrl;
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
        this._chatService.onGroupContactSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(group => {
                this.group = group;
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
