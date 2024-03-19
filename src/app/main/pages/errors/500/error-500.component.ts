import { Component, ViewEncapsulation } from '@angular/core';
import { fromEvent, Observable, Subscription,Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector     : 'error-500',
    templateUrl  : './error-500.component.html',
    styleUrls    : ['./error-500.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error500Component
{
    /**
     * Constructor
     */
    public onlineEvent: Observable<Event>;
    public offlineEvent: Observable<Event>;
    public subscriptions: Subscription[] = [];

    constructor(
        private router: Router
    )
    {
    }
    ngOnInit(){
        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');
        this.subscriptions.push(this.onlineEvent.subscribe(event => {
            this.router.navigate['/'];
        }));
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());        
    }
}
