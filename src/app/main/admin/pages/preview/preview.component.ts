import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService, PagebuilderService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  animations   : fuseAnimations
})
export class PreviewComponent implements OnInit {
  public button: any;
  constructor(
    private _commonService: CommonService,
    private _sanitizer: DomSanitizer,
    private _pagebuilderService: PagebuilderService,
    public dialogRef: MatDialogRef<PreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public pageInfo: any
  ) { }

  ngOnInit() {
    if(this.pageInfo && this.pageInfo.pagecontent){
      this.pageInfo.pagecontent = [...JSON.parse(this.pageInfo.pagecontent)];

       // apply theme settings
       let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
       if (typeof themeData == 'string') {
           let currentData = JSON.parse(themeData);
           themeData = currentData[0];
       }
       this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };     
    }

    if(this.pageInfo && this.pageInfo.settings){
      this.pageInfo.settings = {...JSON.parse(this.pageInfo.settings)};
      //setCss 
      this.applycssSettings();
    }
    console.log(this.pageInfo);
  }

  //APPLY DYNAMIC CSS SETTINGS 
  applycssSettings(){
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
    return false;
  }

}
