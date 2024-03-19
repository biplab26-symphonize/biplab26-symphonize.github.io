import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, PagebuilderService, AuthService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  animations   : fuseAnimations,
})
export class ViewComponent implements OnInit {

  public pageInfo: any;
  public noAccess: boolean = false;
  dateTemp : any = Math.random();
  public page_alias: string='';
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _sanitizer: DomSanitizer,
    private _fuseConfigService: FuseConfigService,
    private _pagebuilderService: PagebuilderService,
    private route : ActivatedRoute,
    private router: Router
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.page_alias = this.route.params['value'].page_alias;
    
  }

  ngOnInit() {

    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
        this.page_alias = params && params['page_alias'] ? params['page_alias'] : '';
        this.getPageInfo();
    });
    
    this.getPageInfo();
    
  }
  getPageInfo(){
    this._pagebuilderService.getPageInfo({'status':'A','page_alias':this.page_alias}).subscribe(response=>{
      this.pageInfo = response.pageinfo;
      this.noAccess = response.pageinfo==null ? true : false;
      //setCss 
      this.applycssSettings();
    });
  }
  //APPLY DYNAMIC CSS SETTINGS 
  applycssSettings(){
    if(this.pageInfo && this.pageInfo.settings.headersettings){
      document.documentElement.style.setProperty('--fullwidth', this.pageInfo.settings.headersettings.fullwidth=='Y' ? '100%' : 'auto');
      document.documentElement.style.setProperty('--bgcolor', this.pageInfo.settings.headersettings.bgcolor);
      document.documentElement.style.setProperty('--fullbgimage', this.pageInfo.settings.headersettings.fullbgimage=='Y' ? '100%' : 'auto');
      document.documentElement.style.setProperty('--bgrepeat', this.pageInfo.settings.headersettings.bgrepeat);
    }
    if(this.pageInfo && this.pageInfo.settings.titlebarsettings){
      document.documentElement.style.setProperty('--titlebarheight', this.pageInfo.settings.titlebarsettings.titlebarheight);
      document.documentElement.style.setProperty('--titlebarbgcolor', this.pageInfo.settings.titlebarsettings.titlebarbgcolor);
      document.documentElement.style.setProperty('--titlebarbordercolor', this.pageInfo.settings.titlebarsettings.titlebarbordercolor);
      document.documentElement.style.setProperty('--textcolor', this.pageInfo.settings.titlebarsettings.textcolor);
      document.documentElement.style.setProperty('--textalign', this.pageInfo.settings.titlebarsettings.textalign);
      document.documentElement.style.setProperty('--textsize',this.pageInfo.settings.titlebarsettings.textsize);
      document.documentElement.style.setProperty('--lineheight', this.pageInfo.settings.titlebarsettings.lineheight);

      document.documentElement.style.setProperty('--subtextcolor', this.pageInfo.settings.titlebarsettings.subtextcolor);
      document.documentElement.style.setProperty('--subtextsize', this.pageInfo.settings.titlebarsettings.subtextsize);
      document.documentElement.style.setProperty('--sublineheight', this.pageInfo.settings.titlebarsettings.sublineheight);
    }

    if(this.pageInfo && this.pageInfo.settings.pagesettings){
      document.documentElement.style.setProperty('--featureimage', this.pageInfo.settings.pagesettings.featureimage);
      document.documentElement.style.setProperty('--pagepadding', this.pageInfo.settings.pagesettings.fullwidthpadding);
      document.documentElement.style.setProperty('--pagebgcolor', this.pageInfo.settings.pagesettings.bgcolor);

      document.documentElement.style.setProperty('--contentpadding', this.pageInfo.settings.pagesettings.contentpadding);
      document.documentElement.style.setProperty('--contentbgcolor', this.pageInfo.settings.pagesettings.contentbgcolor);
    }
  }
  //Set Background Image SafeUrl
  getBackground(image) {
    if(image!==null){
      return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }
  }
  //Open Container Link
  OpenContainerLink(linkUrl:any){
    if(linkUrl.link_type=='C' && linkUrl.link_url && linkUrl.link_target){
      window.open(linkUrl.link_url,linkUrl.link_target);
    }
    else if(linkUrl.menu_anchor!==''){
      window.open(linkUrl.menu_anchor,'_blank');
    }
    else{
      this.router.navigate([linkUrl.link_url]);
    }
  }
}
