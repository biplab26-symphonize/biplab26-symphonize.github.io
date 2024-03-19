import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { EventcategoryService, SettingsService, CommonService, EventbehavioursubService } from 'app/_services';


@Component({
  selector: 'filter-categories',
  templateUrl: './filter-categories.component.html',
  styleUrls: ['./filter-categories.component.scss'],
  animations : fuseAnimations
})
export class FilterCategoriesComponent implements OnInit {

  @Input() EventSettings: any   = {}; 
  @Input() heading: string      = 'To filter the events, click on the categories below:';
  @Input() outerclass: string   = 'category-toolbar px-24 py-8';
  @Input() showinput: string    = 'checkbox';
  @Input() showtype: string     = '';
  @Input() categorytype: string = 'C';  
  @Output() selectedCategory    = new EventEmitter<any>();
  @Output() selectedSubCategory    = new EventEmitter<any>();
  public selection: any[]       = [];
  public subselection: any[]       = [];
  categories: any[]             = [];
  commoncategories: any[]       = [];
  checkedIds: any[]=[];
  subcheckedIds: any[]=[];
  calendarSlug: string='';
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private route: ActivatedRoute,
    private eventbehavioursub: EventbehavioursubService,
    private _eventCategoryService:EventcategoryService) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();   
      
      if(this.route.routeConfig.path=='calendar/:slug' || this.route.routeConfig.path=='my-event/calendar/:slug' || this.route.routeConfig.path=='event/:slug'){
        this.calendarSlug    = this.route.params['value'].slug;
      }
      //call get events list function
      this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
          this.calendarSlug  = params && params['slug'] ? params['slug'] : '';
          this.setCategoryFilterSettings();
      });
    }

  ngOnInit() {    
    this.setCategoryFilterSettings();
    //Reset Categories On Form Reset of Event Filters
    this.eventbehavioursub.clearMetaFields.subscribe(reset =>{
      if(reset==1){
        this.selection      = [];
        this.subselection   = [];
        this.checkedIds     = [];
        this.subcheckedIds  = [];
        this.commoncategories.forEach(item=>{item.checked=false; return item;})
        this.categories.forEach(item=>{item.checked=false; return item;})
      }
    })
  }
  setCategoryFilterSettings(){
    if(this.EventSettings.calender_settings && this.EventSettings.calender_settings.category_filter=='Y'){
      //GET COMMON CATEGORIES FOR FILTERING
      this._eventCategoryService.getCommonCategory({category_type:this.categorytype,status:'A',front:'1',column:'category_name',direction:'asc'}).then(response=>{
        if(response.data.length>0){
          this.commoncategories = response.data;
        }
      });

      //GET CATEGORIES FOR FILTERING
      this._eventCategoryService.getCategory({category_type:this.categorytype,status:'A',front:'1',slug:this.calendarSlug,column:'category_name',direction:'asc'}).then(response=>{
        if(response.data.length>0){
          this.categories = response.data;
        }
      });
    }
  }
  //select categories
  selectCategory(){
    this.selectedCategory.emit(this.selection);
  }
  //select common-categories
  selectSubCategory(){
    this.selectedSubCategory.emit(this.subselection);
  }
  //apply background color to category on selection  
  onValChange($event){
    if($event.source.checked==true){
      this.checkedIds.push($event.source.value); 
    }
    else{
      let existsItemIndex = this.checkedIds.findIndex((item)=>{ return item==$event.source.value}); 
      this.checkedIds.splice(existsItemIndex, 1);
    }
    this.selectedCategory.emit(this.checkedIds);

    /* let checkelement = document.getElementById($event.source.id); 
    if($event.source.checked==true){
      var bgcolor      = checkelement.getAttribute("data-bgcolor");
      checkelement.style.setProperty('background-color',bgcolor);
      this.checkedIds.push($event.source.id); 
    }
    else{
      checkelement.style.removeProperty('background-color');
      let existsItemIndex = this.checkedIds.findIndex((item)=>{ return item==$event.source.id}); 
      this.checkedIds.splice(existsItemIndex, 1);
    } */
  }
  //common categories
  onSubValChange($event){
    
    if($event.source.checked==true){
      this.subcheckedIds.push($event.source.value); 
    }
    else{
      let existsItemIndex = this.subcheckedIds.findIndex((item)=>{ return item==$event.source.value}); 
      this.subcheckedIds.splice(existsItemIndex, 1);
    }
    this.selectedSubCategory.emit(this.subcheckedIds);

    /* 
    let checkelement = document.getElementById($event.source.id); 
    if($event.source.checked==true){
      var bgcolor      = checkelement.getAttribute("data-bgcolor");
      checkelement.style.setProperty('background-color',bgcolor);
      this.subcheckedIds.push($event.source.id); 
    }
    else{
      checkelement.style.removeProperty('background-color');
      let existsItemIndex = this.subcheckedIds.findIndex((item)=>{ return item==$event.source.id}); 
      this.subcheckedIds.splice(existsItemIndex, 1);
    }
    */
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}
