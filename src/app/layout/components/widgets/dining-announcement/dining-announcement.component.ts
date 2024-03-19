import { Component, OnInit, Input } from '@angular/core';
import { AnnouncementService } from 'app/_services';
import { SanitizeHtmlPipe } from '@fuse/pipes/sanitize-html.pipe';

@Component({
  selector: 'widget-dining-announcement',
  templateUrl: './dining-announcement.component.html',
  styleUrls: ['./dining-announcement.component.scss'],
  providers:[SanitizeHtmlPipe]
})
export class DiningAnnouncementComponent implements OnInit {

	@Input() homesettings: any;
	public  showerrorMsg : boolean = true;
	announcments: any[]=[];

	constructor( private _announcmentService:AnnouncementService ){ }

	ngOnInit() {
		this._announcmentService.getLists({'content_type':'dining-announcement','column':'order','direction':'asc','front':'1','status':'A', 'request':'order' }).then(response=>{
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
