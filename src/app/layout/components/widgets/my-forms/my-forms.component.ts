import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {  Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, FormsService, CommonService, SettingsService, FormentriesService} from 'app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { Form, FormEntry } from 'app/_models';
import {CommonUtils} from 'app/_helpers';

@Component({
  selector: 'widget-my-forms',
  templateUrl: './my-forms.component.html',
  styleUrls: ['./my-forms.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None 
})
export class MyFormsComponent implements OnInit {
  @Input() homesettings: any;

  Columns: [];  
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  length: number = 0;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public statusName : any =[];
  public createdAt : any;
  
   
    // Private
    private _unsubscribeAll: Subject<any>;
 
    

    /**
     * Constructor
     *
     * 
     */
    constructor(
      private _FormsService:FormsService,
      private _FormsEntriesService:FormentriesService,
      private _commonService :CommonService,
      private settingsservices : SettingsService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    { 
      
       //Deault DateTime Formats
       this.settingsservices.getSetting({'meta_type' : 'F' ,
      'meta_key' : 'form-settings'}).then(response =>{
         this.statusName  = JSON.parse(response.settingsinfo.meta_value);
      })
       this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
      this.Columns            = OptionsList.Options.tables.list.myforms;
      this.displayedColumns   = OptionsList.Options.tables.list.myforms.map(col => col.columnDef);
       this._FormsEntriesService.getHomePageEnrties({'display':'list','created_by':JSON.parse(localStorage.getItem('token')).user_id,'print':0,'limit':this.homesettings.form_limit}).then(forms=>{
        let formsData = forms.formentriesinfo.map(c => new FormEntry().deserialize(c));
        
        //console.log('form data',formsData);
        this.dataSource = new MatTableDataSource(formsData);
        this.length     = forms.formentriesinfo.length;
      }); 
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
