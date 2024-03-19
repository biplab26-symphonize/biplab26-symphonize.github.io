import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'element-content-boxes',
  templateUrl: './content-boxes.component.html',
  styleUrls: ['./content-boxes.component.scss']
})
export class ContentBoxesComponent implements OnInit {
  @Input() element:any;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  //Open Container Link
  OpenElementLink(linkUrl:any){
    if(linkUrl.link_type=='C' && linkUrl.link_url && linkUrl.link_target){
      window.open(linkUrl.link_url,linkUrl.link_target);
    }
    else{
      this.router.navigate([linkUrl]);
    }
    return false;
  }

}
