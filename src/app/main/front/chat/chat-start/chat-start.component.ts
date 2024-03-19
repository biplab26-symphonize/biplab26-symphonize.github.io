import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { fuseAnimations } from '@fuse/animations';
import { ChatService } from 'app/_services';

@Component({
    selector     : 'chat-start',
    templateUrl  : './chat-start.component.html',
    styleUrls    : ['./chat-start.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ChatStartComponent
{
    constructor(
        private _chatService:ChatService
    )
    {
    }
    ngOnInit(){
    }
}
