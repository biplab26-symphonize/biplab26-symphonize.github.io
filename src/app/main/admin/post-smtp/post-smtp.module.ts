import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailLogComponent } from './email-log/email-log.component';
import { AuthGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { NgxMaskModule } from 'ngx-mask';
import { PostSmtpService, SettingsService } from 'app/_services';
import { ViewlogComponent } from './viewlog/viewlog.component';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { SmtpComponent } from './smtp/smtp.component';


const routes = [
  { 
    path: 'admin/email-log/list', 
    component: EmailLogComponent, 
    canActivate: [AuthGuard],
    resolve  : {
       smtpservice : PostSmtpService
    },
    data :{
      
    }
  },
   { 
	path           : 'admin/settings/smtp', 
	component      : SmtpComponent, 
	data           : { key : "SMTP_Settings"},
	resolve        : {
						Setting : SettingsService,

					  }
  },
  { 
    path: 'admin/email-log/viewlog/:id', 
    component: ViewlogComponent, 
    canActivate: [AuthGuard] ,
    resolve: { 
           smtpservice : PostSmtpService
  } 
  },
];

@NgModule({
  declarations: [EmailLogComponent, ViewlogComponent, SmtpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    FusePipesModule
    
  ]
})
export class PostSmtpModule { }
