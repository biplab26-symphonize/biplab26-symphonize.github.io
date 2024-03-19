import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor( private _fuseConfigService: FuseConfigService) { 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
  }

}
