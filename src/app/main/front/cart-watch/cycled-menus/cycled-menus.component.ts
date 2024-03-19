import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { UsersService, SettingsService } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cycled-menus',
  templateUrl: './cycled-menus.component.html',
  styleUrls: ['./cycled-menus.component.scss'],
  animations : fuseAnimations
})
export class CycledMenusComponent implements OnInit {

  public LocationData : any =[] ;
  public CycleData : any;
  public FormData : FormGroup;
  public showItemData : boolean = false ;
  public ShowCardWatch : any ;
  public ShowData : boolean = true; 

  constructor(
    private _fuseConfigService : FuseConfigService,
    private fb : FormBuilder,
    private settingsservices : SettingsService,
      private userServices : UsersService,
      public  router 			    : Router,
      private route           : ActivatedRoute,
  ) { 
    setTimeout(() => {
      this.settingsservices.getSetting({'meta_type': 'U','meta_key': 'users_settings'}).then(response =>{
        this.ShowCardWatch = JSON.parse(response.settingsinfo.meta_value);
         if(this.ShowCardWatch.users_settings.cardwatch_settings.allow_card_watch == "N"){
                     this.ShowData =false;
         }
  });
      this.userServices.GetCycleMenu({non_cycled:false,cycled:false,locationNumber:''}).subscribe(res=>{
        this.CycleData  =  res.results; 
        this.userServices.GetLocation().subscribe(response=>{  
          this.LocationData  = response.results[0].records;   
        })  
      }) 
    }, 200);
  }

  ngOnInit() {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
 
    this.FormData = this.fb.group({
      non_cycled : this.fb.control(''),
      cycled :this.fb.control(''),
      locationNumber : this.fb.control('')
    })


  }

  submit(event:Event){ 
    this.CycleData =[];

     this.userServices.GetCycleMenu(this.FormData.value).subscribe(res=>{
       if( res.results !== undefined){
         console.log('demoo')
        this.CycleData  =  res.results[0].records; 
        if(typeof this.CycleData[0].items === 'string'){
             this.showItemData = true;
          }else{
            this.showItemData = false;
          }

          }   
    })  
   }

   viewimg(pluItemName,menuNumber,pluItemNumber,imageType){ 
    
        let itemId = pluItemName+'-'+menuNumber+'-'+pluItemNumber+'-'+imageType
        this.router.navigate(['/view-menu/',itemId]);
     }

}
