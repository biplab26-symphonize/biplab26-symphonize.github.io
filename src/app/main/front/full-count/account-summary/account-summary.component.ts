import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { CommonService, UsersService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss'],
  animations: fuseAnimations
})
export class AccountSummaryComponent implements OnInit {
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public currentUser: any;
  public userData: any = [];
  public accountList: any = [];
  public noAccountFound: boolean = false;
  public userSetting: any;
  public userinfo: any;
  public fc_id: any;
  constructor(private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _commonService: CommonService,
    private _usersService: UsersService) {
    // Configure the layout 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit(): void {
    //localStorage.removeItem("fc_id");
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    let userid = JSON.parse(localStorage.getItem('token')).user_id;
    this._usersService.getFullCountUser(userid).subscribe(response => {
      this.userinfo = response.userinfo;
      this.fc_id = this.userinfo.fc_id;      
      this.userSetting = this._commonService.getLocalSettingsJson('users_settings');
      let community_id = this.userSetting.fullcount_settings.community_id;
      this._usersService.getAccountList({ 'cid': community_id, 'cstid': this.fc_id }).then(Response => {
        if(Response && Response.data && Response.data.length>0){
          this.accountList = Response.data.map(item=>{
            item.periodStartDate = new Date(item.periodStartDate.replace(/-/g, '\/'));
            item.periodEndDate = new Date(item.periodEndDate.replace(/-/g, '\/'));
            return item;
          });
          console.log("accountList",this.accountList);
          this.noAccountFound = false;
        }
        else{
          this.noAccountFound = true;
        }
      });
    });

  }

}
