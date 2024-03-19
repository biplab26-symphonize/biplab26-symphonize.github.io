import { Component, OnInit, Input } from '@angular/core';
import { AnnouncementService } from 'app/_services';
import { SanitizeHtmlPipe } from '@fuse/pipes/sanitize-html.pipe';

@Component({
  selector: 'widget-home-announcement',
  templateUrl: './home-announcement.component.html',
  styleUrls: ['./home-announcement.component.scss'],
  providers:[SanitizeHtmlPipe]
})
export class HomeAnnouncementComponent implements OnInit {

  @Input() homesettings: any;
  ancLayout:string='row';
  public  showerrorMsg : boolean = true;
  announcments: any[]=[];
  constructor( private _announcmentService:AnnouncementService ){ }

  ngOnInit() {
    if(this.homesettings && this.homesettings.announcement_layout){
      this.ancLayout = this.homesettings.announcement_layout;
    }
    this._announcmentService.getLists({'content_type':'home-announcement','column':'content_id','direction':'desc','front':'1','status':'A' }).then(response=>{
      if(response.status==200){
        this.announcments = response.data || [];
      }
      if(this.announcments.length == 0)
      {
        this.showerrorMsg = false;
      }
    });
  }

}
