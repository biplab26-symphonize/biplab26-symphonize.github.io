import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { GuestRoomService, OptionsList } from 'app/_services';

@Component({
  selector: 'app-viewinvoices',
  templateUrl: './viewinvoices.component.html',
  styleUrls: ['./viewinvoices.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ViewinvoicesComponent implements OnInit {

  url_id :any;
  editBookingData : boolean = false;
  Editformdata : any;
  public invoiceinfo : any =[];
  public CustomFormats        : any;

  constructor(
    private _guest_service : GuestRoomService,
    private route          : ActivatedRoute,
  ) {
    if (this.route.routeConfig.path == 'admin/guest-room/room/invoice/view/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
    }
   }

  ngOnInit(): void {
    this.CustomFormats = OptionsList.Options.customformats;
    this._guest_service.getinvoicesContents(this.url_id).subscribe(response => {
        this.Editformdata = response.invoiceinfo;
        this.invoiceinfo = response.invoiceinfo.invoiceitem;
    });
  }

}
