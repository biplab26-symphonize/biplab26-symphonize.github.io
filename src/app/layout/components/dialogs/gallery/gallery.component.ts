import { Component, Inject, OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaService, OptionsList, CommonService } from 'app/_services';
import { Media } from 'app/_models';
import { Subject, merge, } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers';
import { FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'media-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class GalleryComponent implements OnInit {
  public noImages:any = 'No images found.';
  public mediaList: any[] = [];
  public filterForm: any;
  public bulkselect:boolean = false;
  public medialist:any = [];
  public mediatype :any = [];
  public mediaData:any = {};
  @Output() selectedUrl    = new EventEmitter<any>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // Private
  private _unsubscribeAll: Subject<any>;
  filterParams: any;
  PaginationOpt: {'pageSize':'',pageSizeOptions:[]}; //pagination size,page options

  public inputAccpets : string = ".jpeg, .jpg, .png";
  private file: File | null = null;
  public uploadedResponse:any={};

  /**
     * Constructor
     *
     * @param {MatDialogRef<StaffBiographyComponent>} dialogRef
     */
  constructor(
    private _formBuilder : FormBuilder,
    private _matSnackBar : MatSnackBar,
    private _commonService: CommonService,
    private _mediaService : MediaService,
    public dialogRef: MatDialogRef<GalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Pagination Options
    this.PaginationOpt      = OptionsList.Options.tables.pagination.options; 
    this.mediatype          = OptionsList.Options.mediatype; 
    //Declare Filter Form
    this.filterForm = this._formBuilder.group({
          searchKey   : [''],
          roles       : [''],
          status      : [''],
          trash       : [''],
          type        : ['image,pageimage'],
          dates       : ['']
    });

    this.resetPageIndex();
    this.getMediaList();
    merge(this.paginator.page,this.filterForm.valueChanges)
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
    )
    .subscribe(res=>{
        this.getMediaList();
    }); 
  }

  getMediaList(){
    this.filterParams = CommonUtils.getFilterJson('', this.paginator.page,this.filterForm.value);
    setTimeout(() => {
      this._mediaService.getMediaList(this.filterParams).then(medialist=>{
        this.mediaList = medialist.media.data.map(c => new Media().deserialize(c,'pagemedialist')) || [];    
        console.log(this.mediaList);
      });
    }, 0);
  }
  //Reset PageIndex On Form Changes
  resetPageIndex(){
    this.filterForm.valueChanges.subscribe(data=>{
        this.paginator.pageIndex = 0;
    });
  }
  //get media url
  sendMediaUrl(event:any){
    if(event.value.image){
      this.selectedUrl.emit(event.value.image);
    }    
  }
}
