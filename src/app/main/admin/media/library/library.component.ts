import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder } from '@angular/forms';
import { Media } from 'app/_models';
import { MediaService, CommonService, OptionsList } from 'app/_services';
import { Subject, merge, } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonUtils } from 'app/_helpers';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class LibraryComponent implements OnInit {

  public selection = new SelectionModel<any>(true, []);
  public filterForm: any;
  public bulkselect:boolean = false;
  public medialist:any = [];
  public mediatype :any = [];
  public mediaData:any = {};
  public alldates  : any =[];

  @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

  @ViewChild('filter', {static: true})
  filter: ElementRef;

   // Private
   private _unsubscribeAll: Subject<any>;
  filterParams: any = {};
  PaginationOpt: {'pageSize':'',pageSizeOptions:[]}; //pagination size,page options

  /**
   * Constructor
   *
   * @param {MediaService} _mediaService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _formBuilder : FormBuilder,
    private _matSnackBar : MatSnackBar,
    private _commonService: CommonService,
    private _mediaService : MediaService
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
    // get all the dates
    this._mediaService.GetAllDate().subscribe(res=>{
      this.alldates = res.date;
    })
     //Pagination Options
     this.PaginationOpt      = OptionsList.Options.tables.pagination.options; 
     this.mediatype          = OptionsList.Options.mediatype; 
     this.mediaData          = this._mediaService.media.media;
     this.medialist          = this.mediaData.data.map(c => new Media().deserialize(c,'medialist'));
     //Declare Filter Form
     this.filterForm = this._formBuilder.group({
              searchKey   : [''],
              roles       : [''],
              status      : [''],
              trash       : [''],
              type        : [''],
              dates       : [''],
              month       : [''],
              year        : ['']
        });

        this.resetPageIndex();
        merge(this.paginator.page,this.filterForm.valueChanges)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{
            this.selection.clear();
            let value
            if(this.filterForm.get('dates').value){
              value = this.filterForm.get('dates').value;
            }
        
            this.filterParams = CommonUtils.getFilterJson('', this.paginator,this.filterForm.value)
            this.filterParams['dates'] = JSON.stringify(value);
            this.getMediaList();
        });
  }  
  getMediaList(){
   
    this.filterParams = CommonUtils.getFilterJson('', this.paginator,this.filterForm.value);
    this.filterParams['column'] = 'media_id';
    this.filterParams['direction'] = 'desc';
    this.filterParams['type'] = this.filterParams['type']!==undefined && this.filterParams['type']!=='' ? this.filterParams['type'] : 'globalmedia,document';

    this._mediaService.getMediaList(this.filterParams).then(medialist=>{
      if(medialist.status==200 && medialist.media && medialist.media.data){
        this.mediaData   = medialist.media;
        this.medialist = medialist.media.data.map(c => new Media().deserialize(c,'medialist')) || []; 
      }           
    });
  }


   //Reset PageIndex On Form Changes
   resetPageIndex(){
    this.filterForm.valueChanges.subscribe(data=>{
        this.paginator.pageIndex = 0;
    });
  }


  bulkSelect(){
    this.bulkselect = true;
  }

  onClickBack(){
      this.selection.clear()
      this.bulkselect = false;
  }

  deleteMedia(){
    this._commonService.removeMedia({media_id:this.selection.selected || 0,'media category':'M'})
        .subscribe(deleteResponse=>{
          if(deleteResponse.status == 200){
            // Show the success message
            this.showSnackBar(deleteResponse.message, 'CLOSE');
            this.getMediaList();
          }
        },
        error => {
            // Show the error message
            this.showSnackBar(error.message, 'RETRY');
        });
    this.selection.clear();
    this.bulkselect = false;
  }

  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
 }
}
