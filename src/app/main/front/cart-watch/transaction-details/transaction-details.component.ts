import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { UsersService, SettingsService, CommonService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  animations : fuseAnimations
})
export class TransactionDetailsComponent implements OnInit {

  public TransectionDetails : any =[];
 public yearToDatePayment
 public planType
 public dailyChargeAmount
 public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
 public  customerNumber
 public accountBalance
 public ShowCardWatch :any ;
 public ShowData : boolean = false;
  public FormData : FormGroup;
  public showerrorMsg : any ;
  public firstName;
  public lastName;

  constructor(private _fuseConfigService : FuseConfigService,
    private settingsservices : SettingsService,
    private  _commonService    : CommonService,
    private fb : FormBuilder,
      private userServices : UsersService) {
        setTimeout(() => {
          this.userServices.GetTransectionDetails({from :'',  to:'',page_size:''}).subscribe(res=>{
            this.TransectionDetails  =  res.results[0].records;
            console.log( this.TransectionDetails);      
            this.firstName =  res.results[0].customer.firstName;
            this.lastName =  res.results[0].customer.lastName;
          })  
        }, 100);
            this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
           
   }

  ngOnInit() { 

      //Deault DateTime Formats
      this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

    this.FormData = this.fb.group({
      from : this.fb.control(''),
      to :this.fb.control(''),
      page_size : this.fb.control('')
    })

    this.settingsservices.getSetting({'meta_type': 'U','meta_key': 'users_settings'}).then(response =>{
      this.ShowCardWatch = JSON.parse(response.settingsinfo.meta_value);
       if(this.ShowCardWatch.users_settings.cardwatch_settings.allow_card_watch == "Y"){
                   this.ShowData =true;
       }
   });

  }

  StartDate(event){
    console.log(event.target.value);
  }

  EndDate(event){
    console.log(event.target.value);
   }

   submit(event:Event){
    this.TransectionDetails =[];
     console.log(this.FormData.value);
   let  value = this.FormData.value;
     let data = {
       from : moment(value.from).format('YYYY-MMM-DD'),
       to :  moment(value.to).format('YYYY-MMM-DD'),
       page_size : value.page_size
      }
     this.userServices.GetTransectionDetails(data).subscribe(res=>{
       if( res.results !== undefined){
        this.TransectionDetails  = res.results[0].records;
        console.log( this.TransectionDetails);  
       }
         
    })  
   }
}
