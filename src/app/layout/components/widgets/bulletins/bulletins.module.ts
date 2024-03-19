import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletinsComponent } from './bulletins.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Routes, RouterModule } from '@angular/router';
import { TopicsReplyModule } from './topics-reply/topics-reply.module';
import { MaterialModule } from 'app/main/material.module';
import { AnnouncementService } from 'app/_services';

const appRoutes: Routes = [
  {
    path: 'forum/topic/',
    loadChildren: () => import('./topics-reply/topics-reply.module').then(m => m.TopicsReplyModule),
    resolve  	: {
      topics : AnnouncementService
      }  
  }
];

@NgModule({
  declarations: [BulletinsComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule.forChild(appRoutes),
    MatButtonModule,
    MaterialModule,
    TopicsReplyModule
  ],
  entryComponents: [
    BulletinsComponent
  ],
  exports: [
    BulletinsComponent
  ],
  providers:[AnnouncementService]
})
export class BulletinsModule { }
