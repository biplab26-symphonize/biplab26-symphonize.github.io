// newest-StaffService.componnent.ts

import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { OwlOptions, ResponsiveSettings, BreakpointOptions } from 'ngx-owl-carousel-o';
import { User } from 'app/_models';
import { StaffService, AppConfig, CommonService } from 'app/_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare let $: any;

@Component({
  selector: 'widget-newest-staff',
  templateUrl: './newest-staff.component.html',
  styleUrls: ['./newest-staff.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewestStaffComponent implements OnInit {

  @Input() homesettings: any;
  private _unsubscribeAll: Subject<any>;
  _defaultAvatar: string;
  public staffList: any[] = [];
  public staffSettings;

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false, 
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['prev','next'],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 3
      }
    }
  }

  
  // customOptions: ResponsiveSettings{
  //   [items: 1]: '',
  // }

  constructor(
    private _staffService: StaffService,
    private route: ActivatedRoute,
    private _commonService: CommonService) { 
      this._unsubscribeAll = new Subject();
    }

  ngOnInit() {

      this.setTheDefaultValue()
  }

  ngOnChanges(){
    this.setTheDefaultValue();
  }

   setTheDefaultValue(){
    this.staffSettings = this._commonService.getLocalSettingsJson('staff_settings');
    // SET DEFAULT AVATAR IAMGE
    this._defaultAvatar = this.staffSettings ? AppConfig.Settings.url.mediaUrl + this.staffSettings.defaultprofile : AppConfig.Settings.url.defaultAvatar;
    this._staffService.getStaffs({ 'display': 'list', 'print': 0, 'limit': this.homesettings.staff_limit, 'status': 'A', 'front': '1' }).then(response => {
        let staffData = response.stafflist.data.map(c => new User().deserialize(c,'resident'));
        this.staffList = staffData;
      
    })
   }
  ngAfterViewInit() {
    this.customOptions = {
      loop: false,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['prev', 'next'],
      nav: true,
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 1
        },
        740: {
          items: 1
        },
        940: {
          items: 3
        }
      }
    }
  }

}

