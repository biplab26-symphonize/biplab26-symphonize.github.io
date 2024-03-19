import { Component, OnInit, Input } from '@angular/core';
import { AnnouncementService } from 'app/_services';
import { SanitizeHtmlPipe } from '@fuse/pipes/sanitize-html.pipe';

@Component({
  selector: 'widget-event-announcement',
  templateUrl: './event-announcement.component.html',
  styleUrls: ['./event-announcement.component.scss']
})
export class EventAnnouncementComponent implements OnInit {

	@Input() homesettings: any;
	public  showerrorMsg : boolean = true;
	announcments: any[]=[];

	constructor( private _announcmentService:AnnouncementService ){ }

	ngOnInit() {
		this._announcmentService.getLists({'content_type':'event-announcement','column':'order','direction':'desc','front':'1','status':'A','request':'order' }).then(response=>{
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
