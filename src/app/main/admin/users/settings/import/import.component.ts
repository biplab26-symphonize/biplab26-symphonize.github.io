import { Component, OnInit } from '@angular/core';
import { AppConfig,OptionsList,CommonService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  // Private
  private _unsubscribeAll: Subject<any>;
  format: string='';
  import: string='';
  mediaUrl:string=AppConfig.Settings.url.mediaUrl;
  FormatsList: any = OptionsList.Options.importexportformat;
  //csv/xls import file info
  uploadInfo: any={
    'importusers':{'type':'importusers','media_id':0,'formControlName':'importusers','url':"",'apimediaUrl':'import/users'}
  };
  constructor(
    private _matSnackBar: MatSnackBar ,
    private _commonService:CommonService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
  }
  

  /**Download Import document format csv.xlsx */
  DownloadFormat(){
    this._commonService.downloadImportFormat({'type':'users','format':this.format})
    .subscribe(uploadResponse=>{
        // Show the success message
        this.showSnackBar(uploadResponse.message, 'CLOSE');
        if(uploadResponse.exportinfo.filepath){
          window.open(AppConfig.Settings.url.mediaUrl+uploadResponse.exportinfo.filepath, "_blank");
        }
    },
    error => {
        // Show the error message
        this.showSnackBar(error.message, 'RETRY');
    });
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }
  setImportModelValue($event:any){
    return;
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}

