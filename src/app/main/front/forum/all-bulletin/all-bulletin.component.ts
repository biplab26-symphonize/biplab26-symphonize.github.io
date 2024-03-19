import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CategoryService } from 'app/_services';
import { FilesDataSource } from 'app/main/admin/events/all/all.component';
import { fuseAnimations } from '@fuse/animations';
import { Category } from 'app/_models';

@Component({
  selector: 'app-all-bulletin',
  templateUrl: './all-bulletin.component.html',
  styleUrls: ['./all-bulletin.component.scss'],
  animations   : fuseAnimations,
})
export class AllBulletinComponent implements OnInit {  
  Columns: any;
  displayedColumns: any;
  dataSource: FilesDataSource | null;
  public ForumSettings : any = OptionsList.Options.forumsettings;
  constructor(
     private _fuseConfigService: FuseConfigService,
     private _categorService : CategoryService) { 
     // Configure the layout
     this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
    this.Columns            = OptionsList.Options.tables.list.frontforums;
  
    this.displayedColumns   = OptionsList.Options.tables.list.frontforums.map(col => col.columnDef);
   
    this._categorService.getForums({'category_type':'FC','status':'A','direction':'asc'}).then(forums=>{
      this.dataSource = this.filterData(forums.data);
    })
  }

  filterData(forumdata): any
  {
    return forumdata.map(c => new Category().deserialize(c,'forumlist'));
  }

}
