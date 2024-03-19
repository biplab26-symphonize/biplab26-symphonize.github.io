import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';

import { CreateGroupModule } from 'app/layout/components/dialogs/create-group/create-group.module';
import { ChatService } from 'app/_services';
import { ChatComponent } from 'app/main/front/chat/chat.component';
import { ChatStartComponent } from 'app/main/front/chat/chat-start/chat-start.component';
import { ChatViewComponent } from 'app/main/front/chat/chat-view/chat-view.component';
import { GroupViewComponent } from 'app/main/front/chat/group-view/group-view.component';

import { ChatUserSidenavComponent } from 'app/main/front/chat/sidenavs/left/user/user.component';
import { ChatChatsSidenavComponent } from 'app/main/front/chat/sidenavs/left/chats/chats.component';
import { ChatLeftSidenavComponent } from 'app/main/front/chat/sidenavs/left/left.component';
import { ChatRightSidenavComponent } from 'app/main/front/chat/sidenavs/right/right.component';
import { ChatContactSidenavComponent } from 'app/main/front/chat/sidenavs/right/contact/contact.component';
import { GroupContactSidenavComponent } from 'app/main/front/chat/sidenavs/right/group/group.component';
import { AuthGuard } from 'app/_guards';

const routes: Routes = [
    {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard],
        children: [],
        resolve: {
            chat: ChatService
        }
    }
];

@NgModule({
    declarations: [
        ChatComponent,
        ChatStartComponent,
        ChatViewComponent,
        GroupViewComponent,
        ChatUserSidenavComponent,
        ChatChatsSidenavComponent,
        ChatLeftSidenavComponent,
        ChatRightSidenavComponent,
        ChatContactSidenavComponent,
        GroupContactSidenavComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,

        FuseSharedModule,
        CreateGroupModule
    ]
})
export class ChatModule
{
}
