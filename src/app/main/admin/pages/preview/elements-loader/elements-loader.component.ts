import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'preview-elements-loader',
  templateUrl: './elements-loader.component.html',
  styleUrls: ['./elements-loader.component.scss']
})
export class ElementsLoaderComponent implements OnInit {

  @Input() elements;
  buttonhover:boolean;
  constructor(
    private _sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.buttonhover = false;
  }

  ngOnInit() {
    this.elements.map(element=>{
      if(element.type=='media'){
        let autoplay = element.autoplay=='Y' ? 'autoplay=1' : 'autoplay=0';
        let apiparams = element.apiparams;
        element.videoid = this._sanitizer.bypassSecurityTrustResourceUrl(element.videoid+'?'+autoplay+'&'+apiparams);
      }
      //button element
      if(element.type=='button'){
        this.applycssSettings(element);
      }
    });
  }
  
  applycssSettings(element:any){
    if(element){
      document.documentElement.style.setProperty('(--texttransform)', element.texttransform);
      document.documentElement.style.setProperty('--buttontextcolor', element.buttontextcolor);
      document.documentElement.style.setProperty('--buttontexthover', element.buttontexthover);
      document.documentElement.style.setProperty('--gradienttop', element.gradienttop);
      document.documentElement.style.setProperty('--gradienttophover', element.gradienttophover);
      document.documentElement.style.setProperty('--gradientbottom', element.gradientbottom);
      document.documentElement.style.setProperty('--gradientbottomhover', element.gradientbottomhover);
    }
  }
}
