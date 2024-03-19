import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { UsersService, SettingsService } from 'app/_services';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss'],
  animations : fuseAnimations
})
export class AccountBalanceComponent implements OnInit {

 public AccountData : any ;
 public yearToDatePayment
 public planType
 public ShowData : boolean = false 
 public dailyChargeAmount
 public  customerNumber
 public accountBalance
 public ShowCardWatch 

  constructor(private _fuseConfigService : FuseConfigService,
    private settingsservices : SettingsService,
      private userServices : UsersService) {

      
        setTimeout(() => {
          this.userServices.Getbalance().subscribe(res=>{
            this.AccountData  =  res.results;
            console.log(this.AccountData);     
          })  
        }, 100);

    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
   }

  ngOnInit() {

    this.settingsservices.getSetting({'meta_type': 'U','meta_key': 'users_settings'}).then(response =>{
      this.ShowCardWatch = JSON.parse(response.settingsinfo.meta_value);
       if(this.ShowCardWatch.users_settings.cardwatch_settings.allow_card_watch == "Y"){
                   this.ShowData =true;
       }
});
  }

}
 